# Shimera Architecture Diagram

A visual overview of Shimera.

Contents:

1. [Interaction layers & core modules](#1-interaction-layers--core-modules)
2. [Backend abstraction (interfaces -> implementations)](#2-backend-abstraction-interfaces--implementations)
3. [Rendering flow](#3-rendering-flow)
4. [External dependencies](#4-external-dependencies)
5. [Module reference table](#5-module-reference-table)


## 1. Interaction layers & core modules

Dependency direction is strictly one-way (top -> bottom): high-level effect orchestration never
depends on a concrete backend. A backend is chosen **at compile time**, not at runtime.

```mermaid
flowchart TB
    subgraph APP["🖥️ Application Layer: host apps / examples"]
        direction LR
        EX_GL["OpenGL example<br/>+ GLFW window/context"]
        EX_SFML["SFML example"]
        EX_RL["Raylib example"]
    end

    subgraph API["🏛️ Public API / Facade"]
        SH["shimera.h<br/>umbrella include"]
        SHAPI["shimera_api.h<br/>SHIMERA_API export/import macros"]
    end

    subgraph EFFECTS["🎨 Effect DSL Layer"]
        SEB["ShaderEffectBase"]
        SE["ShaderEffect&lt;Derived&gt;<br/>CRTP fluent API"]
        PPE["Post-process effects<br/>Brightness, Contrast, Saturation<br/>Grayscale, Colortint, Distortion<br/>Vignette, ChromaticAberration<br/>GaussianBlur, HDRBloom<br/>Pixelisation, AtmosphericScattering"]
        MEB["MaterialEffectBase<br/>MaterialEffect&lt;Derived&gt;"]
        FRESNEL["FresnelEffect<br/>3D material"]
        PIPE["EffectPipeline<br/>pass chaining"]
    end

    subgraph KERNEL["⚙️ Abstraction Kernel: interfaces"]
        FACT["BackendFactory::create()<br/>compile-time backend selection"]
        IB["IBackend<br/>resource factory + renderMaterial"]
        IFACES["IFrameBuffer, IPostProcessor, IShader<br/>ITexture, IMaterial, IMesh"]
    end

    subgraph BACKENDS["🔌 Backend Adapters: concrete"]
        GLB["OpenGL backend"]
        SFB["SFML backend"]
        RLB["Raylib backend"]
    end

    subgraph SUPPORT["🧰 Support / Utility Modules"]
        UNI["uniform/<br/>UniformValue variant, Vec2/3/4, Mat4, Color"]
        SCENE["scene/<br/>Camera, CameraFactory, TransformFactory"]
        CONV["converts/<br/>GlmConvert, Raylib converts"]
        GLU["glUtils<br/>GLC/ASSERT shader compile/link"]
    end

    APP --> API
    API --> EFFECTS
    EFFECTS --> KERNEL
    KERNEL --> BACKENDS
    FACT --> IB
    IB --> GLB
    IB --> SFB
    IB --> RLB
    EFFECTS -. uses .-> UNI
    KERNEL -. uses .-> SCENE
    BACKENDS -. use .-> GLU
    BACKENDS -. use .-> CONV
    BACKENDS -. use .-> UNI
```

**Layer responsibilities**

| Layer | Role |
|-------|------|
| Application | Owns the window/GL context (GLFW/SFML/Raylib), drives the frame loop, owns Shimera objects. |
| Public API / Facade | Stable entry headers + ABI export macros (`SHIMERA_API`). |
| Effect DSL | Backend-agnostic, fluent effect objects (`.with()`), each wrapping one post-processor. |
| Abstraction Kernel | Pure interfaces + `BackendFactory`, the seam that keeps effects backend-agnostic. |
| Backend Adapters | Concrete OpenGL / SFML / Raylib implementations of every interface. |
| Support / Utility | Typed uniforms & math, scene/camera helpers, glm conversions, GL error/shader helpers. |

## 2. Backend abstraction (interfaces -> implementations)

`IBackend` is a factory: it creates every rendering resource as an interface, so application and
effect code hold only interface pointers. Each concrete backend implements the full set.

```mermaid
classDiagram
    class IBackend {
        <<interface>>
        +createFrameBuffer(w, h, samplableDepth) IFrameBuffer
        +createPostProcessor(vert, frag) IPostProcessor
        +createMesh(positions, normals, indices) IMesh
        +createMaterial(vert, frag) IMaterial
        +renderMaterial(material, mesh, camera, transform)
        +createTexture(w, h) ITexture
        +createShader(vert, frag) IShader
    }
    class IFrameBuffer {
        <<interface>>
        +bind()
        +unbind()
        +clear(Color)
        +resize(w, h)
        +getTexture() ITexture
        +getNativeRenderTarget()
    }
    class IPostProcessor {
        <<interface>>
        +setShader(IShader)
        +render(ITexture)
        +setUniform(name, UniformValue)
    }
    class IShader {
        <<interface>>
        +bind()
        +unbind()
        +setUniform(name, UniformValue)
    }
    class ITexture {
        <<interface>>
        +bind()
        +getNativeHandle()
    }
    class IMaterial {
        <<interface>>
    }
    class IMesh {
        <<interface>>
    }

    IBackend ..> IFrameBuffer : creates
    IBackend ..> IPostProcessor : creates
    IBackend ..> IShader : creates
    IBackend ..> ITexture : creates
    IBackend ..> IMaterial : creates
    IBackend ..> IMesh : creates

    OpenGLBackend --|> IBackend
    SFMLBackend --|> IBackend
    RaylibBackend --|> IBackend
```

**Compile-time selection** (`BackendFactory::create()` + `xmake.lua` defines):

```mermaid
flowchart LR
    F["BackendFactory::create()"]
    F -->|SHIMERA_BACKEND_OPENGL| A["new OpenGLBackend"]
    F -->|SHIMERA_BACKEND_SFML| B["new SFMLBackend"]
    F -->|SHIMERA_BACKEND_RAYLIB| C["new RaylibBackend"]
```

> Each built artifact (`shimera-opengl`, `shimera-sfml`, `shimera-raylib`) is bound
> to exactly one backend path, there is no runtime plugin switching.

## 3. Rendering flow

### 3.1 Post-processing pass chain (ping-pong)

The core pipeline: capture the scene offscreen, then apply fullscreen shader passes, alternating
framebuffers so no pass reads and writes the same target.

```mermaid
flowchart LR
    SCENE(["Scene draw calls"]) --> FBA["Framebuffer A<br/>bind -> render -> unbind"]
    FBA -->|getTexture| P1["Effect Pass 1<br/>updateUniforms -> fullscreen quad"]
    P1 --> FBB["Framebuffer B"]
    FBB -->|getTexture| P2["Effect Pass 2"]
    P2 --> SCREEN(["🖼️ Screen / active target"])

    P1 -. or direct to screen<br/>single-pass .-> SCREEN
```

### 3.2 3D material path

Alongside post-processing, `IBackend::renderMaterial()` draws lit/shaded geometry (e.g. the
`FresnelEffect`) using a mesh, material shader, camera and transform.

```mermaid
flowchart LR
    MESH["IMesh<br/>positions, normals, indices"] --> RM
    MAT["IMaterial<br/>material shader"] --> RM
    CAM["Camera<br/>view / projection"] --> RM
    XF["Mat4 transform"] --> RM
    RM["IBackend::renderMaterial()"] --> OUT(["Framebuffer / screen"])
```

### 3.3 Per-frame control & uniform flow

How an effect pushes CPU-side parameters to the GPU each frame (`std::visit` dispatches the
`UniformValue` variant to the right `glUniform*` call, uniform locations are cached).

```mermaid
sequenceDiagram
    participant App
    participant Effect as ShaderEffect
    participant PP as IPostProcessor
    participant Sh as IShader
    participant GPU

    App->>Effect: render(inputTexture, targetFB)
    Note over Effect: skip if disabled
    Effect->>Effect: updateUniforms()
    loop each parameter
        Effect->>PP: setUniform(name, UniformValue)
        PP->>Sh: setUniform(...)
        Sh->>GPU: glUniform* via std::visit (cached location)
    end
    Effect->>PP: render(inputTexture)
    PP->>GPU: bind shader + bind texture (GL_TEXTURE0) + draw quad
    GPU-->>App: transformed pixels -> target
```

## 4. External dependencies

`GLEW`, `GLM` and an OpenGL system library are **always** linked, even the SFML and Raylib
backends run their shader passes through raw OpenGL. Framework libraries are selected per target.

```mermaid
flowchart TB
    subgraph CORE["Always linked (every backend)"]
        GLEW["GLEW"]
        GLM["GLM<br/>math / matrices"]
        GLSYS["OpenGL system lib<br/>opengl32, GL, OpenGL.framework"]
    end

    subgraph OPT["Backend-specific (compile-time, optional)"]
        SFML["SFML"]
        RAYLIB["Raylib"]
    end

    subgraph HOST["Host / example only"]
        GLFW["GLFW<br/>OpenGL example window"]
    end

    TGL["shimera-opengl"] --> GLEW
    TGL --> GLM
    TGL --> GLSYS

    TSF["shimera-sfml"] --> GLEW
    TSF --> GLM
    TSF --> GLSYS
    TSF --> SFML

    TRL["shimera-raylib"] --> GLEW
    TRL --> GLM
    TRL --> GLSYS
    TRL --> RAYLIB

    TGL -. example app .-> GLFW
```

**Per-target dependency matrix**

| Target | GLEW | GLM | OpenGL syslib | Framework | Status |
|--------|:----:|:---:|:-------------:|-----------|--------|
| `shimera-opengl` | ✅ | ✅ | ✅ | - | complete |
| `shimera-sfml` | ✅ | ✅ | ✅ | SFML | complete |
| `shimera-raylib` | ✅ | ✅ | ✅ | Raylib | complete |

> Runtime resources: effects load GLSL from `res/shader/postprocessing/` (and
> `res/shader/material/`) by relative path, so shaders must ship alongside the binary.

## 5. Module reference table

| Module | Location | Purpose |
|--------|----------|---------|
| Public API | `include/shimera.h`, `include/shimera_api.h` | Umbrella include + ABI export macros. |
| Backend interfaces | `include/backend/I*.hpp` | `IBackend`, `IFrameBuffer`, `IPostProcessor`, `IShader`, `ITexture`, `IMaterial`, `IMesh`. |
| Backend factory | `include/backend/BackendFactory.hpp`, `src/backend/BackendFactory.cpp` | Compile-time backend construction. |
| OpenGL backend | `include/backend/opengl/`, `src/backend/opengl/` | Native FBO/texture/shader/mesh/material + fullscreen pass. |
| SFML backend | `include/backend/sfml/`, `src/backend/sfml/` | Wraps `sf::RenderTexture`/`sf::Texture`; passes via OpenGL. |
| Raylib backend | `include/backend/raylib/`, `src/backend/raylib/` | Wraps `RenderTexture2D`; passes via OpenGL; `converts/` for camera/types. |
| Effects | `include/effects/`, `src/effects/` | CRTP `ShaderEffect<Derived>` + 12 post-process effects. |
| Material effects | `include/effects/materials/`, `src/effects/materials/` | `MaterialEffectBase` + `FresnelEffect` (3D). |
| Scene | `include/scene/`, `src/scene/` | `Camera`, `CameraFactory`, `TransformFactory`. |
| Uniforms / math | `include/uniform/` | `UniformValue` variant, `Vec2/3/4`, `Mat4`, `Color`. |
| Converts | `include/converts/`, `src/converts/` | `GlmConvert` and Raylib type conversions. |
| GL utilities | `include/glUtils.h`, `src/glUtils.cpp` | GL error macros + shader compile/link helpers. |

---

### Legend

- **Solid arrow**: direct dependency / data flow.
- **Dashed arrow**: optional / conditional use.
