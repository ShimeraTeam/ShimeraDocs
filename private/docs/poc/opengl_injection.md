# OpenGL Injection 5 March 2025

## Overview
This document is the result of a POC (Proof of Concept) aimed at demonstrating how to inject OpenGL shaders into an application using SFML/SDL/Raylib while encapsulating all OpenGL calls within a dedicated library. The objective is to prove that we can create a generic library that can be used with multiple graphics libraries without exposing OpenGL details to the end user.

## Technical stack
- **Language**: C++
- **Graphics Libraries**: SFML, SDL, Raylib
- **OpenGL Version**: 3.3 Core Profile
- **Build System**: CMake

## Technical Approach
We started by creating exemplary applications using SFML, SDL, and Raylib. Each application initializes its respective graphics context, window and drawing some basic shapes using their native rendering methods.

Next, we developed a dedicated OpenGL library that encapsulates all OpenGL calls. This library provides a simple API for initializing OpenGL, compiling shaders, and rendering objects. The library is designed to be independent of the graphics library used by the application.

After that, we tried to get the context from each graphics library and pass it to our OpenGL library. Then, we tried to apply a post-processing shaders to the context created by each graphics library and render the final output to the screen using OpenGL to demonstrate that our library can work seamlessly with different graphics libraries.

## Results
The POC was not successful in achieving the desired outcome. While we were able to create the dedicated OpenGL library and compile shaders, we encountered significant challenges when trying to integrate it with the graphics libraries.

1. **Context Management**: Some graphics library manages its own OpenGL context like Raylib, making it difficult to share the context with our OpenGL library. This led to issues where the OpenGL calls made by our library did not affect the rendering done by the graphics libraries.

2. **Version Compatibility**: Its a specific example, SDL don't necessarily use OpenGL to render. It chooses the best backend available on the system (Direct3D, Vulkan, Metal, etc) and if we force it to use OpenGL, we can uses SDL only to create a window, create context and handle input events. This means that all the rendering must be done using OpenGL calls, which defeats the purpose of using SDL's rendering capabilities.

## Conclusion
The POC highlighted the complexities involved in integrating a dedicated OpenGL library with various graphics libraries. While the idea of creating a generic OpenGL injection library is appealing, the practical challenges related to context management and version compatibility make it difficult to achieve seamless integration.

Future work could explore alternative approaches, such as encapsulating rendering logic within each graphics library while still leveraging OpenGL for shader effects. Additionally, further investigation into the specific capabilities and limitations of each graphics library may provide insights into more effective integration strategies.
