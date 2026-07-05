# Atmospheric Scattering Effect

**Header:** `include/effects/AtmosphericScatteringEffect.hpp`  
**Implementation:** `src/effects/AtmosphericScatteringEffect.cpp`  
**Shader:** `res/shader/postprocessing/atmospheric_scattering.frag`

## Description

The Atmospheric Scattering effect renders a physically-inspired planetary atmosphere as a post-process. It ray-marches through a spherical atmosphere shell around a planet, accumulating in-scattered sunlight to produce a glowing halo, a day/night terminator, and wavelength-dependent sky color (blue skies, reddish sunsets).

Unlike the other effects, this one is **3D-only**: it reconstructs world-space view rays from the camera and reads the scene **depth buffer** to know where solid geometry occludes the atmosphere. You provide high-level camera and planet information, the library builds the required matrices internally, so you never touch any matrix math.

::: warning 3D-only effect
This effect requires a perspective camera and a sampleable depth buffer, so it is **not available on the SFML (2D) backend**. Use the **OpenGL** or **Raylib** backends. The scene framebuffer must be created with depth sampling enabled (`createFrameBuffer(width, height, true)`).
:::

## Parameters

### Planet & Atmosphere

| Parameter | Type | Default | Effect |
|-----------|------|---------|--------|
| Planet center | Vec3&lt;float&gt; | `(0, 0, 0)` | World-space center of the planet |
| Planet radius | float | `100.0` | Radius of the solid planet surface |
| Atmosphere radius | float | `120.0` | Outer radius of the atmosphere shell (must be &gt; planet radius) |
| `m_uDensityFalloff` | float | `4.0` | How quickly air density drops with altitude |
| `m_uScatterCoefficients` | Vec3&lt;float&gt; | `(5.5, 13.0, 22.4)` | Per-channel (RGB) scattering strength, drives sky color |

### Lighting

| Parameter | Type | Default | Effect |
|-----------|------|---------|--------|
| Sun direction | Vec3&lt;float&gt; | `(0, 1, 0)` | Direction toward the sun (normalized internally) |

### Quality

| Parameter | Type | Default | Effect |
|-----------|------|---------|--------|
| Optical depth samples | int | `16` | Samples along sun rays (clamped to &ge; 2) |
| In-scattering points | int | `16` | Samples along the view ray (clamped to &ge; 2) |

### Camera

These are normally synced from your scene camera every frame rather than set once.

| Parameter | Type | Default | Effect |
|-----------|------|---------|--------|
| `m_uCameraPos` | Vec3&lt;float&gt; | `(0, 0, 0)` | Camera world position |
| `m_uCameraTarget` | Vec3&lt;float&gt; | `(0, 0, 0)` | Point the camera looks at |
| `m_uCameraUp` | Vec3&lt;float&gt; | `(0, 1, 0)` | Camera up vector |
| `m_fovYDegrees` | float | `45.0` | Vertical field of view, in degrees |
| `m_aspect` | float | `16/9` | Viewport aspect ratio (width / height) |
| `m_uNear` | float | `0.1` | Camera near plane (must match the scene's) |
| `m_uFar` | float | `1000.0` | Camera far plane (must match the scene's) |

### Parameter Values

- **Atmosphere radius** must be larger than the planet radius. A ratio of roughly `1.2`–`2.0x` the planet radius gives a believable atmosphere thickness.

- **`m_uDensityFalloff`**:
  - `1.0` - Thick, hazy atmosphere reaching high altitude
  - `4.0` - Balanced falloff (default)
  - `10.0+` - Thin atmosphere hugging the surface

- **`m_uScatterCoefficients`** controls the color of the sky. Higher values scatter more of that channel. The default `(5.5, 13.0, 22.4)` scatters blue most strongly (Rayleigh-like), giving blue daytime skies and warm sunsets near the terminator.

- **Quality** (optical depth samples, in-scattering points) is the main performance/quality dial, cost grows with the product of the two. `16 x 16` is a good balance; lower for performance, raise for smoother gradients.

::: tip Match the camera to your scene
The scene's depth buffer is filled using your engine's projection. For correct occlusion, keep `m_fovYDegrees`, `m_aspect`, `m_uNear`, and `m_uFar` in sync with the camera you render the scene with.
:::

## Usage

### Basic Usage (Raylib)

![Example](../../res/shaders/atmospheric_scattering.gif)

```cpp
#include "raylib.h"
#include <GL/glew.h>
#include <shimera.h>
#include "backend/BackendFactory.hpp"
#include "effects/AtmosphericScatteringEffect.hpp"

using namespace shimera;

int main() {
    const int screenWidth = 960;
    const int screenHeight = 540;

    InitWindow(screenWidth, screenHeight, "Atmospheric Scattering Demo");
    glewInit();

    Camera camera = { 0 };
    camera.position = { 10.0f, 10.0f, 10.0f };
    camera.target   = { 0.0f, 0.0f, 0.0f };
    camera.up       = { 0.0f, 1.0f, 0.0f };
    camera.fovy     = 25.0f;
    camera.projection = CAMERA_PERSPECTIVE;

    Vector3 planetPosition = { 0.0f, 0.0f, 0.0f };

    IBackend *backend = BackendFactory::create();

    // Depth sampling MUST be enabled for this effect (third argument = true)
    IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(screenWidth, screenHeight, true);

    AtmosphericScatteringEffect atmo(backend);
    atmo.withPlanet({0, 0, 0}, 1.0f, 1.6f)   // center, planet radius, atmosphere radius
        .withSun({1.0f, 1.0f, 0.0f})          // direction toward the sun
        .withQuality(16, 16);

    SetTargetFPS(60);

    while (!WindowShouldClose()) {
        // Sync the effect's camera with the scene camera each frame
        atmo.m_uCameraPos = Vec3(camera.position.x, camera.position.y, camera.position.z);
        atmo.m_uCameraTarget = Vec3(camera.target.x, camera.target.y, camera.target.z);
        atmo.m_uCameraUp = Vec3(camera.up.x, camera.up.y, camera.up.z);
        atmo.m_fovYDegrees = camera.fovy;
        atmo.m_aspect = (float)screenWidth / screenHeight;

        atmo.withDepth(sceneFramebuffer->getDepthTexture());

        // 1. Render the 3D scene into the depth-enabled framebuffer
        sceneFramebuffer->bind();
        sceneFramebuffer->clear(Color{0, 0, 0, 1});
            BeginMode3D(camera);
                DrawSphere(planetPosition, 1.0f, {.r = 53, .g = 88, .b = 29, .a = 255});
            EndMode3D();
        sceneFramebuffer->unbind();

        // 2. Apply the atmosphere (reads scene color + depth automatically)
        BeginDrawing();
            ClearBackground(BLACK);
            atmo.render(sceneFramebuffer->getTexture());
        EndDrawing();
    }

    CloseWindow();
    delete sceneFramebuffer;
    delete backend;
    return 0;
}
```

### Notes

- **Draw your planet at the planet radius.** In the example the sphere is drawn with radius `1.0` to match `withPlanet(..., 1.0f, ...)`, and the atmosphere shell (`1.6`) extends beyond it to form the visible halo.
- **`withDepth()` is required.** Call it with the scene framebuffer's depth texture (`getDepthTexture()`). Forgetting the `true` flag on `createFrameBuffer` will throw a clear error when the depth texture is requested.
