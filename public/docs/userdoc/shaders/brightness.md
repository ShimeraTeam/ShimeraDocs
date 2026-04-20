# Brightness Shader

**File:** `res/shader/postprocessing/brightness.frag`

## Description
Adjusts the brightness of the rendered image by adding or subtracting a uniform value to all color components.

## Parameters
| Value | Effect |
|-------|--------|
| `< 0.0` | Darker image (e.g., -0.2 = 20% darker) |
| `0.0` | Original brightness (no change) |
| `> 0.0` | Brighter image (e.g., +0.2 = 20% brighter) |

## Technical Details
- The shader adds the brightness value directly to each RGB component
- Results are clamped to the valid range `[0.0, 1.0]` to prevent color overflow
- The alpha channel is preserved from the original image

## Usage Example

```cpp
// Set brightness to +0.2 (20% brighter)
glUniform1f(brightnessLocation, 0.2f);

// Set brightness to -0.3 (30% darker)
glUniform1f(brightnessLocation, -0.3f);

// Set brightness to 0.0 (no change)
glUniform1f(brightnessLocation, 0.0f);
```