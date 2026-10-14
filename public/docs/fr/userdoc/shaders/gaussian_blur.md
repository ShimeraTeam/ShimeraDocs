# Effet de Flou Gaussien

**Classe :** `shimera::GaussianBlur`  
**En-tête :** `effects/GaussianBlur.hpp`  
**Implémentation :** `src/effects/GaussianBlur.cpp`  
**Shader :** `res/shader/postprocessing/gaussian_blur.slang`

## Description

L'effet de flou gaussien applique un flou doux à l'image, en pondérant les pixels voisins selon une vraie courbe de Gauss. Il est couramment utilisé pour les fonds d'interface en verre dépoli, les menus de pause, des approximations de profondeur de champ ou le lissage général d'une image.

Le flou est séparable : il exécute une passe horizontale dans un framebuffer interne, puis une passe verticale vers la sortie. Cela coûte `2 × (2 × samples + 1)` lectures de texture par pixel au lieu de `(2 × samples + 1)²` pour un flou en une seule passe. Le framebuffer interne est créé et redimensionné par le pipeline, et l'effet n'occupe qu'une seule place dans la chaîne.

## Constructeur

```cpp
explicit GaussianBlur(float sigma = 3.0f,
                      int samples = 10,
                      Vec2<float> resolution = Vec2(1920.0f, 1080.0f));
```

## Paramètres

| Paramètre | Setter / Getter | Type | Plage | Défaut | Effet |
|-----------|-----------------|------|-------|--------|-------|
| `sigma` | `withSigma()` / `getSigma()` | float | `0.5` à `30.0+` | `3.0` | Écart-type de la courbe de Gauss (force du flou) |
| `samples` | `withSamples()` / `getSamples()` | int | `3` à `60+` | `10` | Rayon du noyau en pixels (voisins lus de chaque côté) |
| `resolution` | `withResolution()` / `getResolution()` | Vec2&lt;float&gt; | taille de sortie | `(1920, 1080)` | Taille de la sortie en pixels |

::: warning Réglez la résolution
Contrairement à la plupart des effets, Gaussian Blur ne prend **pas** sa résolution du pipeline. `resolution` fixe la taille d'un pas d'un pixel : si elle ne correspond pas à votre sortie, le flou est plus large ou plus étroit que prévu (et pas de la même façon horizontalement et verticalement). Réglez-la à l'ajout de l'effet, puis à chaque redimensionnement de la fenêtre :

```cpp
fx.resize(width, height);
fx.get<shimera::GaussianBlur>().withResolution(shimera::Vec2(float(width), float(height)));
```
:::

### Valeurs des paramètres

- **`sigma`** :
  - `1.0` à `2.0` - Adoucissement subtil (anti-aliasing, soupçon de flou)
  - `3.0` à `5.0` - Flou modéré (l'image reste lisible)
  - `8.0` à `15.0` - Flou fort (formes reconnaissables, détails perdus)
  - `20.0+` - Flou très fort (seulement des taches de couleur)

- **`samples`** :
  - Règle empirique : `samples ≥ 3 × sigma`
  - En dessous de ce seuil, la courbe de Gauss est tronquée et le flou montre des artefacts carrés visibles sur les bords très contrastés.
  - Au-delà de `3 × sigma`, les échantillons supplémentaires ont des poids quasi nuls et ne font que coûter du temps GPU.

- **`resolution`** :
  - Doit être la taille, en pixels, de la sortie dans laquelle écrit le pipeline (la même taille que celle donnée à `EffectPipeline`).

### Combinaisons recommandées

| Cas d'usage | Sigma | Samples |
|---|---|---|
| Léger adoucissement | 1.5 | 5 |
| Profondeur de champ subtile | 3.0 | 9 |
| Flou d'interface standard | 5.0 | 15 |
| Verre dépoli | 8.0 | 24 |
| Flou fort | 12.0 | 36 |
| Extrême | 20.0 | 60 |

## Utilisation

![Complete Example](../../../res/shaders/gaussian-blur.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::GaussianBlur>(5.0f, 15, shimera::Vec2(960.0f, 540.0f)); // sigma, samples, resolution

// À chaque frame, après avoir dessiné la scène dans la cible hôte
fx.render(scene);
```

### Menu de pause flouté

Ajoutez le flou une fois, laissez-le désactivé pendant le jeu, et activez-le quand le jeu est en pause :

```cpp
fx.add<shimera::GaussianBlur>(8.0f, 24, shimera::Vec2(960.0f, 540.0f));
auto& blur = fx.get<shimera::GaussianBlur>();
blur.setEnabled(false);

// quand le jeu est mis en pause ou repris
blur.setEnabled(paused);
```

Voir [Shaders & Effets](./index.md#exemple-complet-sfml) pour un programme complet.
