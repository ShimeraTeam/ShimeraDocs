# Distortion Effect

**Header:** `include/effects/DistortionEffect.hpp`  
**Implementation:** `src/effects/DistortionEffect.cpp`  
**Shader:** `res/shader/postprocessing/distortion.frag`

## Description

The Distortion effect warps and deforms the rendered image using animated Perlin noise. This creates organic, flowing deformations useful for water ripples, heat waves, magical effects, or disorienting visual feedback. The effect is fully animatable with time-based parameters.

## Parameters

| Parameter | Type | Range | Default | Effect |
|-----------|------|-------|---------|--------|
| `time` | float | `0.0` to `∞` | `0.0` | Animation time in seconds |
| `noiseScale` | float | `0.1` to `10.0+` | `3.0` | Frequency of noise pattern |
| `distortionStrength` | float | `0.0` to `0.5+` | `0.13` | Magnitude of warping |
| `timeScale` | float | `0.01` to `1.0+` | `0.1` | Animation speed multiplier |

### Parameter Values

- **`time`**:
  - Automatically incremented each frame
  - Controls animation progression
  - Example: `time += deltaTime`

- **`noiseScale`**:
  - `1.0` - Large, smooth waves
  - `3.0` - Medium ripples (standard)
  - `6.0` - Fine, detailed distortions
  - `10.0+` - Very granular effects

- **`distortionStrength`**:
  - `0.0` - No distortion
  - `0.1` - Subtle effect
  - `0.2` - Moderate warping
  - `0.3+` - Extreme deformation

- **`timeScale`**:
  - `0.05` - Very slow animation
  - `0.1` - Normal speed (default)
  - `0.3` - Fast animation
  - `0.5+` - Very rapid changes

## Usage

### Basic Usage

![Example](../../res/shaders/distortion.gif)  

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/DistortionEffect.hpp"

int main() {
  sf::RenderWindow window(sf::VideoMode(800, 600), "Distortion Demo");
  window.setActive(true);

  IBackend *backend = BackendFactory::create();
  IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(800, 600);

  DistortionEffect distortion(backend);
  distortion.withDistortionStrength(0.15f)
        .withNoiseScale(3.0f)
        .withTimeScale(0.1f);

  float time = 0.0f;
  while (window.isOpen()) {
    while (const std::optional event = window.pollEvent()) {
      if (event->is<sf::Event::Closed>()) window.close();
    }

    auto *rt = static_cast<sf::RenderTexture*>(sceneFramebuffer->getNativeRenderTarget());
    rt->clear(sf::Color::Black);
    // ... draw your scene to rt ...
    sceneFramebuffer->unbind();

    distortion.time = time;
    window.setActive(true);
    distortion.render(sceneFramebuffer->getTexture());

    time += 0.016f;
    window.display();
  }

  delete sceneFramebuffer;
  delete backend;
  return 0;
}
```
