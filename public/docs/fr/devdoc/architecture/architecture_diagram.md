# Diagramme d'architecture de Shimera

Une vue d'ensemble visuelle de Shimera.

Sommaire :

1. [Couches d'interaction & modules principaux](#1-couches-dinteraction--modules-principaux)
2. [Abstraction du backend (interfaces -> implémentations)](#2-abstraction-du-backend-interfaces--implémentations)
3. [Flux de rendu](#3-flux-de-rendu)
4. [Dépendances externes](#4-dépendances-externes)
5. [Table de référence des modules](#5-table-de-référence-des-modules)


## 1. Couches d'interaction & modules principaux

La direction des dépendances est strictement à sens unique (haut -> bas) : l'orchestration des
effets de haut niveau ne dépend jamais d'un backend concret. Un backend est choisi **à la
compilation**, pas à l'exécution.

```mermaid
flowchart TB
    subgraph APP["🖥️ Couche Application : apps hôtes / exemples"]
        direction LR
        EX_GL["Exemple OpenGL<br/>+ fenêtre/contexte GLFW"]
        EX_SFML["Exemple SFML"]
        EX_RL["Exemple Raylib"]
    end

    subgraph API["🏛️ API publique / Façade"]
        SH["shimera.h<br/>include global"]
        SHAPI["shimera_api.h<br/>macros export/import SHIMERA_API"]
    end

    subgraph EFFECTS["🎨 Couche DSL d'effets"]
        SEB["ShaderEffectBase"]
        SE["ShaderEffect&lt;Derived&gt;<br/>API fluide CRTP"]
        PPE["Effets de post-traitement<br/>Brightness, Contrast, Saturation<br/>Grayscale, Colortint, Distortion<br/>Vignette, ChromaticAberration<br/>GaussianBlur, HDRBloom<br/>Pixelisation, AtmosphericScattering"]
        MEB["MaterialEffectBase<br/>MaterialEffect&lt;Derived&gt;"]
        FRESNEL["FresnelEffect<br/>matériau 3D"]
        PIPE["EffectPipeline<br/>enchaînement de passes"]
    end

    subgraph KERNEL["⚙️ Noyau d'abstraction : interfaces"]
        FACT["BackendFactory::create()<br/>sélection du backend à la compilation"]
        IB["IBackend<br/>fabrique de ressources + renderMaterial"]
        IFACES["IFrameBuffer, IPostProcessor, IShader<br/>ITexture, IMaterial, IMesh"]
    end

    subgraph BACKENDS["🔌 Adaptateurs de backend : concrets"]
        GLB["Backend OpenGL"]
        SFB["Backend SFML"]
        RLB["Backend Raylib"]
    end

    subgraph SUPPORT["🧰 Modules de support / utilitaires"]
        UNI["uniform/<br/>variant UniformValue, Vec2/3/4, Mat4, Color"]
        SCENE["scene/<br/>Camera, CameraFactory, TransformFactory"]
        CONV["converts/<br/>GlmConvert, conversions Raylib"]
        GLU["glUtils<br/>compilation/liaison shader GLC/ASSERT"]
    end

    APP --> API
    API --> EFFECTS
    EFFECTS --> KERNEL
    KERNEL --> BACKENDS
    FACT --> IB
    IB --> GLB
    IB --> SFB
    IB --> RLB
    EFFECTS -. utilise .-> UNI
    KERNEL -. utilise .-> SCENE
    BACKENDS -. utilise .-> GLU
    BACKENDS -. utilise .-> CONV
    BACKENDS -. utilise .-> UNI
```

**Responsabilités des couches**

| Couche | Rôle |
|-------|------|
| Application | Possède la fenêtre/le contexte GL (GLFW/SFML/Raylib), pilote la boucle de rendu, possède les objets Shimera. |
| API publique / Façade | En-têtes d'entrée stables + macros d'export ABI (`SHIMERA_API`). |
| DSL d'effets | Objets d'effet fluides et agnostiques du backend (`.with()`), chacun encapsulant un post-processeur. |
| Noyau d'abstraction | Interfaces pures + `BackendFactory`, la frontière qui garde les effets agnostiques du backend. |
| Adaptateurs de backend | Implémentations concrètes OpenGL / SFML / Raylib de chaque interface. |
| Support / Utilitaires | Uniformes typés & maths, aides scène/caméra, conversions glm, aides d'erreurs GL/shaders. |

## 2. Abstraction du backend (interfaces -> implémentations)

`IBackend` est une fabrique : elle crée chaque ressource de rendu sous forme d'interface, si bien
que le code applicatif et les effets ne manipulent que des pointeurs d'interface. Chaque backend
concret implémente l'ensemble complet.

```mermaid
classDiagram
    class IBackend {
        <<interface>>
        +createFrameBuffer(w, h, samplableDepth) IFrameBuffer
        +createPostProcessor(vert, frag) IPostProcessor
        +createMesh(positions, normals, indices) IMesh
        +createMaterial(vert, frag) IMaterial
        +renderMaterial(material, mesh, camera, transform)
        +createTexture(w, h) ITexture
        +createShader(vert, frag) IShader
    }
    class IFrameBuffer {
        <<interface>>
        +bind()
        +unbind()
        +clear(Color)
        +resize(w, h)
        +getTexture() ITexture
        +getNativeRenderTarget()
    }
    class IPostProcessor {
        <<interface>>
        +setShader(IShader)
        +render(ITexture)
        +setUniform(name, UniformValue)
    }
    class IShader {
        <<interface>>
        +bind()
        +unbind()
        +setUniform(name, UniformValue)
    }
    class ITexture {
        <<interface>>
        +bind()
        +getNativeHandle()
    }
    class IMaterial {
        <<interface>>
    }
    class IMesh {
        <<interface>>
    }

    IBackend ..> IFrameBuffer : crée
    IBackend ..> IPostProcessor : crée
    IBackend ..> IShader : crée
    IBackend ..> ITexture : crée
    IBackend ..> IMaterial : crée
    IBackend ..> IMesh : crée

    OpenGLBackend --|> IBackend
    SFMLBackend --|> IBackend
    RaylibBackend --|> IBackend
```

**Sélection à la compilation** (`BackendFactory::create()` + définitions `xmake.lua`) :

```mermaid
flowchart LR
    F["BackendFactory::create()"]
    F -->|SHIMERA_BACKEND_OPENGL| A["new OpenGLBackend"]
    F -->|SHIMERA_BACKEND_SFML| B["new SFMLBackend"]
    F -->|SHIMERA_BACKEND_RAYLIB| C["new RaylibBackend"]
```

> Chaque artefact compilé (`shimera-opengl`, `shimera-sfml`, `shimera-raylib`) est lié
> à exactement un seul chemin de backend, il n'y a pas de commutation de plugin à l'exécution.

## 3. Flux de rendu

### 3.1 Chaîne de passes de post-traitement (ping-pong)

La pipeline centrale : capturer la scène hors écran, puis appliquer une ou plusieurs passes de
shader plein écran, en alternant les framebuffers pour qu'aucune passe ne lise et n'écrive la
même cible.

```mermaid
flowchart LR
    SCENE(["Appels de rendu de la scène"]) --> FBA["Framebuffer A<br/>bind -> render -> unbind"]
    FBA -->|getTexture| P1["Passe d'effet 1<br/>updateUniforms -> quad plein écran"]
    P1 --> FBB["Framebuffer B"]
    FBB -->|getTexture| P2["Passe d'effet 2"]
    P2 --> SCREEN(["🖼️ Écran / cible active"])

    P1 -. ou directement vers l'écran<br/>passe unique .-> SCREEN
```

### 3.2 Chemin des matériaux 3D

En complément du post-traitement, `IBackend::renderMaterial()` dessine une géométrie
ombrée/éclairée (par ex. `FresnelEffect`) à partir d'un mesh, d'un shader de matériau,
d'une caméra et d'une transformation.

```mermaid
flowchart LR
    MESH["IMesh<br/>positions, normales, indices"] --> RM
    MAT["IMaterial<br/>shader de matériau"] --> RM
    CAM["Camera<br/>vue / projection"] --> RM
    XF["Mat4 transform"] --> RM
    RM["IBackend::renderMaterial()"] --> OUT(["Framebuffer / écran"])
```

### 3.3 Flux de contrôle et d'uniformes par image

Comment un effet transmet ses paramètres CPU au GPU à chaque image (`std::visit` distribue le
`UniformValue` vers le bon appel `glUniform*`, les emplacements d'uniformes sont mis en cache).

```mermaid
sequenceDiagram
    participant App
    participant Effect as ShaderEffect
    participant PP as IPostProcessor
    participant Sh as IShader
    participant GPU

    App->>Effect: render(inputTexture, targetFB)
    Note over Effect: ignoré si désactivé
    Effect->>Effect: updateUniforms()
    loop pour chaque paramètre
        Effect->>PP: setUniform(name, UniformValue)
        PP->>Sh: setUniform(...)
        Sh->>GPU: glUniform* via std::visit (emplacement mis en cache)
    end
    Effect->>PP: render(inputTexture)
    PP->>GPU: bind shader + bind texture (GL_TEXTURE0) + dessin du quad
    GPU-->>App: pixels transformés -> cible
```

## 4. Dépendances externes

`GLEW`, `GLM` et une bibliothèque système OpenGL sont **toujours** liées, même les backends SFML
et Raylib exécutent leurs passes de shader via OpenGL brut. Les bibliothèques de framework sont
sélectionnées par cible.

```mermaid
flowchart TB
    subgraph CORE["Toujours liées (tous les backends)"]
        GLEW["GLEW"]
        GLM["GLM<br/>maths / matrices"]
        GLSYS["Bibliothèque système OpenGL<br/>opengl32, GL, OpenGL.framework"]
    end

    subgraph OPT["Spécifique au backend (compilation, optionnel)"]
        SFML["SFML"]
        RAYLIB["Raylib"]
    end

    subgraph HOST["Hôte / exemple uniquement"]
        GLFW["GLFW<br/>fenêtre de l'exemple OpenGL"]
    end

    TGL["shimera-opengl"] --> GLEW
    TGL --> GLM
    TGL --> GLSYS

    TSF["shimera-sfml"] --> GLEW
    TSF --> GLM
    TSF --> GLSYS
    TSF --> SFML

    TRL["shimera-raylib"] --> GLEW
    TRL --> GLM
    TRL --> GLSYS
    TRL --> RAYLIB

    TGL -. application exemple .-> GLFW
```

**Matrice de dépendances par cible**

| Cible | GLEW | GLM | Bibliothèque système OpenGL | Framework | Statut |
|--------|:----:|:---:|:-------------:|-----------|--------|
| `shimera-opengl` | ✅ | ✅ | ✅ | - | complet |
| `shimera-sfml` | ✅ | ✅ | ✅ | SFML | complet |
| `shimera-raylib` | ✅ | ✅ | ✅ | Raylib | complet |

> Ressources à l'exécution : les effets chargent le GLSL depuis `res/shader/postprocessing/` (et
> `res/shader/material/`) par chemin relatif, les shaders doivent donc être livrés avec le binaire.

## 5. Table de référence des modules

| Module | Emplacement | Objectif |
|--------|----------|---------|
| API publique | `include/shimera.h`, `include/shimera_api.h` | Include global + macros d'export ABI. |
| Interfaces de backend | `include/backend/I*.hpp` | `IBackend`, `IFrameBuffer`, `IPostProcessor`, `IShader`, `ITexture`, `IMaterial`, `IMesh`. |
| Fabrique de backend | `include/backend/BackendFactory.hpp`, `src/backend/BackendFactory.cpp` | Construction du backend à la compilation. |
| Backend OpenGL | `include/backend/opengl/`, `src/backend/opengl/` | FBO/texture/shader/mesh/matériau natifs + passe plein écran. |
| Backend SFML | `include/backend/sfml/`, `src/backend/sfml/` | Encapsule `sf::RenderTexture`/`sf::Texture` ; passes via OpenGL. |
| Backend Raylib | `include/backend/raylib/`, `src/backend/raylib/` | Encapsule `RenderTexture2D` ; passes via OpenGL ; `converts/` pour caméra/types. |
| Effets | `include/effects/`, `src/effects/` | `ShaderEffect<Derived>` CRTP + 12 effets de post-traitement. |
| Effets de matériau | `include/effects/materials/`, `src/effects/materials/` | `MaterialEffectBase` + `FresnelEffect` (3D). |
| Scène | `include/scene/`, `src/scene/` | `Camera`, `CameraFactory`, `TransformFactory`. |
| Uniformes / maths | `include/uniform/` | Variant `UniformValue`, `Vec2/3/4`, `Mat4`, `Color`. |
| Conversions | `include/converts/`, `src/converts/` | `GlmConvert` et conversions de types Raylib. |
| Utilitaires GL | `include/glUtils.h`, `src/glUtils.cpp` | Macros d'erreurs GL + aides de compilation/liaison de shaders. |

---

### Légende

- **Flèche pleine** : dépendance directe / flux de données.
- **Flèche pointillée** : utilisation optionnelle / conditionnelle.
