# Veille technologique Shimera

> Comment l'équipe reste informée sur les technologies utilisées par Shimera, et transforme cette information en décisions concrètes.

## Objectif

Shimera est une librairie C++23 bas niveau qui superpose des effets de post-processing (shaders) au-dessus d'OpenGL, SFML et raylib. Ce sont des technologies matures et stables, mais la pile est vaste : les APIs graphiques sont larges et truffées de comportements spécifiques aux pilotes, et l'outillage autour (librairies de fenêtrage, système de build, CI/CD, documentation) publie encore quelques ruptures ponctuelles.

La veille technologique est notre effort organisé pour maîtriser cette surface. L'objectif n'est pas de réagir à un flux de changements permanent, mais de garder un petit ensemble de canaux à fort signal sous revue régulière, afin de :

- repérer les ruptures d'API et les dépréciations avant qu'elles n'atteignent nos utilisateurs ;
- adopter les bonnes pratiques de la communauté plutôt que de les réinventer ;
- garder une structure de dépôt et un déploiement alignés sur la façon dont les librairies graphiques open source comparables sont construites ;
- garder justifiés dans le temps nos choix techniques (documentés dans les [Comparatifs technologiques](/fr/library/technology_comparative_briefs)).

Ce document décrit les quatre canaux que nous surveillons et la manière dont chacun alimente le projet.

## Périmètre : technologies surveillées

La veille est centrée sur les technologies réellement utilisées dans le dépôt.

| Domaine | Technologie | Pourquoi nous la surveillons |
| --- | --- | --- |
| Langage | C++23 | Nouvelles fonctionnalités du standard, support des compilateurs (GCC/Clang/MSVC), patterns RAII pour les ressources GPU |
| API graphique | OpenGL 3.3+, GLEW | Support des extensions, comportement des pilotes, dépréciation des chemins legacy |
| Shaders | GLSL | Compatibilité des versions, pièges de portabilité entre pilotes |
| Mathématiques | GLM | Changements d'API, considérations d'alignement/SIMD |
| Backends | SFML 3, raylib, SDL3 (exploratoire) | Versions majeures et ruptures d'API |
| Build | xmake | Mises à jour du gestionnaire de paquets, configuration des toolchains, builds multi-plateformes |
| CI/CD & hébergement | GitHub Actions, GitHub Releases | Montées de version des actions, changements d'images de runners, patterns de release |
| Documentation | VitePress | Mises à jour du canal alpha, changements du format de configuration |

## Canal 1 : Reddit, suivi de communautés

**Rôle :** prendre le pouls des communautés C++ et graphics-programming : les problèmes rencontrés, les outils qui montent ou déclinent, et l'accueil réservé à une librairie comme la nôtre.

Reddit est notre principal canal informel car l'écosystème C++/gamedev y est très actif et valorise historiquement l'open source (les mêmes communautés qui portent SFML, raylib et bgfx). Nous suivons :

| Subreddit | Ce que nous surveillons |
| --- | --- |
| r/cpp | Adoption de C++23, actualité des compilateurs, conventions de conception de librairies |
| r/opengl | Bizarreries de pilotes, portabilité des shaders, patterns de framebuffer et de post-processing, techniques de rendu world-space et de matériaux |
| r/raylib | Interopérabilité OpenGL avec raylib, intégration de shaders dans raylib, exemples de la communauté |
| r/sfml | Interopérabilité OpenGL avec SFML, exemples de la communauté |
| r/sdl | Interopérabilité OpenGL avec SDL, exemples de la communauté |
| r/vulkan | Signaux sur la direction que prend l'écosystème graphique (pertinent pour notre stratégie d'API à long terme) |

**Apport au projet :** des fils de discussion communautaires ont directement nourri plusieurs décisions comparatives déjà consignées dans le projet (par exemple les discussions sur le choix du langage sur r/opengl citées dans les comparatifs technologiques). Reddit fait aussi partie de notre [stratégie de diffusion](/fr/deployment/diffusion_strategy) : le plan de lancement public vise r/cpp, r/opengl et r/gamedev, donc surveiller ces communautés en amont nous indique comment formuler l'annonce et quelles objections anticiper.

