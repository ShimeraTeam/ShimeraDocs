# Vignette Effect

**Header:** `include/effects/VignetteEffect.hpp`  
**Implementation:** `src/effects/VignetteEffect.cpp`  
**Shader:** `res/shader/postprocessing/vignette.frag`

## Description

The Vignette effect darkens the edges of the screen while keeping the center bright. This creates a natural focus point, enhances cinematic feel, or provides customizable edge effects. The vignette can be circular or rectangular and supports customizable color, strength, and shape parameters.

## Parameters

| Parameter | Type | Range | Default | Effect |
|-----------|------|-------|---------|--------|
| `u_strength` | float | `0.0` to `1.0+` | `1.0` | Overall darkness intensity |
| `u_radius` | float | `0.0` to `1.0` | `0.5` | Distance before gradient starts |
| `u_gap` | float | `0.0` to `1.0` | `0.3` | Width of the fade gradient |
| `u_color` | Vec4&lt;float&gt; | RGBA (0-1) | `(0,0,0,1)` | Vignette color (usually dark) |
| `u_isRounded` | int | `0` or `1` | `0` | `0`=rectangular, `1`=circular |
| `u_resolution` | Vec2&lt;float&gt;| pixels | `(1920, 1080)` | Screen resolution (for aspect ratio) |

### Parameter Values

- **`u_strength`**:
  - `0.0` - No vignette effect
  - `0.5` - Subtle darkening at edges
  - `1.0` - Normal vignette
  - `> 1.0` - Very dark edges

- **`u_radius`**:
  - `0.3` - Vignetted area starts close to center (tight vignette)
  - `0.5` - Standard vignette starting point
  - `0.7` - Vignetted area starts far from center (loose vignette)

- **`u_gap`**:
  - `0.1` - Sharp fade (thin transition)
  - `0.3` - Smooth fade (normal transition)
  - `0.6` - Very gradual fade (wide transition)

- **`u_color`**:
  - `(0, 0, 0, 1)` - Black vignette (standard)
  - `(1, 0, 0, 1)` - Red vignette (atmospheric)
  - `(0.1, 0.2, 0.5, 1)` - Blue vignette (cool tone)

- **`u_isRounded`**:
  - `0` - Rectangular/square vignette
  - `1` - Circular vignette (requires resolution for correct aspect ratio)

## Usage

### Basic Usage

![Complete Example](../../res/shaders/vignette.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/VignetteEffect.hpp"
#include "uniform/Vec4.hpp"
#include "uniform/Vec2.hpp"

int main() {
  sf::RenderWindow window(sf::VideoMode(960, 540), "Vignette Demo");
  window.setActive(true);

  IBackend *backend = BackendFactory::create();
  IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(960, 540);

  VignetteEffect vignette(backend);
    vignette.withStrength(0.8f)
      .withRadius(0.3f)
      .withGap(0.1f)
      .withColor(Vec4<float>(0.0f, 0.0f, 0.0f, 1.0f))
      .withIsRounded(false)
      .withResolution(Vec2<float>(960.0f, 540.0f));

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
    vignette.render(sceneFramebuffer->getTexture());
    window.display();

    time += 0.016f;
  }

  delete sceneFramebuffer;
  delete backend;
  return 0;
}
```
