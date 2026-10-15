# UserDoc

Shimera est une bibliothèque C++ qui ajoute des effets de post-processing (flou, bloom, distorsion, vignette, ...) à un projet graphique existant, sans écrire une seule ligne de shader. Elle s'intègre à la boucle de rendu de la bibliothèque que vous utilisez déjà : **SFML 3**, **raylib**, **SDL3**, ou **OpenGL** directement (GLFW, ou tout autre moyen de créer un contexte OpenGL).

Cette page explique comment Shimera s'intègre à votre programme. Les pages de la barre latérale détaillent ensuite chaque partie.

## Fonctionnement

Tout programme Shimera repose sur les trois mêmes objets :

| Objet | Rôle |
|-------|------|
| [`shimera::Context`](#context) | Charge OpenGL pour Shimera. Créé une seule fois, après votre fenêtre. |
| [Cible hôte](#cibles-hotes) | Une surface hors écran, appartenant à Shimera mais dans laquelle vous dessinez avec les appels de **votre** bibliothèque. |
| [`shimera::EffectPipeline`](./effect_pipeline_builder.md) | La liste des effets, appliqués dans l'ordre à la cible hôte puis écrits dans la fenêtre. |

Chaque frame suit les trois mêmes étapes :

```cpp
scene.begin();      // 1. dessinez votre scène comme d'habitude, mais dans la cible hôte
    // ... vos appels de dessin SFML / raylib / SDL / OpenGL ...
scene.end();

fx.render(scene);   // 2. applique tous les effets et écrit le résultat dans la fenêtre

// 3. affichez la frame comme d'habitude (window.display(), EndDrawing(), ...)
```

## Démarrage rapide

```cpp
#include <shimera.hpp>             // Context, EffectPipeline et tous les effets
#include <hosts/RaylibTarget.hpp>  // la cible hôte de votre bibliothèque

int main() {
    InitWindow(960, 540, "Shimera");
    {
        auto context = shimera::Context::create();
        shimera::RaylibTarget scene(960, 540);

        shimera::EffectPipeline fx(960, 540);
        fx.add<shimera::Vignette>()
          .add<shimera::Bloom>();

        while (!WindowShouldClose()) {
            scene.begin();
                ClearBackground(DARKGRAY);
                DrawCircle(480, 270, 120.0f, SKYBLUE);
            scene.end();

            BeginDrawing();
                fx.render(scene);
            EndDrawing();
        }
    }
    CloseWindow();
}
```

L'en-tête `shimera.hpp` inclut le cœur de la bibliothèque et tous les effets. Les cibles hôtes s'incluent séparément (`hosts/SfmlTarget.hpp`, `hosts/RaylibTarget.hpp`, `hosts/SdlTarget.hpp`, `hosts/GlfwTarget.hpp`), car chacune dépend de sa bibliothèque hôte.

## Context

```cpp
static shimera::Context shimera::Context::create();
static std::string shimera::Context::getRendererInfo(); // ex. "OpenGL 4.6 ... on NVIDIA ..."
```

`Context::create()` charge les fonctions OpenGL utilisées par Shimera. Vous n'appelez plus `glewInit()` vous-même. Il doit être appelé **après** la création de votre fenêtre, une fois son contexte OpenGL actif, et **avant** de créer la moindre cible hôte, pipeline ou effet :

| Bibliothèque | Appeler `Context::create()` après |
|--------------|-----------------------------------|
| SFML | le constructeur de `sf::RenderWindow` |
| raylib | `InitWindow()` |
| GLFW | `glfwMakeContextCurrent()` |
| SDL3 | `SDL_CreateRenderer(window, "opengl")` |

Si aucun contexte OpenGL n'est actif, ou si OpenGL ne peut pas être chargé, il lève une `shimera::InitError` (une `std::runtime_error`) dont le message indique l'appel manquant. `Context` est déplaçable mais pas copiable.

## Cibles hôtes

Une cible hôte est l'endroit où votre scène est dessinée avant que Shimera ne la traite. Chaque bibliothèque hôte a la sienne, mais toutes partagent la même interface (`shimera::IHostTarget`) :

| Méthode | Description |
|---------|-------------|
| `begin()` | Redirige les appels de dessin de votre bibliothèque vers la cible |
| `end()` | Termine la scène (vide le batching de votre bibliothèque) et rend la main à la fenêtre |
| `native<T>()` | Pointeur typé vers l'objet natif sur lequel vous dessinez, quand votre bibliothèque en a besoin |
| `resize(width, height)` | Recrée la cible à une nouvelle taille |
| `getWidth()`, `getHeight()` | Taille actuelle |
| `getColor()`, `getDepth()` | La texture de couleur de la scène, et sa texture de profondeur quand elle existe (`nullptr` sinon) |

| Hôte | Classe / en-tête | Constructeur | `native<T>()` | Profondeur |
|------|------------------|--------------|---------------|------------|
| SFML 3 | `shimera::SfmlTarget`<br>`hosts/SfmlTarget.hpp` | `SfmlTarget(sf::RenderWindow& window, int width, int height)` | `sf::RenderTexture` | Non |
| raylib | `shimera::RaylibTarget`<br>`hosts/RaylibTarget.hpp` | `RaylibTarget(int width, int height, bool samplableDepth = false)` | `RenderTexture2D` | Optionnelle |
| SDL3 | `shimera::SdlTarget`<br>`hosts/SdlTarget.hpp` | `SdlTarget(SDL_Renderer& renderer, int width, int height)` | `SDL_Renderer` | Non |
| OpenGL | `shimera::GlfwTarget`<br>`hosts/GlfwTarget.hpp` | `GlfwTarget(int width, int height, bool samplableDepth = false)` | `shimera::GLFramebuffer` | Optionnelle |

### SFML

```cpp
shimera::SfmlTarget scene(window, 960, 540);
auto& texture = *scene.native<sf::RenderTexture>();

scene.begin();
    texture.clear(sf::Color::Black);
    texture.draw(sprite);
scene.end();                 // appelle display() sur la texture et réactive `window`

window.clear();
fx.render(scene);
window.display();
```

La cible a besoin de la fenêtre car `sf::RenderTexture` possède son propre contexte OpenGL : `end()` réactive le contexte de la fenêtre, vous n'avez donc jamais à appeler `setActive()` vous-même.

### raylib

```cpp
shimera::RaylibTarget scene(960, 540);

scene.begin();               // BeginTextureMode()
    ClearBackground(BLACK);
    BeginMode3D(camera);
        DrawCube(...);
    EndMode3D();
scene.end();                 // vide le batch de raylib, puis EndTextureMode()

BeginDrawing();
    ClearBackground(BLACK);
    fx.render(scene);
EndDrawing();
```

Passez `samplableDepth = true` pour obtenir aussi la profondeur de la scène sous forme de texture. `RaylibTarget::cameraFromRaylib(eyePosition)`, appelé à l'intérieur de `BeginMode3D()`, renvoie une `shimera::Camera` qui correspond exactement à la caméra de raylib, à utiliser avec les [matériaux](./materials/material_shaders.md).

### SDL3

```cpp
SDL_Renderer* renderer = SDL_CreateRenderer(window, "opengl"); // le driver "opengl" est obligatoire
auto context = shimera::Context::create();
shimera::SdlTarget scene(*renderer, 960, 540);

scene.begin();               // SDL_SetRenderTarget(renderer, <texture de la scène>)
    SDL_RenderClear(renderer);
    SDL_RenderFillRect(renderer, &rect);
scene.end();                 // retour à la fenêtre

fx.render(scene);
SDL_RenderPresent(renderer);
```

Shimera lit la scène via OpenGL, le renderer **doit** donc utiliser le driver `"opengl"` de SDL. Avec n'importe quel autre driver (Direct3D, Vulkan, GPU, logiciel), le constructeur de `SdlTarget` lève une `std::runtime_error` qui explique comment créer le renderer.

### OpenGL (GLFW et autres)

```cpp
shimera::GlfwTarget scene(width, height);

scene.begin();               // lie la cible et règle le viewport à sa taille
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glEnable(GL_DEPTH_TEST);
    // ... vos appels de dessin OpenGL ...
    glDisable(GL_DEPTH_TEST); // désactivez le test de profondeur et le culling avant les effets
    glDisable(GL_CULL_FACE);
scene.end();                 // restaure le framebuffer et le viewport précédents

fx.render(scene);
glfwSwapBuffers(window);
```

Malgré son nom, `GlfwTarget` n'utilise pas du tout GLFW : il lui faut seulement un contexte OpenGL actif, il fonctionne donc aussi avec SDL en mode OpenGL, GLUT, ou un contexte créé par une autre bibliothèque. Si votre scène active le test de profondeur ou le culling des faces, désactivez-les avant `fx.render()`, sinon les effets peuvent produire un écran noir.

## Redimensionnement

Quand la fenêtre est redimensionnée, redimensionnez à la fois la cible hôte et le pipeline :

```cpp
scene.resize(width, height);
fx.resize(width, height);
```

Le pipeline transmet la nouvelle taille à chacun de ses effets.

## Durée de vie

Les cibles hôtes, les pipelines et les effets possèdent des ressources OpenGL : ils doivent donc être détruits **avant** la fenêtre qui possède le contexte OpenGL. Quand ce sont des membres d'une classe, stockez-les dans des `std::optional` : ils peuvent alors être créés une fois la fenêtre ouverte, et réinitialisés dans le bon ordre dans le destructeur :

```cpp
class Game {
    // ...
    std::optional<shimera::Context> m_context;
    std::optional<shimera::SfmlTarget> m_scene;
    std::optional<shimera::EffectPipeline> m_fx;
};

Game::~Game() {
    m_fx.reset();
    m_scene.reset();
    m_context.reset();
    // puis détruisez la fenêtre
}
```

## Compilation et édition de liens

Avec xmake, dépendez de la cible Shimera correspondant à votre bibliothèque hôte. Elle apporte avec elle le cœur de la bibliothèque, GLEW et GLM :

| Bibliothèque hôte | Cible xmake |
|-------------------|-------------|
| SFML 3 | `shimera-sfml` |
| raylib | `shimera-raylib` |
| SDL3 | `shimera-sdl` |
| OpenGL (GLFW, ...) | `shimera-glfw` |

Les shaders des effets sont écrits en [Slang](https://shader-slang.org/) et compilés en GLSL pendant la compilation : `slangc` doit donc être dans votre `PATH` (ou indiqué avec `xmake f --slangc=<chemin>`). Sans lui, la compilation affiche un avertissement et ignore les shaders, et la création d'un effet échoue à l'exécution car son fichier de shader est introuvable.

::: warning Emplacement des shaders
Pour l'instant, Shimera charge ses shaders à l'exécution depuis le dossier `res/` des sources de Shimera (le chemin est fixé à la compilation). Laissez ce dossier en place pour que votre programme fonctionne.
:::

Voir [Installation](./installation.md) pour la mise en place complète.

## Migration depuis l'ancienne API

La bibliothèque a été réécrite. Si votre code utilise l'ancienne API, voici la correspondance de chaque élément avec la nouvelle :

| Ancienne API | Nouvelle API |
|--------------|--------------|
| `#include <shimera.h>` | `#include <shimera.hpp>` (+ `hosts/<Hôte>Target.hpp`) |
| `glewInit()` dans votre code | `shimera::Context::create()` |
| `IBackend* backend = BackendFactory::create()` | Supprimé. Créez un `Context`, puis une cible hôte |
| `backend->createFrameBuffer(w, h)` pour la scène | `SfmlTarget`, `RaylibTarget`, `SdlTarget` ou `GlfwTarget` |
| `static_cast<sf::RenderTexture*>(fb->getNativeRenderTarget())` | `scene.native<sf::RenderTexture>()` |
| `fb->bind()` / `fb->unbind()` autour de la scène | `scene.begin()` / `scene.end()` |
| `window.setActive(true)` avant le rendu des effets | Fait par `SfmlTarget::end()` |
| `EffectPipeline(backend, w, h)` | `EffectPipeline(w, h)` |
| `pipeline.addEffect<T>(...)` | `pipeline.add<T>(...)` |
| `pipeline.addEffect(std::move(effect))` | Supprimé. Utilisez `add<T>(args...)`, puis `get<T>()` pour configurer |
| `pipeline.build()` | Automatique au premier `render()` |
| `pipeline.render(fb->getTexture())` | `pipeline.render(scene)` |
| `effect.render(...)` avec des framebuffers intermédiaires manuels | `EffectPipeline`, même pour un seul effet |
| Classes `XxxEffect` (`DistortionEffect`, ...) | `shimera::Xxx` (`shimera::Distortion`, ...) |
| Constructeurs d'effets prenant `backend` | Ne prennent que les paramètres propres à l'effet |
| Membres d'uniformes publics (`distortion.time`, `m_uTime`, ...) | Setters (`withTime()`, ...) et getters |
| `withResolution()` sur Vignette | Supprimé, la résolution vient du pipeline |
| `HDRBloomEffect` | `shimera::Bloom` (sans tone mapping ACES) |
| `GrayscaleEffect` | `shimera::Saturation(0.0f)` |
| `SaturationEffect::withStrength()` | `Saturation::withSaturationFactor()` |
| `VignetteEffect::withIsRounded()` | `Vignette::withRounded()` |
| `ColorshiftEffect` | `shimera::ColorTint` (même paramètre `withTint()` et même comportement) |
| `AtmosphericScatteringEffect` | Pas encore porté sur la nouvelle API |

## Pour aller plus loin

- [Effect Pipeline Builder](./effect_pipeline_builder.md) : l'API complète du pipeline.
- [Shaders & Effets](./shaders/index.md) : tous les effets disponibles et leurs paramètres.
- [Matériaux](./materials/material_shaders.md) : des shaders appliqués à vos meshes 3D.
- Le dossier `examples/` du dépôt contient un programme complet et exécutable par bibliothèque hôte.
