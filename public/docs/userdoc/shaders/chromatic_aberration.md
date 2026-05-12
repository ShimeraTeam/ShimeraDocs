# Chromatic Aberration Effect

**Header:** `include/effects/ChromaticAberrationEffect.hpp`  
**Implementation:** `src/effects/ChromaticAberrationEffect.cpp`  
**Shader:** `res/shader/postprocessing/chromatic_aberration.frag`

## Description

The Chromatic Aberration effect simulates optical distortion by separating the red, green, and blue color channels. This creates colorful fringes at high-contrast edges, commonly seen in old lenses, sci-fi interfaces, or artistic effects. The effect supports both linear and radial (lens-based) distortion patterns.

## Parameters

| Parameter | Type | Range | Default | Effect |
|-----------|------|-------|---------|--------|
| `strength` | float | `0.0` to `1.0+` | `1.0` | Magnitude of color separation |
| `radius` | int | `0` or `1` | `0` | `0`=linear distortion, `1`=radial from center |
| `contrast` | float | `0.5` to `3.0+` | `2.0` | Blend contrast between channels |
| `samples` | int | `5` to `64` | `20` | Number of samples for quality/performance |

### Parameter Values

- **`strength`**:
  - `0.0` - No aberration
  - `0.3` - Subtle color fringing
  - `0.5` - Noticeable effect
  - `1.0` - Strong chromatic shift
  - `> 1.0` - Extreme separation

- **`radius`**:
  - `0` - Linear pattern (uniform across screen)
  - `1` - Radial pattern (from screen center, like lens distortion)

- **`contrast`**:
  - `1.0` - Subtle blending
  - `2.0` - Normal contrast (default)
  - `3.0+` - High-contrast sharp edges

- **`samples`**:
  - `5` - Very fast, lower quality
  - `10` - Good balance, medium quality
  - `20` - High quality (standard)
  - `30+` - Very high quality, slower
  - `64` - Maximum quality

## Usage

### Basic Usage

![Complete Example](../../res/shaders/chromaticAberration.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/ChromaticAberrationEffect.hpp"

int main() {
  sf::RenderWindow window(sf::VideoMode(800, 600), "Chromatic Aberration Demo");
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
    // ... draw your scene to rt ...
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
