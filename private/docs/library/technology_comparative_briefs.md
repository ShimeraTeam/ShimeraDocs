# Documentation and Comparative Briefs for Technologies Used in the Library

## Purpose

This document summarizes the core technologies used by Shimera and provides short comparative briefs to justify architectural choices.

Shimera is a C++ library designed to allow its users (mainly technicians) to implement visual effects on top of their graphical projects without requiring any GPU knowledge. The library provides a set of shaders that can be easily integrated into OpenGL, SFML, and Raylib projects. Each shader comes with a callable function that allows users to implement and modify the shader's parameters according to their needs.

## Technology Overview

### Language and Runtime

- C++23: main implementation language for performance, RAII, and low-level graphics interop.
- GLSL: shader language used for effects on the GPU.

### Build and Tooling

- xmake: primary build tool in this repository.

## Comparative Brief 1: Main Language of the Library

### C++ vs C vs Rust vs C# vs Java vs Python

| Criterion | C++ | C | Rust | C# | Java | Python |
| --- | --- | --- | --- | --- | --- | --- |
| Low-level performance | Excellent | Excellent | Excellent | Good to very good | Good (JIT) | Low to medium |
| Direct interop with OpenGL/SFML/raylib/SDL | Excellent | Good (SDL very natural, SFML less so) | Good (FFI required depending on libs) | Medium (bindings/interop layers) | Medium (LWJGL/JOGL for OpenGL, third-party bindings for raylib/SFML) | Medium (bindings, frequent C/C++ layers) |
| Memory control and GPU resource management | Excellent (mature RAII) | Good but more manual | Excellent (ownership/borrow checker) | Medium (GC, native patterns required) | Medium (GC, indirect management of GPU resources) | Low to medium (indirect management via wrappers) |
| Expressiveness for high-level library abstractions | Excellent | Medium | Good to excellent | Good | Good to excellent | Excellent |
| Maturity of native ecosystem for our current stack | Very high | High | Medium to high | Medium | Medium (LWJGL mature for OpenGL, less so for raylib/SFML) | High for scripting, more limited for native core |

Decision:
- C++ is chosen for its excellent balance between performance, GPU resource control, expressiveness for library abstractions, and ecosystem maturity for our current stack.
- The RAII model of C++ is particularly well-suited for managing GPU resources (buffers, textures, shaders, framebuffers).
- C remains a very performant foundation, but involves more manual management and offers fewer structuring tools for our current abstraction level.
- Rust is a promising language for graphics projects, but its ecosystem around OpenGL/SFML/raylib is less mature than C++'s. Additionally, the need for FFI to interact with these libraries could introduce unwanted complexity for our current scope.
- C# can accelerate certain application use cases, but adds an interop layer for our native graphics core and is not our current target for a low-level library.
- Java has tools such as LWJGL for OpenGL, but garbage collection, JIT behavior, and the lack of fine-grained control over GPU resources make it less ideal than a native C++ approach for a low-level library. In addition, interop with raylib and SFML requires third-party bindings that are less mature than what is available for C++.
- Python is excellent for prototyping, tooling, and education, but is not suitable as the main language for Shimera's rendering core (CPU performance, interop overhead, fine-grained GPU resource management).

sources:
- C++ and OpenGL (documentation): https://www.opengl.org/Documentation/Implementations/Languages.html
- C++, OpenGL and SFML (documentation): https://www.sfml-dev.org/tutorials/3.0/window/opengl/
- C++, OpenGL, Java, Python (discussion): https://www.reddit.com/r/opengl/comments/ssxve7/which_language_should_choose_for_opengl/
- C++ and OpenGL (discussion): https://www.haroldserrano.com/blog/which-programming-language-should-i-learn-to-use-opengl
- C++, OpenGL, Java, Python (discussion): https://www.reddit.com/r/opengl/comments/fu5eva/which_language_do_you_program_in_with_opengl/
- Python and OpenGL (discussion): https://www.reddit.com/r/gamedev/comments/n6jre/using_opengl_with_python_prudent/
- C# and OpenGL (discussion): https://stackoverflow.com/questions/536065/using-opengl-with-c
- C#, C++ and OpenGL (discussion): https://www.reddit.com/r/opengl/comments/oxcc9z/good_opengl_implementations_for_c/

## Comparative Brief 2: Graphics API

### OpenGL vs Vulkan vs Direct3D vs Metal

| Criterion | OpenGL | Vulkan | Direct3D 11/12 | Metal |
| --- | --- | --- | --- | --- |
| Cross-platform desktop support | High | High | Mainly Windows | Mainly Apple |
| Integration complexity | Moderate | High | Moderate to high | Moderate |
| Learning/debugging effort | Moderate | High | High | Moderate to high |
| Prototyping speed | High | Low to medium | Medium | Medium |
| Maintenance cost for small teams | Low to moderate | High | High outside Windows | High outside Apple |
| Suitability for a teaching-friendly SDK | High | Low to medium | Low | Low to medium |
| Current fit for Shimera | Excellent | Not a priority | Not aligned | Not aligned |

