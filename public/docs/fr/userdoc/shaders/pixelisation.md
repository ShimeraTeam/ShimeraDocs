# Effet Pixelisation

**Classe :** `shimera::Pixelisation`  
**En-tête :** `effects/Pixelisation.hpp`  
**Implémentation :** `src/effects/Pixelisation.cpp`  
**Shader :** `res/shader/postprocessing/pixelisation.slang`

## Description

L'effet de pixelisation donne à l'image un aspect pixel art rétro en découpant l'écran en une grille de blocs, chaque bloc étant rempli avec la couleur trouvée en son centre. La taille des blocs peut être réglée indépendamment sur les axes X et Y, et la grille peut être décalée avec un offset.

## Constructeur

```cpp
explicit Pixelisation(float pixelSizeX = 4.0f,
                      float pixelSizeY = 4.0f,
                      float gap = 0.3f,
                      Vec2<float> resolution = Vec2(1920.0f, 1080.0f),
                      Vec2<float> offset = Vec2(0.0f, 0.0f));
```

::: info
Le troisième paramètre du constructeur, `gap`, n'est actuellement pas utilisé. Pour régler la résolution ou l'offset, passez-lui n'importe quelle valeur, ou utilisez plutôt les setters ci-dessous.
:::

## Paramètres

| Paramètre | Setter / Getter | Type | Plage | Défaut | Effet |
|-----------|-----------------|------|-------|--------|-------|
| `pixelSizeX` | `withPixelSizeX()` / `getPixelSizeX()` | float | `1.0` à la largeur de l'écran | `4.0` | Largeur de chaque bloc, en pixels écran |
| `pixelSizeY` | `withPixelSizeY()` / `getPixelSizeY()` | float | `1.0` à la hauteur de l'écran | `4.0` | Hauteur de chaque bloc, en pixels écran |
| `resolution` | `withResolution()` / `getResolution()` | Vec2&lt;float&gt; | taille de sortie | `(1920, 1080)` | Taille de la sortie en pixels |
| `offset` | `withOffset()` / `getOffset()` | Vec2&lt;float&gt; | `0.0` à `1.0` | `(0, 0)` | Origine de la grille, en fraction de l'écran |

`withPixelSize(size)` règle `pixelSizeX` et `pixelSizeY` en même temps. `getPixelSize()` renvoie `pixelSizeX`.

::: warning Réglez la résolution
Contrairement à la plupart des effets, Pixelisation ne prend **pas** sa résolution du pipeline. Elle sert à convertir la taille des blocs de pixels en fractions d'écran : si elle ne correspond pas à votre sortie, les blocs n'ont pas la taille demandée. Réglez-la à l'ajout de l'effet, puis à chaque redimensionnement de la fenêtre :

```cpp
fx.resize(width, height);
fx.get<shimera::Pixelisation>().withResolution(shimera::Vec2(float(width), float(height)));
```
:::

### Valeurs des paramètres

- **`pixelSizeX` / `pixelSizeY`** :
  - `1.0` - Pas de pixelisation (résolution d'origine)
  - `4.0` - Léger aspect pixel art (défaut)
  - `8.0` - Nettement pixelisé
  - `16.0` - Effet rétro marqué
  - `32.0+` - Très gros blocs

- **`resolution`** :
  - Doit être la taille, en pixels, de la sortie dans laquelle écrit le pipeline (la même taille que celle donnée à `EffectPipeline`).

- **`offset`** :
  - `(0, 0)` - La grille commence dans le coin inférieur gauche de l'écran (défaut)
  - Exprimé en fraction de l'écran : `(0.5, 0.5)` place l'origine de la grille au centre, les lignes de la grille se croisent donc exactement au milieu de l'écran
  - Le faire varier dans le temps fait glisser ou trembler la grille

## Utilisation

### Utilisation de base

![Complete Example](../../../res/shaders/pixelisation.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::Pixelisation>();

fx.get<shimera::Pixelisation>()
  .withPixelSize(8.0f)
  .withResolution(shimera::Vec2(960.0f, 540.0f));

// À chaque frame, après avoir dessiné la scène dans la cible hôte
fx.render(scene);
```

### Blocs non carrés

`withPixelSizeX()` et `withPixelSizeY()` règlent les dimensions des blocs indépendamment, pour un pixel art étiré ou écrasé :

```cpp
fx.get<shimera::Pixelisation>()
  .withPixelSizeX(16.0f)   // blocs larges
  .withPixelSizeY(4.0f)    // blocs bas
  .withResolution(shimera::Vec2(1920.0f, 1080.0f));
```

### Transition

Augmenter rapidement la taille des blocs donne une transition de scène classique par pixelisation :

```cpp
auto& pixelisation = fx.get<shimera::Pixelisation>();
// à chaque frame de la transition, avec progress allant de 0 à 1
pixelisation.withPixelSize(1.0f + progress * 63.0f);
```

Voir [Shaders & Effets](./index.md#exemple-complet-sfml) pour un programme complet.
