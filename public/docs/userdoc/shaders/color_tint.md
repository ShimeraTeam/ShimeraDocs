# Color Tint Effect

**Class:** `shimera::ColorTint`  
**Header:** `effects/ColorTint.hpp`  
**Implementation:** `src/effects/ColorTint.cpp`  
**Shader:** `res/shader/postprocessing/color_tint.slang`

## Description

The Color Tint effect blends the whole image with a single color, half and half. It creates colored overlays, useful for atmosphere (warm sunset, cold night, underwater), emotional tone changes, or gameplay feedback such as a red screen when the player takes damage. The alpha channel is left untouched.

Each pixel is computed as `(original + tint) / 2`: the average of the original color and the tint color.

::: info Formerly Colorshift
This effect replaces the `ColorshiftEffect` of the previous version of the library, with the same behavior under a new name.
:::

## Constructor

```cpp
explicit ColorTint(Vec3<float> tint = Vec3(0.0f, 0.0f, 0.0f));
```

## Parameters

| Parameter | Setter / Getter | Type | Range | Default | Effect |
|-----------|-----------------|------|-------|---------|--------|
| `tint` | `withTint()` / `getTint()` | Vec3&lt;float&gt; | RGB, `0` to `1` | `(0, 0, 0)` | Color averaged with the image |

### Tint Values

Each RGB component ranges from `0.0` to `1.0`. Since the image and the tint always weigh 50% each, the tint also changes the overall brightness: dark tints darken the image, light tints brighten it.

- **`(0.0, 0.0, 0.0)`** - Black: the image is darkened to half its brightness (default)
- **`(1.0, 0.0, 0.0)`** - Red tint
- **`(0.0, 1.0, 0.0)`** - Green tint
- **`(0.0, 0.0, 1.0)`** - Blue tint
- **`(1.0, 1.0, 0.0)`** - Yellow tint
- **`(1.0, 0.0, 1.0)`** - Magenta tint
- **`(0.0, 1.0, 1.0)`** - Cyan tint
- **`(0.5, 0.5, 0.5)`** - Neutral gray: no color shift, the contrast is halved
- **`(1.0, 1.0, 1.0)`** - White: the image is washed out toward white

::: tip
The effect always applies at full strength. To turn it off, use `setEnabled(false)` rather than a particular tint value.
:::

## Usage

![Complete Example](../../res/shaders/colorShift.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::ColorTint>(shimera::Vec3(1.0f, 0.0f, 0.0f)); // red tint

// Change it later
fx.get<shimera::ColorTint>().withTint(shimera::Vec3(0.0f, 0.4f, 0.8f));

// Every frame, after drawing the scene into the host target
fx.render(scene);
```

### Damage Feedback

A red tint shown only while the player is hurt:

```cpp
fx.add<shimera::ColorTint>(shimera::Vec3(1.0f, 0.0f, 0.0f));
auto& damage = fx.get<shimera::ColorTint>();
damage.setEnabled(false);

// every frame
damage.setEnabled(hurtTimer > 0.0f);
```

See [Shaders & Effects](./index.md#complete-example-sfml) for a complete program.
