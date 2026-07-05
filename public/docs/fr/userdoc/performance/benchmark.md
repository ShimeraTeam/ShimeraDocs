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

::: warning Comportements observés (Quadro)
Certains effets comme le GaussianBlur et le HDRBloom ne passent pas encore sur Raylib avec la machine de référence. Cela s'explique probablement par le driver NVIDIA datacenter de la Quadro RTX 5000, plus strict sur la validation OpenGL que le driver GeForce grand public de la machine locale (RTX 5060), où ces mêmes effets fonctionnent normalement.

Le résultat de SFML sans effets sort également du lot, avec un FPS plus bas qu'avec des effets actifs. Une piste probable est un souci de synchronisation verticale propre à la machine quadro. L'investigation est en cours.
:::

<BenchmarkCharts />


## Données brutes

### Quadro RTX 5000 *(référence)*

::: info AtmosphericScatteringEffect sur OpenGL
Les tests de performance du AtmosphericScatteringEffect ne sont pas encore implémentés sur le backend OpenGL, arrivera prochainement.
:::

::: info Fresnel / AtmosphericScattering sur SFML
Ces deux effets reposent sur des shaders exclusivement 3D et ne sont pas applicables au backend SFML (rendu 2D).
:::

| Effet | OpenGL (FPS) | Raylib (FPS) | SFML (FPS) |
|---|---|---|---|
| no_effects | 5 040 | 5 567 | 583 |
| BrightnessEffect | 5 000 | 5 393 | 4 480 |
| AtmosphericScatteringEffect | - | 4 873 | - |
| ChromaticAberrationEffect | 4 344 | 5 020 | 4 452 |
| ColortintEffect | 5 010 | 5 630 | 4 911 |
| ContrastEffect | 4 995 | 5 630 | 4 743 |
| DistortionEffect | 4 995 | 5 382 | 3 965 |
| FresnelEffect | 4 950 | 5 701 | - |
| GaussianBlurEffect | 3 961 | - | 4 019 |
| GrayscaleEffect | 4 980 | 5 208 | 4 633 |
| HDRBloom | 3 333 | - | 3 591 |
| PixelisationEffect | 4 965 | 5 102 | 4 633 |
| SaturationEffect | 4 965 | 5 133 | 4 604 |
| VignetteEffect | 5 010 | 5 452 | 5 010 |
| ContrastEffect + SaturationEffect | 4 945 | - | 4 930 |
| Contrast + Grayscale + Blur | 3 591 | - | 4 006 |

### NVIDIA GeForce RTX 5060 *(local - indicatif)*

| Effet | OpenGL (FPS) | Raylib (FPS) | SFML (FPS) |
|---|---|---|---|
| no_effects | 6 090 | 3 620 | 4 599 |
| BrightnessEffect | 5 186 | 4 374 | 4 926 |
| AtmosphericScatteringEffect | - | 3 017 | - |
| ChromaticAberrationEffect | 4 761 | 4 506 | 4 887 |
| ColortintEffect | 4 591 | 4 558 | 4 699 |
| ContrastEffect | 4 975 | 4 627 | 4 984 |
| DistortionEffect | 4 878 | 4 420 | 4 374 |
| FresnelEffect | 4 703 | 5 005 | - |
| GaussianBlurEffect | 4 145 | 3 676 | 4 599 |
| GrayscaleEffect | 5 045 | 4 863 | 5 064 |
| HDRBloom | 4 012 | 3 687 | 4 022 |
| PixelisationEffect | 4 955 | 4 295 | 5 030 |
| SaturationEffect | 5 149 | 4 555 | 4 882 |
| VignetteEffect | 3 918 | 3 657 | 3 897 |
| ContrastEffect + SaturationEffect | 3 996 | 3 940 | 3 891 |
| Contrast + Grayscale + Blur | 3 819 | 3 337 | 3 733 |