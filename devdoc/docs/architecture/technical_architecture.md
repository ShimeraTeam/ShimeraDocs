# **{Shimera} Current Technical Architecture**
> A factual, implementation-level view of Shimera architecture based on the current codebase.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Core Modules](#core-modules)
3. [Rendering Pipeline](#rendering-pipeline)
4. [Dependencies](#dependencies)
5. [Internal Data Flows](#internal-data-flows)
6. [Build System](#build-system)
7. [Versioning Strategy](#versioning-strategy)
8. [Current Constraints](#current-constraints)
9. [References](#references)

## Architecture Overview

Shimera uses a backend abstraction to run the same post-processing workflow on multiple ecosystems.

The architecture follows this layered model:

1. Public API and ABI layer (`shimera.h`, `shimera_api.h`).
2. Backend abstraction layer (`IBackend`, resource interfaces, `BackendFactory`).
3. Concrete backend adapters (OpenGL, SFML, Raylib, SDL placeholder).
4. Effect framework layer (`ShaderEffectBase`, CRTP `ShaderEffect<Derived>`).
5. Shared support layer (uniform values, lightweight vector types, GL utilities).

Backend choice is compile-time (build target + preprocessor define), not runtime plugin selection.

## Core Modules

### Public API Surface

Main entry points:

- `include/shimera.h`
- `include/shimera_api.h`

Responsibilities:

- Provide a compact public include entry point.
- Handle symbol export/import for static or shared builds.

### Backend Abstraction Layer

Key files:

- `include/backend/IBackend.hpp`
- `include/backend/BackendFactory.hpp`
- `src/backend/BackendFactory.cpp`

Responsibilities:

- Define abstract creation contracts for framebuffers, textures, shaders, and post-processors.
- Hide concrete backend types behind interfaces.
- Select implementation with one backend macro:
  - `SHIMERA_BACKEND_OPENGL`
  - `SHIMERA_BACKEND_SFML`
  - `SHIMERA_BACKEND_RAYLIB`
  - `SHIMERA_BACKEND_SDL` (currently placeholder path)

### Resource Interfaces

- `IFrameBuffer`: render target lifecycle, resize, texture access.
- `IPostProcessor`: fullscreen post-process pass orchestration.
- `IShader`: shader bind/unbind and typed uniform writes.
- `ITexture`: texture bind/unbind and native-handle bridge.

### Concrete Backends

1. OpenGL backend (`src/backend/opengl/*`)
- Native GL ownership for framebuffers, textures, shaders, and fullscreen passes.

2. SFML backend (`src/backend/sfml/*`)
- Scene capture through `sf::RenderTexture`.
- Post-processing still executed through OpenGL-based fullscreen pass code.

3. Raylib backend (`src/backend/raylib/*`)
- Scene capture through `RenderTexture2D`.
- Post-processing still executed through OpenGL-based fullscreen pass code.

4. SDL backend
- Build target and macro path exist.
- Factory path is placeholder and does not instantiate a concrete backend.

### Effect Framework

Key files:

- `include/effects/ShaderEffectBase.hpp`
- `include/effects/ShaderEffect.inl`
- `src/effects/*.cpp`

Design:

- Stateful effect classes wrapping one post-processor each.
- CRTP-based fluent API (`ShaderEffect<Derived>`).
- Shared execution pattern:
  - `render(texture)`
  - `render(texture, framebuffer)`

Built-in effects in current code:

- Brightness
- Contrast
- Saturation
- Grayscale
- Colorshift
- Distortion
- Vignette
- Chromatic Aberration

## Rendering Pipeline

The runtime pipeline is pass-oriented and uses offscreen framebuffers.

### Stage 1: Scene Capture

1. Bind framebuffer A.
2. Render scene/application draw calls.
3. Unbind framebuffer A.

### Stage 2: Post-Process Pass

1. Read framebuffer texture from previous stage.
2. Update effect uniforms.
3. Draw a fullscreen quad with shader pass.

### Stage 3: Presentation

- Output either to screen or to another framebuffer.
- Enables pass chaining (ping-pong) for multi-effect pipelines.

### Common Shader Pass Contract

- Vertex pass consumes fullscreen positions + UV.
- Fragment pass samples `u_screenTexture` (texture unit 0) and applies effect uniforms.

### Typical Flows

Single-pass:

```text
Scene -> Framebuffer A -> Effect Pass -> Screen
```

Two-pass ping-pong:

```text
Scene -> Framebuffer A -> Effect 1 -> Framebuffer B -> Effect 2 -> Screen
```

## Dependencies

Shimera dependencies are split by backend target in Xmake.

### Build-Declared Packages

- `glew`
- `sfml` (optional)
- `raylib` (optional)
- `libsdl3` (optional)

### Backend Target Matrix

| Target | Define | Packages | Status |
|---|---|---|---|
| `shimera-opengl` | `SHIMERA_BACKEND_OPENGL` | `glew` | Implemented |
| `shimera-sfml` | `SHIMERA_BACKEND_SFML` | `glew`, `sfml` | Implemented |
| `shimera-raylib` | `SHIMERA_BACKEND_RAYLIB` | `glew`, `raylib` | Implemented |
| `shimera-sdl` | `SHIMERA_BACKEND_SDL` | `glew`, `libsdl3` | Build path exists, runtime backend incomplete |

### OpenGL and GLEW in Current Architecture

Even with SFML or Raylib backend variants, post-processing execution remains OpenGL-driven.

Practical consequence:

- GLEW and platform OpenGL system libraries are still foundational dependencies for all current backend variants.

## Internal Data Flows

Shimera behavior is best understood through 5 data-flow tracks.

### 1) Control Flow

- App initializes context/window stack.
- App creates backend (`BackendFactory::create`).
- App creates framebuffers and effects.
- Each frame: scene capture -> pass chain -> presentation.

### 2) Render-Target Flow

- `IFrameBuffer::bind/unbind` routes draw output to the selected target.
- Semantics differ by backend implementation (OpenGL FBO, SFML render texture, Raylib texture mode).

### 3) Texture Flow

- Framebuffer output is exposed as `ITexture`.
- Post-processors consume that texture as pass input.
- Pass output becomes next stage input for chaining.

### 4) Uniform Flow

- Effect fields are pushed every render call through `setUniform`.
- Values travel through `UniformValue` variant and backend shader dispatch.
- Shader classes cache uniform locations to reduce repeated lookups.

### 5) Lifetime Flow

- Effects own processors.
- Processors own shader objects.
- Framebuffers own texture wrappers.
- Resource release follows object lifetime hierarchy.

## Build System

Shimera uses Xmake (`xmake.lua`) with a target-per-backend strategy.

### Global Build Settings

- Build modes: debug/release.
- C++ standard: C++23.
- Windows toolchain policy: MSVC.

### Top-Level Options

- `shared` (default: false): build shared or static library.
- `examples` (default: true): include example applications.

### Example Subsystem

When enabled, example targets are included for OpenGL, SFML, Raylib, and SDL.
Each example depends on its corresponding library backend target.

### Platform Link Policy

OpenGL system libraries are linked per platform:

- Windows: `opengl32`
- macOS: `OpenGL` framework
- Linux/Unix-like: `GL`

## Versioning Strategy

Current workflow uses branch-driven integration and tag-driven releases.

### Branch Model

Long-lived branches:

- `dev` (active integration branch)
- `master` (stable-facing branch)

Short-lived branch naming commonly uses:

- `feat/*`
- `fix/*`
- `chore/*`
- `docs/*`
- `task/*`

### Commit and Merge Style

- PR merge commits are retained in history.
- Conventional-style prefixes are commonly used (`feat`, `fix`, `docs`, `ci`, `build`, etc.), but not strictly uniform.

### CI/CD Version Triggering

- CI runs on push/PR for main working branches.
- Release workflow is tag-triggered with `v*` pattern.
- Pre-release is inferred when the tag contains `-` (for example `v1.2.0-rc1`).
- Release artifacts include platform and version in filename.

## Current Constraints

The current implementation has known constraints relevant for roadmap planning:

1. SDL backend path is not fully implemented.
2. `SFMLBackend::createTexture` and `RaylibBackend::createTexture` are incomplete.
3. Post-processor and shader logic is duplicated across backend implementations.
4. Effect shader paths are hardcoded relative paths in constructors.

These constraints do not invalidate the architecture pattern, but they impact maintainability and packaging robustness.

## References

- [Application binary interface (ABI)](https://en.wikipedia.org/wiki/Application_binary_interface)
- [Curiously recurring template pattern (CRTP)](https://en.wikipedia.org/wiki/Curiously_recurring_template_pattern)
- [Xmake Manual](https://xmake.io/guide/introduction.html)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
