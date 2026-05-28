# Gaussian Blur Effect

**Header:** `include/effects/GaussianBlurEffect.hpp`
**Implementation:** `src/effects/GaussianBlurEffect.cpp`
**Shader:** `res/shader/postprocessing/gaussian_blur.frag`

## Description

The Gaussian Blur effect applies a smooth, isotropic blur to the rendered image using a true Gaussian distribution. It is commonly used for depth-of-field, motion softening, frosted glass UI backgrounds, bloom pre-passes, or general image smoothing.

## Parameters

| Parameter | Type | Range | Default | Effect |
|-----------|------|-------|---------|--------|
| `sigma` | float | `0.5` to `30.0+` | `3.0` | Standard deviation of the Gaussian curve (blur intensity) |
| `samples` | int | `3` to `60+` | `10` | Kernel radius in pixels (number of neighbors per side) |
| `resolution` | Vec2<float> | matches target | `(1920, 1080)` | Resolution of the render target in pixels |

### Parameter Values

- **`sigma`**:
  - `1.0` – `2.0` - Subtle softening (anti-aliasing, hint of blur)
  - `3.0` – `5.0` - Moderate blur (image still readable)
  - `8.0` – `15.0` - Strong blur (shapes recognizable, details lost)
  - `20.0+` - Very strong blur (color blobs only)

- **`samples`**:
  - Rule of thumb: `samples ≥ 3 × sigma`
  - Below this threshold the Gaussian curve is truncated and the blur shows visible square-shaped artifacts at high-contrast edges.
  - Above `3 × sigma` you only waste GPU cycles computing near-zero weights.

- **`resolution`**:
  - Must match the dimensions of the framebuffer the effect renders to.
  - **Important:** changing this value via `withResolution()` also resizes the internal intermediate framebuffer. Make sure to call it whenever the target size changes.

### Recommended Combinations

| Use case | Sigma | Samples |
|---|---|---|
| Light softening | 1.5 | 5 |
| Subtle depth of field | 3.0 | 9 |
| Standard UI blur | 5.0 | 15 |
| Frosted glass | 8.0 | 24 |
| Heavy blur | 12.0 | 36 |
| Extreme | 20.0 | 60 |

## Usage

### Basic Usage

![Complete Example](../../res/shaders/gaussian-blur.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/GaussianBlurEffect.hpp"

int main() {
  sf::RenderWindow window(sf::VideoMode({960, 540}), "Gaussian Blur Demo");
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
    // ... draw your scene to rt ...
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
