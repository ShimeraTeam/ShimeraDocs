# **{Shimera} Technical Environment**
> A guide to understand the project's technical environment.

## Table of Contents
1. [Libraries & Tools](#libraries-tools)
2. [Architecture & Deployment](#architecture-deployment)
3. [Hardware Requirements](#hardware-requirements)

## Libraries & Tools
---

For the development of Shimera, we use several libraries, SDKs, or other tools that are essential for the proper functioning of the project.

For programming our software architecture, we use the C++ language.

For the main interaction between the graphics hardware and our library, here is a list of the main libraries and tools used:

- **OpenGL**: A graphics API for 2D and 3D rendering that we manipulate to display graphical elements.
- **Vulkan**: A graphics API for 2D and 3D rendering as an alternative to OpenGL.
- **GLSL**: A shading language mainly used for OpenGL, allowing us to create shaders for visual effects.
- **CMake**: A build management tool that allows us to handle dependencies and compile our project.
- **ApiTrace**: An API tracing tool that allows us to track API calls and debug issues related to the graphics API.

## Architecture & Deployment
---

Regarding the deployment of Shimera, as an open-source SDK library, we will use GitHub to host the source code. Users can either clone the repository or download a compiled version of the library to integrate into their projects.

The compiled version will include a `.so` file (for Linux) and a `.dll` file (for Windows) that can be directly used in projects, along with the definitions of symbols present in the library.

## Hardware Requirements
---

To run our library, several prerequisites are necessary:

1. **System Requirements**

    - **Compatible OS**

        - Windows 10/11 (64-bit)
        - Linux (Ubuntu 22, Fedora 41, etc.)
        - macOS Silicon*

    - **Graphics Card**

        - OpenGL 3.3+ compatible
        - Metal compatible*
        - Vulkan compatible*

2. **Software Requirements**

    - **C/C++ Compiler**
        - Linux/macOS: GCC, Clang, or LLVM
        - Windows: MSVC (via Visual Studio 2022), MINGW, Clang, or LLVM

    - **CMake ≥ 3.20**
        To manage multi-platform configuration

    - **Recent graphics library (e.g.)**
        - **SDL3**
        - **SFML3**
        - **...**

3. **External dependencies (related to SHIMERA)**

    - **OpenGL**

> (*) Implementation of these elements is considered optional for the final operation of the library.