# Roadmap - Shimera

## Juillet 2026 - Point de décision
À l'heure actuelle, Shimera possède une couche d'abstraction distincte pour chaque backend (OpenGL, SFML, Raylib). L'équipe teste si celle-ci peut être remplacée par une architecture générique unique fonctionnant avec n'importe quel backend. Le résultat déterminera la voie suivie par le projet pour le reste de ce cycle de développement.

- Architecture générique fonctionnelle -> **Plan A**
- Ne fonctionne pas -> **Plan B** (on garde l'architecture actuelle spécifique à chaque backend)

*Risque : le test s'éternise ou donne des résultats ambigus -> la date de décision est maintenue ferme pour ne pas retarder la suite du planning.*

## Plan A (l'architecture générique fonctionne)

| Période | Objectifs |
|---|---|
| **Août** | Refactorisation de la librairie sur une branche dédiée autour de la nouvelle architecture générique |
| **Septembre** | Intégration de [Slang](https://shader-slang.org/) dans le workflow et migration des shaders GLSL existants |
| **Octobre** | Accent sur les shaders de scène (world-space) et les matériaux |
| **Novembre – Février** | Consolidation de la librairie et extension du catalogue de shaders |

## Plan B (on garde l'architecture actuelle spécifique à chaque backend)

| Période | Objectifs |
|---|---|
| **Août** | Intégration de Slang dans le workflow et migration des shaders GLSL existants |
| **Septembre** | Implémentation des shaders de scène (world-space) directement dans la librairie actuelle, si pas déjà fait |
| **Octobre – Février** | Même travail de consolidation et de catalogue de shaders que le Plan A |

## Octobre - Shaders de scène & matériaux (les deux plans)
- Fog (linéaire/exponentiel/volumétrique)
- Water Effect
- PBR
- Refraction / Glass

*Défi technique : ces shaders nécessitent plus de ressources GPU et une architecture de rendu multi-passes plus mature que les effets de post-processing simples déjà en place.*

## Novembre - Février - Consolidation & catalogue de shaders (les deux plans)
Shaders de post-processing restants à rattraper :
- Depth of Field, Sobel Filter, Cel Shading, Motion Blur
- SSAO / SSR (si le temps le permet)
- Face Culling / Frustum Culling

### Priorisation en cas de retard
1. Cœur de la librairie + shaders déjà en place (non négociable)
2. Shaders de scène / matériaux (Octobre)
3. Shaders avancés (PBR, SSAO/SSR, volumetric fog)
4. Metal / BGFX (à sacrifier en premier si nécessaire)