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

After that, we tried to get the context from each graphics library and pass it to our OpenGL library. Then, we tried to apply a post-processing shaders to the context created by each graphics library and render the final output to the screen.

## Results
