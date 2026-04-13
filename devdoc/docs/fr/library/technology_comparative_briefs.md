# Documentation et comparatifs des technologies utilisees dans la librairie

## Objectif

Ce document resume les technologies principales de Shimera et fournit des comparatifs courts pour justifier les choix d'architecture.

Shimera est une librairie C++ concue pour permettre a ses utilisateurs (principalement techniciens) d'implementer des effets visuels au-dessus de leurs projets graphiques sans necessite de connaissances GPU. La librairie fournit un ensemble de shaders facilement integrables dans des projets OpenGL, SFML et Raylib. Chaque shader est accompagne d'une fonction appelable qui permet aux utilisateurs d'implementer et de modifier les parametres du shader selon leurs besoins.

## Vue d'ensemble technologique

### Langage et execution

- c++23: langage principal pour les performances, la gestion RAII et l'interoperabilite bas niveau.
- GLSL: langage shader utilise pour les effets sur GPU.

### Build et outillage

- xmake: outil de build principal dans ce depot.

## Comparatif 1: Langage principal de la librairie

### C++ vs C vs Rust vs C# vs Java vs Python

| Critere | C++ | C | Rust | C# | Java | Python |
| --- | --- | --- | --- | --- | --- | --- |
| Performance bas niveau | Excellente | Excellente | Excellente | Bonne a tres bonne | Bonne (JIT) | Faible a moyenne |
| Interop directe avec OpenGL/SFML/raylib/SDL | Excellente | Bonne (SDL tres naturel, SFML moins naturel) | Bonne (FFI necessaire selon libs) | Moyenne (bindings/couches interop) | Moyenne (LWJGL/JOGL pour OpenGL, bindings tiers pour raylib/SFML) | Moyenne (bindings, couches C/C++ frequentes) |
| Controle memoire et ressources GPU | Excellente (RAII mature) | Bonne mais plus manuelle | Excellente (ownership/borrow checker) | Moyenne (GC, patterns natifs necessaires) | Moyenne (GC, gestion indirecte des ressources GPU) | Faible a moyenne (gestion indirecte via wrappers) |
| Expressivite pour abstractions haut niveau de la librairie | Excellente | Moyenne | Bonne a excellente | Bonne | Bonne a excellente | Excellente |
| Maturite ecosysteme natif pour notre stack actuelle | Tres elevee | Elevee | Moyenne a elevee | Moyenne | Moyenne (LWJGL mature pour OpenGL, moins pour raylib/SFML) | Elevee pour scripting, plus limitee pour coeur natif |

