# Bloom Effect

**Class:** `shimera::Bloom`  
**Header:** `effects/Bloom.hpp`  
**Implementation:** `src/effects/Bloom.cpp`  
**Shader:** `res/shader/postprocessing/bloom.slang`

## Description

The Bloom effect makes the bright areas of the image glow, bleeding light into the surrounding pixels. It is ideal for emissive materials, neon signs, light sources, magic, or a soft dreamy look.

It works in two passes, using an internal framebuffer created and resized by the pipeline (the effect still takes a single slot in the chain):

1. **Bright pass and horizontal blur.** Only the pixels brighter than `threshold` are kept, then blurred horizontally. A pixel's brightness is its brightest color channel.
2. **Vertical blur and composite.** The result is blurred vertically, multiplied by `intensity`, and **added** on top of the original image.

The screen resolution, needed for the blur, is given by the pipeline automatically. There is nothing to set when the window is resized.

::: info Formerly HDR Bloom
This effect replaces the `HDRBloomEffect` of the previous version of the library. The ACES tone mapping step was removed: the glow is now simply added to the image, so very bright areas saturate to white instead of being compressed. Lower `intensity` if the highlights look burnt out.
:::

## Constructor

```cpp
explicit Bloom(float threshold = 0.7f,
               float knee = 0.2f,
               float intensity = 1.0f,
               float blurSigma = 5.0f,
               int blurSamples = 15);
```

## Parameters

| Parameter | Setter / Getter | Type | Range | Default | Effect |
|-----------|-----------------|------|-------|---------|--------|
| `threshold` | `withThreshold()` / `getThreshold()` | float | `0.0` to `1.0` | `0.7` | Brightness above which pixels glow |
| `knee` | `withKnee()` / `getKnee()` | float | `0.0` to `0.5` | `0.2` | Softness of the threshold |
| `intensity` | `withIntensity()` / `getIntensity()` | float | `0.0` to `3.0+` | `1.0` | Strength of the added glow |
| `blurSigma` | `withBlurSigma()` / `getBlurSigma()` | float | `1.0` to `30.0+` | `5.0` | Spread (radius) of the glow |
| `blurSamples` | `withBlurSamples()` / `getBlurSamples()` | int | `5` to `90+` | `15` | Blur samples on each side, quality versus performance |

### Parameter Values

- **`threshold`**:
  - `0.3` - Most of the image glows
  - `0.5` - Moderate glow
  - `0.7` - Only bright areas glow (default)
  - `0.9` - Only the brightest sources glow

- **`knee`**: pixels start glowing at `threshold - knee` and glow fully from `threshold + knee`.
  - `0.0` - Hard cutoff, a pixel either glows or not
  - `0.2` - Smooth transition (default)
  - `0.4+` - Very gradual fade into the glow

- **`intensity`**:
  - `0.0` - No glow
  - `1.0` - Natural glow (default)
  - `1.5` to `3.0` - Strong glow
  - `> 3.0` - Glowing areas turn white

- **`blurSigma`**:
  - `5.0` - Tight halo around the sources (default)
  - `15.0` - Medium, soft glow
  - `30.0+` - Large, diffuse aura

- **`blurSamples`**:
  - Rule of thumb: `blurSamples ≈ 2 to 3 × blurSigma`. Fewer samples cut the glow off abruptly and cause banding.
  - `15` - Fast, enough for the default sigma
  - `30` - Good balance for a medium glow
  - `60` - High quality
  - `90+` - Maximum quality, slower

## Usage

![Complete Example](../../res/shaders/hdr-bloom.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::Bloom>();

fx.get<shimera::Bloom>()
  .withThreshold(0.7f)
  .withKnee(0.2f)
  .withIntensity(1.5f)
  .withBlurSigma(15.0f)
  .withBlurSamples(30);

// Every frame, after drawing the scene into the host target
fx.render(scene);
```

Or with the constructor parameters:

```cpp
fx.add<shimera::Bloom>(0.7f, 0.2f, 1.0f, 10.0f, 30); // threshold, knee, intensity, blurSigma, blurSamples
```

::: tip Order in the pipeline
Put the bloom before effects that darken or recolor the image (Vignette, Saturation, ...), so the glow is affected by them, and after effects that move pixels (Distortion, ...), so the glow follows the distorted image.
:::

See [Shaders & Effects](./index.md#complete-example-sfml) for a complete program.
