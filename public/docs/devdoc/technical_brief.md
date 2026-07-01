# Shimera - Technical Brief

## Introduction

This document provides a concise overview of Shimera for partners, recruiters, and external reviewers. For implementation-level detail, see the linked documentation pages.

## Project Overview

Shimera is a C++ library that unifies shader-based visual effects across multiple rendering backends (native OpenGL, SFML, and Raylib) behind a single, consistent API.

The project is developed by a team of three and is currently in **active development** (C++23, built with Xmake), with the OpenGL, SFML, and Raylib backends implemented.

## Core Architecture

Shimera is built as a layered abstraction over OpenGL:

1. **Public API**: a compact entry point (`shimera.h`) with static/shared export handling.
2. **Backend abstraction**: `IBackend` and `BackendFactory` define creation contracts for framebuffers, textures, shaders, and post-processors; the concrete backend is selected at **compile time** via preprocessor define, not runtime plugin loading.
3. **Concrete backends**: OpenGL, SFML, and Raylib each implement scene capture through their native mechanism (FBO, `RenderTexture`, `RenderTexture2D`), while post-processing execution stays OpenGL-driven across all of them.
4. **Effect framework**: a CRTP-based fluent API (`ShaderEffect<Derived>`) lets effects be declared and chained (ping-pong framebuffers).

Full detail: [Architecture documentation](./architecture/technical_architecture.md)

## Technical Innovation

- **Cross-backend**: Most shader libraries only work with one backend. Shimera treats SFML, Raylib, and OpenGL as different flavors of the same GL pipeline, and hides that difference from the user.
- **Multiple-effect chaining** A multiple-effect pipeline that take normally hours of manual framebuffer and texture-binding work but becomes easy with a few method calls, while still exposing low-level uniforms when you need them.

Full detail: [Why Shimera](../userdoc/why_shimera.md)

## Demonstrated Performance

Measured over 5,000 frames per effect (100-frame warm-up), on a dedicated GitHub Actions self-hosted runner (Quadro RTX 5000):

| Backend | Average FPS (no effects) | Average FPS (typical single effect) |
|---|---|---|
| Native OpenGL | 25,510 fps | 22,000 fps |
| Raylib | 5,257 fps | 5,000 – 5,400 fps |
| SFML | 5,012 fps  | 4,400 – 5,000 fps |

Full detail: [Performance documentation](../performance/benchmarks.md)

## Roadmap

**July 2026**: Right now, Shimera has a separate abstraction layer for each backend (OpenGL, SFML, Raylib). The team is testing whether this can be replaced with one generic architecture that works for any backend. The result decides which path the project follows for the rest of this development cycle:

- **Plan A (if the generic architecture works out):**
  - August: refactor the library on a dedicated branch around the new generic architecture.
  - September: integrate [Slang](https://shader-slang.org/) into the workflow and migrate existing GLSL shaders to it.
  - October: focus on world-space shaders and materials.
  - November - February: consolidate the library and expand the shader catalog.
- **Plan B (if it doesn't pan out):** keep the current backend-specific architecture as-is.
  - August*: integrate Slang into the workflow and migrate existing GLSL shaders to it.
  - September: implement world-space shaders directly in the current library, if not already done.
  - October - February: same consolidation and shader-catalog work as Plan A.