Decision:
- C++ est retenu pour son excellent compromis entre performance, controle des ressources GPU, expressivite pour les abstractions de la librairie et maturite de l'ecosysteme pour notre stack actuelle.
- Le modele RAII de C++ est particulierement adapte a la gestion de ressources GPU (buffers, textures, shaders, framebuffers).
- C reste une base tres performante, mais implique davantage de gestion manuelle et offre moins d'outils de structuration pour notre niveau d'abstraction actuel.
- Rust est un langage prometteur pour les projets graphiques, mais son ecosysteme autour de OpenGL/SFML/raylib est moins mature que celui de C++. De plus, le besoin d'FFI pour interagir avec ces bibliotheques pourrait introduire une complexite additionnelle non desiree pour notre scope actuel.
- C# peut accelerer certains usages applicatifs, mais ajoute une couche d'interop pour notre coeur natif graphique et n'est pas notre cible actuelle pour une librairie bas niveau.
- Java dispose d'outils comme LWJGL pour OpenGL, mais la gestion garbage collection, la performance du JIT et l'absence de controle fin sur les ressources GPU le rendent moins ideal qu'une approche native C++ pour une librairie bas niveau. De plus, l'interop avec raylib et SFML requiert des bindings tiers moins matures que ceux disponibles pour C++.
- Python est excellent pour le prototypage, l'outillage et l'enseignement, mais pas adapte comme langage principal du coeur de rendu de Shimera (performance CPU, overhead d'interop, gestion fine des ressources GPU).

sources:
- C++ et OpenGL (documentation): https://www.opengl.org/Documentation/Implementations/Languages.html
- C++, OpenGL et SFML (documentation): https://www.sfml-dev.org/tutorials/3.0/window/opengl/
- C++, OpenGL, Java, Python (discussion): https://www.reddit.com/r/opengl/comments/ssxve7/which_language_should_choose_for_opengl/
- C++ et OpenGL (discussion): https://www.haroldserrano.com/blog/which-programming-language-should-i-learn-to-use-opengl
- C++, OpenGL, Java, Python (discussion): https://www.reddit.com/r/opengl/comments/fu5eva/which_language_do_you_program_in_with_opengl/
- Python et OpenGL (discussion): https://www.reddit.com/r/gamedev/comments/n6jre/using_opengl_with_python_prudent/
- C# et OpenGL (discussion): https://stackoverflow.com/questions/536065/using-opengl-with-c
- C#, C++ et OpenGL (discussion): https://www.reddit.com/r/opengl/comments/oxcc9z/good_opengl_implementations_for_c/

## Comparatif 2: API graphique

### OpenGL vs Vulkan vs Direct3D vs Metal

| Critere | OpenGL | Vulkan | Direct3D 11/12 | Metal |
| --- | --- | --- | --- | --- |
| Support desktop multi-plateforme | Eleve | Eleve | Principalement Windows | Principalement Apple |
| Complexite d'integration | Moderee | Elevee | Moderee a elevee | Moderee |
| Effort d'apprentissage/debug | Modere | Eleve | Eleve | Modere a eleve |
| Vitesse de prototypage | Elevee | Faible a moyenne | Moyenne | Moyenne |
| Cout de maintenance pour une petite equipe | Faible a modere | Eleve | Eleve hors Windows | Eleve hors Apple |
| Pertinence pour un SDK pedagogique | Elevee | Faible a moyenne | Faible | Faible a moyenne |
| Adequation avec Shimera aujourd'hui | Excellente | Non prioritaire | Non aligne | Non aligne |

Decision:
- OpenGL reste le choix le plus coherent pour les objectifs actuels de Shimera: portabilite, pipeline shader clair, abstraction simplifiee.
- Vulkan pourra etre reconsidere par la suite, mais son cout de complexite (synchronisation explicite, descripteurs, boilerplate) est trop eleve pour notre phase actuelle.
- Direct3D est tres solide techniquement, mais son orientation Windows n'est pas alignee avec notre objectif multi-plateforme immediat.
- Metal est performant dans l'ecosysteme Apple, mais son perimetre plateforme ne correspond pas a notre cible multi-plateforme actuelle.

sources:
- OpenGL, Vulkan et Direct3D (documentation): https://blog.replaybird.com/graphic-apis-best-alternatives/
- OpenGL, Vulkan, Direct3D et Metal (documentation): https://gist.github.com/MangaD/b24f4e3052ff7854c6fa5074f22bc9b2
- OpenGL, Vulkan, Direct3D et Metal (documentation): https://techbuzzonline.com/graphics-api-comparison-game-developers-beginners-guide/#google_vignette

## Comparatif 3: Bibliotheques supportées autour d'OpenGL

### SFML vs SDL3 vs raylib

| Critere | SFML | SDL3 | raylib |
| --- | --- | --- | --- |
| Ergonomie 2D | Tres elevee | Moyenne | Elevee |
| Interop OpenGL | Simple | Complexe | Simple mais plus opinionne |
| Verbosite API | Faible | Moyenne | Faible |
| Maturite ecosysteme | Elevee | Tres elevee | Elevee |

Decision:
- SFML est la librairie sur laquelle nous avons eu nos premiers succès et qui correspond le mieux a notre abstraction actuelle.
- raylib est excellent car nous permet démontrer nos shaders sur des exemples 2D comme 3D.
- SDL3 est une option secondaire interessante pour toucher un public plus large, mais elle n'est pas dans nos objectifs à court terme du à certains problemes d'interop OpenGL plus complexes.
- Strategie retenue: SFML et raylib en priorite pour maximiser la clarte pedagogique et la vitesse de livraison.

Sources:
- SFML et OpenGL (documentation): https://www.sfml-dev.org/tutorials/2.6/window-opengl.php
- SFML, SDL3 (documentation): https://junkangworld.com/blog/sdl-vs-sfml-which-c-game-library-is-right-for-you
- SDL, OpenGL (documentation): https://wikis.khronos.org/opengl/Tutorial1:_Creating_a_Cross_Platform_OpenGL_3.2_Context_in_SDL_(C_/_SDL)
- SDL, OpenGL (documentation): https://documentation.help/SDL/guidevideoopengl.html
- SDL, OpenGL (documentation): https://lazyfoo.net/tutorials/SDL/50_SDL_and_opengl_2/index.php

## Comparatif 4: Systeme de build

### xmake vs CMake

| Critere | xmake | CMake |
| --- | --- | --- |
| Rapidite de prise en main | Elevee | Moyenne |
| Lisibilite (petit/moyen projet) | Elevee | Moyenne |
| Ubiquite ecosysteme et CI | Moyenne | Tres elevee |
| Usage actuel au coeur de Shimera | Oui | Partiel (dossiers learning) |
| Verbosite de configuration | Faible | Moyenne a elevee |
| Interoperabilite avec projets externes | Moyenne | Tres elevee |

Decision:
- xmake nous est apparu comme un outil de build moderne, rapide à prendre en main et parfaitement adapté à notre projet.
- CMake reste une compétence importante à documenter pour les utilisateurs qui pourraient vouloir intégrer Shimera dans des projets utilisant CMake, mais nous avons décidé de ne pas l'adopter comme système de build principal par simplicité et rapidité d'utilisation de xmake pour notre contexte.

sources:
- xmake vs CMake (documentation): https://stackshare.io/stackups/cmake-vs-xmake

## Comparatif 5: Langages shader

### GLSL vs HLSL vs Metal Shading Language

| Critere | GLSL | HLSL | MSL |
| --- | --- | --- | --- |
| Compatibilite native avec OpenGL | Excellente (langage natif) | Indirecte (traduction necessaire) | Non (ecosysteme Apple) |
| Portabilite immediate Linux/Windows/macOS | Elevee via OpenGL | Moyenne (plutot axe Direct3D) | Faible hors Apple |
| Cout d'integration dans Shimera aujourd'hui | Faible | Eleve | Eleve |
| Cout de maintenance long terme | Faible a modere | Eleve (pipeline de conversion/tests) | Eleve (code specifique plateforme) |
| Courbe d'apprentissage pour l'equipe et les users | Faible a moderee | Moderee | Moderee |
| Risque de divergence visuelle entre backends | Faible | Plus eleve | Plus eleve |

Decision:
- GLSL est retenu parce que c'est le meilleur ratio simplicite/portabilite/fiabilite pour Shimera.
- DirectX et Metal ne font pas partie de nos objectifs a court terme.
- Comme nous avons choisi OpenGL comme base technique, GLSL est le choix le plus logique et le plus coherent.
- GLSL est directement execute par le pipeline OpenGL: moins de couches intermediaires, moins de points de panne, debug plus rapide.
- HLSL et MSL n'apportent pas de gain decisif pour notre scope actuel, mais augmentent fortement le cout de maintenance (traduction, validation multi-plateforme, differences de rendu).
- Une strategie multi-langage shader pourra etre envisagee plus tard si nous decidons de supporter des backends DirectX/Metal, mais ce n'est pas dans notre scope actuel.

sources:
- GLSL, HLSL et MSL (documentation): https://alain.xyz/blog/a-review-of-shader-languages
- GLSL, HLSL et MSL (documentation): https://pulsegeek.com/articles/slang-glsl-and-hlsl-shader-formats-compared/