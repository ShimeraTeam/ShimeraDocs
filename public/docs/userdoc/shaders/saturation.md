# Saturation Effect

**Class:** `shimera::Saturation`  
**Header:** `effects/Saturation.hpp`  
**Implementation:** `src/effects/Saturation.cpp`  
**Shader:** `res/shader/postprocessing/saturation.slang`

## Description

The Saturation effect controls how vivid the colors are, by interpolating between a grayscale version of the image and its original colors. It goes from pure black & white to oversaturated colors. The result is clamped to the `[0, 1]` range, and the alpha channel is left untouched.

The grayscale value of a pixel is its luminance, computed with the Rec. 709 weights (`0.2126 R + 0.7152 G + 0.0722 B`), so brightness differences are preserved when colors are removed.

## Constructor

```cpp
explicit Saturation(float saturationFactor = 1.2f);
```

## Parameters

| Parameter | Setter / Getter | Type | Range | Default | Effect |
|-----------|-----------------|------|-------|---------|--------|
| `saturationFactor` | `withSaturationFactor()` / `getSaturationFactor()` | float | `0.0` to `2.0+` | `1.2` | Saturation intensity |

### Parameter Values

- **`0.0`** - Completely desaturated (black & white)
- **`0.0`** to **`1.0`** - Partially desaturated, muted colors
- **`1.0`** - No change
- **`> 1.0`** - Oversaturated, more vivid colors (e.g. `1.5` = 50% more saturated)
- **`< 0.0`** - Pushes each color toward its complementary hue

## Usage

![Complete Example](../../res/shaders/saturation.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::Saturation>(1.5f);

// Change it later
fx.get<shimera::Saturation>().withSaturationFactor(0.6f);

// Every frame, after drawing the scene into the host target
fx.render(scene);
```

### Grayscale

There is no dedicated grayscale effect anymore: a saturation factor of `0.0` gives the same black & white result.

![Grayscale](../../res/shaders/grayscale.gif)

```cpp
fx.add<shimera::Saturation>(0.0f);
```

Animating the factor between `1.0` and `0.0` gives a smooth fade to black & white, for example when the player loses health:

```cpp
auto& saturation = fx.get<shimera::Saturation>();
// every frame
saturation.withSaturationFactor(health / maxHealth);
```

See [Shaders & Effects](./index.md#complete-example-sfml) for a complete program.
