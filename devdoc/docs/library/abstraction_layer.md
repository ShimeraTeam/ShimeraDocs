# **{Shimera} Abstraction Layer**

**Shimera**'s abstraction layer is designed to **provide** a **unified interface** for **different graphics libraries**, allowing users to work with shaders **without worrying** about the **underlying implementation** details. This layer **abstracts away** the **complexities of OpenGL** and the **specific calls** required by **each graphics library**, such as SFML.

## Pre-Development

The schema made to discuss the abstraction layer with the team still represents the current state of the abstraction layer in a clear and concise way:

![Abstraction Layer Schema](/abstr_shema.png)

Since then, the abstraction layer has been altered to fit the needs of the project, but the general idea is still the same. The main goal of the abstraction layer is to provide a **simple and consistent interface** for **creating and managing shaders**, regardless of the underlying graphics library.

## Architecture Overview

### Design Philosophy

Shimera follows these core principles:

1. **Compile-Time Backend Selection** - Zero runtime overhead via preprocessor macros
2. **Factory Pattern** - Centralized component creation through `BackendFactory`
3. **Interface-Based Abstraction** - All components implement interfaces (`IBackend`, `IFrameBuffer`, etc.)
4. **Multi-Pass Support** - Built-in support for chaining multiple post-processing effects
5. **Backend-Agnostic API** - Same code works across OpenGL, SFML, and SDL backends


## Core Components

### 1. BackendFactory

**Purpose:** Creates the appropriate backend implementation based on compile-time macro.

**Location:** `BackendFactory.hpp/cpp`

**Key Method:**
- `create()` - Returns an instance of `IBackend` corresponding to the defined backend macro

::: info
The define of the backend is usually done during build configuration, so users typically won't need to manually define it in their code. The factory will automatically select the correct backend based on the defined macro.
:::

**Usage:**
```cpp
#define SHIMERA_BACKEND_SFML  // Set before including shimera.h, usually done durring build configuration
#include <shimera.h>

IBackend* backend = BackendFactory::create();
```

**How it works:**
- Checks `SHIMERA_BACKEND_*` macro at compile time
- Returns appropriate backend (`SFMLBackend`, `OpenGLBackend`, `SDLBackend`)
- No runtime decision, which means no overhead

### 2. IBackend Interface

**Purpose:** Abstract factory for creating backend-specific components. Group all the interfaces together and provide a single point of access.

**Location:** `IBackend.hpp`

**Key Methods:**
- `createFrameBuffer(width, height)` - Creates a backend specific off-screen render target
- `createPostProcessor(vert, frag)` - Creates a backend specific post-processing effect with given shaders
- `createTexture(width, height)` - Creates a backend specific texture
- `createShader(vert, frag)` - Creates a backend specific shader program

### 3. IFrameBuffer Interface

**Purpose:** Represents an off-screen render target.

**Location:** `IFrameBuffer.hpp`

**Key Methods:**
- `bind()` / `unbind()` - Activate/deactivate for rendering
- `clear(Color)` - Clear with specified color
- `getTexture()` - Get rendered result as texture
- `resize(width, height)` - Change dimensions
- `getNativeRenderTarget()` - Get backend-specific render target (e.g., `sf::RenderTexture*`)

**Usage:**
```cpp
IFrameBuffer* fbo = backend->createFrameBuffer(800, 600);

// SFML: Draw using native render target (static_cast is temporary, in WIP.)
auto* rt = static_cast<sf::RenderTexture*>(fbo->getNativeRenderTarget());
rt->draw(shape);
fbo->unbind(); // Finalize rendering

// OpenGL: Use bind/unbind
fbo->bind();
glDrawArrays(...);
fbo->unbind();
```

### 4. IPostProcessor Interface

**Purpose:** Applies post-processing shaders to textures.

**Location:** `IPostProcessor.hpp`

**Key Methods:**
- `setShader(vert, frag)` - Load shader programs
- `render(ITexture&)` - Apply effect to texture
- `setUniform(name, value)` - Set shader uniforms
- `getShader()` - Access underlying shader

**Usage:**
```cpp
IPostProcessor* exempleEffect = backend->createPostProcessor("*...*/post.vert", "*...*/exemple.frag");
effect->setUniform("time", 0.0f);
effect->render(fbo->getTexture());
```

### 5. ITexture & IShader Interfaces

**Purpose:** Abstract texture and shader resources.

**Locations:** `ITexture.hpp`, `IShader.hpp`

**Key Features:**
- `getNativeHandle()` - Access underlying OpenGL/backend handle
- Type-safe uniform system via `UniformValue` variant
- Automatic resource cleanup via RAII

### 6. Color Struct

**Purpose:** Backend-agnostic color representation. A way to specify colors without relying on backend-specific types (e.g., `sf::Color`).

**Location:** `Color.hpp`

**Features:**
- Normalized RGBA (0.0-1.0) for cross-backend compatibility
- Factory method `fromRGB(r, g, b, a)` for 0-255 values
- Common color constants (`Color::Black()`, `Color::White()`, etc.)


