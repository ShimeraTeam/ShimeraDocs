# Effet de Luminosité

**Classe :** `shimera::Brightness`  
**En-tête :** `effects/Brightness.hpp`  
**Implémentation :** `src/effects/Brightness.cpp`  
**Shader :** `res/shader/postprocessing/brightness.slang`

## Description

L'effet de luminosité ajoute la même valeur aux composantes rouge, verte et bleue de chaque pixel, ce qui éclaircit ou assombrit toute l'image de manière uniforme. Le résultat est limité à l'intervalle `[0, 1]`, et le canal alpha n'est pas modifié.

## Constructeur

```cpp
explicit Brightness(float strength = 0.1f);
```

## Paramètres

| Paramètre | Setter / Getter | Type | Plage | Défaut | Effet |
|-----------|-----------------|------|-------|--------|-------|
| `strength` | `withStrength()` / `getStrength()` | float | `-1.0` à `1.0` | `0.1` | Valeur ajoutée à chaque canal de couleur |

### Valeurs des paramètres

- **`< 0.0`** - Assombrit l'image (ex. `-0.2` retire 20 % de la luminosité maximale à chaque canal)
- **`0.0`** - Aucun changement
- **`> 0.0`** - Éclaircit l'image (ex. `0.2` ajoute 20 % de la luminosité maximale à chaque canal)
- **`-1.0`** / **`1.0`** - Image entièrement noire / entièrement blanche

::: tip
La valeur étant ajoutée et non multipliée, les zones claires atteignent vite le blanc pur et perdent leurs détails. Pour un résultat plus doux, combinez une petite valeur de luminosité avec [Contrast](./contrast.md).
:::

## Utilisation

![Complete Example](../../../res/shaders/brightness.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::Brightness>(0.2f);

// La changer plus tard, par ex. quand le joueur entre dans une pièce sombre
fx.get<shimera::Brightness>().withStrength(-0.15f);

// À chaque frame, après avoir dessiné la scène dans la cible hôte
fx.render(scene);
```

Voir [Shaders & Effets](./index.md#exemple-complet-sfml) pour un programme complet.
