# Saturation Shader

**File:** `res/shader/postprocessing/saturation.frag`

## Description
Adjusts the color saturation of the rendered image by interpolating between a grayscale version and the original colors.

## Parameters
| Value | Effect |
|-------|--------|
| `0.0` | Completely desaturated (grayscale) |
| `1.0` | Original colors (no change) |
| `> 1.0` | Oversaturated colors |

## Technical Details
- Uses **ITU-R BT.709** luma coefficients for luminance calculation: `(0.2126, 0.7152, 0.0722)`
- This standard is recommended for HD content and modern displays (sRGB color space)
- The shader preserves the alpha channel from the original image

## Usage Example

```cpp
// Set saturation to 0.5 (50% desaturated)
glUniform1f(saturationLocation, 0.5f);

// Set saturation to 0.0 (grayscale)
glUniform1f(saturationLocation, 0.0f);

// Set saturation to 2.0 (highly saturated)
glUniform1f(saturationLocation, 2.0f);
```