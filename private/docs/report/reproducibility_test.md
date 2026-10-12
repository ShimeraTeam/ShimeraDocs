# Reproducibility Test

## Objective

Verify that a person outside the project can install the Shimera library and set it up in their own project **using only our documentation**, on a clean machine, without any help from the team.

## Test Protocol

| Item | Details |
| --- | --- |
| **Tester** | A 3rd-year Epitech student, not involved in the Shimera project |
| **Machine** | Clean machine (Shimera never installed before) |
| **Resources allowed** | Shimera documentation only |
| **Task** | Install the library, link it to a new project and display a scene with Shimera shaders applied |

The team did not intervene during the test. The tester's blocking points were noted, then discussed with her at the end of the session.

## Results

### Time Taken

**About 20 minutes** to go from a clean machine to a working project with Shimera installed and shaders applied to the scene.

### Blocking Points

| # | Blocking point | Description |
| --- | --- | --- |
| 1 | **Linking the library to the project** | Once the library was installed on her computer, the tester did not know how to link it to her own project. The documentation did not clearly explain how to reference the installed library from the user's build configuration. |
| 2 | **Organizing the scene** | The tester did not know where to place her scene's draw calls so that the shaders would be applied to it. The documentation did not make it clear which part of the code had to be "captured" by Shimera. |

Apart from these two points, the tester did not encounter any other difficulties: the installation itself (dependencies, build) went smoothly.

## Fixes Applied

### 1. Linking the Library

- **Clearer and more complete documentation**: the installation section was rewritten to explain, step by step, how to link the installed library to an existing project (build configuration, include paths, linking), with a full example.
- **Future improvement – xmake package**: we discussed publishing Shimera to the **xmake package repository** (xmake-repo). Once done, installing and linking will come down to a single declaration in the user's `xmake.lua`, handled by the package manager:

```lua
add_requires("shimera")

target("my_project")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("shimera")
```

This is planned for later and will remove most of the manual installation steps.

### 2. Organizing the Scene

To make it obvious where the scene must be drawn, we decided to introduce **explicit bounds** in the API: `scene->begin()` and `scene->end()`. Everything drawn between these two calls is captured by Shimera and has the shaders applied to it.

```cpp
scene->begin();
    // Draw your scene here: everything between begin() and end()
    // is captured and processed by Shimera's shaders.
scene->end();
```

This structure makes the expected usage self-explanatory, even before reading the documentation, and removes the ambiguity the tester ran into.

## Summary

| Item | Result |
| --- | --- |
| Time to install and set up | ~20 minutes |
| Blocking points | 2 (library linking, scene organization) |
| Documentation changes | Clearer, more complete installation and linking guide |
| API changes | `scene->begin()` / `scene->end()` bounds to delimit the scene |
| Planned improvement | Publish Shimera to the xmake package repository |
