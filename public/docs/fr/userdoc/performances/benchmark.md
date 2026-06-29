---
title: Benchmarks
---

<script setup>
import BenchmarkCharts from './BenchmarkCharts.vue'
</script>

# Benchmarks

Résultats de performance de Shimera sur 5 000 frames par effet.

## Méthodologie

- **Frames** : 5 000 par test
- **Warm-up** : 100 frames pour stabiliser le rendu
- **VRAM** : mesurée via `GL_NVX_gpu_memory_info` (NVIDIA uniquement)
- **Machine de référence** : Quadro RTX 5000, runner GitHub Actions dédié, environnement contrôlé
- **Machines locales** : résultats indicatifs uniquement

---

## Graphes comparatifs

<BenchmarkCharts />

---

## Données brutes

### Quadro RTX 5000 *(référence)*

| Effet | OpenGL (FPS) | Raylib (FPS) | SFML (FPS) |
|---|---|---|---|
| no_effects | 25 510 | 5 257 | 578 ⚠️ |
| BrightnessEffect | 22 123 | 5 086 | 4 480 |
| ChromaticAberrationEffect | 12 919 | 4 849 | 4 452 |
| ColortintEffect | 22 123 | 5 446 | 4 911 |
| ContrastEffect | 22 123 | 5 376 | 4 743 |
| DistortionEffect | 20 080 | 5 091 | 3 965 |
| GaussianBlurEffect | 9 416 | — | 4 019 |
| GrayscaleEffect | 22 222 | 5 076 | 4 582 |
| PixelisationEffect | 21 645 | 4 916 | 4 633 |
| SaturationEffect | 22 026 | 5 055 | 4 625 |
| VignetteEffect | 21 834 | — | 5 010 |
| ContrastEffect + SaturationEffect | 16 778 | — | 4 930 |
| Contrast + Grayscale + Blur | 7 898 | — | 4 006 |

::: warning Anomalie SFML - Quadro RTX 5000
Le test `no_effects` sur SFML retourne **578 FPS** (attendu : ~4 500 FPS). Sur une machine dédiée sans bruit, cette valeur est d'autant plus suspecte et pointe vers un problème propre à l'environnement Linux — probablement une interaction entre SFML et Xvfb (display virtuel `:99`), un vsync mal géré, ou une interférence entre `glFinish()` et le contexte OpenGL interne de SFML. Ce résultat est exclu des graphes comparatifs.
:::

### NVIDIA GeForce RTX 5060 *(local - indicatif)*

| Effet | OpenGL (FPS) | Raylib (FPS) | SFML (FPS) |
|---|---|---|---|
| no_effects | 5 268 | 3 828 | 4 472 |
| BrightnessEffect | 5 241 | 4 364 | 4 918 |
| ChromaticAberrationEffect | 4 761 | 4 506 | 4 887 |
| ColortintEffect | 5 192 | 4 558 | 4 699 |
| ContrastEffect | 4 975 | 4 627 | 4 984 |
| DistortionEffect | 5 065 | 4 420 | 4 366 |
| GaussianBlurEffect | 4 184 | 3 836 | 4 599 |
| GrayscaleEffect | 5 045 | 4 398 | 5 064 |
| PixelisationEffect | 4 911 | 4 442 | 5 030 |
| SaturationEffect | 4 975 | 4 555 | 4 882 |
| VignetteEffect | 3 903 | 3 668 | 3 950 |
| ContrastEffect + SaturationEffect | 4 022 | 3 669 | 3 770 |
| Contrast + Grayscale + Blur | 3 717 | 3 550 | 3 733 |

::: info Machines locales
Ces résultats proviennent de machines de développement et sont fournis à titre indicatif. Ils ne constituent pas les chiffres officiels de Shimera.
:::