## Backend Implementations

### SFML Backend (Implemented)

**Components:**
- **SFMLBackend** - Factory implementation
- **SFMLFramebuffer** - Wraps `sf::RenderTexture`
- **SFMLPostProcessor** - Uses OpenGL under the hood (SFML is OpenGL-accessible)
- **SFMLTexture** - Wraps `sf::Texture`
- **SFMLShader** - Raw OpenGL shader management

**Key Implementation Details:**

#### SFMLFramebuffer
- Uses `sf::RenderTexture` internally
- `bind()` calls `setActive(true)` to make OpenGL render to it
- `unbind()` calls `display()` to finalize and `setActive(false)`
- `getNativeRenderTarget()` returns `&renderTexture` for SFML drawing

#### SFMLPostProcessor
- Creates fullscreen quad (VAO, VBO, EBO)
- Manages OpenGL shader via `SFMLShader`
- Handles uniform caching for performance
- Properly manages OpenGL state to avoid conflicts with SFML

### OpenGL Backend (Planned)

Will directly use OpenGL FBOs without wrapper library.

### SDL Backend (Planned)

Will use SDL's renderer or OpenGL context depending on SDL configuration.


## Multi-Pass Rendering Architecture

### Concept

Multi-pass rendering chains multiple post-processing effects by using intermediate framebuffers (ping-pong rendering).

**Flow:**
```
Scene → FBO1 → Effect1 → FBO2 → Effect2 → Screen
```

### Implementation Pattern

```cpp
// Create framebuffers
IFrameBuffer* sceneFBO = backend->createFrameBuffer(800, 600);
IFrameBuffer* tempFBO = backend->createFrameBuffer(800, 600);

// Create effects
IPostProcessor* effect1 = backend->createPostProcessor("post.vert", "effect1.frag");
IPostProcessor* effect2 = backend->createPostProcessor("post.vert", "effect2.frag");

// Render loop
while (running) {
    // 1. Render scene to sceneFBO
    auto* rt = static_cast<sf::RenderTexture*>(sceneFBO->getNativeRenderTarget());
    rt->clear(sf::Color::Black);
    rt->draw(shape);
    sceneFBO->unbind();
    
    // 2. Apply effect1: sceneFBO → tempFBO
    tempFBO->bind();
    glClear(GL_COLOR_BUFFER_BIT);
    effect1->render(sceneFBO->getTexture());
    tempFBO->unbind();
    
    // 3. Apply effect2: tempFBO → screen
    window.setActive(true);
    glClear(GL_COLOR_BUFFER_BIT);
    effect2->render(tempFBO->getTexture());
    
    window.display();
}
```

### Best Practices

1. **Minimize FBO switches** - Expensive operation
2. **Reuse framebuffers** - Create once, use many times
3. **Match dimensions** - All FBOs should match target resolution
4. **Proper context management** - Ensure correct context is active (especially in SFML)


## Usage Guide

### Step 1: Define Backend

::: tip NOTE
As said previously, the backend is usually defined during build configuration, so users typically won't need to manually define it in their code. The factory will automatically select the correct backend based on the defined macro.
:::

```cpp
// `#define [BACKEND]` should be already set, so no need to manually define it
#define SHIMERA_BACKEND_SFML  // Or SHIMERA_BACKEND_OPENGL, SHIMERA_BACKEND_SDL
#include <shimera.h>
```

### Step 2: Initialize

```cpp
// OpenGL initialization (if using OpenGL-based backend)
glewInit();

// Create backend
IBackend* backend = BackendFactory::create();
```

### Step 3: Create Components

```cpp
IFrameBuffer* fbo = backend->createFrameBuffer(800, 600);
IPostProcessor* effect = backend->createPostProcessor("vert.glsl", "frag.glsl");

// Set shader uniforms
effect->setUniform("time", 0.0f);
effect->setUniform("strength", 0.5f);
```

### Step 4: Render

```cpp
// Render to framebuffer
auto* rt = static_cast<sf::RenderTexture*>(fbo->getNativeRenderTarget());
rt->draw(sprite);
fbo->unbind();

// Apply post-processing
effect->render(fbo->getTexture());
```

### Step 5: Cleanup

```cpp
delete effect;
delete fbo;
delete backend;
```

**Note:** Consider using smart pointers (`std::unique_ptr`) for automatic cleanup.


## Uniform System

### Type-Safe Uniforms

Shimera uses `std::variant` for type-safe uniform values:

```cpp
using UniformValue = std::variant<float, int, Vec4<float>>;
```

### Setting Uniforms

```cpp
effect->setUniform("time", 1.5f);           // float
effect->setUniform("iterations", 10);       // int
effect->setUniform("color", Vec4(1,0,0,1)); // vec4
```

### Under the Hood

Uses `std::visit` to dispatch to correct OpenGL uniform function:
- `float` → `glUniform1f`
- `int` → `glUniform1i`
- `Vec4` → `glUniform4f`


## Build System
::: warning IMPORTANT NOTE
Maybe this section should be moved to a separate "Build Instructions" or smth.
:::
### XMake Configuration

The library is compiled as separate targets per backend:

```lua
-- Shimera SFML backend
target("shimera-sfml")
    set_kind("static")
    add_files("src/*.cpp")
    add_files("src/backend/*.cpp")
    add_files("src/backend/sfml/*.cpp")  -- Backend-specific files
    add_packages("glew", "sfml")
    add_defines("SHIMERA_BACKEND_SFML")
