---
title: Benchmarks
---

<script setup>
import BenchmarkCharts from './BenchmarkCharts.vue'
</script>

# Benchmarks

Performance results for Shimera over 5,000 frames per effect.

## Methodology

- **Frames**: 5,000 per test
- **Warm-up**: 100 frames to stabilize rendering
- **VRAM**: measured via `GL_NVX_gpu_memory_info` (NVIDIA only)
- **Reference machine**: Quadro RTX 5000, dedicated GitHub Actions runner, controlled environment
- **Local machines**: results are indicative only

## Comparative charts

::: warning Observed behaviors (Quadro)
Some effects such as GaussianBlur and HDRBloom currently don't pass on Raylib with the reference machine. This is likely explained by the Quadro RTX 5000's NVIDIA datacenter driver, which is stricter on OpenGL validation than the consumer GeForce driver on the local machine (RTX 5060), where these same effects work normally.

The SFML no-effects result also stands out, with a lower FPS than with active effects. A likely lead is a vertical sync issue specific to the Quadro machine. Investigation is ongoing.
:::


<BenchmarkCharts />


## Raw data

### Quadro RTX 5000 *(reference)*

::: info AtmosphericScatteringEffect on OpenGL
Performance tests for AtmosphericScatteringEffect are not yet implemented on the OpenGL backend; coming soon.
:::

::: info Fresnel / AtmosphericScattering on SFML
Both of these effects rely on 3D-only shaders and are not applicable to the SFML backend (2D rendering).
:::

| Effect | OpenGL (FPS) | Raylib (FPS) | SFML (FPS) |
|---|---|---|---|
| no_effects | 5,040 | 5,567 | 583 |
| BrightnessEffect | 5,000 | 5,393 | 4,480 |
| AtmosphericScatteringEffect | - | 4,873 | - |
| ChromaticAberrationEffect | 4,344 | 5,020 | 4,452 |
| ColortintEffect | 5,010 | 5,630 | 4,911 |
| ContrastEffect | 4,995 | 5,630 | 4,743 |
| DistortionEffect | 4,995 | 5,382 | 3,965 |
| FresnelEffect | 4,950 | 5,701 | - |
| GaussianBlurEffect | 3,961 | - | 4,019 |
| GrayscaleEffect | 4,980 | 5,208 | 4,633 |
| HDRBloom | 3,333 | - | 3,591 |
| PixelisationEffect | 4,965 | 5,102 | 4,633 |
| SaturationEffect | 4,965 | 5,133 | 4,604 |
| VignetteEffect | 5,010 | 5,452 | 5,010 |
| ContrastEffect + SaturationEffect | 4,945 | - | 4,930 |
| Contrast + Grayscale + Blur | 3,591 | - | 4,006 |

### NVIDIA GeForce RTX 5060 *(local - indicative)*

| Effect | OpenGL (FPS) | Raylib (FPS) | SFML (FPS) |
|---|---|---|---|
| no_effects | 6,090 | 3,620 | 4,599 |
| BrightnessEffect | 5,186 | 4,374 | 4,926 |
| AtmosphericScatteringEffect | - | 3,017 | - |
| ChromaticAberrationEffect | 4,761 | 4,506 | 4,887 |
| ColortintEffect | 4,591 | 4,558 | 4,699 |
| ContrastEffect | 4,975 | 4,627 | 4,984 |
| DistortionEffect | 4,878 | 4,420 | 4,374 |
| FresnelEffect | 4,703 | 5,005 | - |
| GaussianBlurEffect | 4,145 | 3,676 | 4,599 |
| GrayscaleEffect | 5,045 | 4,863 | 5,064 |
| HDRBloom | 4,012 | 3,687 | 4,022 |
| PixelisationEffect | 4,955 | 4,295 | 5,030 |
| SaturationEffect | 5,149 | 4,555 | 4,882 |
| VignetteEffect | 3,918 | 3,657 | 3,897 |
| ContrastEffect + SaturationEffect | 3,996 | 3,940 | 3,891 |
| Contrast + Grayscale + Blur | 3,819 | 3,337 | 3,733 |