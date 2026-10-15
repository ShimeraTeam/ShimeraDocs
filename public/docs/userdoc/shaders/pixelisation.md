# Pixelisation Effect

**Class:** `shimera::Pixelisation`  
**Header:** `effects/Pixelisation.hpp`  
**Implementation:** `src/effects/Pixelisation.cpp`  
**Shader:** `res/shader/postprocessing/pixelisation.slang`

## Description

The Pixelisation effect gives the image a retro pixel-art look by splitting the screen into a grid of blocks and filling each block with the color found at its center. The block size can be set independently on the X and Y axes, and the grid can be shifted with an offset.

## Constructor

```cpp
explicit Pixelisation(float pixelSizeX = 4.0f,
                      float pixelSizeY = 4.0f,
                      float gap = 0.3f,
                      Vec2<float> resolution = Vec2(1920.0f, 1080.0f),
                      Vec2<float> offset = Vec2(0.0f, 0.0f));
```

::: info
The third constructor parameter, `gap`, is currently unused. To set the resolution or the offset, pass any value for it, or use the setters below instead.
:::

## Parameters

| Parameter | Setter / Getter | Type | Range | Default | Effect |
|-----------|-----------------|------|-------|---------|--------|
| `pixelSizeX` | `withPixelSizeX()` / `getPixelSizeX()` | float | `1.0` to screen width | `4.0` | Width of each block, in screen pixels |
| `pixelSizeY` | `withPixelSizeY()` / `getPixelSizeY()` | float | `1.0` to screen height | `4.0` | Height of each block, in screen pixels |
| `resolution` | `withResolution()` / `getResolution()` | Vec2&lt;float&gt; | output size | `(1920, 1080)` | Size of the output in pixels |
| `offset` | `withOffset()` / `getOffset()` | Vec2&lt;float&gt; | `0.0` to `1.0` | `(0, 0)` | Grid origin, as a fraction of the screen |

`withPixelSize(size)` sets both `pixelSizeX` and `pixelSizeY` at once. `getPixelSize()` returns `pixelSizeX`.

::: warning Set the resolution
Unlike most effects, Pixelisation does **not** take its resolution from the pipeline. It is used to convert the block size from pixels to screen fractions, so if it does not match your output, the blocks are not the size you asked for. Set it when adding the effect, and again whenever the window is resized:

```cpp
fx.resize(width, height);
fx.get<shimera::Pixelisation>().withResolution(shimera::Vec2(float(width), float(height)));
```
:::

### Parameter Values

- **`pixelSizeX` / `pixelSizeY`**:
  - `1.0` - No pixelisation (original resolution)
  - `4.0` - Subtle pixel-art look (default)
  - `8.0` - Clearly blocky
  - `16.0` - Strong retro effect
  - `32.0+` - Very coarse blocks

- **`resolution`**:
  - Must be the size, in pixels, of the output the pipeline renders into (the same size you gave to `EffectPipeline`).

- **`offset`**:
  - `(0, 0)` - The grid starts at the bottom-left corner of the screen (default)
  - Expressed as a fraction of the screen: `(0.5, 0.5)` moves the grid origin to the center, so grid lines cross exactly at the middle of the screen
  - Changing it over time makes the grid slide or jitter

## Usage

### Basic Usage

![Complete Example](../../res/shaders/pixelisation.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::Pixelisation>();

fx.get<shimera::Pixelisation>()
  .withPixelSize(8.0f)
  .withResolution(shimera::Vec2(960.0f, 540.0f));

// Every frame, after drawing the scene into the host target
fx.render(scene);
```

### Non-square Blocks

`withPixelSizeX()` and `withPixelSizeY()` set the block dimensions independently, for a stretched or squashed pixel-art look:

```cpp
fx.get<shimera::Pixelisation>()
  .withPixelSizeX(16.0f)   // wide blocks
  .withPixelSizeY(4.0f)    // short blocks
  .withResolution(shimera::Vec2(1920.0f, 1080.0f));
```

### Transition

Growing the block size quickly makes a classic "pixelate out" scene transition:

```cpp
auto& pixelisation = fx.get<shimera::Pixelisation>();
// every frame of the transition, with progress going from 0 to 1
pixelisation.withPixelSize(1.0f + progress * 63.0f);
```

See [Shaders & Effects](./index.md#complete-example-sfml) for a complete program.
