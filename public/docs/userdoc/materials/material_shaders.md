# Material Shaders

**Base header:** `include/effects/materials/MaterialEffectBase.hpp`\
**Template base:** `include/effects/materials/MaterialEffect.inl`

## Description

**Material shaders** apply an effect to the **surface of an object** as it is drawn, rather than to a finished 2D image. Where a [post-processing effect](../shaders/index.md) takes the whole rendered frame as a texture and transforms it, a material is bound to a piece of geometry and shades it in place, using that geometry's per-vertex data (positions, normals) and the camera's point of view.

Because materials are drawn as part of the scene, they **compose correctly with everything else you render**: they respect depth, occlude and are occluded by other objects, and move naturally with the camera. You provide a mesh, a camera, and a transform, the library renders the object with the material through the active backend's native pipeline.

A single material shader is written once and works across every dimension specific-backend (a 2D material shader will work in 2D backends but could work in 3D backends too, a 3D material shader will only work in 3D backends). You never touch matrix math or backend-specific shader plumbing, the library builds the model/view/projection matrices and feeds them to the shader for you.

::: warning SFML not integrated yet
The material system is **not inherently 3D-only**. The same architecture can just as well drive 2D surface materials, so a backend like SFML could support materials too. It simply isn't wired up on SFML **yet**: Shimera currently ships no 2D material shaders, so we skipped that integration for now rather than add unused plumbing. Until it lands, calling a material method on the SFML backend throws a clear runtime error.

In practice, the materials available **today** are 3D and need a perspective camera, so use the **OpenGL** or **Raylib** backends.
:::

## How It Works

- **You keep your geometry.** On Raylib you hand the material the `Model` you already have; on OpenGL you upload vertex/normal/index arrays through the backend. Either way you get a backend-agnostic mesh handle.
- **The backend renders natively.** On Raylib the object is drawn through Raylib's own renderer (so it sits inside your `BeginMode3D` scene and depth-tests against other Raylib objects). On OpenGL it is drawn directly with depth testing.
- **One shader, every backend.** The same GLSL is reused everywhere. The backend supplies the standard uniforms (`u_model`, `u_view`, `u_projection`, `u_cameraPos`) automatically; each material only pushes its own parameters.
- **One material, many objects.** A material is reusable: configure it once, then set a transform and render it on as many meshes as you like, every frame.

## Basic Usage Pattern

### 1. Create a Backend
```cpp
#include <shimera.h>
#include "backend/BackendFactory.hpp"

IBackend *backend = BackendFactory::create();
```

### 2. Get a Mesh

