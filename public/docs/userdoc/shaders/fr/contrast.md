# Effet de Contraste

**En-tête:** `include/effects/ContrastEffect.hpp`  
**Implémentation:** `src/effects/ContrastEffect.cpp`  
**Shader:** `res/shader/postprocessing/contrast.frag`

## Description

L'effet de contraste ajuste le contraste de l'image rendue en utilisant une approche multiplicative. Il étire ou comprime la distance entre les valeurs claires et sombres autour d'un point médian (0.5). Cela crée un ajustement de luminosité non linéaire qui préserve la demi-teinte grise tout en intensifiant les hautes lumières et les ombres.

## Paramètres

| Paramètre | Type | Plage | Défaut | Effet |
|-----------|------|-------|--------|-------|
| `u_contrastFactor` | float | `0.0` à `2.0+` | `1.0` | Multiplicateur d'intensité de contraste |

### Valeurs des Paramètres

- **`< 1.0`** - Diminue le contraste, l'image devient plus plate/grise (ex: `0.5` = 50% moins de contraste)
- **`1.0`** - Aucun changement (contraste normal)
- **`> 1.0`** - Augmente le contraste, les couleurs plus vivantes (ex: `1.5` = 50% plus de contraste)

## Utilisation

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/ContrastEffect.hpp"

int main() {
    sf::RenderWindow window(sf::VideoMode(800, 600), "Démo de Contraste");
    window.setActive(true);

    IBackend *backend = BackendFactory::create();
    IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(800, 600);

    ContrastEffect contrast(backend);
    contrast.withContrastFactor(1.5f);

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
        contrast.render(sceneFramebuffer->getTexture());
        window.display();

        time += 0.016f;
    }

    delete sceneFramebuffer;
    delete backend;
    return 0;
}
```
