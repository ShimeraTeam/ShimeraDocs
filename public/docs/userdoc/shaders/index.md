# Shaders & Effects

Shimera provides a set of ready-to-use post-processing effects. Each effect is a C++ class wrapping a shader: you set its parameters from C++, and Shimera handles the shader, its uniforms and the OpenGL state. The same effects work with every supported host library (SFML 3, raylib, SDL3 and plain OpenGL).

This page shows how effects are used in general. Each effect then has its own page listing its parameters.

## Basic Usage Pattern

### 1. Create the Context and a host target

After your window exists:

```cpp
#include <shimera.hpp>
#include <hosts/SfmlTarget.hpp>

auto context = shimera::Context::create();
shimera::SfmlTarget scene(window, 960, 540);
```

See [Host targets](../index.md#host-targets) for the other host libraries.

### 2. Create a pipeline and add effects

```cpp
shimera::EffectPipeline fx(960, 540);
fx.add<shimera::Distortion>()             // default parameters
  .add<shimera::Vignette>(1.0f, 0.45f);   // or constructor parameters
```

### 3. Configure the effects (optional)

Every effect has `with...()` setters that return the effect itself, so they can be chained:

```cpp
fx.get<shimera::Distortion>()
  .withNoiseScale(2.0f)
  .withDistortionStrength(0.1f)
  .withTimeScale(0.1f);
```

### 4. Draw your scene into the target

```cpp
scene.begin();
    // ... draw with your host library ...
scene.end();
```

### 5. Apply the effects

```cpp
fx.render(scene);
```

## Complete Example (SFML)

![Complete Example](../../res/shaders/distortion-chromaticAberration.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <shimera.hpp>
#include <hosts/SfmlTarget.hpp>

#include <iostream>
#include <optional>

int main() {
    sf::RenderWindow window(sf::VideoMode({960, 540}), "Shimera Demo");
    window.setVerticalSyncEnabled(true);

    try {
        auto context = shimera::Context::create();
        shimera::SfmlTarget scene(window, 960, 540);

        shimera::EffectPipeline fx(960, 540);
        fx.add<shimera::Distortion>(2.0f, 0.1f, 0.1f)          // noiseScale, strength, timeScale
          .add<shimera::ChromaticAberration>(1.0f, true, 1.0f, 32);

        auto& distortion = fx.get<shimera::Distortion>();

        sf::CircleShape circle(80.f);
        circle.setFillColor(sf::Color::Magenta);
        circle.setPosition({130.f, 190.f});

        sf::RectangleShape rectangle({160.f, 160.f});
        rectangle.setFillColor(sf::Color::White);
        rectangle.setPosition({400.f, 190.f});

        sf::CircleShape triangle(105.f, 3);
        triangle.setFillColor(sf::Color::Yellow);
        triangle.setPosition({645.f, 190.f});

        sf::Clock clock;
        while (window.isOpen()) {
            while (const std::optional event = window.pollEvent()) {
                if (event->is<sf::Event::Closed>())
                    window.close();
            }

            auto& texture = *scene.native<sf::RenderTexture>();
            scene.begin();
                texture.clear(sf::Color::Black);
                texture.draw(circle);
                texture.draw(rectangle);
                texture.draw(triangle);
            scene.end();

            distortion.withTime(clock.getElapsedTime().asSeconds());

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

## Common Effect API

All effects derive from `shimera::Effect` and share these methods:

| Method | Description |
|--------|-------------|
| `with...(value)` | Sets a parameter, returns the effect for chaining |
| `get...()` | Reads a parameter back (see each effect page for the available getters) |
| `setEnabled(bool)` / `isEnabled()` | Turns the effect off without removing it from the pipeline |
| `getName()` | The effect's name, e.g. `"Bloom"` |
| `resize(width, height)` | Gives the output size to the effect. Called for you by the pipeline |

Parameters are sent to the shader at each render, so a `with...()` call takes effect on the next frame. Effects are move-only.

### Resolution

Most effects that depend on the screen size (Vignette, Bloom) receive it from the pipeline automatically, on `add()` and on every `pipeline.resize()`.

[Gaussian Blur](./gaussian_blur.md) and [Pixelisation](./pixelisation.md) are the exceptions: they still use their own `withResolution()` value, which defaults to `1920 x 1080`. Set it to your output size, and update it when the window is resized:

```cpp
fx.get<shimera::GaussianBlur>().withResolution(shimera::Vec2(960.0f, 540.0f));
```

### Types

Vector parameters use Shimera's own small types from the `uniform/` folder, so you never need GLM or your host's vector types:

```cpp
shimera::Vec2(960.0f, 540.0f)          // Vec2<float>
shimera::Vec4(0.0f, 0.0f, 0.0f, 1.0f)  // Vec4<float>, RGBA colors
```

## Using an Effect Without a Pipeline

`EffectPipeline` is the recommended way to render effects, even a single one. An effect can still be rendered directly:

```cpp
void render(const GLTexture& input);                        // into the bound framebuffer
void render(const GLTexture& input, GLFramebuffer& target); // into `target`
```

In that case you are responsible for what the pipeline normally does:

- call `effect.resize(width, height)` once before the first render and on every window resize. Multi-pass effects (Gaussian Blur, Bloom) create their intermediate framebuffer there, and **crash** if it was never called;
- set the viewport to the output size;
- protect the host's OpenGL state with a `shimera::GLStateGuard` for the duration of the render.

See [Comparison with Manual Chaining](../effect_pipeline_builder.md#comparison-with-manual-chaining) for an example.

## Available Effects

Shimera provides **10 effects**:

### Color Adjustments
- [**Brightness**](./brightness.md) - Brighten or darken the entire image
- [**Contrast**](./contrast.md) - Adjust image contrast
- [**Saturation**](./saturation.md) - Control color saturation, down to black & white
- [**Color Tint**](./color_tint.md) - Blend the image with a color

### Advanced Effects (Multiple Parameters)
- [**Vignette**](./vignette.md) - Darken (or tint) the image edges with a customizable shape
- [**Distortion**](./distortion.md) - Warp the image with animated gradient noise
- [**Chromatic Aberration**](./chromatic_aberration.md) - Separate the RGB channels like a cheap lens
- [**Gaussian Blur**](./gaussian_blur.md) - Smooth the image with a separable two-pass Gaussian blur
- [**Pixelisation**](./pixelisation.md) - Reduce the image to blocky pixels for a retro look
- [**Bloom**](./bloom.md) - Make bright areas glow

### Not Yet Ported to the New API
This effect existed in the previous version of the library and has not been rewritten yet. Its page still describes the previous API.
- [**Atmospheric Scattering**](./atmospheric_scattering.md) - Physically-inspired planetary atmosphere (3D, depth-aware)

::: info Renamed or merged effects
Grayscale is now `Saturation` with a factor of `0.0`, HDR Bloom became [Bloom](./bloom.md), and Colorshift became [Color Tint](./color_tint.md).
:::

## Host Compatibility

Every effect is screen-space and works with every host target:

- ✅ **SFML 3** (`SfmlTarget`)
- ✅ **raylib** (`RaylibTarget`)
- ✅ **SDL3** (`SdlTarget`, with the `"opengl"` renderer driver)
- ✅ **OpenGL** (`GlfwTarget`: GLFW, SDL in OpenGL mode, or any current OpenGL context)

## Shader Sources

Effect shaders are written in [Slang](https://shader-slang.org/) and live in `res/shader/postprocessing/`. At build time, xmake compiles each `.slang` file to GLSL 330 in `res/shader/generated/`, which is what Shimera loads at runtime. All effects share the same fullscreen vertex shader, `postprocess.slang`.

## Next Steps

- Explore the individual effect pages
- Read the [Effect Pipeline Builder](../effect_pipeline_builder.md) page for the full pipeline API
- Check the `examples/` directory of the repository for complete, runnable code
