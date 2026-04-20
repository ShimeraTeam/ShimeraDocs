# **{Shimera} Architecture Technique Actuelle**
> Une vue factuelle de l'architecture de Shimera, au niveau implémentation, basée sur l'état actuel du code.

## Sommaire
1. [Vue d'ensemble de l'architecture](#vue-densemble-de-larchitecture)
2. [Modules coeur](#modules-coeur)
3. [Pipeline de rendu](#pipeline-de-rendu)
4. [Dépendances](#dépendances)
5. [Flux de données internes](#flux-de-données-internes)
6. [Système de build](#système-de-build)
7. [Stratégie de versioning](#stratégie-de-versioning)
8. [Contraintes actuelles](#contraintes-actuelles)
9. [Références](#références)

## Vue d'ensemble de l'architecture

Shimera utilise une abstraction de backend pour exécuter le même workflow de post-processing sur plusieurs écosystèmes.

L'architecture suit ce modèle en couches:

1. Couche API publique et ABI (`shimera.h`, `shimera_api.h`).
2. Couche d'abstraction backend (`IBackend`, interfaces de ressources, `BackendFactory`).
3. Adaptateurs backend concrets (OpenGL, SFML, Raylib, placeholder SDL).
4. Couche framework d'effets (`ShaderEffectBase`, CRTP `ShaderEffect<Derived>`).
5. Couche de support partagée (valeurs d'uniformes, types vecteurs légers, utilitaires GL).

Le choix du backend se fait à la compilation (cible de build + define préprocesseur), et non via un système plugin au runtime.

## Modules coeur

### Surface d'API publique

Points d'entrée principaux:

- `include/shimera.h`
- `include/shimera_api.h`

Responsabilités:

- Fournir un point d'inclusion public compact.
- Gérer l'export/import des symboles pour les builds statiques ou partagés.

### Couche d'abstraction backend

Fichiers clés:

- `include/backend/IBackend.hpp`
- `include/backend/BackendFactory.hpp`
- `src/backend/BackendFactory.cpp`

Responsabilités:

- Définir des contrats abstraits de création pour framebuffers, textures, shaders et post-processors.
- Masquer les implémentations concrètes derrière des interfaces.
- Sélectionner l'implémentation via un macro backend:
  - `SHIMERA_BACKEND_OPENGL`
  - `SHIMERA_BACKEND_SFML`
  - `SHIMERA_BACKEND_RAYLIB`
  - `SHIMERA_BACKEND_SDL` (actuellement un chemin placeholder)

### Interfaces de ressources

- `IFrameBuffer`: cycle de vie du render target, redimensionnement, accès texture.
- `IPostProcessor`: orchestration des passes de post-processing fullscreen.
- `IShader`: bind/unbind shader et écriture d'uniformes typées.
- `ITexture`: bind/unbind texture et pont vers handle natif.

### Backends concrets

1. Backend OpenGL (`src/backend/opengl/*`)
- Possession native des ressources GL pour framebuffers, textures, shaders et passes fullscreen.

2. Backend SFML (`src/backend/sfml/*`)
- Capture de scène via `sf::RenderTexture`.
- Post-processing toujours exécuté via une passe fullscreen basée OpenGL.

3. Backend Raylib (`src/backend/raylib/*`)
- Capture de scène via `RenderTexture2D`.
- Post-processing toujours exécuté via une passe fullscreen basée OpenGL.

4. Backend SDL
- La cible de build et le macro existent.
- Le chemin factory est un placeholder et n'instancie pas de backend concret.

### Framework d'effets

Fichiers clés:

- `include/effects/ShaderEffectBase.hpp`
- `include/effects/ShaderEffect.inl`
- `src/effects/*.cpp`

Design:

- Classes d'effets stateful, chacune encapsulant un post-processor.
- API fluide basée sur le CRTP (`ShaderEffect<Derived>`).
- Pattern d'exécution commun:
  - `render(texture)`
  - `render(texture, framebuffer)`

Effets intégrés dans l'état actuel du code:

- Brightness
- Contrast
- Saturation
- Grayscale
- Colorshift
- Distortion
- Vignette
- Chromatic Aberration

## Pipeline de rendu

Le pipeline runtime est orienté passes et utilise des framebuffers offscreen.

### Etape 1: Capture de scène

1. Binder le framebuffer A.
2. Rendre les draw calls de la scène/application.
3. Unbinder le framebuffer A.

### Etape 2: Passe de post-processing

1. Lire la texture du framebuffer précédent.
2. Mettre à jour les uniformes d'effet.
3. Dessiner un quad fullscreen avec la passe shader.

### Etape 3: Présentation

- La sortie va soit vers l'écran, soit vers un autre framebuffer.
- Cela permet de chaîner plusieurs passes (ping-pong).

### Contrat commun des passes shader

- La passe vertex consomme des positions fullscreen + UV.
- La passe fragment échantillonne `u_screenTexture` (texture unit 0) et applique les uniformes d'effet.

### Flux typiques

Single-pass:

```text
Scene -> Framebuffer A -> Effect Pass -> Screen
```

Two-pass ping-pong:

```text
Scene -> Framebuffer A -> Effect 1 -> Framebuffer B -> Effect 2 -> Screen
```

## Dépendances

Les dépendances de Shimera sont organisées par cible backend dans Xmake.

### Packages déclarés au build

- `glew`
- `sfml` (optionnel)
- `raylib` (optionnel)
- `libsdl3` (optionnel)

### Matrice des cibles backend

| Target | Define | Packages | Status |
|---|---|---|---|
| `shimera-opengl` | `SHIMERA_BACKEND_OPENGL` | `glew` | Implémenté |
| `shimera-sfml` | `SHIMERA_BACKEND_SFML` | `glew`, `sfml` | Implémenté |
| `shimera-raylib` | `SHIMERA_BACKEND_RAYLIB` | `glew`, `raylib` | Implémenté |
| `shimera-sdl` | `SHIMERA_BACKEND_SDL` | `glew`, `libsdl3` | Chemin de build existe, mais backend incomplet |

### OpenGL et GLEW dans l'architecture actuelle

Même avec les variantes backend SFML ou Raylib, l'exécution du post-processing reste basée sur OpenGL.

Conséquence pratique:

- GLEW et les librairies système OpenGL restent des dépendances fondamentales pour toutes les variantes backend actuelles.

## Flux de données internes

Le comportement de Shimera peut être lu à travers 5 flux principaux.

### 1) Flux de contrôle

- L'application initialise la stack contexte/fenêtre.
- L'application crée le backend (`BackendFactory::create`).
- L'application crée les framebuffers et les effets.
- A chaque frame: capture de scène -> chaînage de passes -> présentation.

### 2) Flux render-target

- `IFrameBuffer::bind/unbind` redirige la sortie de rendu vers la cible sélectionnée.
- La sémantique varie selon le backend (OpenGL FBO, SFML render texture, Raylib texture mode).

### 3) Flux texture

- La sortie framebuffer est exposée en `ITexture`.
- Les post-processors consomment cette texture en entrée de passe.
- La sortie d'une passe devient l'entrée de la suivante.

### 4) Flux uniforms

- Les champs des effets sont poussés à chaque render call via `setUniform`.
- Les valeurs passent par `UniformValue` puis le dispatch shader backend.
- Les classes shader mettent en cache les locations d'uniformes pour réduire les lookups répétés.

### 5) Flux de cycle de vie

- Les effets possèdent les processors.
- Les processors possèdent les objets shader.
- Les framebuffers possèdent les wrappers de texture.
- La libération des ressources suit la hiérarchie des objets.

## Système de build

Shimera utilise Xmake (`xmake.lua`) avec une stratégie une cible par backend.

### Paramètres globaux de build

- Modes de build: debug/release.
- Standard C++: C++23.
- Politique toolchain sous Windows: MSVC.

### Options top-level

- `shared` (défaut: false): build shared ou static.
- `examples` (défaut: true): inclure les applications d'exemple.

### Sous-système d'exemples

Quand activé, des cibles d'exemple sont incluses pour OpenGL, SFML, Raylib et SDL.
Chaque exemple dépend de la cible backend correspondante.

### Politique de linkage plateforme

Les librairies système OpenGL sont liées selon la plateforme:

- Windows: `opengl32`
- macOS: framework `OpenGL`
- Linux/Unix-like: `GL`

## Stratégie de versioning

Le workflow actuel combine intégration par branches et releases par tags.

### Modèle de branches

Branches longue durée:

- `dev` (branche d'intégration active)
- `master` (branche orientée stabilité)

Nommage fréquent des branches courtes:

- `feat/*`
- `fix/*`
- `chore/*`

### Style de commits et merges

- Les merge commits de PR sont conservés dans l'historique.
- Les préfixes de type Conventional sont fréquents (`feat`, `fix`, `docs`, `ci`, `build`, etc.), mais non strictement uniformes.

### Déclenchement CI/CD du versioning

- La CI tourne sur push/PR pour les branches de travail principales.
- Le workflow de release est déclenché par tags `v*`.
- Le statut prerelease est déduit si le tag contient `-` (par exemple `v1.2.0-rc1`).
- Les artefacts de release incluent la plateforme et la version dans le nom de fichier.

## Contraintes actuelles

L'implémentation actuelle a des contraintes importantes pour la roadmap:

1. Le chemin backend SDL n'est pas complètement implémenté.
2. `SFMLBackend::createTexture` et `RaylibBackend::createTexture` sont incomplets.
3. La logique post-processor/shader est dupliquée entre les implémentations backend.
4. Les chemins shaders des effets sont hardcodés en relatif dans les constructeurs.

Ces contraintes n'invalident pas le pattern architectural, mais elles impactent la maintenabilité et la robustesse du packaging.

## Références

- [Interface binaire-programme (ABI)](https://fr.wikipedia.org/wiki/Application_binary_interface)
- [Curiously recurring template pattern (CRTP)](https://en.wikipedia.org/wiki/Curiously_recurring_template_pattern)
- [Xmake Manual](https://xmake.io/#/guide/basic_commands)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