```

### Linking to Project

```lua
target("my-app")
    add_deps("shimera-sfml")  -- Link against shimera
    add_packages("sfml", "glew")
```

## Design Decisions

### Why Factory Pattern?

1. **Centralized component creation** - Single point for backend instantiation
2. **Decoupling** - User code doesn't know about concrete implementations
3. **Extensibility** - Easy to add new backends (Metal, Vulkan, DirectX, WebGPU)
4. **Type safety** - Interfaces ensure correct usage

### Why Compile-Time Selection?

1. **Zero runtime overhead** - No virtual dispatch or branching
2. **Smaller binaries** - Only selected backend is compiled
3. **Cleaner code** - No #ifdef in user code
4. **Better optimization** - Compiler can inline backend-specific code

### Why getNativeRenderTarget()?

Different backends have different rendering patterns:
- **SFML**: Must call `.draw()` on `sf::RenderTexture`
- **OpenGL**: Use `bind()` / `unbind()`
- **SDL**: `SDL_SetRenderTarget()`

Exposing native types allows idiomatic usage per backend while maintaining abstraction.

## Future Enhancements

### Planned Features

1. **Automatic Resource Management** - Smart pointers in interfaces to avoid manual cleanup (avoid `delete ...`)
2. **Effect Library** - More pre-built shaders than actuelly proposed (blur, bloom, vignette, etc.)
3. **Effect Composition API** - High-level pipeline builder, so "automatic" multi-pass chaining without manual FBO management (concept idea below)
4. **Shader Hot-Reloading** - Reload shaders without restart
5. **More Backends** - Vulkan, DirectX, Metal, WebGPU

### Effect Pipeline API (Concept)

```cpp
EffectPipeline pipeline;
pipeline.addEffect("blur", blurShader)
        .addEffect("bloom", bloomShader)
        .addEffect("vignette", vignetteShader)
        .compile();

// One call applies all effects
pipeline.render(sourceTexture);
```

## Example: Complete Multi-Pass Application

See `examples/sfml/src/main.cpp` for a working example demonstrating:
- Backend initialization
- Framebuffer creation
- Multi-pass effect chaining (distortion + grayscale)
- Proper context management
- Resource cleanup

Comment have been added to explain each step in detail.

## Troubleshooting

### Black Screen

**Problem:** Framebuffer renders but screen is black.

**Solutions:**
1. Ensure correct context is active: `window.setActive(true)` before rendering
2. Call `fbo->unbind()` to finalize framebuffer rendering
3. Check shader compilation errors
4. Verify texture binding (`glActiveTexture`, `glBindTexture`)

### OpenGL Errors

**Problem:** `GL_INVALID_OPERATION` on `glBindVertexArray`.

**Solutions:**
1. Initialize GLEW before creating any OpenGL resources
2. Ensure window/context is active before OpenGL calls
3. Unbind SFML's VAO before binding yours: `glBindVertexArray(0)`

These problems should not happen as the abstraction layer is designed to handle context management and OpenGL state, but if you are directly using OpenGL calls in your shaders or custom effects, these tips may help.

### Includes Missing

Currently, users need to include specific headers for each component, which can lead to confusion and errors.
#### TODO :
Clean and add every headers in `shimera.h`, as for now, users need to include specific headers for each component, which is not ideal. The main header should provide access to all necessary components without requiring users to know the internal structure of the library.

## Performance Considerations

### Framebuffer Overhead

- **Creation**: Expensive - create once, reuse
- **Binding**: Moderate - minimize switches
- **Clear**: Cheap - but necessary

### Shader Compilation

- Compile shaders at startup, not per-frame
- Cache uniform locations (already done in `SFMLShader`)

### Uniform Updates

- Only update changed uniforms
- Batch uniform updates when possible
- Uniform should have a caching mechanism to avoid redundant OpenGL calls

### Memory

- Match framebuffer size to window - don't oversample
- Release unused effects/framebuffers

## References

- [SFML Documentation](https://www.sfml-dev.org/documentation/3.0.0/)
- [OpenGL Wiki](https://www.khronos.org/opengl/wiki/)
- [LearnOpenGL - Framebuffers](https://learnopengl.com/Advanced-OpenGL/Framebuffers)
- [Overhead Definition](https://en.wikipedia.org/wiki/Overhead_(computing))
- [RAII in C++](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization)
- [What is Ping-Pong Rendering?](https://gamedev.stackexchange.com/questions/80951/what-is-ping-pong-in-the-context-of-graphics-rendering)