The geometry you shade is backend-specific (it's the object you already have), but both paths give you a mesh you can render with any material.

::: code-group
```cpp [OpenGL]
// upload position/normal/index arrays:
IMesh *mesh = backend->createMesh(positions, normals, indices);
```

```cpp [Raylib]
// adopt a native Model (loaded from a file or generated):
#include "backend/raylib/RaylibMesh.hpp"

Model model = LoadModelFromMesh(GenMeshSphere(1.5f, 48, 48));
shimera::RaylibMesh mesh(model);
```
:::

### 3. Create a Material
```cpp
#include "effects/materials/MyMaterialEffect.hpp"

MyMaterialEffect material(backend);
```

### 4. Configure the Material (Optional)

Every material exposes a fluent builder API, plus the shared placement and toggle helpers from `MaterialEffectBase`:
```cpp
material.withSomeParameter(1.0f)
        .withAnotherParameter(0.5f);

material.setTransform(Vec3(0.0f, 0.0f, 0.0f));  // position (+ optional rotation, scale)
```

### 5. Build a Camera

::: code-group
```cpp [OpenGL]
// build a camera from high-level parameters (glm stays internal):
#include "scene/CameraFactory.hpp"

Camera camera = CameraFactory::perspective(
    Vec3(0.0f, 0.0f, 6.0f),   // position
    Vec3(0.0f, 0.0f, 0.0f),   // target
    Vec3(0.0f, 1.0f, 0.0f),   // up
    45.0f, 16.0f / 9.0f, 0.1f, 100.0f);
```

```cpp [Raylib]
// convert your existing `Camera3D`:
#include "backend/raylib/converts/RaylibCamera.hpp"

Camera camera = shimera::RaylibCamera::toShimera(camera3d);
```
:::

### 6. Render the Object
```cpp
material.render(*mesh, camera); // or `*mesh` 
```

- On **OpenGL**, enable depth testing once (`glEnable(GL_DEPTH_TEST)`) and render each frame.
- On **Raylib**, call `render()` **inside** `BeginMode3D(...) / EndMode3D(...)` so the object joins the rest of your 3D scene.

## Shared API (`MaterialEffectBase`)

Every material inherits these members.

### `render`

```cpp
void render(IMesh& mesh, const Camera& camera);
```

Draws `mesh` with the material from the given camera's point of view. The material's current transform (see `setTransform`) positions the object. Does nothing if the material is disabled.

---

### `setTransform`

```cpp
void setTransform(const Vec3<float>& position,
                  const Vec3<float>& rotationEuler = Vec3(0.0f),
                  const Vec3<float>& scale         = Vec3(1.0f));
```

Places, orients, and scales the object in world space. Rotation is in **degrees** (Euler angles). The matrix is built internally, you never handle matrix math. Call it per object between `render()` calls to reuse one material for several objects.

| Parameter | Description |
|-----------|-------------|
| `position` | World-space position of the object |
| `rotationEuler` | Rotation in degrees around X, Y, Z (default: none) |
| `scale` | Per-axis scale (default: `1, 1, 1`) |

---

### `setEnabled` / `isEnabled`

```cpp
void setEnabled(bool enabled);
bool isEnabled() const;
```

Toggle the material on or off. A disabled material's `render()` is a no-op.

---

### Fluent parameter builders

Each concrete material adds its own `withXxx(...)` setters that return `*this`, so they can be chained (see the individual material pages for the parameters each one supports).

```cpp
material.withSomeParameter(2.0f)
        .withAnotherParameter(0.5f);
```

## Backend Compatibility

| Backend | Materials |
|---------|-----------|
| ✅ **OpenGL** | Supported |
| ✅ **Raylib** | Supported (composes with your Raylib scene) |
| ⏳ **SFML** | Not integrated yet, technically possible, skipped until there is a 2D material |

> SFML support was **intentionally deferred**, not ruled out: the architecture would allow a 2D material, but there is no 2D material shader to justify the integration yet. Until then, creating or rendering a material on the SFML backend throws `std::runtime_error` with a clear message, so it fails loudly rather than silently.

## Complete Example (OpenGL)

Replace `MyMaterialEffect` with a concrete material (see the individual material pages).

```cpp
#include <GLFW/glfw3.h>
#include <GL/glew.h>
#include <shimera.h>
#include "backend/BackendFactory.hpp"
#include "scene/CameraFactory.hpp"
#include "effects/materials/MyMaterialEffect.hpp"

using namespace shimera;

int main() {
    // ... create a GLFW window + glewInit() ...

    IBackend *backend = BackendFactory::create();

    // Geometry: upload your vertex data (positions + normals + indices)
    IMesh *mesh = backend->createMesh(positions, normals, indices);

    MyMaterialEffect material(backend);
    material.withSomeParameter(1.0f);
    material.setTransform(Vec3(0.0f, 0.0f, 0.0f));

    glEnable(GL_DEPTH_TEST);

    while (/* window open */) {
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        Camera camera = CameraFactory::perspective(
            Vec3(0.0f, 0.0f, 6.0f), Vec3(0.0f), Vec3(0.0f, 1.0f, 0.0f),
            45.0f, 16.0f / 9.0f, 0.1f, 100.0f);

        material.render(*mesh, camera);

        // ... swap buffers, poll events ...
    }

    delete mesh;
    delete backend;
    return 0;
}
```

## Complete Example (Raylib)

On Raylib the material lives inside your normal `BeginMode3D` scene, so it depth-tests and composes with any other Raylib objects (here, a cube).

```cpp
#include "raylib.h"
#include <shimera.h>
#include "backend/BackendFactory.hpp"
#include "backend/raylib/RaylibMesh.hpp"
#include "backend/raylib/converts/RaylibCamera.hpp"
#include "effects/materials/MyMaterialEffect.hpp"

int main() {
    InitWindow(960, 540, "Shimera - Material Demo");

    Camera3D camera = { 0 };
    camera.position   = { 10.0f, 10.0f, 10.0f };
    camera.target     = { 0.0f, 0.0f, 0.0f };
    camera.up         = { 0.0f, 1.0f, 0.0f };
    camera.fovy       = 25.0f;
    camera.projection = CAMERA_PERSPECTIVE;

    shimera::IBackend *backend = shimera::BackendFactory::create();

    Model model = LoadModelFromMesh(GenMeshSphere(1.5f, 48, 48));
    shimera::RaylibMesh mesh(model);

    shimera::MyMaterialEffect material(backend);
    material.withSomeParameter(1.0f);
    material.setTransform(shimera::Vec3(0.0f, 0.0f, 0.0f));

    SetTargetFPS(60);
    while (!WindowShouldClose()) {
        UpdateCamera(&camera, CAMERA_THIRD_PERSON);
        shimera::Camera shCam = shimera::RaylibCamera::toShimera(camera);

        BeginDrawing();
            ClearBackground(BLACK);
            BeginMode3D(camera);
                material.render(mesh, shCam);              // Shimera material
                DrawCube({5, 0, 0}, 2.0f, 2.0f, 2.0f, RED); // untouched Raylib object
            EndMode3D();
        EndDrawing();
    }

    UnloadModel(model);
    delete backend;
    CloseWindow();
    return 0;
}
```

## Available Materials

See the individual material pages for the effects Shimera ships and the parameters each one exposes.

For now, Shimera provides **1 material effect**:
- [**Fresnel**](./fresnel.md): Highlights surfaces at grazing viewing angles (rim lighting, force fields, holograms)