**Règle pratique :** l'opinion communautaire est un signal, pas une source de vérité. Tout élément actionnable trouvé sur Reddit est confirmé auprès de la documentation officielle avant de modifier le code.

## Canal 2 : Stack Overflow, bonnes pratiques et résolution de problèmes

**Rôle :** résoudre des problèmes d'ingénierie concrets et reproductibles, et aligner notre implémentation sur les bonnes pratiques établies.

Lorsque nous butons sur un obstacle technique précis (un shader qui compile sur un pilote mais pas sur un autre, un framebuffer qui se comporte mal au redimensionnement, une configuration xmake qui refuse de linker), Stack Overflow est le chemin le plus rapide vers une réponse vérifiée et validée par les votes. Nous surveillons et recherchons ces tags :

| Tag | Usage typique |
| --- | --- |
| `[opengl]` | Création de contexte, framebuffer objects, formats de texture |
| `[glsl]` | Gestion des uniforms, qualificateurs de précision, pragmas de version |
| `[c++]` / `[c++23]` | Idiomes modernes, templates, wrappers RAII de ressources |
| `[sfml]` / `[raylib]` | Interopérabilité OpenGL propre à chaque backend |
| `[glew]` | Chargement des extensions et ordre d'initialisation |
| `[framebuffer]` | Rendu vers texture, le pattern au cœur de notre pipeline de post-processing |

**Apport au projet :** les thèmes d'ingénierie récurrents du code (la pipeline framebuffer/rendu vers texture, les abstractions shader et texture par backend, l'ordre correct d'initialisation de GLEW) sont exactement les domaines où les réponses Stack Overflow font gagner des heures.

**Règle pratique :** nous privilégions les réponses acceptées, récentes et fortement votées, et nous vérifions l'API référencée dans la documentation officielle avant de fusionner. Les extraits sont adaptés à nos wrappers RAII, jamais copiés tels quels.

## Canal 3 : GitHub, structure et déploiement (modèles)

**Rôle :** modeler notre structure de dépôt, notre CI/CD et notre processus de release sur la façon dont les librairies graphiques open source matures sont réellement organisées.

GitHub est l'endroit où nous observons *comment les projets comparables sont construits et livrés*, et pas seulement leur code. Nous étudions des dépôts de référence comme modèles structurels :

| Dépôt de référence | Ce que nous empruntons / comparons |
| --- | --- |
| raylib | Organisation orientée exemples, surface d'API publique simple, empaquetage des releases |
| SFML | Séparation backend/module, releases versionnées, structure de documentation |
| glfw / GLEW | Surface d'API C minimale, matrices de build multi-plateformes |
| bgfx | Stratégie d'abstraction multi-backend, organisation de l'outillage shader |
| godot | Architecture de rendu multi-backend (OpenGL/Vulkan), gouvernance des contributions, cadence de release |
| blender | Organisation d'une large base de code C/C++, build et empaquetage multi-plateformes, pratiques de documentation |

Nous surveillons aussi l'écosystème **GitHub Actions**, puisque toute notre chaîne de livraison y tourne. Le dépôt utilise déjà plusieurs modèles de workflow directement issus de cette veille :

- **CI** (`ci-build`, `ci-tests`) : build et tests à chaque changement.
- **CD** (`cd-release`) : une matrice de build sur `ubuntu-latest`/`windows-latest`, les trois backends (`opengl`, `sfml`, `raylib`) et les architectures, qui empaquette les artefacts `.so`/`.a`/`.dll`/`.lib` et publie des GitHub Releases (avec détection de pré-release) sur les tags `v*`.
- **Miroir** (`mirror_to_epitech`) : le dépôt est mis en miroir vers l'infrastructure de l'école.

**Apport au projet :** observer comment raylib et SFML taguent leurs releases, empaquettent leurs binaires et labellisent leurs issues a façonné notre propre modèle de release taguée (`v0.1.0`, releases pilotées par un changelog) ainsi que le plan de topics/labels de la stratégie de diffusion. Suivre les changements de version des actions (par exemple les montées de version majeures de checkout, upload-artifact et gh-release) est une nécessité de maintenance : notre workflow `cd-release` épingle des versions majeures précises et doit être mis à jour à mesure que ces actions évoluent.

