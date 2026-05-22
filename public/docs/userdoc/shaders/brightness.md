# Brightness Effect

**Header:** `include/effects/BrightnessEffect.hpp`
**Implementation:** `src/effects/BrightnessEffect.cpp`
**Shader:** `res/shader/postprocessing/brightness.frag`

## Description

The Brightness effect adjusts the overall brightness of the rendered image by adding or subtracting a value to all RGB color components. This is a simple linear brightness adjustment that brightens or darkens the entire image uniformly.

## Parameters

| Parameter | Type | Range | Default | Effect |
|-----------|------|-------|---------|--------|
| `u_strength` | float | `-1.0` to `1.0` | `0.0` | Brightness adjustment amount |

### Parameter Values

- **`< 0.0`** - Darkens the image (e.g., `-0.2` = 20% darker)
- **`0.0`** - No change (original brightness)
- **`> 0.0`** - Brightens the image (e.g., `+0.2` = 20% brighter)

## Usage

![Complete Example](../../res/shaders/brightness.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/BrightnessEffect.hpp"

int main() {
    sf::RenderWindow window(sf::VideoMode(800, 600), "Brightness Demo");
    window.setActive(true);

    IBackend *backend = BackendFactory::create();
    IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(800, 600);

    BrightnessEffect brightness(backend);
    brightness.withStrength(0.2f);

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
        brightness.render(sceneFramebuffer->getTexture());
        window.display();

        time += 0.016f;
    }

    delete sceneFramebuffer;
    delete backend;
    return 0;
}
```
