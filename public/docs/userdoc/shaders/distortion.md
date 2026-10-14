# Distortion Effect

**Class:** `shimera::Distortion`  
**Header:** `effects/Distortion.hpp`  
**Implementation:** `src/effects/Distortion.cpp`  
**Shader:** `res/shader/postprocessing/distortion.slang`

## Description

The Distortion effect warps the image by offsetting each pixel with an animated gradient noise (a Perlin-like noise). It creates organic, flowing deformations, useful for water ripples, heat waves, magical effects or disorienting visual feedback.

The effect does not track time by itself: you give it the current time every frame with `withTime()`. Without it, the distortion is still applied, but frozen.

## Constructor

```cpp
explicit Distortion(float noiseScale = 3.0f,
                    float distortionStrength = 0.13f,
                    float timeScale = 0.1f);
```

The time starts at `0.0` and is only set with `withTime()`.

## Parameters

| Parameter | Setter / Getter | Type | Range | Default | Effect |
|-----------|-----------------|------|-------|---------|--------|
| `time` | `withTime()` / `getTime()` | float | `0.0` to `∞` | `0.0` | Animation time, usually in seconds |
| `noiseScale` | `withNoiseScale()` / `getNoiseScale()` | float | `0.1` to `10.0+` | `3.0` | Frequency of the noise pattern |
| `distortionStrength` | `withDistortionStrength()` / `getDistortionStrength()` | float | `0.0` to `0.5+` | `0.13` | Magnitude of the warping |
| `timeScale` | `withTimeScale()` / `getTimeScale()` | float | `0.01` to `1.0+` | `0.1` | Animation speed multiplier |

### Parameter Values

- **`time`**:
  - Set it every frame with the elapsed time of your program
  - The noise pattern scrolls diagonally across the screen as the time increases
  - Example: `distortion.withTime(clock.getElapsedTime().asSeconds())`

- **`noiseScale`**:
  - `1.0` - Large, smooth waves
  - `3.0` - Medium ripples (default)
  - `6.0` - Fine, detailed distortions
  - `10.0+` - Very granular effect

- **`distortionStrength`**:
  - `0.0` - No distortion
  - `0.05` - Subtle shimmer
  - `0.1` - Visible warping
  - `0.2` - Strong warping
  - `0.3+` - Extreme deformation

- **`timeScale`**:
  - `0.05` - Very slow animation
  - `0.1` - Normal speed (default)
  - `0.3` - Fast animation
  - `0.5+` - Very rapid changes

## Usage

![Example](../../res/shaders/distortion.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::Distortion>(3.0f, 0.15f, 0.1f); // noiseScale, distortionStrength, timeScale

// Keep a reference to update the time every frame
auto& distortion = fx.get<shimera::Distortion>();

while (running) {
    // ... draw the scene into the host target ...

    distortion.withTime(elapsedSeconds);
    fx.render(scene);
}
```

Time sources per host library:

| Host library | Elapsed time |
|--------------|--------------|
| SFML | `clock.getElapsedTime().asSeconds()` (with an `sf::Clock`) |
| raylib | `static_cast<float>(GetTime())` |
| SDL3 | `SDL_GetTicks() / 1000.0f` |
| GLFW | `static_cast<float>(glfwGetTime())` |

See [Shaders & Effects](./index.md#complete-example-sfml) for a complete program.
