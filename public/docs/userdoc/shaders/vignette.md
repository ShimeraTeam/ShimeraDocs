# Vignette Effect

**Class:** `shimera::Vignette`  
**Header:** `effects/Vignette.hpp`  
**Implementation:** `src/effects/Vignette.cpp`  
**Shader:** `res/shader/postprocessing/vignette.slang`

## Description

The Vignette effect darkens the edges of the screen while keeping the center untouched. It draws the eye to the middle of the screen and gives a cinematic feel. The vignette color can be changed (a red vignette for damage feedback, for example), and its shape can either follow the screen's proportions or be a perfect circle.

The screen resolution, needed for the circular shape, is given by the pipeline automatically. There is nothing to set when the window is resized.

## Constructor

```cpp
explicit Vignette(float strength = 1.0f,
                  float radius = 0.5f,
                  float gap = 0.3f,
                  Vec4<float> color = Vec4(0.0f, 0.0f, 0.0f, 1.0f),
                  bool rounded = false);
```

## Parameters

| Parameter | Setter | Type | Range | Default | Effect |
|-----------|--------|------|-------|---------|--------|
| `strength` | `withStrength()` | float | `0.0` to `1.0` | `1.0` | Opacity of the vignette color at its darkest |
| `radius` | `withRadius()` | float | `0.0` to `1.0` | `0.5` | Distance from the center where the vignette starts |
| `gap` | `withGap()` | float | `0.0` to `1.0` | `0.3` | Width of the fade, from `radius` to full strength |
| `color` | `withColor()` | Vec4&lt;float&gt; | RGBA, `0` to `1` | `(0, 0, 0, 1)` | Vignette color |
| `rounded` | `withRounded()` | bool | `true` / `false` | `false` | `false` = follows the screen's shape, `true` = perfect circle |

Only `getStrength()` is available as a getter.

### Parameter Values

Distances are measured from the center of the screen, in screen units: the center is at `0.0`, the middle of each edge at `0.5`, and the corners at about `0.7`.

- **`strength`**:
  - `0.0` - No vignette
  - `0.5` - The edges get halfway to the vignette color
  - `1.0` - The edges fully reach the vignette color
  - `> 1.0` - The vignette color is reached before the end of the fade, giving a harsher edge

- **`radius`**:
  - `0.3` - Tight vignette, starts close to the center
  - `0.5` - Standard, starts at the middle of the edges
  - `0.7` - Loose vignette, only the corners are affected

- **`gap`**:
  - `0.1` - Sharp transition
  - `0.3` - Smooth transition
  - `0.6` - Very gradual transition

- **`color`**:
  - `(0, 0, 0, 1)` - Black vignette (standard)
  - `(1, 0, 0, 1)` - Red vignette (damage, danger)
  - `(0.1, 0.2, 0.5, 1)` - Blue vignette (cold, night)
  - Only the RGB components are used: the alpha component is ignored. Use `strength` to make the vignette more transparent.

- **`rounded`**:
  - `false` - The vignette is stretched to the screen's proportions: an ellipse on a widescreen display
  - `true` - The vignette is a perfect circle, whatever the screen's proportions

## Usage

### Basic Usage

![Complete Example](../../res/shaders/vignette.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::Vignette>();

fx.get<shimera::Vignette>()
  .withStrength(0.8f)
  .withRadius(0.3f)
  .withGap(0.1f)
  .withColor(shimera::Vec4(0.0f, 0.0f, 0.0f, 1.0f))
  .withRounded(false);

// Every frame, after drawing the scene into the host target
fx.render(scene);
```

### Damage Feedback

A red, circular vignette that fades out over time:

```cpp
fx.add<shimera::Vignette>(0.0f, 0.35f, 0.4f, shimera::Vec4(0.8f, 0.0f, 0.0f, 1.0f), true);
auto& damage = fx.get<shimera::Vignette>();

// when the player is hit
damage.withStrength(1.0f);

// every frame
damage.withStrength(std::max(0.0f, damage.getStrength() - deltaTime * 2.0f));
```

See [Shaders & Effects](./index.md#complete-example-sfml) for a complete program.
