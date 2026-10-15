# Gaussian Blur Effect

**Class:** `shimera::GaussianBlur`  
**Header:** `effects/GaussianBlur.hpp`  
**Implementation:** `src/effects/GaussianBlur.cpp`  
**Shader:** `res/shader/postprocessing/gaussian_blur.slang`

## Description

The Gaussian Blur effect applies a smooth blur to the image, weighting neighboring pixels with a true Gaussian curve. It is commonly used for frosted glass UI backgrounds, pause menus, depth of field approximations or general image smoothing.

The blur is separable: it runs a horizontal pass into an internal framebuffer, then a vertical pass into the output. This costs `2 × (2 × samples + 1)` texture reads per pixel instead of `(2 × samples + 1)²` for a single-pass blur. The internal framebuffer is created and resized by the pipeline, and the effect still takes a single slot in the chain.

## Constructor

```cpp
explicit GaussianBlur(float sigma = 3.0f,
                      int samples = 10,
                      Vec2<float> resolution = Vec2(1920.0f, 1080.0f));
```

## Parameters

| Parameter | Setter / Getter | Type | Range | Default | Effect |
|-----------|-----------------|------|-------|---------|--------|
| `sigma` | `withSigma()` / `getSigma()` | float | `0.5` to `30.0+` | `3.0` | Standard deviation of the Gaussian curve (blur strength) |
| `samples` | `withSamples()` / `getSamples()` | int | `3` to `60+` | `10` | Kernel radius in pixels (neighbors read on each side) |
| `resolution` | `withResolution()` / `getResolution()` | Vec2&lt;float&gt; | output size | `(1920, 1080)` | Size of the output in pixels |

::: warning Set the resolution
Unlike most effects, Gaussian Blur does **not** take its resolution from the pipeline. `resolution` sets the size of one pixel step, so if it does not match your output, the blur is wider or narrower than expected (and not by the same amount horizontally and vertically). Set it when adding the effect, and again whenever the window is resized:

```cpp
fx.resize(width, height);
fx.get<shimera::GaussianBlur>().withResolution(shimera::Vec2(float(width), float(height)));
```
:::

### Parameter Values

- **`sigma`**:
  - `1.0` to `2.0` - Subtle softening (anti-aliasing, hint of blur)
  - `3.0` to `5.0` - Moderate blur (image still readable)
  - `8.0` to `15.0` - Strong blur (shapes recognizable, details lost)
  - `20.0+` - Very strong blur (color blobs only)

- **`samples`**:
  - Rule of thumb: `samples ≥ 3 × sigma`
  - Below this threshold the Gaussian curve is cut off and the blur shows visible square-shaped artifacts at high-contrast edges.
  - Above `3 × sigma`, the extra samples have near-zero weights and only cost GPU time.

- **`resolution`**:
  - Must be the size, in pixels, of the output the pipeline renders into (the same size you gave to `EffectPipeline`).

### Recommended Combinations

| Use case | Sigma | Samples |
|---|---|---|
| Light softening | 1.5 | 5 |
| Subtle depth of field | 3.0 | 9 |
| Standard UI blur | 5.0 | 15 |
| Frosted glass | 8.0 | 24 |
| Heavy blur | 12.0 | 36 |
| Extreme | 20.0 | 60 |

## Usage

![Complete Example](../../res/shaders/gaussian-blur.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::GaussianBlur>(5.0f, 15, shimera::Vec2(960.0f, 540.0f)); // sigma, samples, resolution

// Every frame, after drawing the scene into the host target
fx.render(scene);
```

### Blurred Pause Menu

Add the blur once, keep it disabled during gameplay, and turn it on when the game is paused:

```cpp
fx.add<shimera::GaussianBlur>(8.0f, 24, shimera::Vec2(960.0f, 540.0f));
auto& blur = fx.get<shimera::GaussianBlur>();
blur.setEnabled(false);

// when the game is paused or resumed
blur.setEnabled(paused);
```

See [Shaders & Effects](./index.md#complete-example-sfml) for a complete program.
