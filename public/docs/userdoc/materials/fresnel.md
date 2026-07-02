# Fresnel Effect

**Header:** `include/effects/materials/FresnelEffect.hpp`\
**Implementation:** `src/effects/materials/FresnelEffect.cpp`\
**Shaders:** `res/shader/material/fresnel.vert`, `res/shader/material/fresnel.frag`

## Description

The Fresnel effect is a **material** that highlights the surface of a 3D object based on the viewing angle. Surfaces facing away from the camera (the silhouette / grazing angles) glow, while surfaces facing the camera stay dark. This is the classic look behind **rim lighting**, **force fields**, **holograms**, **energy shields**, and the glowing edge of glass or water.

It reproduces the real-world Fresnel phenomenon (surfaces get more reflective at grazing angles) using Schlick's approximation:

```
fresnel = reflectance + (1 - reflectance) * pow(1 - dot(N, V), power)
```

where `N` is the surface normal and `V` is the direction toward the camera. The result is `~0` head-on and `~1` at the silhouette, then tinted by your color and scaled by intensity.

::: tip This is a material, not a post-process
Fresnel is applied to a **mesh** as it is drawn, not to the final image. If you haven't set up materials yet, read [Material Shaders](./material_shaders.md) first, it covers backends, meshes, cameras, transforms, and the render call. This page only documents the Fresnel-specific parameters.
:::

## Parameters

| Builder | Uniform | Type | Default | Effect |
|---------|---------|------|---------|--------|
| `withColor` | `u_color` | Vec3&lt;float&gt; | `(0.3, 0.7, 1.0)` | Color of the rim glow (RGB, 0–1) |
| `withPower` | `u_power` | float | `3.0` | Falloff sharpness, how quickly the glow appears toward the edge |
| `withReflectance` | `u_reflectance` | float | `0.04` | Base reflectance when looking head-on (the "F0" term) |
| `withIntensity` | `u_intensity` | float | `1.5` | Overall multiplier applied to the effect |

### Parameter Values

- **`withColor`**: the glow color.

- **`withPower`**: controls how wide the rim is:
  - `1.0` - `2.0`: wide, soft glow covering much of the surface
  - `3.0`: balanced rim (default)
  - `5.0`+: thin, sharp edge highlight

- **`withReflectance`**: how much the surface glows when facing you directly:
  - `0.0`: fully dark head-on, glow only at the silhouette
  - `0.04`: a faint base glow (default, dielectric-like)
  - `0.2`+: the whole surface picks up noticeable color

- **`withIntensity`**: scales the final result. Raise it to make the rim brighter/more saturated, lower it for a subtle effect. Values above `1.0` push the rim toward white/over-bright.

## Flat vs. curved surfaces

Because Fresnel depends on the surface normal, it behaves very differently on curved and flat geometry:

- **Curved surfaces** (spheres) have continuously varying normals, so you get a smooth gradient, a solid-looking object with a bright glowing rim.
- **Flat faces** (cubes) share a single normal per face, so the whole face gets one near-`0` value: the faces are nearly invisible and only the **edges** glow. This is expected Fresnel behavior, not a bug.

The shader outputs `alpha = fresnel`, so under alpha blending a flat face is mostly transparent. If you want a box to read as solid, give it a base color underneath (mix a base color into the shader, or draw a base pass first) rather than relying on Fresnel alone (currently no base materials is available).

## Usage

### Basic Usage (Raylib)

```cpp
#include "raylib.h"
#include <shimera.h>
#include "backend/BackendFactory.hpp"
#include "backend/raylib/RaylibMesh.hpp"
#include "backend/raylib/converts/RaylibCamera.hpp"
#include "effects/materials/FresnelEffect.hpp"

int main() {
    InitWindow(960, 540, "Shimera - Fresnel Demo");

    Camera3D camera = { 0 };
    camera.position   = { 6.0f, 4.0f, 6.0f };
    camera.target     = { 0.0f, 0.0f, 0.0f };
    camera.up         = { 0.0f, 1.0f, 0.0f };
    camera.fovy       = 45.0f;
    camera.projection = CAMERA_PERSPECTIVE;

    shimera::IBackend *backend = shimera::BackendFactory::create();

    Model model = LoadModelFromMesh(GenMeshSphere(1.5f, 48, 48));
    shimera::RaylibMesh mesh(model);

    shimera::FresnelEffect fresnel(backend);
    fresnel.withColor(shimera::Vec3(0.3f, 0.7f, 1.0f))
           .withPower(3.0f)
           .withReflectance(0.04f)
           .withIntensity(1.5f);
    fresnel.setTransform(shimera::Vec3(0.0f, 0.0f, 0.0f));

    SetTargetFPS(60);
    while (!WindowShouldClose()) {
        UpdateCamera(&camera, CAMERA_THIRD_PERSON);
        shimera::Camera shCam = shimera::RaylibCamera::toShimera(camera);

        BeginDrawing();
            ClearBackground(BLACK);
            BeginMode3D(camera);
                fresnel.render(mesh, shCam);                // glowing rim on the sphere
                DrawCube({5, 0, 0}, 2.0f, 2.0f, 2.0f, RED);  // untouched Raylib object
            EndMode3D();
        EndDrawing();
    }

    UnloadModel(model);
    delete backend;
    CloseWindow();
    return 0;
}
```

### OpenGL

The Fresnel material works identically on OpenGL, only the mesh creation and camera differ (arrays via `createMesh`, camera via `CameraFactory`), and you enable depth testing yourself. See the [Material Shaders](./material_shaders.md#complete-example-opengl) overview for the full OpenGL skeleton, then configure the material exactly as above:

```cpp
FresnelEffect fresnel(backend);
fresnel.withColor(Vec3(0.3f, 0.6f, 1.0f))
       .withPower(3.0f)
       .withReflectance(0.04f)
       .withIntensity(1.5f);
```

## Backend Compatibility

| Backend | Fresnel |
|---------|---------|
| ✅ **OpenGL** (GLFW, SDL) | Supported |
| ✅ **Raylib** | Supported (composes with your Raylib scene) |
| ⏳ **SFML** | Not available (materials are not integrated on the 2D backend yet) |

> Fresnel is a 3D material and needs a perspective camera. See [Material Shaders → Backend Compatibility](./material_shaders.md#backend-compatibility) for details.

## See Also

- [Material Shaders](./material_shaders.md): the material system, setup, and shared API
