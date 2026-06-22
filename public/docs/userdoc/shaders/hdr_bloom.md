# HDR Bloom Effect

**Header:** `include/effects/HDRBloomEffect.hpp`  
**Implementation:** `src/effects/HDRBloomEffect.cpp`  
**Shader:** `res/shader/postprocessing/hdr_bloom.frag`

## Description

The HDR Bloom effect makes the bright areas of an image glow, bleeding light into the surrounding pixels. It first extracts the brightest pixels (bright pass), blurs them with a separable two-pass Gaussian blur, then blends the resulting halo back over the original scene. The final composite is tone-mapped with an ACES filmic curve, which compresses high luminance values into a displayable range without harshly clipping the highlights to white. This is ideal for emissive materials, neon, light sources, or a soft cinematic look.

## Parameters

| Parameter | Type | Range | Default | Effect |
|-----------|------|-------|---------|--------|
| `threshold` | float | `0.0` to `1.0` | `0.7` | Brightness level above which pixels glow |
| `knee` | float | `0.0` to `threshold` | `0.2` | Softness of the threshold transition |
| `intensity` | float | `0.0` to `∞` | `1.0` | Strength of the added glow |
| `blurSigma` | float | `1.0` to `30.0+` | `5.0` | Spread (radius) of the glow |
| `blurSamples` | int | `5` to `128` | `15` | Number of blur samples for quality/performance |
| `resolution` | Vec2 | screen size | `1920x1080` | Must match your framebuffer size |

### Parameter Values

- **`threshold`**:
  - `0.3` - Many areas glow
  - `0.5` - Moderate glow
  - `0.7` - Only bright areas glow (default)
  - `0.9` - Only very bright sources glow

- **`knee`**:
  - `0.0` - Hard cutoff (sharp on/off glow)
  - `0.2` - Smooth transition (default)
  - `0.4+` - Very gradual fade into the glow

- **`intensity`**:
  - `0.0` - No glow (bloom disabled)
  - `1.0` - Subtle glow (default)
  - `1.5` to `3.0` - Strong glow
  - `> 4.0` - Highlights clip to white, marginal gain

- **`blurSigma`**:
  - `5.0` - Tight halo near sources
  - `15.0` - Medium, soft glow
  - `30.0+` - Large, diffuse aura

- **`blurSamples`**:
  - `15` - Fast, lower quality
  - `30` - Good balance
  - `60` - High quality
  - `90+` - Maximum quality, slower
  - **Tip:** keep `samples ≈ 2-3 × sigma` to avoid banding

## Usage

### Basic Usage

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/HDRBloomEffect.hpp"

int main() {
  sf::RenderWindow window(sf::VideoMode(800, 600), "HDR Bloom Demo");
  window.setActive(true);

  IBackend *backend = BackendFactory::create();
  IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(800, 600);

  HDRBloomEffect bloom(backend);
  bloom.withThreshold(0.7f)
       .withKnee(0.2f)
       .withIntensity(1.5f)
       .withBlurSigma(15.0f)
       .withBlurSamples(30)
       .withResolution(Vec2(800.0f, 600.0f));

  while (window.isOpen()) {
    while (const std::optional event = window.pollEvent()) {
      if (event->is<sf::Event::Closed>()) window.close();
    }

    auto *rt = static_cast<sf::RenderTexture*>(sceneFramebuffer->getNativeRenderTarget());
    rt->clear(sf::Color::Black);
    // ... draw your scene to rt ...
    sceneFramebuffer->unbind();

    window.setActive(true);
    bloom.render(sceneFramebuffer->getTexture());
    window.display();
  }

  delete sceneFramebuffer;
  delete backend;
  return 0;
}
```
