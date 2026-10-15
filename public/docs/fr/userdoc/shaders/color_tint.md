# Effet de Teinte

**Classe :** `shimera::ColorTint`  
**En-tête :** `effects/ColorTint.hpp`  
**Implémentation :** `src/effects/ColorTint.cpp`  
**Shader :** `res/shader/postprocessing/color_tint.slang`

## Description

L'effet de teinte mélange toute l'image avec une seule couleur, à parts égales. Il crée des filtres colorés, utiles pour l'ambiance (coucher de soleil chaud, nuit froide, sous l'eau), les changements de ton émotionnel, ou un retour visuel en jeu comme un écran rouge quand le joueur subit des dégâts. Le canal alpha n'est pas modifié.

Chaque pixel est calculé ainsi : `(couleur d'origine + tint) / 2`, c'est-à-dire la moyenne entre la couleur d'origine et la couleur de teinte.

::: info Anciennement Colorshift
Cet effet remplace le `ColorshiftEffect` de la version précédente de la bibliothèque, avec le même comportement sous un nouveau nom.
:::

## Constructeur

```cpp
explicit ColorTint(Vec3<float> tint = Vec3(0.0f, 0.0f, 0.0f));
```

## Paramètres

| Paramètre | Setter / Getter | Type | Plage | Défaut | Effet |
|-----------|-----------------|------|-------|--------|-------|
| `tint` | `withTint()` / `getTint()` | Vec3&lt;float&gt; | RGB, `0` à `1` | `(0, 0, 0)` | Couleur moyennée avec l'image |

### Valeurs de teinte

Chaque composante RGB va de `0.0` à `1.0`. Comme l'image et la teinte pèsent toujours 50 % chacune, la teinte modifie aussi la luminosité globale : les teintes sombres assombrissent l'image, les teintes claires l'éclaircissent.

- **`(0.0, 0.0, 0.0)`** - Noir : l'image est assombrie de moitié (défaut)
- **`(1.0, 0.0, 0.0)`** - Teinte rouge
- **`(0.0, 1.0, 0.0)`** - Teinte verte
- **`(0.0, 0.0, 1.0)`** - Teinte bleue
- **`(1.0, 1.0, 0.0)`** - Teinte jaune
- **`(1.0, 0.0, 1.0)`** - Teinte magenta
- **`(0.0, 1.0, 1.0)`** - Teinte cyan
- **`(0.5, 0.5, 0.5)`** - Gris neutre : aucun changement de couleur, le contraste est divisé par deux
- **`(1.0, 1.0, 1.0)`** - Blanc : l'image est délavée vers le blanc

::: tip
L'effet s'applique toujours à pleine force. Pour le désactiver, utilisez `setEnabled(false)` plutôt qu'une valeur de teinte particulière.
:::

## Utilisation

![Complete Example](../../../res/shaders/colorShift.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::ColorTint>(shimera::Vec3(1.0f, 0.0f, 0.0f)); // teinte rouge

// La changer plus tard
fx.get<shimera::ColorTint>().withTint(shimera::Vec3(0.0f, 0.4f, 0.8f));

// À chaque frame, après avoir dessiné la scène dans la cible hôte
fx.render(scene);
```

### Retour visuel de dégâts

Une teinte rouge affichée uniquement quand le joueur est blessé :

```cpp
fx.add<shimera::ColorTint>(shimera::Vec3(1.0f, 0.0f, 0.0f));
auto& damage = fx.get<shimera::ColorTint>();
damage.setEnabled(false);

// à chaque frame
damage.setEnabled(hurtTimer > 0.0f);
```

Voir [Shaders & Effets](./index.md#exemple-complet-sfml) pour un programme complet.
