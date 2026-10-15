# Effect Pipeline Builder

**Header:** `EffectPipeline.hpp` (included by `shimera.hpp`)  
**Implementation:** `src/EffectPipeline.cpp`

## Description

`EffectPipeline` is the way to apply post-processing effects with Shimera. You add effects in order, call `render()` once per frame, and the pipeline takes care of everything else:

- it routes each effect's output into the next one through two internal ping-pong framebuffers, whatever the number of effects in the chain;
- it pushes the output resolution down to every effect (on `add()` and on every `resize()`), so most effects never need to be told the screen size;
- it saves the host's OpenGL state before rendering and restores it afterwards (see [GL state protection](#gl-state-protection)), so SFML, raylib or SDL keep drawing correctly after Shimera ran.

Even for a single effect, going through a pipeline is the recommended path.

## Prerequisites

A pipeline issues OpenGL calls, so two things must exist before you create one:

1. **A `shimera::Context`**, created once, after your window and its OpenGL context exist. It loads the OpenGL functions and throws a `shimera::InitError` naming the missing call if no context is current.
2. **A host target** (`SfmlTarget`, `RaylibTarget`, `GlfwTarget` or `SdlTarget`), the offscreen surface your scene is drawn into. See [Host targets](./index.md#host-targets).

```cpp
#include <shimera.hpp>
#include <hosts/RaylibTarget.hpp>

InitWindow(960, 540, "My game");                       // 1. the window and its GL context

shimera::Context context = shimera::Context::create(); // 2. Shimera's GL setup
shimera::RaylibTarget scene(960, 540);                 // 3. where the scene is drawn
shimera::EffectPipeline fx(960, 540);                  // 4. the effects
```

::: tip Use `std::optional` members in classes
`Context`, the host targets and `EffectPipeline` cannot be created before the window. When they are class members, store them in `std::optional` and `emplace()` them once the window exists, as all the official examples do.
:::

## API Reference

### Constructor

```cpp
EffectPipeline(int width, int height);
```

| Parameter | Description |
|-----------|-------------|
| `width` | Output width in pixels |
| `height` | Output height in pixels |

The size must match the framebuffer the pipeline renders into (usually the window). It is used for the viewport, for the internal framebuffers and as the resolution given to each effect. On high-DPI screens, use the framebuffer size in pixels (for example `glfwGetFramebufferSize`), not the window size in screen coordinates.

`EffectPipeline` is move-only: it can be moved (into a `std::optional`, a container, ...) but not copied.

---

### `add`

```cpp
template<typename TEffect, typename... Args>
EffectPipeline& add(Args&&... args);
```

Constructs a `TEffect` inside the pipeline, forwarding `args` to its constructor, then gives it the pipeline's current size. `TEffect` must derive from `shimera::Effect`, which is checked at compile time.

Returns `*this`, so calls can be chained.

```cpp
fx.add<shimera::Distortion>()                       // default parameters
  .add<shimera::Vignette>(1.0f, 0.45f, 0.35f)       // constructor parameters
  .add<shimera::Bloom>(0.7f, 0.2f, 1.0f, 10.0f, 30);
```

Each effect page lists its constructor parameters and their default values.

::: tip Order matters
Effects are applied in the order they were added: the first added is the first applied.
:::

---

### `get`

```cpp
template<typename TEffect>
TEffect& get(std::size_t index = 0);
```

Returns a reference to the `index`-th effect of type `TEffect` in the pipeline. The index counts effects **of that type only**, starting at 0, so it is only needed when the same effect is added more than once.

Throws `std::out_of_range` if there is no such effect.

Use it to configure an effect after adding it, or to update it every frame:

```cpp
// Configure once, after adding
fx.get<shimera::GaussianBlur>()
  .withSigma(5.0f)
  .withSamples(15);

// Update every frame
fx.get<shimera::Distortion>().withTime(elapsedSeconds);

// Two effects of the same type
fx.get<shimera::GaussianBlur>(0).withSigma(4.0f); // first blur
fx.get<shimera::GaussianBlur>(1).withSigma(8.0f); // second blur
```

::: tip
`get()` walks the effect list on each call. If you update an effect every frame, keep the reference once and reuse it:

```cpp
auto& distortion = fx.get<shimera::Distortion>();
// in the loop:
distortion.withTime(time);
```

The reference stays valid for the lifetime of the pipeline, adding more effects does not invalidate it.
:::

---

### `render` from a host target (recommended)

```cpp
void render(IHostTarget& scene);
void render(IHostTarget& scene, GLFramebuffer& target);
```

Runs every enabled effect on the scene held by `scene`, which must have been closed with `scene.end()`. The scene's depth texture is forwarded automatically when the host provides one.

- The first overload writes the result into **the framebuffer that is bound when `render()` is called**. After `scene.end()`, that is the window for every host, so this is the call you write in your main loop.
- The second overload writes the result into `target` instead, to feed another pipeline or a later composition step.

```cpp
scene.begin();
    // ... draw your scene with your host library ...
scene.end();

fx.render(scene); // to the window
```

---

### `render` from a texture

```cpp
void render(const GLTexture& input, const GLTexture* depth = nullptr);
void render(const GLTexture& input, GLFramebuffer& target, const GLTexture* depth = nullptr);
```

Same as above, from any `GLTexture` instead of a host target. Use it when the image to process does not come from a host target, for example the output of another pipeline rendered into a `GLFramebuffer`.

| Parameter | Description |
|-----------|-------------|
| `input` | Texture to process |
| `target` | Framebuffer to write into (second overload only) |
| `depth` | Optional depth texture, only read by effects that need the scene's depth |

```cpp
shimera::GLFramebuffer intermediate(960, 540);

first.render(scene, intermediate);        // pipeline 1 -> intermediate framebuffer
second.render(intermediate.color());      // pipeline 2 -> window
```

#### Scene depth

Effects can declare that they need the scene's depth (`Effect::needsDepth()`). For those, the pipeline hands over the depth texture given to `render()`, or the host target's own depth texture. If such an effect is enabled and no depth was ever provided, `render()` throws `std::runtime_error`.

None of the built-in effects needs depth at the moment. To get a depth texture from a host target, create it with `samplableDepth = true` (`RaylibTarget` and `GlfwTarget` only).

---

### `resize`

```cpp
void resize(int width, int height);
```

Resizes the internal framebuffers and passes the new size to every effect. Call it whenever the window is resized, together with your host target's `resize()`:

```cpp
scene.resize(width, height);
fx.resize(width, height);
```

---

### Queries

```cpp
std::size_t size() const;        // number of effects, disabled ones included
std::string effectNames() const; // "Vignette, Distortion, Bloom", or "no_effects"
int getWidth() const;
int getHeight() const;
```

`effectNames()` is handy for logging or for a debug overlay.

---

### Enabling and disabling effects

Every effect has `setEnabled(bool)` and `isEnabled()`. Disabled effects stay in the pipeline (they keep their parameters and are still returned by `get()`) but are skipped at render time, so they cost neither a pass nor GPU time.

```cpp
auto& bloom = fx.get<shimera::Bloom>();
bloom.setEnabled(!bloom.isEnabled()); // toggle on a key press
```

::: warning All effects disabled
When no effect is enabled, `render()` returns without drawing anything: the scene is **not** copied to the output. If you allow the user to turn every effect off, draw the scene yourself in that case.
:::

## Usage

### Minimal example (raylib)

```cpp
#include <raylib.h>
#include <shimera.hpp>
#include <hosts/RaylibTarget.hpp>

int main() {
    constexpr int width = 960;
    constexpr int height = 540;

    InitWindow(width, height, "Shimera - raylib");
    SetTargetFPS(60);
    {
        auto context = shimera::Context::create();
        shimera::RaylibTarget scene(width, height);

        shimera::EffectPipeline fx(width, height);
        fx.add<shimera::Distortion>()
          .add<shimera::Bloom>();

        auto& distortion = fx.get<shimera::Distortion>();

        while (!WindowShouldClose()) {
            scene.begin();
                ClearBackground(Color{18, 20, 28, 255});
                DrawCircle(480, 270, 120.0f, Color{41, 181, 242, 255});
            scene.end();

            distortion.withTime(static_cast<float>(GetTime()));

            BeginDrawing();
                ClearBackground(BLACK);
                fx.render(scene);
            EndDrawing();
        }
    } // Shimera objects are destroyed here, while the GL context still exists
    CloseWindow();
    return 0;
}
```

::: warning Destruction order
Pipelines, effects and host targets own OpenGL resources. Destroy them **before** the window (`CloseWindow()`, `glfwDestroyWindow()`, `SDL_DestroyWindow()`, ...), which is why the example above uses an inner scope.
:::

---

### Complete example (SFML)

```cpp
#include <SFML/Graphics.hpp>
#include <shimera.hpp>
#include <hosts/SfmlTarget.hpp>

#include <iostream>
#include <optional>

int main() {
    sf::RenderWindow window(sf::VideoMode({960, 540}), "Shimera - SFML");
    window.setVerticalSyncEnabled(true);

    try {
        auto context = shimera::Context::create();
        std::cout << shimera::Context::getRendererInfo() << '\n';

        shimera::SfmlTarget scene(window, 960, 540);

        shimera::EffectPipeline fx(960, 540);
        fx.add<shimera::Vignette>(1.0f, 0.45f, 0.35f)
          .add<shimera::Distortion>()
          .add<shimera::Bloom>(0.7f, 0.2f, 1.0f, 10.0f, 30);

        auto& distortion = fx.get<shimera::Distortion>();

        sf::CircleShape circle(115.0f);
        circle.setPosition({555.0f, 160.0f});
        circle.setFillColor(sf::Color::Yellow);

        sf::Clock clock;
        while (window.isOpen()) {
            while (const std::optional event = window.pollEvent()) {
                if (event->is<sf::Event::Closed>()) {
                    window.close();
                } else if (const auto* resized = event->getIf<sf::Event::Resized>()) {
                    const auto w = static_cast<int>(resized->size.x);
                    const auto h = static_cast<int>(resized->size.y);
                    window.setView(sf::View(sf::FloatRect({0.0f, 0.0f}, sf::Vector2f(resized->size))));
                    scene.resize(w, h);
                    fx.resize(w, h);
                }
            }

            // 1. Draw the scene into the target
            auto& texture = *scene.native<sf::RenderTexture>();
            scene.begin();
                texture.clear(sf::Color::Black);
                texture.draw(circle);
            scene.end();

            // 2. Update the effects
            distortion.withTime(clock.getElapsedTime().asSeconds());

            // 3. Apply the pipeline to the window
            window.clear(sf::Color::Black);
            fx.render(scene);
            window.display();
        }
    } catch (const std::exception& error) {
        std::cerr << error.what() << '\n';
        return 1;
    }
    return 0;
}
```

## How It Works Internally

The framebuffers are created on the first `render()`. The pipeline then keeps exactly **two** of them and alternates between them, the last effect writing straight into the output:

```
Scene texture  ──►  Effect 0  ──►  fboA
                    Effect 1  ──►  fboB    (reads fboA)
                    Effect 2  ──►  fboA    (reads fboB)
                    ...
                    Effect N  ──►  output  (reads the last written fbo)
```

With a single enabled effect, no intermediate framebuffer is used: the effect reads the scene and writes into the output directly.

Some effects (Gaussian Blur, Bloom) need two passes on their own. They keep their own intermediate framebuffer, sized by the pipeline, so they still take a single slot in the chain.

### GL state protection

OpenGL is one global state machine shared by Shimera and your host library, and host libraries cache what they believe is bound. To avoid breaking the host's next draw, `render()` wraps the whole chain in a `GLStateGuard` that captures the state it is about to change (bound program, VAO, buffers, framebuffer, textures of units 0 to 7, blending, depth and cull settings, viewport, clear color) and restores it once the chain is done, even if an effect throws.

If you render at a point where you know the state does not matter and want to skip those queries, the guard can be turned off globally:

```cpp
shimera::GLStateGuard::setEnabled(false);
```

## Comparison with Manual Chaining

Effects can be rendered by hand with `Effect::render(input)` and `Effect::render(input, target)`, but you then have to do the pipeline's work yourself:

```cpp
shimera::Distortion distortion;
shimera::GaussianBlur blur;
shimera::Vignette vignette;

// Effects learn the output size from resize(), and multi-pass ones allocate
// their intermediate framebuffer there. Skipping this breaks them.
distortion.resize(960, 540);
blur.resize(960, 540);
vignette.resize(960, 540);

shimera::GLFramebuffer temp1(960, 540);
shimera::GLFramebuffer temp2(960, 540);

// Every frame:
{
    const shimera::GLStateGuard guard;   // protect the host's GL state
    const uint32_t output = shimera::currentDrawFramebuffer();
    glViewport(0, 0, 960, 540);

    distortion.render(scene.getColor(), temp1);
    blur.render(temp1.color(), temp2);

    shimera::bindFramebuffer(output);
    vignette.render(temp2.color());
}
```

With `EffectPipeline`:

```cpp
fx.render(scene);
```

## References

- `Args&&...`: [Forwarding References](https://en.cppreference.com/cpp/language/reference#Forwarding_references) ([*Easier to understand*](https://lemire.me/blog/2024/05/13/forwarding-references-in-c/))
