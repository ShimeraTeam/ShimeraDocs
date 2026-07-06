# Pixelisation Effect

**Header:** `include/effects/PixelisationEffect.hpp`  
**Implementation:** `src/effects/PixelisationEffect.cpp`  
**Shader:** `res/shader/postprocessing/pixelisation.frag`

## Description

The Pixelisation effect applies a retro pixel-art look to the rendered image by snapping UV coordinates to a grid of configurable size. Each "pixel block" samples the color at the center of its cell, creating a chunky, low-resolution appearance. The pixel grid can be sized independently on the X and Y axes, and an optional offset allows the grid to be shifted across the screen.

## Parameters

| Parameter | Type | Range | Default | Effect |
|-----------|------|-------|---------|--------|
| `u_pixelSizeX` | float | `1.0` to screen width | `4.0` | Width of each pixel block in screen pixels |
| `u_pixelSizeY` | float | `1.0` to screen height | `4.0` | Height of each pixel block in screen pixels |
| `u_resolution` | Vec2&lt;float&gt; | pixels | `(1920, 1080)` | Screen resolution used to compute UV step size |
| `u_offset` | Vec2&lt;float&gt; | UV space (0–1) | `(0, 0)` | Grid origin offset in UV coordinates |

### Parameter Values

- **`u_pixelSizeX` / `u_pixelSizeY`**:
  - `1.0` - No pixelisation (original resolution)
  - `4.0` - Subtle pixel art look (default)
  - `8.0` - Clear blocky appearance
  - `16.0` - Strong retro effect
  - `32.0+` - Extreme, very coarse pixelisation

- **`u_resolution`**:
  - Must match the actual render target resolution so that UV step sizes are computed correctly
  - `(960, 540)` - Low-resolution window
  - `(1920, 1080)` - Full HD (default)
  - `(2560, 1440)` - 1440p display

- **`u_offset`**:
  - `(0, 0)` - Grid origin at the top-left corner (default)
  - Any non-zero value shifts the pixel grid across the screen, which can be used to animate or jitter the grid

## Usage

### Basic Usage

![Complete Example](../../res/shaders/pixelisation.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/PixelisationEffect.hpp"
#include "uniform/Vec2.hpp"

int main() {
  sf::RenderWindow window(sf::VideoMode(960, 540), "Pixelisation Demo");
  window.setActive(true);

  IBackend *backend = BackendFactory::create();
  IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(960, 540);

  PixelisationEffect pixelisation(backend);
  pixelisation.withPixelSize(8.0f)
              .withResolution(Vec2<float>(960.0f, 540.0f));

  while (window.isOpen()) {
    while (const std::optional event = window.pollEvent()) {
      if (event->is<sf::Event::Closed>()) window.close();
    }

    auto *rt = static_cast<sf::RenderTexture*>(sceneFramebuffer->getNativeRenderTarget());
    rt->clear(sf::Color::Black);
    // ... draw your scene to rt ...
    sceneFramebuffer->unbind();

    window.setActive(true);
    pixelisation.render(sceneFramebuffer->getTexture());
    window.display();
  }

  delete sceneFramebuffer;
  delete backend;
  return 0;
}
```

### Non-square pixel blocks

`withPixelSizeX` and `withPixelSizeY` let you set the block dimensions independently for a stretched or squished pixel-art look:

```cpp
PixelisationEffect pixelisation(backend);
pixelisation.withPixelSizeX(16.0f)   // wide blocks
            .withPixelSizeY(4.0f)    // short blocks
            .withResolution(Vec2<float>(1920.0f, 1080.0f));
```
