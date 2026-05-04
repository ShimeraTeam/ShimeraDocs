# Grayscale Effect

**Header:** `include/effects/GrayscaleEffect.hpp`  
**Implementation:** `src/effects/GrayscaleEffect.cpp`  
**Shader:** `res/shader/postprocessing/saturation.frag` (with strength = 0.0)

## Description

The Grayscale effect converts the rendered image to black & white by completely removing color information while preserving luminance (brightness) differences. This creates a monochrome effect useful for artistic styles, old film looks, or gameplay mechanics.

## Parameters

| Parameter | Type | Note |
|-----------|------|------|
| None | - | Grayscale is a fixed effect with no parameters |

The grayscale effect internally uses the Saturation shader with `u_strength = 0.0`, which completely desaturates colors.

## Usage

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/GrayscaleEffect.hpp"

int main() {
    sf::RenderWindow window(sf::VideoMode(800, 600), "Grayscale Demo");
    window.setActive(true);

    IBackend *backend = BackendFactory::create();
    IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(800, 600);

    GrayscaleEffect grayscale(backend);

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
        grayscale.render(sceneFramebuffer->getTexture());
        window.display();

        time += 0.016f;
    }

    delete sceneFramebuffer;
    delete backend;
    return 0;
}
```

## Implementation Note

`GrayscaleEffect` is a convenience wrapper around `SaturationEffect`. It provides:
- Semantic clarity in code (intent is obvious)
- No parameters to manage
- Same performance
- Simpler API when you specifically need pure B&W

For transitions or partial desaturation, use [SaturationEffect](./saturation.md) with varying strength values instead.
