# Shimera - Carte de sécurité

Ce document décrit la stratégie de protection technique de Shimera (librairie d'abstraction graphique C++, backends OpenGL / Raylib / SFML).

## 1. Périmètre & Modèle de menace

Avant d'identifier les risques, il est essentiel de définir ce que Shimera est et n'est pas afin de cadrer une analyse pertinente plutôt que générique.

Shimera est :
- Une **bibliothèque logicielle Open Source uniquement** (pas un service, pas une application)
- Une lib qui **ne manipule aucune donnée utilisateur** (pas de compte, pas de session, pas de contenu personnel)
- Une lib qui **ne stocke aucune donnée sensible** (pas de base de données, pas de fichiers de config utilisateur persistés)
- Une lib **sans service réseau ni authentification** (pas de serveur, pas d'API distante, pas de RCE réseau possible)

**Conséquence directe sur le scope de cette map** : les catégories de risque classiques (auth, gestion de session, fuite de données personnelles, exposition réseau) sont **hors scope**, car structurellement absentes de la lib. Le risque réel de Shimera se situe ailleurs :

- **Robustesse mémoire** : Shimera manipule directement des ressources GPU (OpenGL) via un code bas niveau, donc les risques classiques de sécurité C++ (buffer overflow, use-after-free, double-free) s'appliquent.
- **Frontière d'API publique** : Shimera est intégrée dans des applications tierces. Une entrée non validée peut se propager depuis l'app cliente jusqu'au driver graphique.
- **Intégrité de la supply chain / CI-CD** : en tant que projet Open Source avec un runner self-hosted, l'infrastructure de build est une surface d'attaque à part entière, indépendante du code de la lib elle-même.

Cette map documente donc **la stratégie de protection réelle de Shimera** : quoi est protégé, pourquoi, et comment dans les limites de ce périmètre.

## 2. Modules sensibles

Ces modules sont considérés sensibles car ils manipulent directement des ressources natives (GPU, mémoire, fichiers) à partir d'entrées fournies par le code appelant.

| Module | Rôle | Pourquoi il est sensible |
|---|---|---|
| **Framebuffers** (`OpenGLFramebuffer` et équivalents) | Allocation de FBO/RBO GPU à partir de dimensions fournies par l'appelant | Ce module est sensible car il manipule directement des ressources GPU |
| **Textures** (`OpenGLTexture` et équivalents) | Allocation de textures GPU | Même logique que Framebuffer, la manipulation GPU bas niveau reste une zone à surveiller |
| **Shaders** (`OpenGLShader` et équivalents) | Chargement, compilation et link de programmes GLSL depuis fichiers | Prend des chemins de fichiers fournis par l'appelant ; gère le cycle de vie d'une ressource GPU (`glProgram`) |
| **EffectPipeline** | Orchestration de plusieurs effets post-processing avec des FBO en double-buffer (ping-pong) | Module avec l'état interne le plus complexe du projet ; toute incohérence entre resize et rendu peut provoquer un comportement indéfini |
| **Backend factories** (`create*` de chaque backend) | Point de passage entre l'API publique de Shimera et l'implémentation native (GL/Raylib/SFML) | Frontière de *ownership* : ce sont ces fonctions qui transfèrent la responsabilité mémoire à l'application cliente |

## 3. Mécanismes critiques

### Ping-pong buffering (`EffectPipeline`)
Le pipeline d'effets alterne entre deux framebuffers (`m_fboA` / `m_fboB`) pour appliquer plusieurs effets en chaîne sans allocation supplémentaire à chaque passe.
- **Risque** : si `resize()` est appelé pendant un cycle de rendu en cours, ou si les FBO ne sont pas reconstruits de façon synchrone avec la texture source, un mismatch de dimensions peut produire un comportement GL indéfini. La validation des bornes sur `width`/`height` réduit le risque de valeurs aberrantes (négatives, nulles, excessives) déclenchant ce mismatch, mais ne couvre pas la synchronisation temporelle resize/rendu elle-même.
- **Nature du risque** : correctness / stabilité, pas une vulnérabilité exploitable par un tiers.

### Gestion d'état natif (bind/unbind)
Chaque ressource (shader, texture, framebuffer) gère son propre bind/unbind localement, sans state tracking centralisé.
- **Risque** : un `unbind()` manquant peut laisser un état GPU actif fuiter d'un objet à l'autre, provoquant des bugs de rendu silencieux, difficiles à diagnostiquer.
- **Nature du risque** : robustesse interne, pas une surface d'attaque.

### Ownership via pointeurs bruts aux frontières de backend
Les fonctions `create*` des backends retournent des pointeurs bruts (`new X()`), à charge pour l'application cliente de les libérer.
- **Risque** : fuite mémoire si l'appelant omet le `delete`, ou double-free si la responsabilité est mal comprise.
- **Nature du risque** : ce n'est pas une vulnérabilité en soi, mais un point de vigilance transmis à chaque nouvelle intégration ou nouveau backend.

## 4. Points d'accès (frontière API publique)

Ce sont les fonctions publiques de Shimera qui reçoivent une entrée fournie par le code appelant. C'est la frontière entre le code de la lib et du code externe non contrôlé, le seul véritable "point de contrôle d'accès" pertinent pour une bibliothèque sans réseau ni authentification.

| Point d'accès | Entrée externe | Validation actuelle | Statut |
|---|---|---|---|
| Constructeur Framebuffer (tous backends) | `width`, `height` (int) | Bornes vérifiées avant transmission aux appels natifs | OK |
| Constructeur Texture (tous backends) | `width`, `height` (int) | Bornes vérifiées avant transmission aux appels natifs | OK |
| `EffectPipeline::resize(width, height)` | `int`, `int` | Bornes vérifiées avant propagation aux Framebuffers internes | OK |
| Chargement de shader (`loadFromFiles(vertPath, fragPath)`, tous backends) | chemins fichiers (`std::string`) | Aucune | A Surveillé - Impact limité (voir section dédiée ci-dessous) |
| `EffectPipeline::get<TEffect>(index)` | index numérique | Vérifiée (exception `std::out_of_range` si absent) | OK |
| Compilation shader (`glCompileShader` + check `GL_COMPILE_STATUS`) | source GLSL | Vérifiée, échec propre via exception | OK |

### Focus : path traversal sur le chargement de shaders

Analyse du flow réel (identique sur tous les backends) : `path -> lecture fichier -> glShaderSource -> glCompileShader -> check du statut`.

- Si le chemin fourni sort du dossier assets prévu (ex. `../../fichier`), le pire cas concret est une **lecture de fichier non autorisée puis un échec de compilation propre** (le contenu n'étant probablement pas du GLSL valide).
- Risque conditionnel : uniquement pertinent si une application tierce utilisant Shimera expose un chemin choisi par un utilisateur final non fiable (système de mods, config externe).
- Fuite d'information mineure possible : les messages d'erreur de compilation GLSL peuvent citer des fragments du fichier lu.
- **Statut : risque théorique, non critique dans le scope actuel.**

## 5. Vulnérabilités du pipeline de build

| Point | Risque | Détail |
|---|---|---|
| Runner self-hosted (machine physique avec GPU dédié) | Faible | Configuration GitHub conforme aux recommandations officielles : workflows de fork bloqués par défaut (approval requise), aucun secret ni token write transmis aux PR externes. **Reste dépendant de la vigilance du reviewer au moment de l'approbation** |
| Sélection de backend (compile-time) | Aucun | `#ifdef SHIMERA_BACKEND_*` par xmake, pas de chargement dynamique (`dlopen`/`LoadLibrary`), garde `#error` si aucun backend défini |

## 6. Synthèse - stratégie de protection

| Ce qui est protégé | Pourquoi | Comment |
|---|---|---|
| Compilation de shaders | Éviter un crash sur GLSL invalide | Vérification systématique de `GL_COMPILE_STATUS`, cleanup et exception propre en cas d'échec |
| Sélection de backend | Éviter une config ambiguë ou incomplète | Résolution compile-time via macros xmake + garde `#error` |
| Mémoire (fuites, corruptions) | Détecter les erreurs mémoire tôt dans le cycle de dev | ASan/LSan (Linux), CRT Debug Heap (Windows), exécutés en CI |
| Accès CI au runner self-hosted | Éviter l'exécution de code arbitraire sur une machine physique depuis un fork externe | Approbation obligatoire pour les workflows de PR externes, aucun secret ni token en écriture transmis à ces workflows (réglages GitHub Actions) |
| Dimensions (Framebuffer/Texture/resize) | Éviter la transmission de valeurs négatives, nulles ou excessives aux appels graphiques natifs | Validation des bornes (`width > 0 && height > 0 && <= MAX_DIMENSION`) appliquée de façon cohérente sur les trois backends |

*Ce document est destiné à évoluer à chaque nouveau backend, nouvelle fonction publique exposée, ou changement d'infrastructure CI.*