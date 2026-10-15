# Effet Bloom

**Classe :** `shimera::Bloom`  
**En-tête :** `effects/Bloom.hpp`  
**Implémentation :** `src/effects/Bloom.cpp`  
**Shader :** `res/shader/postprocessing/bloom.slang`

## Description

L'effet bloom fait briller les zones lumineuses de l'image, en faisant déborder la lumière sur les pixels voisins. Il est idéal pour les matériaux émissifs, les néons, les sources de lumière, la magie, ou un rendu doux et onirique.

Il fonctionne en deux passes, avec un framebuffer interne créé et redimensionné par le pipeline (l'effet n'occupe qu'une seule place dans la chaîne) :

1. **Extraction des zones lumineuses et flou horizontal.** Seuls les pixels plus lumineux que `threshold` sont gardés, puis floutés horizontalement. La luminosité d'un pixel est celle de son canal de couleur le plus lumineux.
2. **Flou vertical et composition.** Le résultat est flouté verticalement, multiplié par `intensity`, puis **ajouté** par-dessus l'image d'origine.

La résolution de l'écran, nécessaire pour le flou, est fournie automatiquement par le pipeline. Il n'y a rien à régler quand la fenêtre est redimensionnée.

::: info Anciennement HDR Bloom
Cet effet remplace le `HDRBloomEffect` de la version précédente de la bibliothèque. L'étape de tone mapping ACES a été retirée : la lueur est maintenant simplement ajoutée à l'image, si bien que les zones très lumineuses saturent vers le blanc au lieu d'être compressées. Baissez `intensity` si les hautes lumières paraissent brûlées.
:::

## Constructeur

```cpp
explicit Bloom(float threshold = 0.7f,
               float knee = 0.2f,
               float intensity = 1.0f,
               float blurSigma = 5.0f,
               int blurSamples = 15);
```

## Paramètres

| Paramètre | Setter / Getter | Type | Plage | Défaut | Effet |
|-----------|-----------------|------|-------|--------|-------|
| `threshold` | `withThreshold()` / `getThreshold()` | float | `0.0` à `1.0` | `0.7` | Luminosité au-dessus de laquelle les pixels brillent |
| `knee` | `withKnee()` / `getKnee()` | float | `0.0` à `0.5` | `0.2` | Douceur du seuil |
| `intensity` | `withIntensity()` / `getIntensity()` | float | `0.0` à `3.0+` | `1.0` | Force de la lueur ajoutée |
| `blurSigma` | `withBlurSigma()` / `getBlurSigma()` | float | `1.0` à `30.0+` | `5.0` | Étendue (rayon) de la lueur |
| `blurSamples` | `withBlurSamples()` / `getBlurSamples()` | int | `5` à `90+` | `15` | Échantillons de flou de chaque côté, qualité contre performance |

### Valeurs des paramètres

- **`threshold`** :
  - `0.3` - La majeure partie de l'image brille
  - `0.5` - Lueur modérée
  - `0.7` - Seules les zones lumineuses brillent (défaut)
  - `0.9` - Seules les sources les plus lumineuses brillent

- **`knee`** : les pixels commencent à briller à partir de `threshold - knee` et brillent pleinement à partir de `threshold + knee`.
  - `0.0` - Coupure nette, un pixel brille ou ne brille pas
  - `0.2` - Transition douce (défaut)
  - `0.4+` - Apparition très progressive de la lueur

- **`intensity`** :
  - `0.0` - Pas de lueur
  - `1.0` - Lueur naturelle (défaut)
  - `1.5` à `3.0` - Lueur forte
  - `> 3.0` - Les zones qui brillent deviennent blanches

- **`blurSigma`** :
  - `5.0` - Halo serré autour des sources (défaut)
  - `15.0` - Lueur moyenne et douce
  - `30.0+` - Grande aura diffuse

- **`blurSamples`** :
  - Règle empirique : `blurSamples ≈ 2 à 3 × blurSigma`. Avec moins d'échantillons, la lueur est coupée brusquement et des bandes apparaissent.
  - `15` - Rapide, suffisant pour le sigma par défaut
  - `30` - Bon compromis pour une lueur moyenne
  - `60` - Haute qualité
  - `90+` - Qualité maximale, plus lent

## Utilisation

![Complete Example](../../../res/shaders/hdr-bloom.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::Bloom>();

fx.get<shimera::Bloom>()
  .withThreshold(0.7f)
  .withKnee(0.2f)
  .withIntensity(1.5f)
  .withBlurSigma(15.0f)
  .withBlurSamples(30);

// À chaque frame, après avoir dessiné la scène dans la cible hôte
fx.render(scene);
```

Ou avec les paramètres du constructeur :

```cpp
fx.add<shimera::Bloom>(0.7f, 0.2f, 1.0f, 10.0f, 30); // threshold, knee, intensity, blurSigma, blurSamples
```

::: tip Position dans le pipeline
Placez le bloom avant les effets qui assombrissent ou recolorent l'image (Vignette, Saturation, ...), pour que la lueur soit affectée par eux, et après les effets qui déplacent les pixels (Distortion, ...), pour que la lueur suive l'image déformée.
:::

Voir [Shaders & Effets](./index.md#exemple-complet-sfml) pour un programme complet.
