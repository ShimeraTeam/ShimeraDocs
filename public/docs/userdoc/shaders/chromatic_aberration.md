# Chromatic Aberration Effect

**Class:** `shimera::ChromaticAberration`  
**Header:** `effects/ChromaticAberration.hpp`  
**Implementation:** `src/effects/ChromaticAberration.cpp`  
**Shader:** `res/shader/postprocessing/chromatic_aberration.slang`

## Description

The Chromatic Aberration effect simulates a lens that does not focus every wavelength at the same place, by spreading the red, green and blue channels apart. It creates colorful fringes along high-contrast edges, commonly seen with old lenses, in sci-fi interfaces, or as an impact effect.

The image is sampled several times along a short line: samples at one end are weighted toward red, samples in the middle toward green, and samples at the other end toward blue. The line can either have the same direction everywhere (linear mode) or point away from the center of the screen (radial mode, like a real lens).

## Constructor

```cpp
explicit ChromaticAberration(float strength = 1.0f,
                             bool radius = false,
                             float contrast = 2.0f,
                             int samples = 20);
```

## Parameters

| Parameter | Setter / Getter | Type | Range | Default | Effect |
|-----------|-----------------|------|-------|---------|--------|
| `strength` | `withStrength()` / `getStrength()` | float | `0.0` to `1.0+` | `1.0` | Distance between the color channels |
| `radius` | `withRadius()` / `getRadius()` | bool | `true` / `false` | `false` | `false` = linear, `true` = radial from the center |
| `contrast` | `withContrast()` / `getContrast()` | float | `0.5` to `3.0+` | `2.0` | How sharply the channels are separated |
| `samples` | `withSamples()` / `getSamples()` | int | `1` to `64` | `20` | Number of samples, quality versus performance |

### Parameter Values

- **`strength`**:
  - `0.0` - No aberration
  - `0.3` - Subtle color fringing
  - `0.5` - Noticeable effect
  - `1.0` - Strong separation
  - `> 1.0` - Extreme separation

- **`radius`**:
  - `false` - Linear: the channels are shifted diagonally, by the same amount over the whole screen
  - `true` - Radial: no shift at the center of the screen, growing toward the edges, like a real lens

- **`contrast`**:
  - `1.0` - Soft blending between the channels
  - `2.0` - Clearly separated channels (default)
  - `3.0+` - Very sharp, saturated fringes

- **`samples`**:
  - `5` - Very fast, visible banding
  - `10` - Good balance
  - `20` - High quality (default)
  - `30+` - Very high quality, slower
  - Values below `1` are treated as `1`. Raise it along with `strength`, otherwise the individual samples become visible.

## Usage

![Complete Example](../../res/shaders/chromaticAberration.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::ChromaticAberration>();

fx.get<shimera::ChromaticAberration>()
  .withStrength(0.5f)
  .withRadius(true)
  .withContrast(2.0f)
  .withSamples(20);

// Every frame, after drawing the scene into the host target
fx.render(scene);
```

### Impact Effect

A short burst of aberration that fades out, for example when the player is hit:

```cpp
auto& aberration = fx.get<shimera::ChromaticAberration>();

// when the player is hit
aberration.withStrength(1.5f);

// every frame
aberration.withStrength(std::max(0.0f, aberration.getStrength() - deltaTime * 3.0f));
```

See [Shaders & Effects](./index.md#complete-example-sfml) for a complete program.
