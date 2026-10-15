# Effet de Saturation

**Classe :** `shimera::Saturation`  
**En-tête :** `effects/Saturation.hpp`  
**Implémentation :** `src/effects/Saturation.cpp`  
**Shader :** `res/shader/postprocessing/saturation.slang`

## Description

L'effet de saturation contrôle la vivacité des couleurs, en interpolant entre une version en niveaux de gris de l'image et ses couleurs d'origine. Il va du noir et blanc pur jusqu'à des couleurs sursaturées. Le résultat est limité à l'intervalle `[0, 1]`, et le canal alpha n'est pas modifié.

La valeur de gris d'un pixel est sa luminance, calculée avec les coefficients Rec. 709 (`0.2126 R + 0.7152 G + 0.0722 B`) : les différences de luminosité sont donc conservées quand les couleurs sont retirées.

## Constructeur

```cpp
explicit Saturation(float saturationFactor = 1.2f);
```

## Paramètres

| Paramètre | Setter / Getter | Type | Plage | Défaut | Effet |
|-----------|-----------------|------|-------|--------|-------|
| `saturationFactor` | `withSaturationFactor()` / `getSaturationFactor()` | float | `0.0` à `2.0+` | `1.2` | Intensité de la saturation |

### Valeurs des paramètres

- **`0.0`** - Entièrement désaturé (noir et blanc)
- **`0.0`** à **`1.0`** - Partiellement désaturé, couleurs ternes
- **`1.0`** - Aucun changement
- **`> 1.0`** - Sursaturé, couleurs plus vives (ex. `1.5` = 50 % plus saturé)
- **`< 0.0`** - Pousse chaque couleur vers sa teinte complémentaire

## Utilisation

![Complete Example](../../../res/shaders/saturation.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::Saturation>(1.5f);

// La changer plus tard
fx.get<shimera::Saturation>().withSaturationFactor(0.6f);

// À chaque frame, après avoir dessiné la scène dans la cible hôte
fx.render(scene);
```

### Niveaux de gris

Il n'y a plus d'effet dédié aux niveaux de gris : un facteur de saturation de `0.0` donne le même résultat en noir et blanc.

![Grayscale](../../../res/shaders/grayscale.gif)

```cpp
fx.add<shimera::Saturation>(0.0f);
```

Animer le facteur entre `1.0` et `0.0` donne un fondu progressif vers le noir et blanc, par exemple quand le joueur perd de la vie :

```cpp
auto& saturation = fx.get<shimera::Saturation>();
// à chaque frame
saturation.withSaturationFactor(health / maxHealth);
```

Voir [Shaders & Effets](./index.md#exemple-complet-sfml) pour un programme complet.
