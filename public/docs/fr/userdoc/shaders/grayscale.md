# Effet Échelle de Gris

**En-tête:** `include/effects/GrayscaleEffect.hpp`  
**Implémentation:** `src/effects/GrayscaleEffect.cpp`  
**Shader:** `res/shader/postprocessing/saturation.frag` (avec strength = 0.0)

## Description

L'effet échelle de gris convertit l'image rendue en noir et blanc en supprimant complètement les informations de couleur tout en préservant la luminance (luminosité). Cela crée un effet monochrome utile pour les styles artistiques, les looks de film ancien, ou les mécaniques de jeu.

## Paramètres

| Paramètre | Type | Remarque |
|-----------|------|---------|
| Aucun | - | L'échelle de gris est un effet fixe sans paramètres |

L'effet échelle de gris utilise en interne le shader Saturation avec `u_strength = 0.0`, qui désature complètement les couleurs.

## Utilisation

![Complete Example](../../../res/shaders/grayscale.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/GrayscaleEffect.hpp"

int main() {
    sf::RenderWindow window(sf::VideoMode(800, 600), "Démo Échelle de Gris");
    window.setActive(true);

    IBackend *backend = BackendFactory::create();
    IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(800, 600);

    GrayscaleEffect grayscale(backend);

    float time = 0.0f;
    while (window.isOpen()) {
        while (const std::optional event = window.pollEvent()) {
            if (event->is<sf::Event::Closed>()) window.close();
        }

        auto *rt = static_cast<sf::RenderTexture*>(sceneFramebuffer->getNativeRenderTarget());
        rt->clear(sf::Color::Black);
        // ... dessinez votre scène sur rt ...
        sceneFramebuffer->unbind();

        window.setActive(true);
        grayscale.render(sceneFramebuffer->getTexture());
        window.display();

        time += 0.016f;
    }

    delete sceneFramebuffer;
    delete backend;
    return 0;
}
```

## Remarque d'Implémentation

`GrayscaleEffect` est un wrapper pratique autour de `SaturationEffect`. Il fournit:
- Clarté sémantique dans le code (l'intention est évidente)
- Pas de paramètres à gérer
- Même performance
- API plus simple quand vous avez spécifiquement besoin du noir et blanc pur

Pour les transitions ou la désaturation partielle, utilisez [SaturationEffect](./saturation.md) avec des valeurs de strength variables à la place.
