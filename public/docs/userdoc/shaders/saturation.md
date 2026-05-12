# Saturation Effect

**Header:** `include/effects/SaturationEffect.hpp`  
**Implementation:** `src/effects/SaturationEffect.cpp`  
**Shader:** `res/shader/postprocessing/saturation.frag`

## Description

The Saturation effect adjusts the color saturation of the rendered image by interpolating between a grayscale version and the original colors. This allows you to control how vibrant or muted colors appear, from complete black & white to oversaturated colors.

## Parameters

| Parameter | Type | Range | Default | Effect |
|-----------|------|-------|---------|--------|
| `u_strength` | float | `0.0` to `2.0+` | `1.0` | Saturation intensity |

### Parameter Values

- **`0.0`** - Completely desaturated (pure grayscale/black & white)
- **`1.0`** - No change (original colors)
- **`> 1.0`** - Oversaturated, colors more vivid (e.g., `1.5` = 50% more saturated)
- **`< 0.0`** to **`1.0`** - Partially desaturated

## Usage

![Complete Example](../../res/shaders/saturation.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/SaturationEffect.hpp"

int main() {
    sf::RenderWindow window(sf::VideoMode(800, 600), "Saturation Demo");
    window.setActive(true);

    IBackend *backend = BackendFactory::create();
    IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(800, 600);

    SaturationEffect saturation(backend);
    saturation.withStrength(1.5f);

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
        saturation.render(sceneFramebuffer->getTexture());
        window.display();

        time += 0.016f;
    }

    delete sceneFramebuffer;
    delete backend;
    return 0;
}
```
