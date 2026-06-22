# Effet HDR Bloom

**En-tête:** `include/effects/HDRBloomEffect.hpp`  
**Implémentation:** `src/effects/HDRBloomEffect.cpp`  
**Shader:** `res/shader/postprocessing/hdr_bloom.frag`

## Description

L'effet HDR Bloom fait briller les zones claires d'une image en faisant déborder la lumière sur les pixels environnants. Il extrait d'abord les pixels les plus lumineux (bright pass), les floute avec un flou gaussien séparable en deux passes, puis recompose le halo obtenu par-dessus la scène d'origine. Le rendu final passe par un tone mapping filmique ACES, qui comprime les hautes luminosités dans une plage affichable sans cramer brutalement les hautes lumières en blanc. Idéal pour les matériaux émissifs, les néons, les sources de lumière ou un rendu cinématographique doux.

## Paramètres

| Paramètre | Type | Plage | Défaut | Effet |
|-----------|------|-------|--------|-------|
| `threshold` | float | `0.0` à `1.0` | `0.7` | Seuil de luminosité au-dessus duquel les pixels brillent |
| `knee` | float | `0.0` à `threshold` | `0.2` | Douceur de la transition autour du seuil |
| `intensity` | float | `0.0` à `∞` | `1.0` | Force du halo ajouté |
| `blurSigma` | float | `1.0` à `30.0+` | `5.0` | Étalement (rayon) du halo |
| `blurSamples` | int | `5` à `128` | `15` | Nombre d'échantillons du flou pour la qualité/performance |
| `resolution` | Vec2 | taille écran | `1920x1080` | Doit correspondre à la taille de votre framebuffer |

### Valeurs des Paramètres

- **`threshold`**:
  - `0.3` - Beaucoup de zones brillent
  - `0.5` - Halo modéré
  - `0.7` - Seules les zones claires brillent (par défaut)
  - `0.9` - Seules les sources très vives brillent

- **`knee`**:
  - `0.0` - Coupure nette (halo on/off franc)
  - `0.2` - Transition douce (par défaut)
  - `0.4+` - Apparition très progressive du halo

- **`intensity`**:
  - `0.0` - Pas de halo (bloom désactivé)
  - `1.0` - Halo subtil (par défaut)
  - `1.5` à `3.0` - Halo fort
  - `> 4.0` - Les hautes lumières crament en blanc, gain marginal

- **`blurSigma`**:
  - `5.0` - Halo serré près des sources
  - `15.0` - Halo moyen et doux
  - `30.0+` - Grande aura diffuse

- **`blurSamples`**:
  - `15` - Rapide, qualité inférieure
  - `30` - Bon équilibre
  - `60` - Haute qualité
  - `90+` - Qualité maximale, plus lent
  - **Astuce:** gardez `samples ≈ 2-3 × sigma` pour éviter le banding

## Utilisation

### Utilisation Basique

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/HDRBloomEffect.hpp"

int main() {
  sf::RenderWindow window(sf::VideoMode(800, 600), "Démo HDR Bloom");
  window.setActive(true);

  IBackend *backend = BackendFactory::create();
  IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(800, 600);

  HDRBloomEffect bloom(backend);
  bloom.withThreshold(0.7f)
       .withKnee(0.2f)
       .withIntensity(1.5f)
       .withBlurSigma(15.0f)
       .withBlurSamples(30)
       .withResolution(Vec2(800.0f, 600.0f));

  while (window.isOpen()) {
    while (const std::optional event = window.pollEvent()) {
      if (event->is<sf::Event::Closed>()) window.close();
    }

    auto *rt = static_cast<sf::RenderTexture*>(sceneFramebuffer->getNativeRenderTarget());
    rt->clear(sf::Color::Black);
    // ... dessinez votre scène sur rt ...
    sceneFramebuffer->unbind();

    window.setActive(true);
    bloom.render(sceneFramebuffer->getTexture());
    window.display();
  }

  delete sceneFramebuffer;
  delete backend;
  return 0;
}
```
