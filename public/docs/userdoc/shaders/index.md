# Shaders & Effects

Shimera provides a comprehensive post-processing shader system that works across multiple rendering backends (OpenGL, SFML, Raylib, SDL). This section documents all available shader effects and how to use them.

## Basic Usage Pattern

### 1. Create a Backend
```cpp
#include <shimera.h>
#include "backend/BackendFactory.hpp"

IBackend *backend = BackendFactory::create();
```

### 2. Create an Effect
```cpp
#include "effects/DistortionEffect.hpp"

DistortionEffect distortion(backend);
```

### 3. Configure the Effect (Optional)
```cpp
distortion.withNoiseScale(2.0f)
          .withDistortionStrength(0.1f)
          .withTimeScale(0.1f);
```

### 4. Render Your Scene to a Framebuffer
```cpp
IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(width, height);

sceneFramebuffer->bind();
// ... draw your scene ...
sceneFramebuffer->unbind();
```

### 5. Apply the Effect
```cpp
distortion.render(sceneFramebuffer->getTexture());
```

## Complete Example (SFML)

![Complete Example](../../res/shaders/distortion-chromaticAberration.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include <shimera.h>
#include "backend/BackendFactory.hpp"
#include "effects/DistortionEffect.hpp"
#include "effects/ChromaticAberrationEffect.hpp"

int main() {
    sf::RenderWindow window(sf::VideoMode({960, 540}), "Shimera Demo");
    window.setActive(true);

    IBackend *backend = BackendFactory::create();
    IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(960, 540);
    IFrameBuffer *tempFramebuffer = backend->createFrameBuffer(960, 540);

    DistortionEffect distortion(backend);
    distortion.withNoiseScale(2.0f)
              .withDistortionStrength(0.1f)
              .withTimeScale(0.1f);

    ChromaticAberrationEffect chromatic(backend);
    chromatic.withStrength(1.0f)
             .withRadius(true)
             .withContrast(1.0f)
             .withSamples(32);

    sf::CircleShape circle(80.f);
    circle.setFillColor(sf::Color::Magenta);
    circle.setPosition({130.f, 190.f});

    sf::RectangleShape rectangle({160.f, 160.f});
    rectangle.setFillColor(sf::Color::White);
    rectangle.setPosition({400.f, 190.f});

    sf::CircleShape triangle(105.f, 3);
    triangle.setFillColor(sf::Color::Yellow);
    triangle.setPosition({645.f, 190.f});

    float time = 0.0f;

    while (window.isOpen()) {
        while (const std::optional event = window.pollEvent()) {
            if (event->is<sf::Event::Closed>()) {
                window.close();
            }
        }

        if (!window.setActive(true)) {
            break;
        }

        auto *renderTexture = static_cast<sf::RenderTexture*>(sceneFramebuffer->getNativeRenderTarget());
        renderTexture->clear(sf::Color::Black);
        renderTexture->draw(circle);
        renderTexture->draw(rectangle);
        renderTexture->draw(triangle);
        sceneFramebuffer->unbind();

        distortion.time = time;

        tempFramebuffer->bind();
        distortion.render(sceneFramebuffer->getTexture());
        tempFramebuffer->unbind();

        window.setActive(true);
        chromatic.render(tempFramebuffer->getTexture());

        time += 0.016f;
        window.display();
    }

    delete tempFramebuffer;
    delete sceneFramebuffer;
    delete backend;
    return 0;
}
```

## Multi-Pass Rendering (Chaining Effects)

When applying multiple effects with SFML, use intermediate `IFrameBuffer` objects provided by the backend to chain passes without losing quality:

```cpp
IFrameBuffer *temp1 = backend->createFrameBuffer(width, height);
IFrameBuffer *temp2 = backend->createFrameBuffer(width, height);

// Pass 1: Scene -> Distortion -> temp1
temp1->bind();
distortion.render(sceneFramebuffer->getTexture());
temp1->unbind();

// Pass 2: temp1 -> Brightness -> temp2
temp2->bind();
brightness.render(temp1->getTexture());
temp2->unbind();

// Pass 3: temp2 -> Vignette -> Screen
// Ensure the SFML window context is active before rendering to screen
window.setActive(true);
vignette.render(temp2->getTexture());
```

## Available Effects

Shimera provides **8 post-processing effects**:

### Simple Effects (Single Parameter)
- [**Brightness**](./brightness.md) - Brighten or darken the entire image
- [**Contrast**](./contrast.md) - Adjust image contrast
- [**Saturation**](./saturation.md) - Control color saturation
- [**Grayscale**](./grayscale.md) - Convert to black & white
- [**Colorshift**](./colorshift.md) - Apply a color tint overlay

### Advanced Effects (Multiple Parameters)
- [**Vignette**](./vignette.md) - Darken image edges with customizable shape
- [**Distortion**](./distortion.md) - Warp image with Perlin noise animation
- [**Chromatic Aberration**](./chromatic_aberration.md) - RGB color channel separation effect

## Backend Compatibility

All effects work with:
- ✅ **OpenGL** (GLFW, SDL)
- ✅ **SFML** (sf::RenderWindow)
- ✅ **Raylib**
- ✅ **SDL2**

## Next Steps

- Explore individual effect documentation pages
- Check the `examples/` directory for complete, runnable code