Decision:
- OpenGL remains the most coherent choice for Shimera's current objectives: portability, clear shader pipeline, simplified abstraction.
- Vulkan could be reconsidered later, but its complexity cost (explicit synchronization, descriptors, boilerplate) is too high for our current phase.
- Direct3D is technically very solid, but its Windows orientation does not align with our immediate multi-platform objective.
- Metal is performant in the Apple ecosystem, but its platform scope does not match our current multi-platform target.

sources:
- OpenGL, Vulkan and Direct3D (documentation): https://blog.replaybird.com/graphic-apis-best-alternatives/
- OpenGL, Vulkan, Direct3D and Metal (documentation): https://gist.github.com/MangaD/b24f4e3052ff7854c6fa5074f22bc9b2
- OpenGL, Vulkan, Direct3D and Metal (documentation): https://techbuzzonline.com/graphics-api-comparison-game-developers-beginners-guide/#google_vignette

## Comparative Brief 3: Supported Libraries Around OpenGL

### SFML vs SDL3 vs raylib

| Criterion | SFML | SDL3 | raylib |
| --- | --- | --- | --- |
| 2D drawing ergonomics | Very high | Medium | High |
| OpenGL interop | Simple | Complex | Simple |
| API verbosity | Low | Medium | Low |
| Ecosystem maturity | High | Very high | High |

Decision:
- SFML is the library on which we have had our first successes and which best matches our current abstraction.
- raylib is excellent as it allows us to demonstrate our shaders on both 2D and 3D examples.
- SDL3 is an interesting secondary option to reach a wider audience, but it is not in our short-term objectives due to some more complex OpenGL interop issues.
- Retained strategy: SFML and raylib as priorities to maximize pedagogical clarity and delivery speed.

Sources:
- SFML and OpenGL (documentation): https://www.sfml-dev.org/tutorials/2.6/window-opengl.php
- SFML and SDL3 (documentation): https://junkangworld.com/blog/sdl-vs-sfml-which-c-game-library-is-right-for-you
- SDL, OpenGL (documentation): https://wikis.khronos.org/opengl/Tutorial1:_Creating_a_Cross_Platform_OpenGL_3.2_Context_in_SDL_(C_/_SDL)
- SDL, OpenGL (documentation): https://documentation.help/SDL/guidevideoopengl.html
- SDL, OpenGL (documentation): https://lazyfoo.net/tutorials/SDL/50_SDL_and_opengl_2/index.php

## Comparative Brief 4: Build System

### xmake vs CMake

| Criterion | xmake | CMake |
| --- | --- | --- |
| Onboarding speed | High | Medium |
| Readability (small/medium project) | High | Medium |
| Ecosystem and CI ubiquity | Medium | Very high |
| Current usage in Shimera core | Yes | Partial (learning folders) |
| Configuration verbosity | Low | Medium to high |
| Interoperability with external projects | Medium | Very high |

Decision:
- xmake appears to us as a modern build tool, fast to onboard, and perfectly suited to our project.
- CMake remains an important skill to document for users who might want to integrate Shimera into projects using CMake, but we decided not to adopt it as the primary build system for simplicity and ease of use of xmake in our context.

sources:
- xmake vs CMake (documentation): https://stackshare.io/stackups/cmake-vs-xmake

## Comparative Brief 5: Shader Languages

### GLSL vs HLSL vs Metal Shading Language

| Criterion | GLSL | HLSL | MSL |
| --- | --- | --- | --- |
| Native compatibility with OpenGL | Excellent (native language) | Indirect (translation required) | No (Apple ecosystem) |
| Immediate portability Linux/Windows/macOS | High via OpenGL | Medium (primarily Direct3D focused) | Low outside Apple |
| Integration cost in Shimera today | Low | High | High |
| Long-term maintenance cost | Low to moderate | High (conversion pipeline/testing) | High (platform-specific code) |
| Learning curve for team and users | Low to moderate | Moderate | Moderate |
| Risk of visual divergence between backends | Low | Higher | Higher |

Decision:
- GLSL is retained because it offers the best simplicity/portability/reliability ratio for Shimera.
- DirectX and Metal are not part of our short-term objectives.
- Since we chose OpenGL as the technical foundation, GLSL is the most logical and coherent choice.
- GLSL is directly executed by the OpenGL pipeline: fewer intermediate layers, fewer points of failure, faster debugging.
- HLSL and MSL do not provide decisive gains for our current scope, but significantly increase maintenance costs (translation, multi-platform validation, rendering differences).
- A multi-shader-language strategy could be considered later if we decide to support DirectX/Metal backends, but this is not in our current scope.

sources:
- GLSL, HLSL and MSL (documentation): https://alain.xyz/blog/a-review-of-shader-languages
- GLSL, HLSL and MSL (documentation): https://pulsegeek.com/articles/slang-glsl-and-hlsl-shader-formats-compared/
