# Contrast Effect

**Class:** `shimera::Contrast`  
**Header:** `effects/Contrast.hpp`  
**Implementation:** `src/effects/Contrast.cpp`  
**Shader:** `res/shader/postprocessing/contrast.slang`

## Description

The Contrast effect stretches or compresses the distance between each color channel and the mid-gray value `0.5`. Highlights get brighter and shadows get darker as the factor increases, while mid-tones stay in place. The result is clamped to the `[0, 1]` range, and the alpha channel is left untouched.

Each channel is computed as `(color - 0.5) * contrastFactor + 0.5`.

## Constructor

```cpp
explicit Contrast(float contrastFactor = 1.2f);
```

## Parameters

| Parameter | Setter / Getter | Type | Range | Default | Effect |
|-----------|-----------------|------|-------|---------|--------|
| `contrastFactor` | `withContrastFactor()` / `getContrastFactor()` | float | `0.0` to `2.0+` | `1.2` | Contrast multiplier |

### Parameter Values

- **`0.0`** - Flat, uniform mid-gray image
- **`< 1.0`** - Lower contrast, the image looks washed out (e.g. `0.5` halves the contrast)
- **`1.0`** - No change
- **`> 1.0`** - Higher contrast, more vivid colors (e.g. `1.5` adds 50% contrast)
- **`< 0.0`** - Inverts the image around mid-gray

## Usage

![Complete Example](../../res/shaders/contrast.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::Contrast>(1.5f);

// Change it later
fx.get<shimera::Contrast>().withContrastFactor(0.8f);

// Every frame, after drawing the scene into the host target
fx.render(scene);
```

See [Shaders & Effects](./index.md#complete-example-sfml) for a complete program.
