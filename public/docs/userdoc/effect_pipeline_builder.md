# Effect Pipeline Builder

**Header:** `include/EffectPipeline.inl`

## Description

`EffectPipeline` lets you chain multiple post-processing effects together without manually managing intermediate framebuffers. You add effects in order, call `render()`, and the pipeline handles the ping-pong framebuffer routing internally. Each effect reads from the previous one's output and writes to the next one's input, with only two framebuffers allocated regardless of how many effects are in the chain.

Without `EffectPipeline`, chaining N effects requires N−1 manually managed intermediate framebuffers and careful bind/unbind sequencing.

## API Reference

### Constructor

```cpp
EffectPipeline(IBackend* backend, unsigned int width, unsigned int height);
```

| Parameter | Description |
|-----------|-------------|
| `backend` | Non-owning pointer to the active backend (same one used to create your effects) |
| `width` | Output resolution width in pixels |
| `height` | Output resolution height in pixels |

---

### `addEffect`: construct in place

```cpp
template<typename TEffect, typename... Args>
EffectPipeline& addEffect(Args&&... args);
```

Constructs the effect directly inside the pipeline. The backend is injected automatically as the first constructor argument, so you only pass the effect-specific parameters.

Returns `*this` to allow chaining.

```cpp
pipeline.addEffect<DistortionEffect>()
        .addEffect<GaussianBlurEffect>()
        .addEffect<VignetteEffect>(1.0f, 0.4f, 0.3f); // Can also define the shader's parameters like that
```

---

### `addEffect`: move a pre-configured effect

```cpp
template<typename TEffect>
EffectPipeline& addEffect(TEffect&& effect);
```

Moves an already-constructed and configured effect into the pipeline. Use this when you need to configure an effect with the fluent API before handing it off.

Returns `*this` to allow chaining.

```cpp
DistortionEffect distortion(backend);
distortion.withNoiseScale(2.0f).withDistortionStrength(0.1f);

pipeline.addEffect(std::move(distortion));  // distortion is now owned by the pipeline
```

::: warning
After `std::move`, the original variable is empty (distortion = nullptr). Access the effect through `pipeline.get<DistortionEffect>()` instead.
:::

---

### `get`: retrieve an effect for per-frame updates

```cpp
template<typename TEffect>
TEffect& get(std::size_t index = 0);
```

Returns a reference to the Nth effect of type `TEffect` in the pipeline (0-indexed per type). Use this to update parameters each frame (e.g. incrementing a time uniform).

Throws `std::out_of_range` if no effect of that type exists at the given index.

```cpp
pipeline.get<DistortionEffect>().m_uTime = time; // index 0 by default
pipeline.get<GaussianBlurEffect>(0).m_uSigma = 4.0f; // first blur
pipeline.get<GaussianBlurEffect>(1).m_uSigma = 8.0f; // second blur
pipeline.get<DistortionEffect>().withTime(time); // ! This also works, but should not be used when frequently updating an uniform !

```

---

### `build`

```cpp
void build();
```

Allocates the two internal ping-pong framebuffers at the configured resolution. Calling this is **optional**, `render()` calls it automatically on the first frame. Use it explicitly if you want to pre-allocate GPU resources at startup rather than on first render.

---

### `render`: output to screen

```cpp
void render(ITexture& input);
```

Runs all enabled effects in order, routing output through internal ping-pong framebuffers, and presents the final result to the currently active screen target.

---

### `render`: output to framebuffer

```cpp
void render(ITexture& input, IFrameBuffer& target);
```

Same as above but writes the final pass into `target` instead of the screen. Use this to feed the pipeline's output into another pipeline or a post-composition step.

---

### `resize`

```cpp
void resize(int width, int height);
```

Updates the internal framebuffer resolution. Call this when your window or render target is resized.

---

### `size`

```cpp
std::size_t size() const;
```

Returns the total number of effects in the pipeline (including disabled ones).

---

## Usage

### Basic construct effects inside the pipeline

```cpp
#include "EffectPipeline.inl"
#include "effects/DistortionEffect.hpp"
#include "effects/GaussianBlurEffect.hpp"

IBackend *backend = BackendFactory::create();
IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(960, 540);

EffectPipeline pipeline(backend, 960, 540);
pipeline.addEffect<DistortionEffect>()
        .addEffect<GaussianBlurEffect>()
        .build();  // optional, allocates FBOs now instead of on first render

float time = 0.0f;
while (window.isOpen()) {
    // ... render scene into sceneFramebuffer ...

    pipeline.get<DistortionEffect>().m_uTime = time;
    pipeline.render(sceneFramebuffer->getTexture());

    time += 0.016f;
    window.display();
}
```

