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
- **Reference machine**: Quadro RTX 5000, dedicated GitHub Actions self-hosted runner, controlled environment
- **Local machines**: indicative results only

---

## Comparative charts

<BenchmarkCharts />

---

## Raw data

### Quadro RTX 5000 *(reference)*

| Effect | OpenGL (FPS) | Raylib (FPS) | SFML (FPS) |
|---|---|---|---|
| no_effects | 25,510 | 5,257 | 578 ⚠️ |
| BrightnessEffect | 22,123 | 5,086 | 4,480 |
| ChromaticAberrationEffect | 12,919 | 4,849 | 4,452 |
| ColortintEffect | 22,123 | 5,446 | 4,911 |
| ContrastEffect | 22,123 | 5,376 | 4,743 |
| DistortionEffect | 20,080 | 5,091 | 3,965 |
| GaussianBlurEffect | 9,416 | - | 4,019 |
| GrayscaleEffect | 22,222 | 5,076 | 4,582 |
| PixelisationEffect | 21,645 | 4,916 | 4,633 |
| SaturationEffect | 22,026 | 5,055 | 4,625 |
| VignetteEffect | 21,834 | - | 5,010 |
| ContrastEffect + SaturationEffect | 16,778 | - | 4,930 |
| Contrast + Grayscale + Blur | 7,898 | - | 4,006 |

::: warning SFML anomaly - Quadro RTX 5000
The `no_effects` test on SFML returns **578 FPS** (expected: ~4,500 FPS). On a dedicated machine with no background noise, this value is especially suspicious and likely points to a Linux-specific issue — probably an interaction between SFML and Xvfb (virtual display `:99`), a mishandled vsync, or interference between `glFinish()` and SFML's internal OpenGL context. This result is excluded from the comparative charts.
:::

### NVIDIA GeForce RTX 5060 *(local - indicative)*

| Effect | OpenGL (FPS) | Raylib (FPS) | SFML (FPS) |
|---|---|---|---|
| no_effects | 5,268 | 3,828 | 4,472 |
| BrightnessEffect | 5,241 | 4,364 | 4,918 |
| ChromaticAberrationEffect | 4,761 | 4,506 | 4,887 |
| ColortintEffect | 5,192 | 4,558 | 4,699 |
| ContrastEffect | 4,975 | 4,627 | 4,984 |
| DistortionEffect | 5,065 | 4,420 | 4,366 |
| GaussianBlurEffect | 4,184 | 3,836 | 4,599 |
| GrayscaleEffect | 5,045 | 4,398 | 5,064 |
| PixelisationEffect | 4,911 | 4,442 | 5,030 |
| SaturationEffect | 4,975 | 4,555 | 4,882 |
| VignetteEffect | 3,903 | 3,668 | 3,950 |
| ContrastEffect + SaturationEffect | 4,022 | 3,669 | 3,770 |
| Contrast + Grayscale + Blur | 3,717 | 3,550 | 3,733 |

::: info Local machines
These results come from development machines and are provided for reference only. They do not represent official Shimera benchmarks.
:::