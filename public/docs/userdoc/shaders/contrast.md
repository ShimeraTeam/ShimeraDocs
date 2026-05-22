# Contrast Effect

**Header:** `include/effects/ContrastEffect.hpp`  
**Implementation:** `src/effects/ContrastEffect.cpp`  
**Shader:** `res/shader/postprocessing/contrast.frag`

## Description

The Contrast effect adjusts the contrast of the rendered image using a multiplicative approach. It stretches or compresses the distance between light and dark values around a midpoint (0.5). This creates a nonlinear brightness adjustment that preserves the gray midtone while intensifying highlights and shadows.

## Parameters

| Parameter | Type | Range | Default | Effect |
|-----------|------|-------|---------|--------|
| `u_contrastFactor` | float | `0.0` to `2.0+` | `1.0` | Contrast intensity multiplier |

### Parameter Values

- **`< 1.0`** - Decreases contrast, image becomes flatter/grayer (e.g., `0.5` = 50% less contrast)
- **`1.0`** - No change (normal contrast)
- **`> 1.0`** - Increases contrast, colors more vivid (e.g., `1.5` = 50% more contrast)

## Usage

![Complete Example](../../res/shaders/contrast.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/ContrastEffect.hpp"

int main() {
    sf::RenderWindow window(sf::VideoMode(800, 600), "Contrast Demo");
    window.setActive(true);

    IBackend *backend = BackendFactory::create();
    IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(800, 600);

    ContrastEffect contrast(backend);
    contrast.withContrastFactor(1.5f);

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
        contrast.render(sceneFramebuffer->getTexture());
        window.display();

        time += 0.016f;
    }

    delete sceneFramebuffer;
    delete backend;
    return 0;
}
```
