# Shaders & Effets

Shimera fournit un ensemble d'effets de post-processing prêts à l'emploi. Chaque effet est une classe C++ qui encapsule un shader : vous réglez ses paramètres depuis le C++, et Shimera gère le shader, ses uniformes et l'état OpenGL. Les mêmes effets fonctionnent avec toutes les bibliothèques hôtes supportées (SFML 3, raylib, SDL3 et OpenGL directement).

Cette page montre comment utiliser les effets de manière générale. Chaque effet a ensuite sa propre page qui liste ses paramètres.

## Modèle d'utilisation de base

### 1. Créer le Context et une cible hôte

Une fois votre fenêtre créée :

```cpp
#include <shimera.hpp>
#include <hosts/SfmlTarget.hpp>

auto context = shimera::Context::create();
shimera::SfmlTarget scene(window, 960, 540);
```

Voir [Cibles hôtes](../index.md#cibles-hotes) pour les autres bibliothèques hôtes.

### 2. Créer un pipeline et ajouter des effets

```cpp
shimera::EffectPipeline fx(960, 540);
fx.add<shimera::Distortion>()             // paramètres par défaut
  .add<shimera::Vignette>(1.0f, 0.45f);   // ou paramètres du constructeur
```

### 3. Configurer les effets (optionnel)

Chaque effet possède des setters `with...()` qui renvoient l'effet lui-même, ils peuvent donc être chaînés :

```cpp
fx.get<shimera::Distortion>()
  .withNoiseScale(2.0f)
  .withDistortionStrength(0.1f)
  .withTimeScale(0.1f);
```

### 4. Dessiner votre scène dans la cible

```cpp
scene.begin();
    // ... dessinez avec votre bibliothèque hôte ...
scene.end();
```

### 5. Appliquer les effets

```cpp
fx.render(scene);
```

## Exemple complet (SFML)

![Complete Example](../../../res/shaders/distortion-chromaticAberration.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <shimera.hpp>
#include <hosts/SfmlTarget.hpp>

#include <iostream>
#include <optional>

int main() {
    sf::RenderWindow window(sf::VideoMode({960, 540}), "Shimera Demo");
    window.setVerticalSyncEnabled(true);

    try {
        auto context = shimera::Context::create();
        shimera::SfmlTarget scene(window, 960, 540);

        shimera::EffectPipeline fx(960, 540);
        fx.add<shimera::Distortion>(2.0f, 0.1f, 0.1f)          // noiseScale, strength, timeScale
          .add<shimera::ChromaticAberration>(1.0f, true, 1.0f, 32);

        auto& distortion = fx.get<shimera::Distortion>();

        sf::CircleShape circle(80.f);
        circle.setFillColor(sf::Color::Magenta);
        circle.setPosition({130.f, 190.f});

        sf::RectangleShape rectangle({160.f, 160.f});
        rectangle.setFillColor(sf::Color::White);
        rectangle.setPosition({400.f, 190.f});

        sf::CircleShape triangle(105.f, 3);
        triangle.setFillColor(sf::Color::Yellow);
        triangle.setPosition({645.f, 190.f});

        sf::Clock clock;
        while (window.isOpen()) {
            while (const std::optional event = window.pollEvent()) {
                if (event->is<sf::Event::Closed>())
                    window.close();
            }

            auto& texture = *scene.native<sf::RenderTexture>();
            scene.begin();
                texture.clear(sf::Color::Black);
                texture.draw(circle);
                texture.draw(rectangle);
                texture.draw(triangle);
            scene.end();

            distortion.withTime(clock.getElapsedTime().asSeconds());

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

## API commune des effets

Tous les effets dérivent de `shimera::Effect` et partagent ces méthodes :

| Méthode | Description |
|---------|-------------|
| `with...(value)` | Règle un paramètre, renvoie l'effet pour le chaînage |
| `get...()` | Relit un paramètre (voir la page de chaque effet pour les getters disponibles) |
| `setEnabled(bool)` / `isEnabled()` | Désactive l'effet sans le retirer du pipeline |
| `getName()` | Le nom de l'effet, ex. `"Bloom"` |
| `resize(width, height)` | Donne la taille de sortie à l'effet. Appelé pour vous par le pipeline |

Les paramètres sont envoyés au shader à chaque rendu : un appel à `with...()` prend donc effet dès la frame suivante. Les effets sont déplaçables mais pas copiables.

### Résolution

La plupart des effets qui dépendent de la taille de l'écran (Vignette, Bloom) la reçoivent automatiquement du pipeline, à l'`add()` et à chaque `pipeline.resize()`.

[Gaussian Blur](./gaussian_blur.md) et [Pixelisation](./pixelisation.md) font exception : ils utilisent encore leur propre valeur `withResolution()`, qui vaut `1920 x 1080` par défaut. Réglez-la sur votre taille de sortie, et mettez-la à jour quand la fenêtre est redimensionnée :

```cpp
fx.get<shimera::GaussianBlur>().withResolution(shimera::Vec2(960.0f, 540.0f));
```

### Types

Les paramètres vectoriels utilisent les petits types de Shimera du dossier `uniform/`, vous n'avez donc jamais besoin de GLM ni des types vectoriels de votre hôte :

```cpp
shimera::Vec2(960.0f, 540.0f)          // Vec2<float>
shimera::Vec3(1.0f, 0.0f, 0.0f)        // Vec3<float>, couleurs RGB
shimera::Vec4(0.0f, 0.0f, 0.0f, 1.0f)  // Vec4<float>, couleurs RGBA
```

## Utiliser un effet sans pipeline

`EffectPipeline` est la méthode recommandée pour rendre des effets, même un seul. Un effet peut tout de même être rendu directement :

```cpp
void render(const GLTexture& input);                        // dans le framebuffer lié
void render(const GLTexture& input, GLFramebuffer& target); // dans `target`
```

Dans ce cas, c'est à vous de faire ce que fait normalement le pipeline :

- appeler `effect.resize(width, height)` une fois avant le premier rendu et à chaque redimensionnement de la fenêtre. Les effets à plusieurs passes (Gaussian Blur, Bloom) y créent leur framebuffer intermédiaire, et **plantent** si cet appel n'a jamais eu lieu ;
- régler le viewport sur la taille de sortie ;
- protéger l'état OpenGL de l'hôte avec un `shimera::GLStateGuard` pendant le rendu.

Voir [Comparaison avec le chaînage manuel](../effect_pipeline_builder.md#comparaison-avec-le-chainage-manuel) pour un exemple.

## Effets disponibles

Shimera fournit **10 effets** :

### Réglages de couleur
- [**Brightness**](./brightness.md) - Éclaircir ou assombrir toute l'image
- [**Contrast**](./contrast.md) - Ajuster le contraste de l'image
- [**Saturation**](./saturation.md) - Contrôler la saturation des couleurs, jusqu'au noir et blanc
- [**Color Tint**](./color_tint.md) - Mélanger l'image avec une couleur

### Effets avancés (plusieurs paramètres)
- [**Vignette**](./vignette.md) - Assombrir (ou teinter) les bords de l'image avec une forme personnalisable
- [**Distortion**](./distortion.md) - Déformer l'image avec un bruit de gradient animé
- [**Chromatic Aberration**](./chromatic_aberration.md) - Séparer les canaux RGB comme un objectif de mauvaise qualité
- [**Gaussian Blur**](./gaussian_blur.md) - Lisser l'image avec un flou gaussien séparable en deux passes
- [**Pixelisation**](./pixelisation.md) - Réduire l'image en gros pixels pour un rendu rétro
- [**Bloom**](./bloom.md) - Faire briller les zones lumineuses

### Pas encore portés sur la nouvelle API
Cet effet existait dans la version précédente de la bibliothèque et n'a pas encore été réécrit. Sa page décrit encore l'ancienne API.
- [**Atmospheric Scattering**](./atmospheric_scattering.md) - Atmosphère planétaire d'inspiration physique (3D, utilise la profondeur)

::: info Effets renommés ou fusionnés
Grayscale correspond maintenant à `Saturation` avec un facteur de `0.0`, HDR Bloom est devenu [Bloom](./bloom.md), et Colorshift est devenu [Color Tint](./color_tint.md).
:::

## Compatibilité avec les hôtes

Tous les effets travaillent dans l'espace écran et fonctionnent avec toutes les cibles hôtes :

- ✅ **SFML 3** (`SfmlTarget`)
- ✅ **raylib** (`RaylibTarget`)
- ✅ **SDL3** (`SdlTarget`, avec le driver de renderer `"opengl"`)
- ✅ **OpenGL** (`GlfwTarget` : GLFW, SDL en mode OpenGL, ou n'importe quel contexte OpenGL actif)

## Sources des shaders

Les shaders des effets sont écrits en [Slang](https://shader-slang.org/) et se trouvent dans `res/shader/postprocessing/`. À la compilation, xmake compile chaque fichier `.slang` en GLSL 330 dans `res/shader/generated/`, et c'est ce que Shimera charge à l'exécution. Tous les effets partagent le même vertex shader plein écran, `postprocess.slang`.

## Pour aller plus loin

- Parcourez les pages de chaque effet
- Lisez la page [Effect Pipeline Builder](../effect_pipeline_builder.md) pour l'API complète du pipeline
- Consultez le dossier `examples/` du dépôt pour des programmes complets et exécutables
