# Effet Vignette

**En-tête:** `include/effects/VignetteEffect.hpp`  
**Implémentation:** `src/effects/VignetteEffect.cpp`  
**Shader:** `res/shader/postprocessing/vignette.frag`

## Description

L'effet vignette assombrit les bords de l'écran tout en gardant le centre lumineux. Cela crée un point focal naturel, améliore l'apparence cinématographique, ou fournit des effets de bord personnalisables. La vignette peut être circulaire ou rectangulaire et supporte des paramètres de couleur, de force et de forme personnalisables.

## Paramètres

| Paramètre | Type | Plage | Défaut | Effet |
|-----------|------|-------|--------|-------|
| `u_strength` | float | `0.0` à `1.0+` | `1.0` | Intensité globale d'obscurité |
| `u_radius` | float | `0.0` à `1.0` | `0.5` | Distance avant le début du dégradé |
| `u_gap` | float | `0.0` à `1.0` | `0.3` | Largeur du dégradé de transition |
| `u_color` | Vec4<float> | RGBA (0-1) | `(0,0,0,1)` | Couleur de la vignette (généralement sombre) |
| `u_isRounded` | int | `0` ou `1` | `0` | `0`=rectangulaire, `1`=circulaire |
| `u_resolution` | Vec2<float> | pixels | `(1920, 1080)` | Résolution de l'écran (pour le rapport d'aspect) |

### Valeurs des Paramètres

- **`u_strength`**:
  - `0.0` - Pas d'effet vignette
  - `0.5` - Assombrissement subtil aux bords
  - `1.0` - Vignette normale
  - `> 1.0` - Bords très sombres

- **`u_radius`**:
  - `0.3` - La zone vignetée commence près du centre (vignette serré)
  - `0.5` - Point de départ standard de la vignette
  - `0.7` - La zone vignetée commence loin du centre (vignette lâche)

- **`u_gap`**:
  - `0.1` - Transition nette (transition fine)
  - `0.3` - Transition lisse (transition normale)
  - `0.6` - Transition très progressive (transition large)

- **`u_color`**:
  - `(0, 0, 0, 1)` - Vignette noire (standard)
  - `(1, 0, 0, 1)` - Vignette rouge (atmosphérique)
  - `(0.1, 0.2, 0.5, 1)` - Vignette bleue (ton frais)

- **`u_isRounded`**:
  - `0` - Vignette rectangulaire/carrée
  - `1` - Vignette circulaire (nécessite une résolution correcte pour le bon rapport d'aspect)

## Utilisation

### Utilisation Basique

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/VignetteEffect.hpp"
#include "uniform/Vec4.hpp"
#include "uniform/Vec2.hpp"

int main() {
  sf::RenderWindow window(sf::VideoMode(1280, 720), "Démo de Vignette");
  window.setActive(true);

  IBackend *backend = BackendFactory::create();
  IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(1280, 720);

  VignetteEffect vignette(backend);
  vignette.withStrength(0.8f)
      .withRadius(0.5f)
      .withGap(0.3f)
      .withColor(Vec4<float>(0.0f, 0.0f, 0.0f, 1.0f))
      .withIsRounded(false)
      .withResolution(Vec2<float>(1280.0f, 720.0f));

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
    vignette.render(sceneFramebuffer->getTexture());
    window.display();

    time += 0.016f;
  }

  delete sceneFramebuffer;
  delete backend;
  return 0;
}
```

### Exemples Pratiques

```cpp
// Vignette cinématographique (standard)
VignetteEffect cinematic(backend);
cinematic.withStrength(0.6f)
         .withRadius(0.45f)
         .withGap(0.25f);

// Effet de projecteur serré (dramatique)
VignetteEffect spotlight(backend);
spotlight.withStrength(1.0f)
         .withRadius(0.3f)
         .withGap(0.2f)
         .withIsRounded(true)
         .withResolution(Vec2<float>(1920.0f, 1080.0f));

// Assombrissement subtil (discret)
VignetteEffect subtle(backend);
subtle.withStrength(0.3f)
      .withRadius(0.6f)
      .withGap(0.4f);

// Vignette colorée (atmosphérique)
VignetteEffect nightVignette(backend);
nightVignette.withColor(Vec4<float>(0.1f, 0.1f, 0.3f, 1.0f))  // Bleu foncé
            .withStrength(0.7f);

// Effet d'alerte/danger (vignette rouge)
VignetteEffect danger(backend);
danger.withColor(Vec4<float>(0.5f, 0.0f, 0.0f, 1.0f))  // Rouge foncé
      .withStrength(0.8f)
      .withRadius(0.4f);
```