---

### Pre-configure effects before adding them

Useful when you want to set initial parameters with the fluent API:

```cpp
GaussianBlurEffect blur(backend);
blur.withSigma(5.0f)
    .withSamples(15)
    .withResolution(Vec2(960.0f, 540.0f));

DistortionEffect distortion(backend);
distortion.withNoiseScale(2.0f)
          .withDistortionStrength(0.1f);

EffectPipeline pipeline(backend, 960, 540);
pipeline.addEffect(std::move(distortion))
        .addEffect(std::move(blur));
```
::: tip
**Order matters:** effects are applied in the order they were added in the effect pipeline, first added is first applied.
:::

---

### Complete Example (SFML)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include <GL/glew.h>
#include <SFML/OpenGL.hpp>
#include "backend/BackendFactory.hpp"
#include "backend/sfml/SFMLFramebuffer.hpp"
#include "effects/DistortionEffect.hpp"
#include "effects/GaussianBlurEffect.hpp"
#include "EffectPipeline.inl"

using namespace shimera;

int main() {
    const sf::VideoMode videoMode({960, 540});
    sf::RenderWindow window(videoMode, "Effect Pipeline Demo");
    window.setActive(true);

    if (glewInit() != GLEW_OK) return -1;

    IBackend *backend = BackendFactory::create();
    IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(960, 540);

    EffectPipeline effects(backend, 960, 540);
    effects.addEffect<DistortionEffect>()
            .addEffect<GaussianBlurEffect>()
            .build();

    effects.get<GaussianBlurEffect>()
            .withSigma(5.0f)
            .withSamples(15)
            .withResolution(Vec2(960.0f, 540.0f));

    sf::Texture texture;
    texture.loadFromFile("path/to/image.jpg");
    sf::Sprite sprite(texture);

    sf::Clock clock;
    clock.start();
    while (window.isOpen()) {
        while (const std::optional event = window.pollEvent()) {
            if (event->is<sf::Event::Closed>()) window.close();
        }

        if (!window.isOpen()) break;
        if (!window.setActive(true)) break;

        // Render scene into framebuffer
        auto *rt = static_cast<sf::RenderTexture*>(sceneFramebuffer->getNativeRenderTarget());
        rt->clear(sf::Color::Black);
        rt->draw(sprite);
        sceneFramebuffer->unbind();

        // Apply pipeline: distortion -> gaussian blur -> screen
        effects.get<DistortionEffect>().m_uTime = clock.getElapsedTime().asSeconds();
        glClear(GL_COLOR_BUFFER_BIT);
        effects.render(sceneFramebuffer->getTexture());

        window.display();
    }
    clock.stop();

    delete sceneFramebuffer;
    delete backend;
    return 0;
}
```

---

## How It Works Internally

The pipeline keeps exactly **two framebuffers** and alternates them each pass:

```
Scene texture  ──►  Effect 0  ──►  fboA
                    Effect 1  ──►  fboB  (reads fboA)
                    Effect 2  ──►  fboA  (reads fboB)
                    Effect N  ──►  Screen (reads last written fbo)
```

Disabled effects (via `setEnabled(false)`) are skipped entirely at render time, so they don't consume a framebuffer slot or GPU time.

---

## Comparison with Manual Chaining

Without `EffectPipeline`:

```cpp
// Manual ping-pong, you manage every framebuffer
IFrameBuffer *temp1 = backend->createFrameBuffer(960, 540);
IFrameBuffer *temp2 = backend->createFrameBuffer(960, 540);

temp1->bind();
distortion.render(scene->getTexture());
temp1->unbind();

temp2->bind();
blur.render(temp1->getTexture());
temp2->unbind();

window.setActive(true);
vignette.render(temp2->getTexture());

delete temp1;
delete temp2;
```

With `EffectPipeline`:

```cpp
pipeline.render(scene->getTexture());
```

## References

- `T&&`: [Forwarding References](https://en.cppreference.com/cpp/language/reference#Forwarding_references) ([*Easier to understand*](https://lemire.me/blog/2024/05/13/forwarding-references-in-c/))
