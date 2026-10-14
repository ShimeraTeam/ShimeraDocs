# Effet Vignette

**Classe :** `shimera::Vignette`  
**En-tête :** `effects/Vignette.hpp`  
**Implémentation :** `src/effects/Vignette.cpp`  
**Shader :** `res/shader/postprocessing/vignette.slang`

## Description

L'effet vignette assombrit les bords de l'écran tout en laissant le centre intact. Il attire le regard vers le milieu de l'écran et donne un aspect cinématographique. La couleur de la vignette peut être changée (une vignette rouge pour signaler des dégâts, par exemple), et sa forme peut soit suivre les proportions de l'écran, soit être un cercle parfait.

La résolution de l'écran, nécessaire pour la forme circulaire, est fournie automatiquement par le pipeline. Il n'y a rien à régler quand la fenêtre est redimensionnée.

## Constructeur

```cpp
explicit Vignette(float strength = 1.0f,
                  float radius = 0.5f,
                  float gap = 0.3f,
                  Vec4<float> color = Vec4(0.0f, 0.0f, 0.0f, 1.0f),
                  bool rounded = false);
```

## Paramètres

| Paramètre | Setter | Type | Plage | Défaut | Effet |
|-----------|--------|------|-------|--------|-------|
| `strength` | `withStrength()` | float | `0.0` à `1.0` | `1.0` | Opacité de la couleur de vignette au plus sombre |
| `radius` | `withRadius()` | float | `0.0` à `1.0` | `0.5` | Distance au centre où commence la vignette |
| `gap` | `withGap()` | float | `0.0` à `1.0` | `0.3` | Largeur du fondu, de `radius` jusqu'à la force maximale |
| `color` | `withColor()` | Vec4&lt;float&gt; | RGBA, `0` à `1` | `(0, 0, 0, 1)` | Couleur de la vignette |
| `rounded` | `withRounded()` | bool | `true` / `false` | `false` | `false` = suit la forme de l'écran, `true` = cercle parfait |

Seul `getStrength()` est disponible comme getter.

### Valeurs des paramètres

Les distances sont mesurées depuis le centre de l'écran, en unités d'écran : le centre est à `0.0`, le milieu de chaque bord à `0.5`, et les coins à environ `0.7`.

- **`strength`** :
  - `0.0` - Pas de vignette
  - `0.5` - Les bords vont à mi-chemin vers la couleur de vignette
  - `1.0` - Les bords atteignent complètement la couleur de vignette
  - `> 1.0` - La couleur de vignette est atteinte avant la fin du fondu, ce qui donne un bord plus dur

- **`radius`** :
  - `0.3` - Vignette serrée, commence près du centre
  - `0.5` - Standard, commence au milieu des bords
  - `0.7` - Vignette lâche, seuls les coins sont touchés

- **`gap`** :
  - `0.1` - Transition nette
  - `0.3` - Transition douce
  - `0.6` - Transition très progressive

- **`color`** :
  - `(0, 0, 0, 1)` - Vignette noire (standard)
  - `(1, 0, 0, 1)` - Vignette rouge (dégâts, danger)
  - `(0.1, 0.2, 0.5, 1)` - Vignette bleue (froid, nuit)
  - Seules les composantes RGB sont utilisées : la composante alpha est ignorée. Utilisez `strength` pour rendre la vignette plus transparente.

- **`rounded`** :
  - `false` - La vignette est étirée selon les proportions de l'écran : une ellipse sur un écran large
  - `true` - La vignette est un cercle parfait, quelles que soient les proportions de l'écran

## Utilisation

### Utilisation de base

![Complete Example](../../../res/shaders/vignette.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::Vignette>();

fx.get<shimera::Vignette>()
  .withStrength(0.8f)
  .withRadius(0.3f)
  .withGap(0.1f)
  .withColor(shimera::Vec4(0.0f, 0.0f, 0.0f, 1.0f))
  .withRounded(false);

// À chaque frame, après avoir dessiné la scène dans la cible hôte
fx.render(scene);
```

### Retour visuel de dégâts

Une vignette rouge et circulaire qui s'estompe avec le temps :

```cpp
fx.add<shimera::Vignette>(0.0f, 0.35f, 0.4f, shimera::Vec4(0.8f, 0.0f, 0.0f, 1.0f), true);
auto& damage = fx.get<shimera::Vignette>();

// quand le joueur est touché
damage.withStrength(1.0f);

// à chaque frame
damage.withStrength(std::max(0.0f, damage.getStrength() - deltaTime * 2.0f));
```

Voir [Shaders & Effets](./index.md#exemple-complet-sfml) pour un programme complet.
