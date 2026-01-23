# Contrast Shader

**File:** `res/shader/postprocessing/contrast.frag`

## Description
Adjusts the contrast of the rendered image by scaling the distance of each color component from middle gray (0.5).

## Parameters
| Value | Effect |
|-------|--------|
| `0.0` | No contrast (uniform gray) |
| `1.0` | Original contrast (no change) |
| `> 1.0` | Increased contrast |

## Technical Details
- The shader uses 0.5 as the pivot point for contrast adjustment
- Results are clamped to the valid range `[0.0, 1.0]` to prevent color overflow
- The alpha channel is preserved from the original image

## Usage Example

```cpp
// Set contrast to 1.5 (50% more contrast)
glUniform1f(contrastLocation, 1.5f);

// Set contrast to 0.5 (50% less contrast)
glUniform1f(contrastLocation, 0.5f);

// Set contrast to 0.0 (no contrast - gray)
glUniform1f(contrastLocation, 0.0f);
```
