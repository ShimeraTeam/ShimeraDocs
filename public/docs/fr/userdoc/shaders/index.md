# Shaders & Effets

Shimera fournit un système complet de shaders de post-traitement qui fonctionne sur plusieurs moteurs de rendu (OpenGL, SFML, Raylib, SDL). Cette section documente tous les effets de shader disponibles et comment les utiliser.

## Modèle d'Utilisation Basique

### 1. Créer un Backend
```cpp
#include <shimera.h>
#include "backend/BackendFactory.hpp"

IBackend *backend = BackendFactory::create();
```

### 2. Créer un Effet
```cpp
#include "effects/DistortionEffect.hpp"

DistortionEffect distortion(backend);
```

### 3. Configurer l'Effet (Optionnel)
```cpp
distortion.withNoiseScale(2.0f)
          .withDistortionStrength(0.1f)
          .withTimeScale(0.1f);
```

### 4. Rendre Votre Scène dans un Framebuffer
```cpp
IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(width, height);

sceneFramebuffer->bind();
// ... dessinez votre scène ...
sceneFramebuffer->unbind();
```

### 5. Appliquer l'Effet
```cpp
distortion.render(sceneFramebuffer->getTexture());
```

## Exemple Complet (SFML)

![Complete Example](../../../res/shaders/distortion-chromaticAberration.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include <shimera.h>
#include "backend/BackendFactory.hpp"
#include "effects/DistortionEffect.hpp"
#include "effects/ChromaticAberrationEffect.hpp"

int main() {
    sf::RenderWindow window(sf::VideoMode({960, 540}), "Démo Shimera");
    window.setActive(true);

    IBackend *backend = BackendFactory::create();
    IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(960, 540);
    IFrameBuffer *tempFramebuffer = backend->createFrameBuffer(960, 540);

    DistortionEffect distortion(backend);
    distortion.withNoiseScale(2.0f)
              .withDistortionStrength(0.1f)
              .withTimeScale(0.1f);

    ChromaticAberrationEffect chromatic(backend);
    chromatic.withStrength(1.0f)
             .withRadius(true)
             .withContrast(1.0f)
             .withSamples(32);

    sf::CircleShape circle(80.f);
    circle.setFillColor(sf::Color::Magenta);
    circle.setPosition({130.f, 190.f});

    sf::RectangleShape rectangle({160.f, 160.f});
    rectangle.setFillColor(sf::Color::White);
    rectangle.setPosition({400.f, 190.f});

    sf::CircleShape triangle(105.f, 3);
    triangle.setFillColor(sf::Color::Yellow);
    triangle.setPosition({645.f, 190.f});

    float time = 0.0f;

    while (window.isOpen()) {
        while (const std::optional event = window.pollEvent()) {
            if (event->is<sf::Event::Closed>()) {
                window.close();
            }
        }

        if (!window.setActive(true)) {
            break;
        }

        auto *renderTexture = static_cast<sf::RenderTexture*>(sceneFramebuffer->getNativeRenderTarget());
        renderTexture->clear(sf::Color::Black);
        renderTexture->draw(circle);
        renderTexture->draw(rectangle);
        renderTexture->draw(triangle);
        sceneFramebuffer->unbind();

        distortion.time = time;

        tempFramebuffer->bind();
        distortion.render(sceneFramebuffer->getTexture());
        tempFramebuffer->unbind();

        window.setActive(true);
        chromatic.render(tempFramebuffer->getTexture());

        time += 0.016f;
        window.display();
    }

    delete tempFramebuffer;
    delete sceneFramebuffer;
    delete backend;
    return 0;
}
```

## Rendu Multi-Passes (Chaînage d'Effets)

Lors de l'application de plusieurs effets avec SFML, utilisez des objets `IFrameBuffer` intermédiaires fournis par le backend pour chaîner les passes sans perdre de qualité:

```cpp
IFrameBuffer *temp1 = backend->createFrameBuffer(width, height);
IFrameBuffer *temp2 = backend->createFrameBuffer(width, height);

// Pass 1: Scène -> Distorsion -> temp1
temp1->bind();
distortion.render(sceneFramebuffer->getTexture());
temp1->unbind();

// Pass 2: temp1 -> Luminosité -> temp2
temp2->bind();
brightness.render(temp1->getTexture());
temp2->unbind();

// Pass 3: temp2 -> Vignette -> Écran
// Assurez-vous que le contexte de la fenêtre SFML est actif avant de rendre à l'écran
window.setActive(true);
vignette.render(temp2->getTexture());
```

## Effets Disponibles

Shimera fournit **11 effets**, 10 effets de post-traitement en espace écran plus un effet 3D sensible à la profondeur:

### Effets Simples (Paramètre Unique)
- [**Luminosité**](./brightness.md) - Éclaircir ou assombrir l'image entière
- [**Contraste**](./contrast.md) - Ajuster le contraste de l'image
- [**Saturation**](./saturation.md) - Contrôler la saturation des couleurs
- [**Échelle de Gris**](./grayscale.md) - Convertir en noir et blanc
- [**Décalage Couleur**](./colorshift.md) - Appliquer une superposition de teinte de couleur

### Effets Avancés (Paramètres Multiples)
- [**Vignette**](./vignette.md) - Assombrir les bords de l'image avec forme personnalisable
- [**Distorsion**](./distortion.md) - Déformer l'image avec animation Perlin noise
- [**Aberration Chromatique**](./chromatic_aberration.md) - Effet de séparation du canal de couleur RGB
- [**Flou Gaussien**](./gaussian_blur.md) - Flou lisse et isotrope avec une vraie distribution gaussienne
- [**Pixelisation**](./pixelisation.md) - Rendu pixel-art rétro par alignement sur une grille configurable

### Effets 3D (Sensibles à la Profondeur)
- [**Diffusion Atmosphérique**](./atmospheric_scattering.md) - Atmosphère planétaire d'inspiration physique (backends 3D uniquement)

## Compatibilité des Backends

La plupart des effets sont en espace écran et fonctionnent avec tous les backends:
- ✅ **OpenGL** (GLFW, SDL)
- ✅ **SFML** (sf::RenderWindow)
- ✅ **Raylib**
- ✅ **SDL2**

> **Exception :** La [Diffusion Atmosphérique](./atmospheric_scattering.md) est un effet 3D qui nécessite une caméra en perspective et un tampon de profondeur. Elle est prise en charge sur **OpenGL** et **Raylib**, mais **pas sur SFML** (2D).

## Prochaines Étapes

- Explorez les pages de documentation des effets individuels
- Consultez le répertoire `examples/` pour des codes complets et exécutables
```
