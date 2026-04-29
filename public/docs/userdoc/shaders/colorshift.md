# Color Shift Shader

**File:** `res/shader/postprocessing/colorshift.frag`

## Description
Applies a color shift effect to the rendered image by blending the original colors with a uniform color shift vector, creating a tinted/filtered appearance.

## Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `colorShift` | `vec3` | - | RGB color shift values to blend with the original image (range: 0.0 - 1.0 per component) |

## Technical Details
- The shader blends the original color with the shift color using a 50/50 mix: `(original + shift) / 2.0`
- Each RGB component can range from `0.0` to `1.0`
- The alpha channel is preserved from the original image
- Higher values in the shift vector will push colors toward that channel, creating a dominant tint

## Usage Example

```cpp
// Get uniform location
GLint colorShiftLocation = glGetUniformLocation(shaderProgram, "colorShift");

// Warm tone (orange/sepia-like)
glUniform3f(colorShiftLocation, 0.8f, 0.5f, 0.2f);

// Cool tone (blue/cyan-like)
glUniform3f(colorShiftLocation, 0.2f, 0.5f, 0.8f);

// Green tone
glUniform3f(colorShiftLocation, 0.2f, 0.8f, 0.3f);

// Neutral (no shift)
glUniform3f(colorShiftLocation, 0.5f, 0.5f, 0.5f);
```