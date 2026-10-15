# Brightness Effect

**Class:** `shimera::Brightness`  
**Header:** `effects/Brightness.hpp`  
**Implementation:** `src/effects/Brightness.cpp`  
**Shader:** `res/shader/postprocessing/brightness.slang`

## Description

The Brightness effect adds the same value to the red, green and blue components of every pixel, which brightens or darkens the whole image uniformly. The result is clamped to the `[0, 1]` range, and the alpha channel is left untouched.

## Constructor

```cpp
explicit Brightness(float strength = 0.1f);
```

## Parameters

| Parameter | Setter / Getter | Type | Range | Default | Effect |
|-----------|-----------------|------|-------|---------|--------|
| `strength` | `withStrength()` / `getStrength()` | float | `-1.0` to `1.0` | `0.1` | Value added to each color channel |

### Parameter Values

- **`< 0.0`** - Darkens the image (e.g. `-0.2` removes 20% of full brightness from every channel)
- **`0.0`** - No change
- **`> 0.0`** - Brightens the image (e.g. `0.2` adds 20% of full brightness to every channel)
- **`-1.0`** / **`1.0`** - Fully black / fully white image

::: tip
Since the value is added rather than multiplied, bright areas reach pure white quickly and lose detail. For a softer result, combine a small brightness value with [Contrast](./contrast.md).
:::

## Usage

![Complete Example](../../res/shaders/brightness.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::Brightness>(0.2f);

// Change it later, e.g. when the player enters a dark room
fx.get<shimera::Brightness>().withStrength(-0.15f);

// Every frame, after drawing the scene into the host target
fx.render(scene);
```

See [Shaders & Effects](./index.md#complete-example-sfml) for a complete program.
