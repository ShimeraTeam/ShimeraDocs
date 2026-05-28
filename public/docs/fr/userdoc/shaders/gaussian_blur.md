# Effet de Flou Gaussien

**En-tête:** `include/effects/GaussianBlurEffect.hpp`
**Implémentation:** `src/effects/GaussianBlurEffect.cpp`
**Shader:** `res/shader/postprocessing/gaussian_blur.frag`

## Description

L'effet de flou gaussien applique un flou doux et isotrope à l'image rendue en utilisant une véritable distribution gaussienne. Il est couramment utilisé pour la profondeur de champ, l'adoucissement de mouvement, les arrière-plans d'interface en verre dépoli, les pré-passes de bloom, ou le lissage général d'image.

## Paramètres

| Paramètre | Type | Plage | Défaut | Effet |
|-----------|------|-------|--------|-------|
| `sigma` | float | `0.5` à `30.0+` | `3.0` | Écart-type de la courbe gaussienne (intensité du flou) |
| `samples` | int | `3` à `60+` | `10` | Rayon du kernel en pixels (nombre de voisins par côté) |
| `resolution` | Vec2<float> | correspond à la cible | `(1920, 1080)` | Résolution de la cible de rendu en pixels |

### Valeurs des Paramètres

- **`sigma`**:
  - `1.0` – `2.0` - Adoucissement subtil (anti-aliasing, légère touche de flou)
  - `3.0` – `5.0` - Flou modéré (image toujours lisible)
  - `8.0` – `15.0` - Flou prononcé (formes reconnaissables, détails perdus)
  - `20.0+` - Flou très prononcé (uniquement des taches de couleur)

- **`samples`**:
  - Règle générale : `samples ≥ 3 × sigma`
  - En dessous de ce seuil, la courbe gaussienne est tronquée et le flou présente des artefacts visibles en forme de carrés sur les arêtes à fort contraste.
  - Au-dessus de `3 × sigma`, vous gaspillez du temps GPU à calculer des poids quasi nuls.

- **`resolution`**:
  - Doit correspondre aux dimensions du framebuffer sur lequel l'effet est rendu.
  - **Important :** modifier cette valeur via `withResolution()` redimensionne également le framebuffer intermédiaire interne. Pensez à l'appeler à chaque fois que la taille de la cible change.

### Combinaisons Recommandées

| Cas d'usage | Sigma | Samples |
|---|---|---|
| Adoucissement léger | 1.5 | 5 |
| Profondeur de champ subtile | 3.0 | 9 |
| Flou d'interface standard | 5.0 | 15 |
| Verre dépoli | 8.0 | 24 |
| Flou prononcé | 12.0 | 36 |
| Extrême | 20.0 | 60 |

## Utilisation

### Utilisation Basique

![Complete Example](../../../res/shaders/gaussian-blur.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/GaussianBlurEffect.hpp"

int main() {
  sf::RenderWindow window(sf::VideoMode({960, 540}), "Démo de Flou Gaussien");
  window.setActive(true);

  IBackend *backend = BackendFactory::create();
  IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(960, 540);

  GaussianBlurEffect blur(backend);
  blur.withSigma(5.0f)
      .withSamples(15)
      .withResolution(Vec2(960.0f, 540.0f));

  while (window.isOpen()) {
    while (const std::optional event = window.pollEvent()) {
      if (event->is<sf::Event::Closed>()) window.close();
    }

    auto *rt = static_cast<sf::RenderTexture*>(sceneFramebuffer->getNativeRenderTarget());
    rt->clear(sf::Color::Black);
    // ... dessinez votre scène sur rt ...
    sceneFramebuffer->unbind();

    window.setActive(true);
    blur.render(sceneFramebuffer->getTexture());

    window.display();
  }

  delete sceneFramebuffer;
  delete backend;
  return 0;
}
```