**Règle pratique :** nous considérons un pattern comme adoptable lorsqu'il apparaît de façon cohérente dans plusieurs librairies établies, et non parce qu'un seul dépôt tendance l'utilise.

## Canal 4 : Documentation officielle, référence des technologies utilisées

**Rôle :** la source faisant autorité. Toute décision qui touche à une API y est validée avant d'être livrée.

La documentation officielle est le point de contrôle final de la veille : elle lève l'ambiguïté que les canaux communautaires laissent ouverte. Nous maintenons un ensemble organisé de références primaires, une par technologie de la pile :

| Technologie | Référence primaire |
| --- | --- |
| OpenGL | Registre OpenGL de Khronos, <https://registry.khronos.org/OpenGL/> et <https://docs.gl> |
| GLSL | Spécifications GLSL de Khronos (via le registre OpenGL) |
| GLEW | <https://glew.sourceforge.net/> |
| GLM | <https://github.com/g-truc/glm> (manuel et documentation d'API) |
| SFML | <https://www.sfml-dev.org/documentation/> et les tutoriels 3.0 |
| raylib | Cheatsheet <https://www.raylib.com/> et le wiki raylib |
| SDL3 | <https://wiki.libsdl.org/SDL3/> |
| xmake | <https://xmake.io/> |
| VitePress | <https://vitepress.dev/> |
| GitHub Actions | <https://docs.github.com/actions> |
| Ressource d'apprentissage | <https://learnopengl.com/> (apprentissage OpenGL fondamental, reflété dans les sous-modules `learnings/LearningOpenGL*`) |

**Apport au projet :** les comparatifs technologiques citent déjà la documentation officielle OpenGL et SFML pour justifier les choix C++/OpenGL/GLSL. La veille de versions est critique ici : la transition SFML 2 vers 3 fut une rupture, les définitions de paquets xmake changent entre les versions, et VitePress est suivi sur un canal alpha (`^2.0.0-alpha.15`), donc nous lisons les notes de version avant toute montée de dépendance.

**Règle pratique :** la documentation est la source de vérité ; lorsqu'elle contredit un fil Reddit ou une vieille réponse Stack Overflow, c'est la documentation qui l'emporte.

## Processus de veille et cadence

Les quatre canaux forment un entonnoir : signal informel en haut, validation faisant autorité en bas.

| Canal | Nature | Cadence typique | Sortie |
| --- | --- | --- | --- |
| Reddit | Tendances, ressenti communautaire | Continue / survol hebdomadaire | Prise de conscience, cadrage du lancement, sujets à investiguer |
| Stack Overflow | Résolution de problèmes concrets | À la demande, par problème | Solutions vérifiées adaptées à notre code |
| GitHub | Modèles de structure et de déploiement | Par cycle de release, quand une question se pose | Organisation du dépôt, CI/CD, patterns de release |
| Documentation officielle | Référence faisant autorité | Avant tout changement de dépendance ou d'API | Décisions validées et livrables |

Le flux typique : un signal repéré sur **Reddit** ou rencontré sous forme de bug devient une question précise résolue sur **Stack Overflow** ; le volet structure ou déploiement est modelé sur **GitHub** ; et rien n'est fusionné tant que ce n'est pas confirmé dans la **documentation officielle**.

## Références

- Choix technologiques : [Comparatifs technologiques](/fr/library/technology_comparative_briefs)
- Diffusion et lancement communautaire : [Stratégie de diffusion](/fr/deployment/diffusion_strategy)
- Environnement technique : [Environnement Technique](/fr/deployment/technology_environment)
- Registre OpenGL : <https://registry.khronos.org/OpenGL/>
- learnopengl.com : <https://learnopengl.com/>
- raylib : <https://www.raylib.com/>
- SFML : <https://www.sfml-dev.org/>
- xmake : <https://xmake.io/>
- VitePress : <https://vitepress.dev/>
