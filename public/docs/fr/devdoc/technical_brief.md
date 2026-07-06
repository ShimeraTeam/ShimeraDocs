# Shimera - Brief Technique

## Introduction

Ce document propose un aperçu concis de Shimera à destination des partenaires, recruteurs et lecteurs externes. Pour le détail technique, voir les pages de documentation liées.

## Aperçu du projet

Shimera est une librairie C++ qui unifie l'intégration d'effets visuels (shaders) à travers plusieurs backends de rendu (OpenGL natif, SFML et Raylib) derrière une API unique et cohérente.

Le projet est développé par une équipe de trois personnes et se trouve actuellement en **cour de développement** (C++23, compilé avec Xmake), avec les backends OpenGL, SFML et Raylib déjà implémentés.

## Architecture principale

Shimera est construit comme une abstraction en couches au-dessus d'OpenGL :

1. **API publique** : un point d'entrée compact (`shimera.h`) avec gestion des exports statiques/dynamiques.
2. **Abstraction de backend** : `IBackend` et `BackendFactory` définissent les contrats de création pour les framebuffers, textures, shaders et post-processeurs ; le backend concret est sélectionné à la **compilation** via une macro préprocesseur, et non par chargement de plugin à l'exécution.
3. **Backends concrets** : OpenGL, SFML et Raylib implémentent chacun la capture de scène via leur mécanisme natif (FBO, `RenderTexture`, `RenderTexture2D`), tandis que l'exécution du post-processing reste pilotée par OpenGL dans tous les cas.
4. **Framework d'effets** : une API fluide basée sur le CRTP (`ShaderEffect<Derived>`) permet de déclarer et chaîner les effets (framebuffers en ping-pong).

Détail complet : [Documentation de l'architecture](./architecture/technical_architecture.md)

## Innovation technique

- **Compatible avec plusieurs backends** : la plupart des librairies de shaders ne fonctionnent qu'avec un seul backend. Shimera traite SFML, Raylib et OpenGL comme différentes variantes d'un même pipeline GL, et masque cette différence à l'utilisateur.
- **Chaînage d'effets multiples** : un pipeline à plusieurs effets, qui demande normalement des heures de gestion manuelle des framebuffers et du binding de textures, se réduit à quelques appels de méthode, tout en gardant l'accès aux uniforms bas niveau quand nécessaire.

Détail complet : [Pourquoi Shimera](../userdoc/why_shimera.md)

## Performances démontrées

Mesures sur 5 000 frames par effet (100 frames de chauffe), sur un runner GitHub Actions self-hosted dédié (Quadro RTX 5000) :

| Backend | FPS moyen (sans effet) | FPS moyen (effet simple typique) |
|---|---|---|
| OpenGL natif | 25 510 fps | 22 000 fps |
| Raylib | 5 257 fps | 5 000 – 5 400 fps |
| SFML | 5 012 fps | 4 400 – 5 000 fps |

Détail complet : [Documentation des performances](../userdoc/performance/benchmark.md)

## Roadmap

**Juillet 2026** : actuellement, Shimera possède une couche d'abstraction distincte pour chaque backend (OpenGL, SFML, Raylib). L'équipe teste si celle-ci peut être remplacée par une architecture générique unique, valable pour n'importe quel backend. Le résultat détermine la direction prise par le projet pour la suite du cycle de développement :

- **Plan A (si l'architecture générique fonctionne) :**
  - Août : refactorisation de la librairie sur une branche dédiée autour de la nouvelle architecture générique.
  - Septembre : intégration de [Slang](https://shader-slang.org/) dans le workflow et migration des shaders GLSL existants vers Slang.
  - Octobre : focus sur les shaders et materials en world-space.
  - Novembre - Février : consolidation de la librairie et élargissement du catalogue de shaders.
- **Plan B (si ça ne fonctionne pas) :** maintien de l'architecture actuelle spécifique à chaque backend.
  - Août : intégration de Slang dans le workflow et migration des shaders GLSL existants vers Slang.
  - Septembre : implémentation des shaders world-space directement dans la librairie actuelle, si pas déjà fait.
  - Octobre - Février : mêmes travaux de consolidation et d'élargissement du catalogue de shaders que pour le Plan A.
