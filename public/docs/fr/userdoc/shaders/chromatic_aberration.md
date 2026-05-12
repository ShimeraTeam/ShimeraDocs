# Effet d'Aberration Chromatique

**En-tête:** `include/effects/ChromaticAberrationEffect.hpp`  
**Implémentation:** `src/effects/ChromaticAberrationEffect.cpp`  
**Shader:** `res/shader/postprocessing/chromatic_aberration.frag`

## Description

L'effet d'aberration chromatique simule la distorsion optique en séparant les canaux de couleur rouge, vert et bleu. Cela crée des franges colorées aux bords à contraste élevé, couramment vues dans les anciens objectifs, les interfaces sci-fi, ou les effets artistiques. L'effet supporte les modèles de distorsion linéaire et radial (basé sur l'objectif).

## Paramètres

| Paramètre | Type | Plage | Défaut | Effet |
|-----------|------|-------|--------|-------|
| `strength` | float | `0.0` à `1.0+` | `1.0` | Magnitude de la séparation des couleurs |
| `radius` | int | `0` ou `1` | `0` | `0`=distorsion linéaire, `1`=radiale depuis le centre |
| `contrast` | float | `0.5` à `3.0+` | `2.0` | Contraste de fusion entre les canaux |
| `samples` | int | `5` à `64` | `20` | Nombre d'échantillons pour la qualité/performance |

### Valeurs des Paramètres

- **`strength`**:
  - `0.0` - Pas d'aberration
  - `0.3` - Frangement de couleur subtil
  - `0.5` - Effet notable
  - `1.0` - Décalage chromatique fort
  - `> 1.0` - Séparation extrême

- **`radius`**:
  - `0` - Motif linéaire (uniforme sur l'écran)
  - `1` - Motif radial (depuis le centre de l'écran, comme une distorsion d'objectif)

- **`contrast`**:
  - `1.0` - Fusion subtile
  - `2.0` - Contraste normal (par défaut)
  - `3.0+` - Bords nets à haut contraste

- **`samples`**:
  - `5` - Très rapide, qualité inférieure
  - `10` - Bon équilibre, qualité moyenne
  - `20` - Haute qualité (standard)
  - `30+` - Très haute qualité, plus lent
  - `64` - Qualité maximale

## Utilisation

### Utilisation Basique

![Complete Example](../../../res/shaders/chromaticAberration.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/ChromaticAberrationEffect.hpp"

int main() {
  sf::RenderWindow window(sf::VideoMode(800, 600), "Démo d'Aberration Chromatique");
  window.setActive(true);

  IBackend *backend = BackendFactory::create();
  IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(800, 600);

  ChromaticAberrationEffect chromatic(backend);
  chromatic.withStrength(0.5f)
       .withRadius(false)
       .withContrast(2.0f)
       .withSamples(20);

  float time = 0.0f;
  while (window.isOpen()) {
    while (const std::optional event = window.pollEvent()) {
      if (event->is<sf::Event::Closed>()) window.close();
    }

    auto *rt = static_cast<sf::RenderTexture*>(sceneFramebuffer->getNativeRenderTarget());
    rt->clear(sf::Color::Black);
    // ... dessinez votre scène sur rt ...
    sceneFramebuffer->unbind();

    window.setActive(true);
    chromatic.render(sceneFramebuffer->getTexture());
    window.display();

    time += 0.016f;
  }

  delete sceneFramebuffer;
  delete backend;
  return 0;
}
```
