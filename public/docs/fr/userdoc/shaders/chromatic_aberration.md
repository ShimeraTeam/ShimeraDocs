# Effet d'Aberration Chromatique

**Classe :** `shimera::ChromaticAberration`  
**En-tête :** `effects/ChromaticAberration.hpp`  
**Implémentation :** `src/effects/ChromaticAberration.cpp`  
**Shader :** `res/shader/postprocessing/chromatic_aberration.slang`

## Description

L'effet d'aberration chromatique simule un objectif qui ne fait pas converger toutes les longueurs d'onde au même endroit, en écartant les canaux rouge, vert et bleu. Il crée des franges colorées le long des bords très contrastés, que l'on retrouve avec les vieux objectifs, dans les interfaces de science-fiction, ou comme effet d'impact.

L'image est échantillonnée plusieurs fois le long d'un court segment : les échantillons d'une extrémité sont pondérés vers le rouge, ceux du milieu vers le vert, et ceux de l'autre extrémité vers le bleu. Le segment peut soit avoir la même direction partout (mode linéaire), soit partir du centre de l'écran (mode radial, comme un vrai objectif).

## Constructeur

```cpp
explicit ChromaticAberration(float strength = 1.0f,
                             bool radius = false,
                             float contrast = 2.0f,
                             int samples = 20);
```

## Paramètres

| Paramètre | Setter / Getter | Type | Plage | Défaut | Effet |
|-----------|-----------------|------|-------|--------|-------|
| `strength` | `withStrength()` / `getStrength()` | float | `0.0` à `1.0+` | `1.0` | Écart entre les canaux de couleur |
| `radius` | `withRadius()` / `getRadius()` | bool | `true` / `false` | `false` | `false` = linéaire, `true` = radial depuis le centre |
| `contrast` | `withContrast()` / `getContrast()` | float | `0.5` à `3.0+` | `2.0` | Netteté de la séparation des canaux |
| `samples` | `withSamples()` / `getSamples()` | int | `1` à `64` | `20` | Nombre d'échantillons, qualité contre performance |

### Valeurs des paramètres

- **`strength`** :
  - `0.0` - Pas d'aberration
  - `0.3` - Franges colorées subtiles
  - `0.5` - Effet perceptible
  - `1.0` - Forte séparation
  - `> 1.0` - Séparation extrême

- **`radius`** :
  - `false` - Linéaire : les canaux sont décalés en diagonale, de la même quantité sur tout l'écran
  - `true` - Radial : aucun décalage au centre de l'écran, de plus en plus fort vers les bords, comme un vrai objectif

- **`contrast`** :
  - `1.0` - Mélange doux entre les canaux
  - `2.0` - Canaux clairement séparés (défaut)
  - `3.0+` - Franges très nettes et saturées

- **`samples`** :
  - `5` - Très rapide, effet d'escalier visible
  - `10` - Bon compromis
  - `20` - Haute qualité (défaut)
  - `30+` - Très haute qualité, plus lent
  - Les valeurs inférieures à `1` sont traitées comme `1`. Augmentez-le en même temps que `strength`, sinon les échantillons individuels deviennent visibles.

## Utilisation

![Complete Example](../../../res/shaders/chromaticAberration.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::ChromaticAberration>();

fx.get<shimera::ChromaticAberration>()
  .withStrength(0.5f)
  .withRadius(true)
  .withContrast(2.0f)
  .withSamples(20);

// À chaque frame, après avoir dessiné la scène dans la cible hôte
fx.render(scene);
```

### Effet d'impact

Une courte bouffée d'aberration qui s'estompe, par exemple quand le joueur est touché :

```cpp
auto& aberration = fx.get<shimera::ChromaticAberration>();

// quand le joueur est touché
aberration.withStrength(1.5f);

// à chaque frame
aberration.withStrength(std::max(0.0f, aberration.getStrength() - deltaTime * 3.0f));
```

Voir [Shaders & Effets](./index.md#exemple-complet-sfml) pour un programme complet.
