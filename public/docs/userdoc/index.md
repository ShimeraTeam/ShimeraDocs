# UserDoc

Shimera is a C++ library that adds post-processing effects (blur, bloom, distortion, vignette, ...) to an existing graphical project, without writing a single line of shader code. It plugs into the rendering loop of the library you already use: **SFML 3**, **raylib**, **SDL3**, or plain **OpenGL** (GLFW, or any other way of creating an OpenGL context).

This page explains how Shimera fits into your program. The pages in the sidebar then go into each part in detail.

## How it works

Every Shimera program is built from the same three objects:

| Object | Role |
|--------|------|
| [`shimera::Context`](#context) | Loads OpenGL for Shimera. Created once, after your window. |
| [Host target](#host-targets) | An offscreen surface, owned by Shimera but drawn into with **your** library's own calls. |
| [`shimera::EffectPipeline`](./effect_pipeline_builder.md) | The list of effects, applied in order to the host target and written to the window. |

Each frame follows the same three steps:

```cpp
scene.begin();      // 1. draw your scene as usual, but into the host target
    // ... your SFML / raylib / SDL / OpenGL draw calls ...
scene.end();

fx.render(scene);   // 2. apply every effect and write the result to the window

// 3. present the frame as usual (window.display(), EndDrawing(), ...)
```

## Quick start

```cpp
#include <shimera.hpp>             // Context, EffectPipeline and every effect
#include <hosts/RaylibTarget.hpp>  // the host target for your library

int main() {
    InitWindow(960, 540, "Shimera");
    {
        auto context = shimera::Context::create();
        shimera::RaylibTarget scene(960, 540);

        shimera::EffectPipeline fx(960, 540);
        fx.add<shimera::Vignette>()
          .add<shimera::Bloom>();

        while (!WindowShouldClose()) {
            scene.begin();
                ClearBackground(DARKGRAY);
                DrawCircle(480, 270, 120.0f, SKYBLUE);
            scene.end();

            BeginDrawing();
                fx.render(scene);
            EndDrawing();
        }
    }
    CloseWindow();
}
```

The `shimera.hpp` header includes the core of the library and every effect. Host targets are included separately (`hosts/SfmlTarget.hpp`, `hosts/RaylibTarget.hpp`, `hosts/SdlTarget.hpp`, `hosts/GlfwTarget.hpp`) because each one depends on its host library.

## Context

```cpp
static shimera::Context shimera::Context::create();
static std::string shimera::Context::getRendererInfo(); // e.g. "OpenGL 4.6 ... on NVIDIA ..."
```

`Context::create()` loads the OpenGL functions Shimera uses. You no longer call `glewInit()` yourself. It must be called **after** your window exists and its OpenGL context is current, and **before** creating any host target, pipeline or effect:

| Library | Call `Context::create()` after |
|---------|-------------------------------|
| SFML | the `sf::RenderWindow` constructor |
| raylib | `InitWindow()` |
| GLFW | `glfwMakeContextCurrent()` |
| SDL3 | `SDL_CreateRenderer(window, "opengl")` |

If no OpenGL context is current, or OpenGL cannot be loaded, it throws a `shimera::InitError` (a `std::runtime_error`) whose message tells you which call is missing. `Context` is move-only.

## Host targets

A host target is where your scene is drawn before Shimera processes it. Each host library has its own, but they all share the same interface (`shimera::IHostTarget`):

| Method | Description |
|--------|-------------|
| `begin()` | Redirects your library's draw calls into the target |
| `end()` | Finishes the scene (flushes your library's batching) and gives the window back |
| `native<T>()` | Typed pointer to the native object you draw on, when your library needs one |
| `resize(width, height)` | Recreates the target at a new size |
| `getWidth()`, `getHeight()` | Current size |
| `getColor()`, `getDepth()` | The scene's color texture, and its depth texture when available (`nullptr` otherwise) |

| Host | Class / header | Constructor | `native<T>()` | Depth |
|------|----------------|-------------|---------------|-------|
| SFML 3 | `shimera::SfmlTarget`<br>`hosts/SfmlTarget.hpp` | `SfmlTarget(sf::RenderWindow& window, int width, int height)` | `sf::RenderTexture` | No |
| raylib | `shimera::RaylibTarget`<br>`hosts/RaylibTarget.hpp` | `RaylibTarget(int width, int height, bool samplableDepth = false)` | `RenderTexture2D` | Optional |
| SDL3 | `shimera::SdlTarget`<br>`hosts/SdlTarget.hpp` | `SdlTarget(SDL_Renderer& renderer, int width, int height)` | `SDL_Renderer` | No |
| OpenGL | `shimera::GlfwTarget`<br>`hosts/GlfwTarget.hpp` | `GlfwTarget(int width, int height, bool samplableDepth = false)` | `shimera::GLFramebuffer` | Optional |

### SFML

```cpp
shimera::SfmlTarget scene(window, 960, 540);
auto& texture = *scene.native<sf::RenderTexture>();

scene.begin();
    texture.clear(sf::Color::Black);
    texture.draw(sprite);
scene.end();                 // calls display() on the texture and reactivates `window`

window.clear();
fx.render(scene);
window.display();
```

The target needs the window because `sf::RenderTexture` has its own OpenGL context: `end()` makes the window's context current again, so you never call `setActive()` yourself.

### raylib

```cpp
shimera::RaylibTarget scene(960, 540);

scene.begin();               // BeginTextureMode()
    ClearBackground(BLACK);
    BeginMode3D(camera);
        DrawCube(...);
    EndMode3D();
scene.end();                 // flushes raylib's batch, then EndTextureMode()

BeginDrawing();
    ClearBackground(BLACK);
    fx.render(scene);
EndDrawing();
```

Pass `samplableDepth = true` to also get the scene's depth as a texture. `RaylibTarget::cameraFromRaylib(eyePosition)`, called inside `BeginMode3D()`, returns a `shimera::Camera` that matches raylib's camera exactly, for use with [materials](./materials/material_shaders.md).

### SDL3

```cpp
SDL_Renderer* renderer = SDL_CreateRenderer(window, "opengl"); // the "opengl" driver is required
auto context = shimera::Context::create();
shimera::SdlTarget scene(*renderer, 960, 540);

scene.begin();               // SDL_SetRenderTarget(renderer, <scene texture>)
    SDL_RenderClear(renderer);
    SDL_RenderFillRect(renderer, &rect);
scene.end();                 // back to the window

fx.render(scene);
SDL_RenderPresent(renderer);
```

Shimera reads the scene through OpenGL, so the renderer **must** use SDL's `"opengl"` driver. With any other driver (Direct3D, Vulkan, GPU, software), the `SdlTarget` constructor throws a `std::runtime_error` explaining how to create the renderer.

### OpenGL (GLFW and others)

```cpp
shimera::GlfwTarget scene(width, height);

scene.begin();               // binds the target and sets the viewport to its size
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glEnable(GL_DEPTH_TEST);
    // ... your OpenGL draw calls ...
    glDisable(GL_DEPTH_TEST); // leave depth testing and culling off before the effects
    glDisable(GL_CULL_FACE);
scene.end();                 // restores the previous framebuffer and viewport

fx.render(scene);
glfwSwapBuffers(window);
```

Despite its name, `GlfwTarget` does not use GLFW at all: it only needs a current OpenGL context, so it also works with SDL in OpenGL mode, GLUT, or a context created by another library. If your scene enables depth testing or face culling, disable them before `fx.render()`, otherwise the effects can output a black screen.

## Resizing

When the window is resized, resize both the host target and the pipeline:

```cpp
scene.resize(width, height);
fx.resize(width, height);
```

The pipeline forwards the new size to every effect it contains.

## Lifetime

Host targets, pipelines and effects own OpenGL resources, so they must be destroyed **before** the window that owns the OpenGL context. When they are members of a class, store them in `std::optional`: they can then be created once the window exists, and reset in the right order in the destructor:

```cpp
class Game {
    // ...
    std::optional<shimera::Context> m_context;
    std::optional<shimera::SfmlTarget> m_scene;
    std::optional<shimera::EffectPipeline> m_fx;
};

Game::~Game() {
    m_fx.reset();
    m_scene.reset();
    m_context.reset();
    // then destroy the window
}
```

## Building and linking

With xmake, depend on the Shimera target that matches your host library. It brings the core library, GLEW and GLM with it:

| Host library | xmake target |
|--------------|--------------|
| SFML 3 | `shimera-sfml` |
| raylib | `shimera-raylib` |
| SDL3 | `shimera-sdl` |
| OpenGL (GLFW, ...) | `shimera-glfw` |

The effect shaders are written in [Slang](https://shader-slang.org/) and compiled to GLSL during the build, so `slangc` must be in your `PATH` (or given with `xmake f --slangc=<path>`). Without it, the build prints a warning, skips the shaders, and creating an effect fails at runtime because its shader file cannot be found.

::: warning Shader location
For now, Shimera loads its shaders at runtime from the `res/` folder of the Shimera source tree (the path is set at build time). Keep that folder in place for your program to run.
:::

See [Installation](./installation.md) for the full setup.

## Migrating from the previous API

The library was rewritten. If your code uses the previous API, here is how each part maps to the new one:

| Previous API | New API |
|--------------|---------|
| `#include <shimera.h>` | `#include <shimera.hpp>` (+ `hosts/<Host>Target.hpp`) |
| `glewInit()` in your code | `shimera::Context::create()` |
| `IBackend* backend = BackendFactory::create()` | Removed. Create a `Context`, then a host target |
| `backend->createFrameBuffer(w, h)` for the scene | `SfmlTarget`, `RaylibTarget`, `SdlTarget` or `GlfwTarget` |
| `static_cast<sf::RenderTexture*>(fb->getNativeRenderTarget())` | `scene.native<sf::RenderTexture>()` |
| `fb->bind()` / `fb->unbind()` around the scene | `scene.begin()` / `scene.end()` |
| `window.setActive(true)` before rendering effects | Done by `SfmlTarget::end()` |
| `EffectPipeline(backend, w, h)` | `EffectPipeline(w, h)` |
| `pipeline.addEffect<T>(...)` | `pipeline.add<T>(...)` |
| `pipeline.addEffect(std::move(effect))` | Removed. Use `add<T>(args...)`, then `get<T>()` to configure |
| `pipeline.build()` | Automatic on the first `render()` |
| `pipeline.render(fb->getTexture())` | `pipeline.render(scene)` |
| `effect.render(...)` with manual intermediate framebuffers | `EffectPipeline`, even for a single effect |
| `XxxEffect` classes (`DistortionEffect`, ...) | `shimera::Xxx` (`shimera::Distortion`, ...) |
| Effect constructors taking `backend` | Only take the effect's own parameters |
| Public uniform members (`distortion.time`, `m_uTime`, ...) | Setters (`withTime()`, ...) and getters |
| `withResolution()` on Vignette | Removed, the resolution comes from the pipeline |
| `HDRBloomEffect` | `shimera::Bloom` (no ACES tone mapping anymore) |
| `GrayscaleEffect` | `shimera::Saturation(0.0f)` |
| `SaturationEffect::withStrength()` | `Saturation::withSaturationFactor()` |
| `VignetteEffect::withIsRounded()` | `Vignette::withRounded()` |
| `ColorshiftEffect` | `shimera::ColorTint` (same `withTint()` parameter and behavior) |
| `AtmosphericScatteringEffect` | Not ported to the new API yet |

## Next steps

- [Effect Pipeline Builder](./effect_pipeline_builder.md): the full pipeline API.
- [Shaders & Effects](./shaders/index.md): every available effect and its parameters.
- [Materials](./materials/material_shaders.md): shaders applied to your 3D meshes.
- The `examples/` folder of the repository contains one complete, runnable program per host library.
