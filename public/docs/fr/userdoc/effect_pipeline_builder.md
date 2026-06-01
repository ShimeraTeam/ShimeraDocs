# Effect Pipeline Builder

**Header :** `include/EffectPipeline.inl`

## Description

`EffectPipeline` vous permet d'enchaîner plusieurs effets de post-processing sans gérer manuellement les framebuffers intermédiaires. Vous ajoutez les effets dans l'ordre, appelez `render()`, et le pipeline gère en interne le routage ping-pong des framebuffers. Chaque effet lit la sortie du précédent et écrit dans l'entrée du suivant, avec seulement deux framebuffers alloués quel que soit le nombre d'effets dans la chaîne.

Sans `EffectPipeline`, enchaîner N effets nécessite N−1 framebuffers intermédiaires gérés manuellement et une séquence d'appels bind/unbind minutieuse.

## Référence API

### Constructeur

```cpp
EffectPipeline(IBackend* backend, unsigned int width, unsigned int height);
```

| Paramètre | Description |
|-----------|-------------|
| `backend` | Pointeur non-propriétaire vers le backend actif (le même que celui utilisé pour créer vos effets) |
| `width` | Largeur de la résolution de sortie en pixels |
| `height` | Hauteur de la résolution de sortie en pixels |

---

### `addEffect` : construire directement dans la pipeline

```cpp
template<typename TEffect, typename... Args>
EffectPipeline& addEffect(Args&&... args);
```

Construit l'effet directement à l'intérieur de la pipeline. Le backend est injecté automatiquement en premier argument du constructeur, vous n'avez donc à passer que les paramètres spécifiques à l'effet.

Retourne `*this` pour permettre le chaînage.

```cpp
pipeline.addEffect<DistortionEffect>()
        .addEffect<GaussianBlurEffect>()
        .addEffect<VignetteEffect>(1.0f, 0.4f, 0.3f); // Les paramètres du shader peuvent aussi être définis comme ceci
```

---

### `addEffect` : déplacer un effet pré-configuré

```cpp
template<typename TEffect>
EffectPipeline& addEffect(TEffect&& effect);
```

Déplace un effet déjà construit et configuré dans la pipeline. Utilisez cette surcharge lorsque vous souhaitez configurer un effet via l'API fluide avant de le transférer.

Retourne `*this` pour permettre le chaînage.

```cpp
DistortionEffect distortion(backend);
distortion.withNoiseScale(2.0f).withDistortionStrength(0.1f);

pipeline.addEffect(std::move(distortion));  // distortion appartient maintenant à la pipeline
```

::: warning
Après `std::move`, la variable d'origine est vide (distortion = nullptr). Accédez à l'effet via `pipeline.get<DistortionEffect>()` à la place.
:::

---

### `get` : récupérer un effet pour des mises à jour par frame

```cpp
template<typename TEffect>
TEffect& get(std::size_t index = 0);
```

Retourne une référence vers le N-ième effet de type `TEffect` dans la pipeline (indexé à partir de 0 par type). Utilisez cela pour mettre à jour des paramètres à chaque frame (par exemple, incrémenter un uniform de temps).

Erreur avec `std::out_of_range` si aucun effet de ce type n'existe à l'index donné.

```cpp
pipeline.get<DistortionEffect>().m_uTime = time; // index 0 par défaut
pipeline.get<GaussianBlurEffect>(0).m_uSigma = 4.0f; // premier flou
pipeline.get<GaussianBlurEffect>(1).m_uSigma = 8.0f; // second flou
pipeline.get<DistortionEffect>().withTime(time); // ! Fonctionne aussi, mais déconseillé pour des mises à jour fréquentes d'uniform !
```

---

### `build`

```cpp
void build();
```

Alloue les deux framebuffers ping-pong internes à la résolution configurée. Cet appel est **optionnel** : `render()` l'appelle automatiquement à la première frame. Utilisez-le explicitement si vous souhaitez pré-allouer les ressources GPU au démarrage plutôt qu'au premier rendu.

---

### `render` : sortie vers l'écran

```cpp
void render(ITexture& input);
```

Exécute tous les effets activés dans l'ordre, route la sortie à travers les framebuffers ping-pong internes, et présente le résultat final vers la cible écran active.

---

### `render` : sortie vers un framebuffer

```cpp
void render(ITexture& input, IFrameBuffer& target);
```

Identique à la surcharge ci-dessus, mais écrit le rendu final dans `target` plutôt que sur l'écran. Utilisez cela pour alimenter la sortie du pipeline dans un autre pipeline ou une étape de post-composition.

---

### `resize`

```cpp
void resize(int width, int height);
```

Met à jour la résolution des framebuffers internes. Appelez cette méthode lorsque votre fenêtre ou cible de rendu est redimensionnée.

---

### `size`

```cpp
std::size_t size() const;
```

Retourne le nombre total d'effets dans la pipeline (y compris les effets désactivés).


## Utilisation

### Construction basique d'effets dans le pipeline

