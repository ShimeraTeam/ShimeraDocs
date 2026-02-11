# **{Shimera} Couche d'Abstraction**

La couche d'abstraction de **Shimera** est conçue pour **fournir** une **interface unifiée** pour **différentes bibliothèques graphiques**, permettant aux utilisateurs de travailler avec des shaders **sans se soucier** des **détails d'implémentation** sous-jacents. Cette couche **abstrait** les **complexités d'OpenGL** et les **appels spécifiques** requis par **chaque bibliothèque graphique**, comme SFML par exemple.

## Pré-Développement

Le schéma créé pour discuter de la couche d'abstraction avec l'équipe représente toujours l'état actuel de la couche d'abstraction de manière claire et concise :

![Schéma de la Couche d'Abstraction](/abstr_shema.png)

Depuis lors, la couche d'abstraction a été modifiée pour répondre aux besoins du projet, mais l'idée générale reste la même. L'objectif principal de la couche d'abstraction est de fournir une **interface simple et cohérente** pour **créer et gérer des shaders**, quelle que soit la bibliothèque graphique sous-jacente.

## Vue d'Ensemble de l'Architecture

### Philosophie de Conception

Shimera suit ces principes fondamentaux :

1. **Sélection du Backend à la Compilation** - Aucune surcharge à l'exécution grâce aux macros du préprocesseur
2. **"Factory" Principale** - Création centralisée de composants via `BackendFactory`
3. **Abstraction Basée sur les Interfaces** - Tous les composants implémentent des interfaces (`IBackend`, `IFrameBuffer`, etc.)
4. **Support Multi-Pass** - Support intégré pour chaîner plusieurs effets de post-traitement
5. **API Agnostique du Backend** - Le même code fonctionne sur les backends OpenGL, SFML et SDL


## Composants Principaux

### 1. BackendFactory

**Objectif :** Crée l'implémentation de backend appropriée basée sur la macro de compilation.

**Emplacement :** `BackendFactory.hpp/cpp`

**Méthode Clé :**
- `create()` - Retourne une instance de `IBackend` correspondant à la macro de backend définie

::: info
La définition du backend est généralement effectuée lors de la configuration de build, donc les utilisateurs n'auront généralement pas besoin de la définir manuellement dans leur code. La factory sélectionnera automatiquement le bon backend en fonction de la macro définie.
:::

**Usage :**
```cpp
#define SHIMERA_BACKEND_SFML  // Défini avant d'inclure shimera.h, généralement fait lors de la configuration de build
#include <shimera.h>

IBackend* backend = BackendFactory::create();
```

**Comment ça fonctionne :**
- Vérifie la macro `SHIMERA_BACKEND_*` au moment de la compilation
- Retourne le backend approprié (`SFMLBackend`, `OpenGLBackend`, `SDLBackend`)
- Aucune décision à l'exécution, ce qui signifie aucune surcharge

### 2. Interface IBackend

**Objectif :** Factory abstraite pour créer des composants spécifiques au backend. Regroupe toutes les interfaces ensemble et fournit un point d'accès unique.

**Emplacement :** `IBackend.hpp`

**Méthodes Clés :**
- `createFrameBuffer(width, height)` - Crée une cible de rendu hors écran spécifique au backend
- `createPostProcessor(vert, frag)` - Crée un effet de post-traitement spécifique au backend avec les shaders donnés
- `createTexture(width, height)` - Crée une texture spécifique au backend
- `createShader(vert, frag)` - Crée un programme de shader spécifique au backend

### 3. Interface IFrameBuffer

**Objectif :** Représente une cible de rendu hors écran.

**Emplacement :** `IFrameBuffer.hpp`

**Méthodes Clés :**
- `bind()` / `unbind()` - Activer/désactiver pour le rendu
- `clear(Color)` - Effacer avec la couleur spécifiée
- `getTexture()` - Obtenir le résultat rendu en tant que texture
- `resize(width, height)` - Changer les dimensions
- `getNativeRenderTarget()` - Obtenir la cible de rendu spécifique au backend (ex. `sf::RenderTexture*`)

**Usage :**
```cpp
IFrameBuffer* fbo = backend->createFrameBuffer(800, 600);

// SFML: Dessiner en utilisant la cible de rendu native (static_cast est temporaire, en cours de développement.)
auto* rt = static_cast<sf::RenderTexture*>(fbo->getNativeRenderTarget());
rt->draw(shape);
fbo->unbind(); // Finaliser le rendu

// OpenGL: Utiliser bind/unbind
fbo->bind();
glDrawArrays(...);
fbo->unbind();
```

### 4. Interface IPostProcessor

**Objectif :** Applique des shaders de post-traitement aux textures.

**Emplacement :** `IPostProcessor.hpp`

**Méthodes Clés :**
- `setShader(vert, frag)` - Charger les programmes de shader
- `render(ITexture&)` - Appliquer l'effet à la texture
- `setUniform(name, value)` - Définir les uniforms du shader
- `getShader()` - Accéder au shader sous-jacent

**Usage :**
```cpp
IPostProcessor* exempleEffect = backend->createPostProcessor("*...*/post.vert", "*...*/exemple.frag");
effect->setUniform("time", 0.0f);
effect->render(fbo->getTexture());
```

### 5. Interfaces ITexture & IShader

**Objectif :** Abstraire les ressources de texture et de shader.

**Emplacements :** `ITexture.hpp`, `IShader.hpp`

**Caractéristiques Clés :**
- `getNativeHandle()` - Accéder au handle OpenGL/backend sous-jacent
- Système d'uniforms type-safe via le variant `UniformValue`
- Nettoyage automatique des ressources via RAII

### 6. Structure Color

**Objectif :** Représentation de couleur agnostique du backend. Une façon de spécifier les couleurs sans dépendre des types spécifiques au backend (ex. `sf::Color`).

**Emplacement :** `Color.hpp`

**Caractéristiques :**
- RGBA normalisé (0.0-1.0) pour la compatibilité inter-backend
- Méthode factory `fromRGB(r, g, b, a)` pour les valeurs 0-255
- Constantes de couleurs communes (`Color::Black()`, `Color::White()`, etc.)


## Implémentations des Backends

### Backend SFML (Implémenté)

**Composants :**
- **SFMLBackend** - Implémentation de la factory
- **SFMLFramebuffer** - Encapsule `sf::RenderTexture`
- **SFMLPostProcessor** - Utilise OpenGL en interne (SFML est accessible via OpenGL)
- **SFMLTexture** - Encapsule `sf::Texture`
- **SFMLShader** - Gestion brute des shaders OpenGL

**Détails d'Implémentation Clés :**

#### SFMLFramebuffer
- Utilise `sf::RenderTexture` en interne
- `bind()` appelle `setActive(true)` pour faire le rendu OpenGL dessus
- `unbind()` appelle `display()` pour finaliser et `setActive(false)`
- `getNativeRenderTarget()` retourne `&renderTexture` pour le dessin SFML

#### SFMLPostProcessor
- Crée un quad plein écran (VAO, VBO, EBO)
- Gère le shader OpenGL via `SFMLShader`
- Gère la mise en cache des uniforms pour les performances
- Gère correctement l'état OpenGL pour éviter les conflits avec SFML

### Backend OpenGL (Planifié)

Utilisera directement les FBOs OpenGL sans bibliothèque wrapper.

### Backend SDL (Planifié)

Utilisera le renderer SDL ou le contexte OpenGL selon la configuration SDL.


## Architecture de Rendu Multi-Pass

### Concept

Le rendu multi-pass chaîne plusieurs effets de post-traitement en utilisant des framebuffers intermédiaires (rendu ping-pong).

**Flux :**
```
Scène → FBO1 → Effet1 → FBO2 → Effet2 → Écran
```

### Modèle d'Implémentation

```cpp
// Créer les framebuffers
IFrameBuffer* sceneFBO = backend->createFrameBuffer(800, 600);
IFrameBuffer* tempFBO = backend->createFrameBuffer(800, 600);

// Créer les effets
IPostProcessor* effect1 = backend->createPostProcessor("post.vert", "effect1.frag");
IPostProcessor* effect2 = backend->createPostProcessor("post.vert", "effect2.frag");

// Boucle de rendu
while (running) {
    // 1. Rendre la scène vers sceneFBO
    auto* rt = static_cast<sf::RenderTexture*>(sceneFBO->getNativeRenderTarget());
    rt->clear(sf::Color::Black);
    rt->draw(shape);
    sceneFBO->unbind();
    
    // 2. Appliquer effect1: sceneFBO → tempFBO
    tempFBO->bind();
    glClear(GL_COLOR_BUFFER_BIT);
    effect1->render(sceneFBO->getTexture());
    tempFBO->unbind();
    
    // 3. Appliquer effect2: tempFBO → écran
    window.setActive(true);
    glClear(GL_COLOR_BUFFER_BIT);
    effect2->render(tempFBO->getTexture());
    
    window.display();
}
```

### Bonnes Pratiques

1. **Minimiser les changements de FBO** - Opération coûteuse
2. **Réutiliser les framebuffers** - Créer une fois, utiliser plusieurs fois
3. **Correspondre les dimensions** - Tous les FBOs doivent correspondre à la résolution cible
4. **Gestion appropriée du contexte** - S'assurer que le bon contexte est actif (surtout avec SFML)


## Guide d'Utilisation

### Étape 1 : Définir le Backend

::: tip NOTE
Comme mentionné précédemment, le backend est généralement défini lors de la configuration de build, donc les utilisateurs n'auront généralement pas besoin de le définir manuellement dans leur code. La factory sélectionnera automatiquement le bon backend en fonction de la macro définie.
:::

```cpp
// `#define [BACKEND]` devrait déjà être défini, donc pas besoin de le définir manuellement
#define SHIMERA_BACKEND_SFML  // Ou SHIMERA_BACKEND_OPENGL, SHIMERA_BACKEND_SDL
#include <shimera.h>
```

### Étape 2 : Initialiser

```cpp
// Initialisation OpenGL (si utilisation d'un backend basé sur OpenGL)
glewInit();

// Créer le backend
IBackend* backend = BackendFactory::create();
```

### Étape 3 : Créer les Composants

```cpp
IFrameBuffer* fbo = backend->createFrameBuffer(800, 600);
IPostProcessor* effect = backend->createPostProcessor("vert.glsl", "frag.glsl");

// Définir les uniforms du shader
effect->setUniform("time", 0.0f);
effect->setUniform("strength", 0.5f);
```

### Étape 4 : Rendre

```cpp
// Rendre vers le framebuffer
auto* rt = static_cast<sf::RenderTexture*>(fbo->getNativeRenderTarget());
rt->draw(sprite);
fbo->unbind();

// Appliquer le post-traitement
effect->render(fbo->getTexture());
```

### Étape 5 : Nettoyage

```cpp
delete effect;
delete fbo;
delete backend;
```

**Note :** Considérez l'utilisation de pointeurs intelligents (`std::unique_ptr`) pour un nettoyage automatique.


## Système d'Uniforms

### Uniforms Type-Safe

Shimera utilise `std::variant` pour des valeurs d'uniforms type-safe :

```cpp
using UniformValue = std::variant<float, int, Vec4<float>>;
```

### Définir les Uniforms

```cpp
effect->setUniform("time", 1.5f);           // float
effect->setUniform("iterations", 10);       // int
effect->setUniform("color", Vec4(1,0,0,1)); // vec4
```

### Sous le Capot

Utilise `std::visit` pour dispatcher vers la fonction uniform OpenGL correcte :
- `float` → `glUniform1f`
- `int` → `glUniform1i`
- `Vec4` → `glUniform4f`


## File Structure

```
include/
  shimera.h                      # Main public header
  backend/
    BackendFactory.hpp           # Factory interface
    IBackend.hpp                 # Backend interface
    IFrameBuffer.hpp             # Framebuffer interface
    IPostProccessor.hpp          # Post-processor interface
    ITexture.hpp                 # Texture interface
    IShader.hpp                  # Shader interface
    Color.hpp                    # Color struct
    sfml/
      SFMLBackend.hpp            # SFML implementation declarations
      SFMLFramebuffer.hpp
      SFMLPostProccessor.hpp
      SFMLTexture.hpp
      SFMLShader.hpp
  uniform/
    Uniform.hpp                  # Uniform wrapper
    Vec4.hpp                     # Vector types

src/
  backend/
    BackendFactory.cpp           # Factory implementation
    sfml/
      SFMLBackend.cpp            # SFML implementations
      SFMLFramebuffer.cpp
      SFMLPostProccessor.cpp
      SFMLTexture.cpp
      SFMLShader.cpp
```

## Système de Build
::: warning NOTE IMPORTANTE
Peut-être que cette section devrait être déplacée vers une section séparée "Instructions de Build" ou similaire.
:::
### Configuration XMake

La bibliothèque est compilée en cibles séparées par backend :

```lua
-- Backend SFML de Shimera
target("shimera-sfml")
    set_kind("static")
    add_files("src/*.cpp")
    add_files("src/backend/*.cpp")
    add_files("src/backend/sfml/*.cpp")  -- Fichiers spécifiques au backend
    add_packages("glew", "sfml")
    add_defines("SHIMERA_BACKEND_SFML")
```

### Liaison au Projet

```lua
target("my-app")
    add_deps("shimera-sfml")  -- Lier avec shimera
    add_packages("sfml", "glew")
```

## Décisions de Conception

### Pourquoi le Patron Factory ?

1. **Création centralisée de composants** - Point unique pour l'instanciation du backend
2. **Découplage** - Le code utilisateur ne connaît pas les implémentations concrètes
3. **Extensibilité** - Facile d'ajouter de nouveaux backends (Metal, Vulkan, DirectX, WebGPU)
4. **Sécurité des types** - Les interfaces garantissent une utilisation correcte

### Pourquoi la Sélection à la Compilation ?

1. **Aucune surcharge à l'exécution** - Pas de dispatch virtuel ou de branchement
2. **Binaires plus petits** - Seul le backend sélectionné est compilé
3. **Code plus propre** - Pas de #ifdef dans le code utilisateur
4. **Meilleure optimisation** - Le compilateur peut inliner le code spécifique au backend

### Pourquoi getNativeRenderTarget() ?

Les différents backends ont des modèles de rendu différents :
- **SFML** : Doit appeler `.draw()` sur `sf::RenderTexture`
- **OpenGL** : Utilise `bind()` / `unbind()`
- **SDL** : `SDL_SetRenderTarget()`

Exposer les types natifs permet une utilisation idiomatique par backend tout en maintenant l'abstraction.

## Améliorations Futures

### Fonctionnalités Planifiées

1. **Gestion Automatique des Ressources** - Pointeurs intelligents dans les interfaces pour éviter le nettoyage manuel (éviter `delete ...`)
2. **Bibliothèque d'Effets** - Plus de shaders pré-construits que ceux actuellement proposés (flou, bloom, vignette, etc.)
3. **API de Composition d'Effets** - Constructeur de pipeline de haut niveau, donc chaînage multi-pass "automatique" sans gestion manuelle des FBO (idée conceptuelle ci-dessous)
4. **Rechargement à Chaud des Shaders** - Recharger les shaders sans redémarrage
5. **Plus de Backends** - Vulkan, DirectX, Metal, WebGPU

### API de Pipeline d'Effets (Concept)

```cpp
EffectPipeline pipeline;
pipeline.addEffect("blur", blurShader)
        .addEffect("bloom", bloomShader)
        .addEffect("vignette", vignetteShader)
        .compile();

// Un seul appel applique tous les effets
pipeline.render(sourceTexture);
```

## Exemple : Application Multi-Pass Complète

Voir `examples/sfml/src/main.cpp` pour un exemple fonctionnel démontrant :
- Initialisation du backend
- Création de framebuffer
- Chaînage d'effets multi-pass (distorsion + niveaux de gris)
- Gestion appropriée du contexte
- Nettoyage des ressources

Des commentaires ont été ajoutés pour expliquer chaque étape en détail.

## Dépannage

### Écran Noir

**Problème :** Le framebuffer rend mais l'écran est noir.

**Solutions :**
1. S'assurer que le bon contexte est actif : `window.setActive(true)` avant le rendu
2. Appeler `fbo->unbind()` pour finaliser le rendu du framebuffer
3. Vérifier les erreurs de compilation des shaders
4. Vérifier la liaison de texture (`glActiveTexture`, `glBindTexture`)

### Erreurs OpenGL

**Problème :** `GL_INVALID_OPERATION` sur `glBindVertexArray`.

**Solutions :**
1. Initialiser GLEW avant de créer des ressources OpenGL
2. S'assurer que la fenêtre/contexte est actif avant les appels OpenGL
3. Délier le VAO de SFML avant de lier le vôtre : `glBindVertexArray(0)`

Ces problèmes ne devraient pas arriver car la couche d'abstraction est conçue pour gérer la gestion du contexte et l'état OpenGL, mais si vous utilisez directement des appels OpenGL dans vos shaders ou effets personnalisés, ces conseils peuvent aider.

### Includes Manquants

Actuellement, les utilisateurs doivent inclure des headers spécifiques pour chaque composant, ce qui peut mener à de la confusion et des erreurs.
#### TODO :
Nettoyer et ajouter tous les headers dans `shimera.h`, car pour l'instant, les utilisateurs doivent inclure des headers spécifiques pour chaque composant, ce qui n'est pas idéal. Le header principal devrait fournir l'accès à tous les composants nécessaires sans exiger que les utilisateurs connaissent la structure interne de la bibliothèque.

## Considérations de Performance

### Surcharge des Framebuffers

- **Création** : Coûteuse - créer une fois, réutiliser
- **Liaison** : Modérée - minimiser les changements
- **Effacement** : Peu coûteux - mais nécessaire

### Compilation des Shaders

- Compiler les shaders au démarrage, pas par frame
- Mettre en cache les emplacements des uniforms (déjà fait dans `SFMLShader`)

### Mises à Jour des Uniforms

- Mettre à jour uniquement les uniforms modifiés
- Grouper les mises à jour d'uniforms quand possible
- Les uniforms devraient avoir un mécanisme de cache pour éviter les appels OpenGL redondants

### Mémoire

- Faire correspondre la taille du framebuffer à la fenêtre - ne pas suréchantillonner
- Libérer les effets/framebuffers inutilisés

## Références

- [Documentation SFML](https://www.sfml-dev.org/documentation/3.0.0/)
- [OpenGL Wiki](https://www.khronos.org/opengl/wiki/)
- [LearnOpenGL - Framebuffers](https://learnopengl.com/Advanced-OpenGL/Framebuffers)
- [Définition de Surcharge](https://en.wikipedia.org/wiki/Overhead_(computing))
- [RAII en C++](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization)
- [Qu'est-ce que le Rendu Ping-Pong ?](https://gamedev.stackexchange.com/questions/80951/what-is-ping-pong-in-the-context-of-graphics-rendering)
