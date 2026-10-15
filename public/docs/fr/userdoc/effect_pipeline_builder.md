# Effect Pipeline Builder

**En-tête :** `EffectPipeline.hpp` (inclus par `shimera.hpp`)  
**Implémentation :** `src/EffectPipeline.cpp`

## Description

`EffectPipeline` est la façon d'appliquer des effets de post-processing avec Shimera. Vous ajoutez les effets dans l'ordre, appelez `render()` une fois par frame, et le pipeline s'occupe de tout le reste :

- il fait passer la sortie de chaque effet dans le suivant via deux framebuffers internes en ping-pong, quel que soit le nombre d'effets dans la chaîne ;
- il transmet la résolution de sortie à chaque effet (à l'`add()` et à chaque `resize()`), si bien que la plupart des effets n'ont jamais besoin de connaître la taille de l'écran ;
- il sauvegarde l'état OpenGL de l'hôte avant le rendu et le restaure ensuite (voir [Protection de l'état GL](#protection-de-l-etat-gl)), pour que SFML, raylib ou SDL continuent de dessiner correctement après le passage de Shimera.

Même pour un seul effet, passer par un pipeline est la méthode recommandée.

## Prérequis

Un pipeline effectue des appels OpenGL, deux choses doivent donc exister avant de le créer :

1. **Un `shimera::Context`**, créé une seule fois, après votre fenêtre et son contexte OpenGL. Il charge les fonctions OpenGL et lève une `shimera::InitError` indiquant l'appel manquant si aucun contexte n'est actif.
2. **Une cible hôte** (`SfmlTarget`, `RaylibTarget`, `GlfwTarget` ou `SdlTarget`), la surface hors écran dans laquelle votre scène est dessinée. Voir [Cibles hôtes](./index.md#cibles-hotes).

```cpp
#include <shimera.hpp>
#include <hosts/RaylibTarget.hpp>

InitWindow(960, 540, "My game");                       // 1. la fenêtre et son contexte GL

shimera::Context context = shimera::Context::create(); // 2. l'initialisation GL de Shimera
shimera::RaylibTarget scene(960, 540);                 // 3. là où la scène est dessinée
shimera::EffectPipeline fx(960, 540);                  // 4. les effets
```

::: tip Utilisez des membres `std::optional` dans vos classes
`Context`, les cibles hôtes et `EffectPipeline` ne peuvent pas être créés avant la fenêtre. Quand ce sont des membres d'une classe, stockez-les dans des `std::optional` et appelez `emplace()` une fois la fenêtre créée, comme le font tous les exemples officiels.
:::

## Référence API

### Constructeur

```cpp
EffectPipeline(int width, int height);
```

| Paramètre | Description |
|-----------|-------------|
| `width` | Largeur de sortie en pixels |
| `height` | Hauteur de sortie en pixels |

La taille doit correspondre au framebuffer dans lequel le pipeline écrit (en général la fenêtre). Elle sert pour le viewport, pour les framebuffers internes et comme résolution donnée à chaque effet. Sur les écrans haute densité, utilisez la taille du framebuffer en pixels (par exemple `glfwGetFramebufferSize`), et non la taille de la fenêtre en coordonnées écran.

`EffectPipeline` est déplaçable mais pas copiable : il peut être déplacé (dans un `std::optional`, un conteneur, ...) mais pas copié.

---

### `add`

```cpp
template<typename TEffect, typename... Args>
EffectPipeline& add(Args&&... args);
```

Construit un `TEffect` à l'intérieur du pipeline en transmettant `args` à son constructeur, puis lui donne la taille actuelle du pipeline. `TEffect` doit dériver de `shimera::Effect`, ce qui est vérifié à la compilation.

Retourne `*this`, les appels peuvent donc être chaînés.

```cpp
fx.add<shimera::Distortion>()                       // paramètres par défaut
  .add<shimera::Vignette>(1.0f, 0.45f, 0.35f)       // paramètres du constructeur
  .add<shimera::Bloom>(0.7f, 0.2f, 1.0f, 10.0f, 30);
```

La page de chaque effet liste les paramètres de son constructeur et leurs valeurs par défaut.

::: tip L'ordre compte
Les effets sont appliqués dans l'ordre où ils ont été ajoutés : le premier ajouté est le premier appliqué.
:::

---

### `get`

```cpp
template<typename TEffect>
TEffect& get(std::size_t index = 0);
```

Renvoie une référence vers le `index`-ième effet de type `TEffect` du pipeline. L'index ne compte **que les effets de ce type**, à partir de 0 : il n'est donc utile que si le même effet a été ajouté plusieurs fois.

Lève `std::out_of_range` si cet effet n'existe pas.

Utilisez-le pour configurer un effet après l'avoir ajouté, ou pour le mettre à jour à chaque frame :

```cpp
// Configurer une fois, après l'ajout
fx.get<shimera::GaussianBlur>()
  .withSigma(5.0f)
  .withSamples(15);

// Mettre à jour à chaque frame
fx.get<shimera::Distortion>().withTime(elapsedSeconds);

// Deux effets du même type
fx.get<shimera::GaussianBlur>(0).withSigma(4.0f); // premier flou
fx.get<shimera::GaussianBlur>(1).withSigma(8.0f); // second flou
```

::: tip
`get()` parcourt la liste des effets à chaque appel. Si vous mettez un effet à jour à chaque frame, gardez la référence une fois pour toutes et réutilisez-la :

```cpp
auto& distortion = fx.get<shimera::Distortion>();
// dans la boucle :
distortion.withTime(time);
```

La référence reste valide pendant toute la durée de vie du pipeline : ajouter d'autres effets ne l'invalide pas.
:::

---

### `render` depuis une cible hôte (recommandé)

```cpp
void render(IHostTarget& scene);
void render(IHostTarget& scene, GLFramebuffer& target);
```

Exécute tous les effets activés sur la scène contenue dans `scene`, qui doit avoir été terminée avec `scene.end()`. La texture de profondeur de la scène est transmise automatiquement quand l'hôte en fournit une.

- La première surcharge écrit le résultat dans **le framebuffer lié au moment de l'appel à `render()`**. Après `scene.end()`, c'est la fenêtre pour tous les hôtes : c'est donc l'appel que vous écrivez dans votre boucle principale.
- La seconde surcharge écrit le résultat dans `target`, pour alimenter un autre pipeline ou une étape de composition ultérieure.

```cpp
scene.begin();
    // ... dessinez votre scène avec votre bibliothèque hôte ...
scene.end();

fx.render(scene); // vers la fenêtre
```

---

### `render` depuis une texture

```cpp
void render(const GLTexture& input, const GLTexture* depth = nullptr);
void render(const GLTexture& input, GLFramebuffer& target, const GLTexture* depth = nullptr);
```

Identique au précédent, mais depuis n'importe quelle `GLTexture` au lieu d'une cible hôte. Utilisez-le quand l'image à traiter ne vient pas d'une cible hôte, par exemple la sortie d'un autre pipeline rendue dans un `GLFramebuffer`.

| Paramètre | Description |
|-----------|-------------|
| `input` | Texture à traiter |
| `target` | Framebuffer dans lequel écrire (seconde surcharge uniquement) |
| `depth` | Texture de profondeur optionnelle, lue uniquement par les effets qui ont besoin de la profondeur de la scène |

```cpp
shimera::GLFramebuffer intermediate(960, 540);

first.render(scene, intermediate);        // pipeline 1 -> framebuffer intermédiaire
second.render(intermediate.color());      // pipeline 2 -> fenêtre
```

#### Profondeur de la scène

Un effet peut déclarer qu'il a besoin de la profondeur de la scène (`Effect::needsDepth()`). Pour ceux-là, le pipeline transmet la texture de profondeur donnée à `render()`, ou celle de la cible hôte. Si un tel effet est activé et qu'aucune profondeur n'a jamais été fournie, `render()` lève une `std::runtime_error`.

Aucun des effets intégrés n'a besoin de la profondeur pour le moment. Pour obtenir une texture de profondeur depuis une cible hôte, créez-la avec `samplableDepth = true` (`RaylibTarget` et `GlfwTarget` uniquement).

---

### `resize`

```cpp
void resize(int width, int height);
```

Redimensionne les framebuffers internes et transmet la nouvelle taille à chaque effet. Appelez-le à chaque redimensionnement de la fenêtre, avec le `resize()` de votre cible hôte :

```cpp
scene.resize(width, height);
fx.resize(width, height);
```

---

### Requêtes

```cpp
std::size_t size() const;        // nombre d'effets, désactivés compris
std::string effectNames() const; // "Vignette, Distortion, Bloom", ou "no_effects"
int getWidth() const;
int getHeight() const;
```

`effectNames()` est pratique pour les logs ou pour un overlay de debug.

---

### Activer et désactiver des effets

Chaque effet possède `setEnabled(bool)` et `isEnabled()`. Les effets désactivés restent dans le pipeline (ils gardent leurs paramètres et sont toujours renvoyés par `get()`), mais sont ignorés au rendu : ils ne coûtent ni passe ni temps GPU.

```cpp
auto& bloom = fx.get<shimera::Bloom>();
bloom.setEnabled(!bloom.isEnabled()); // bascule sur un appui de touche
```

::: warning Tous les effets désactivés
Quand aucun effet n'est activé, `render()` retourne sans rien dessiner : la scène n'est **pas** copiée vers la sortie. Si vous permettez à l'utilisateur de désactiver tous les effets, dessinez vous-même la scène dans ce cas.
:::

## Utilisation

### Exemple minimal (raylib)

```cpp
#include <raylib.h>
#include <shimera.hpp>
#include <hosts/RaylibTarget.hpp>

int main() {
    constexpr int width = 960;
    constexpr int height = 540;

    InitWindow(width, height, "Shimera - raylib");
    SetTargetFPS(60);
    {
        auto context = shimera::Context::create();
        shimera::RaylibTarget scene(width, height);

        shimera::EffectPipeline fx(width, height);
        fx.add<shimera::Distortion>()
          .add<shimera::Bloom>();

        auto& distortion = fx.get<shimera::Distortion>();

        while (!WindowShouldClose()) {
            scene.begin();
                ClearBackground(Color{18, 20, 28, 255});
                DrawCircle(480, 270, 120.0f, Color{41, 181, 242, 255});
            scene.end();

            distortion.withTime(static_cast<float>(GetTime()));

            BeginDrawing();
                ClearBackground(BLACK);
                fx.render(scene);
            EndDrawing();
        }
    } // les objets Shimera sont détruits ici, tant que le contexte GL existe encore
    CloseWindow();
    return 0;
}
```

::: warning Ordre de destruction
Les pipelines, les effets et les cibles hôtes possèdent des ressources OpenGL. Détruisez-les **avant** la fenêtre (`CloseWindow()`, `glfwDestroyWindow()`, `SDL_DestroyWindow()`, ...), c'est pourquoi l'exemple ci-dessus utilise un bloc interne.
:::

---

### Exemple complet (SFML)

```cpp
#include <SFML/Graphics.hpp>
#include <shimera.hpp>
#include <hosts/SfmlTarget.hpp>

#include <iostream>
#include <optional>

int main() {
    sf::RenderWindow window(sf::VideoMode({960, 540}), "Shimera - SFML");
    window.setVerticalSyncEnabled(true);

    try {
        auto context = shimera::Context::create();
        std::cout << shimera::Context::getRendererInfo() << '\n';

        shimera::SfmlTarget scene(window, 960, 540);

        shimera::EffectPipeline fx(960, 540);
        fx.add<shimera::Vignette>(1.0f, 0.45f, 0.35f)
          .add<shimera::Distortion>()
          .add<shimera::Bloom>(0.7f, 0.2f, 1.0f, 10.0f, 30);

        auto& distortion = fx.get<shimera::Distortion>();

        sf::CircleShape circle(115.0f);
        circle.setPosition({555.0f, 160.0f});
        circle.setFillColor(sf::Color::Yellow);

        sf::Clock clock;
        while (window.isOpen()) {
            while (const std::optional event = window.pollEvent()) {
                if (event->is<sf::Event::Closed>()) {
                    window.close();
                } else if (const auto* resized = event->getIf<sf::Event::Resized>()) {
                    const auto w = static_cast<int>(resized->size.x);
                    const auto h = static_cast<int>(resized->size.y);
                    window.setView(sf::View(sf::FloatRect({0.0f, 0.0f}, sf::Vector2f(resized->size))));
                    scene.resize(w, h);
                    fx.resize(w, h);
                }
            }

            // 1. Dessiner la scène dans la cible
            auto& texture = *scene.native<sf::RenderTexture>();
            scene.begin();
                texture.clear(sf::Color::Black);
                texture.draw(circle);
            scene.end();

            // 2. Mettre à jour les effets
            distortion.withTime(clock.getElapsedTime().asSeconds());

            // 3. Appliquer le pipeline à la fenêtre
            window.clear(sf::Color::Black);
            fx.render(scene);
            window.display();
        }
    } catch (const std::exception& error) {
        std::cerr << error.what() << '\n';
        return 1;
    }
    return 0;
}
```

## Fonctionnement interne

Les framebuffers sont créés au premier `render()`. Le pipeline en garde ensuite exactement **deux** et alterne entre eux, le dernier effet écrivant directement dans la sortie :

```
Texture de la scène  ──►  Effet 0  ──►  fboA
                          Effet 1  ──►  fboB    (lit fboA)
                          Effet 2  ──►  fboA    (lit fboB)
                          ...
                          Effet N  ──►  sortie  (lit le dernier fbo écrit)
```

Avec un seul effet activé, aucun framebuffer intermédiaire n'est utilisé : l'effet lit la scène et écrit directement dans la sortie.

Certains effets (Gaussian Blur, Bloom) ont besoin de deux passes à eux seuls. Ils gardent leur propre framebuffer intermédiaire, dimensionné par le pipeline, et n'occupent donc qu'une seule place dans la chaîne.

### Protection de l'état GL

OpenGL est une machine à états globale, partagée entre Shimera et votre bibliothèque hôte, et les bibliothèques hôtes gardent en cache ce qu'elles pensent être lié. Pour ne pas casser le prochain dessin de l'hôte, `render()` entoure toute la chaîne d'un `GLStateGuard` qui capture l'état qu'il va modifier (programme lié, VAO, buffers, framebuffer, textures des unités 0 à 7, blending, réglages de profondeur et de culling, viewport, couleur d'effacement) et le restaure une fois la chaîne terminée, même si un effet lève une exception.

Si vous faites le rendu à un moment où vous savez que l'état n'a pas d'importance et voulez éviter ces requêtes, la protection peut être désactivée globalement :

```cpp
shimera::GLStateGuard::setEnabled(false);
```

## Comparaison avec le chaînage manuel

Les effets peuvent être rendus à la main avec `Effect::render(input)` et `Effect::render(input, target)`, mais vous devez alors faire vous-même le travail du pipeline :

```cpp
shimera::Distortion distortion;
shimera::GaussianBlur blur;
shimera::Vignette vignette;

// Les effets apprennent la taille de sortie par resize(), et ceux à plusieurs passes
// y allouent leur framebuffer intermédiaire. Sans cet appel, ils ne fonctionnent pas.
distortion.resize(960, 540);
blur.resize(960, 540);
vignette.resize(960, 540);

shimera::GLFramebuffer temp1(960, 540);
shimera::GLFramebuffer temp2(960, 540);

// À chaque frame :
{
    const shimera::GLStateGuard guard;   // protège l'état GL de l'hôte
    const uint32_t output = shimera::currentDrawFramebuffer();
    glViewport(0, 0, 960, 540);

    distortion.render(scene.getColor(), temp1);
    blur.render(temp1.color(), temp2);

    shimera::bindFramebuffer(output);
    vignette.render(temp2.color());
}
```

Avec `EffectPipeline` :

```cpp
fx.render(scene);
```

## Références

- `Args&&...` : [Forwarding References](https://en.cppreference.com/cpp/language/reference#Forwarding_references) ([*Plus simple à comprendre*](https://lemire.me/blog/2024/05/13/forwarding-references-in-c/))