```cpp
#include "EffectPipeline.inl"
#include "effects/DistortionEffect.hpp"
#include "effects/GaussianBlurEffect.hpp"

IBackend *backend = BackendFactory::create();
IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(960, 540);

EffectPipeline pipeline(backend, 960, 540);
pipeline.addEffect<DistortionEffect>()
        .addEffect<GaussianBlurEffect>()
        .build();  // optionnel, alloue les FBO maintenant plutôt qu'au premier rendu

float time = 0.0f;
while (window.isOpen()) {
    // ... rendu de la scène dans sceneFramebuffer ...

    pipeline.get<DistortionEffect>().m_uTime = time;
    pipeline.render(sceneFramebuffer->getTexture());

    time += 0.016f;
    window.display();
}
```

---

### Pré-configurer les effets avant de les ajouter

Utile lorsque vous souhaitez définir des paramètres initiaux via l'API fluide :

```cpp
GaussianBlurEffect blur(backend);
blur.withSigma(5.0f)
    .withSamples(15)
    .withResolution(Vec2(960.0f, 540.0f));

DistortionEffect distortion(backend);
distortion.withNoiseScale(2.0f)
          .withDistortionStrength(0.1f);

EffectPipeline pipeline(backend, 960, 540);
pipeline.addEffect(std::move(distortion))
        .addEffect(std::move(blur));
```
::: tip
**L'ordre est important :** les effets sont appliqués dans l'ordre dans lequel ils ont été ajoutés à la pipeline, le premier ajouté est le premier appliqué.
:::

---

### Exemple complet (SFML)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include <GL/glew.h>
#include <SFML/OpenGL.hpp>
#include "backend/BackendFactory.hpp"
#include "backend/sfml/SFMLFramebuffer.hpp"
#include "effects/DistortionEffect.hpp"
#include "effects/GaussianBlurEffect.hpp"
#include "EffectPipeline.inl"

using namespace shimera;

int main() {
    const sf::VideoMode videoMode({960, 540});
    sf::RenderWindow window(videoMode, "Effect Pipeline Demo");
    window.setActive(true);

    if (glewInit() != GLEW_OK) return -1;

    IBackend *backend = BackendFactory::create();
    IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(960, 540);

    EffectPipeline effects(backend, 960, 540);
    effects.addEffect<DistortionEffect>()
            .addEffect<GaussianBlurEffect>()
            .build();

    effects.get<GaussianBlurEffect>()
            .withSigma(5.0f)
            .withSamples(15)
            .withResolution(Vec2(960.0f, 540.0f));

    sf::Texture texture;
    texture.loadFromFile("path/to/image.jpg");
    sf::Sprite sprite(texture);

    sf::Clock clock;
    clock.start();
    while (window.isOpen()) {
        while (const std::optional event = window.pollEvent()) {
            if (event->is<sf::Event::Closed>()) window.close();
        }

        if (!window.isOpen()) break;
        if (!window.setActive(true)) break;

        // Rendu de la scène dans le framebuffer
        auto *rt = static_cast<sf::RenderTexture*>(sceneFramebuffer->getNativeRenderTarget());
        rt->clear(sf::Color::Black);
        rt->draw(sprite);
        sceneFramebuffer->unbind();

        // Application du pipeline : distortion -> flou gaussien -> écran
        effects.get<DistortionEffect>().m_uTime = clock.getElapsedTime().asSeconds();
        glClear(GL_COLOR_BUFFER_BIT);
        effects.render(sceneFramebuffer->getTexture());

        window.display();
    }
    clock.stop();

    delete sceneFramebuffer;
    delete backend;
    return 0;
}
```

---

## Fonctionnement interne

Le pipeline conserve exactement **deux framebuffers** et les alterne à chaque passe :

```
Texture scène  ──►  Effet 0  ──►  fboA
                    Effet 1  ──►  fboB  (lit fboA)
                    Effet 2  ──►  fboA  (lit fboB)
                    Effet N  ──►  Écran (lit le dernier fbo écrit)
```

Les effets désactivés (via `setEnabled(false)`) sont entièrement ignorés au moment du rendu : ils ne consomment ni slot de framebuffer ni temps GPU.

---

## Comparaison avec le chaînage manuel

Sans `EffectPipeline` :

```cpp
// Ping-pong manuel, vous gérez chaque framebuffer
IFrameBuffer *temp1 = backend->createFrameBuffer(960, 540);
IFrameBuffer *temp2 = backend->createFrameBuffer(960, 540);

temp1->bind();
distortion.render(scene->getTexture());
temp1->unbind();

temp2->bind();
blur.render(temp1->getTexture());
temp2->unbind();

window.setActive(true);
vignette.render(temp2->getTexture());

delete temp1;
delete temp2;
```

Avec `EffectPipeline` :

```cpp
pipeline.render(scene->getTexture());
```

## Références

- `T&&` : [Références de transfert](https://en.cppreference.com/cpp/language/reference#Forwarding_references) ([*Plus facile à comprendre*](https://lemire.me/blog/2024/05/13/forwarding-references-in-c/))
