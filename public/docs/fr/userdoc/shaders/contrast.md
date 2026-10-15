# Effet de Contraste

**Classe :** `shimera::Contrast`  
**En-tête :** `effects/Contrast.hpp`  
**Implémentation :** `src/effects/Contrast.cpp`  
**Shader :** `res/shader/postprocessing/contrast.slang`

## Description

L'effet de contraste étire ou resserre l'écart entre chaque canal de couleur et le gris moyen `0.5`. Plus le facteur augmente, plus les hautes lumières s'éclaircissent et les ombres s'assombrissent, tandis que les tons moyens restent en place. Le résultat est limité à l'intervalle `[0, 1]`, et le canal alpha n'est pas modifié.

Chaque canal est calculé ainsi : `(couleur - 0.5) * contrastFactor + 0.5`.

## Constructeur

```cpp
explicit Contrast(float contrastFactor = 1.2f);
```

## Paramètres

| Paramètre | Setter / Getter | Type | Plage | Défaut | Effet |
|-----------|-----------------|------|-------|--------|-------|
| `contrastFactor` | `withContrastFactor()` / `getContrastFactor()` | float | `0.0` à `2.0+` | `1.2` | Multiplicateur de contraste |

### Valeurs des paramètres

- **`0.0`** - Image uniformément grise
- **`< 1.0`** - Contraste réduit, l'image paraît délavée (ex. `0.5` divise le contraste par deux)
- **`1.0`** - Aucun changement
- **`> 1.0`** - Contraste accru, couleurs plus vives (ex. `1.5` ajoute 50 % de contraste)
- **`< 0.0`** - Inverse l'image autour du gris moyen

## Utilisation

![Complete Example](../../../res/shaders/contrast.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::Contrast>(1.5f);

// Le changer plus tard
fx.get<shimera::Contrast>().withContrastFactor(0.8f);

// À chaque frame, après avoir dessiné la scène dans la cible hôte
fx.render(scene);
```

Voir [Shaders & Effets](./index.md#exemple-complet-sfml) pour un programme complet.
