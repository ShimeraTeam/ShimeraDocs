# Colorshift Effect

**Header:** `include/effects/ColorshiftEffect.hpp`  
**Implementation:** `src/effects/ColorshiftEffect.cpp`  
**Shader:** `res/shader/postprocessing/colorshift.frag`

## Description

The Colorshift effect applies a color tint or filter overlay to the rendered image by blending the original colors with a uniform RGB color. This creates colored overlays useful for atmospheric effects, emotional tone changes, or environmental filtering.

## Parameters

| Parameter | Type | Range | Default | Effect |
|-----------|------|-------|---------|--------|
| `u_tint` | Vec3<float> | `(0,0,0)` to `(1,1,1)` | `(0,0,0)` | RGB tint color to blend with original |  

### Color Values

Each RGB component ranges from `0.0` to `1.0`:

- **`(0.0, 0.0, 0.0)`** - No tint (original colors)
- **`(1.0, 0.0, 0.0)`** - Red tint
- **`(0.0, 1.0, 0.0)`** - Green tint
- **`(0.0, 0.0, 1.0)`** - Blue tint
- **`(1.0, 1.0, 0.0)`** - Yellow tint
- **`(1.0, 0.0, 1.0)`** - Magenta tint
- **`(0.0, 1.0, 1.0)`** - Cyan tint
- **`(0.5, 0.5, 0.5)`** - Neutral gray (desaturates slightly)

## Usage

![Complete Example](../../res/shaders/colorShift.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/ColorshiftEffect.hpp"
#include "uniform/Vec3.hpp"

int main() {
    sf::RenderWindow window(sf::VideoMode(800, 600), "Colorshift Demo");
    window.setActive(true);

    IBackend *backend = BackendFactory::create();
    IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(800, 600);

    ColorshiftEffect colorshift(backend);
    colorshift.withTint(Vec3<float>(1.0f, 0.0f, 0.0f));

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
        colorshift.render(sceneFramebuffer->getTexture());
        window.display();

        time += 0.016f;
    }

    delete sceneFramebuffer;
    delete backend;
    return 0;
}
```
