# Effet de Luminosité

**En-tête:** `include/effects/BrightnessEffect.hpp`
**Implémentation:** `src/effects/BrightnessEffect.cpp`
**Shader:** `res/shader/postprocessing/brightness.frag`

## Description

L'effet de luminosité ajuste la luminosité globale de l'image rendue en ajoutant ou soustrayant une valeur à tous les composants de couleur RGB. C'est un ajustement de luminosité linéaire simple qui éclaircit ou assombrit l'ensemble de l'image uniformément.

## Paramètres

| Paramètre | Type | Plage | Défaut | Effet |
|-----------|------|-------|--------|-------|
| `u_strength` | float | `-1.0` à `1.0` | `0.0` | Montant d'ajustement de luminosité |

### Valeurs des Paramètres

- **`< 0.0`** - Assombrit l'image (ex: `-0.2` = 20% plus sombre)
- **`0.0`** - Aucun changement (luminosité originale)
- **`> 0.0`** - Éclaircit l'image (ex: `+0.2` = 20% plus lumineux)

## Utilisation

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/BrightnessEffect.hpp"

int main() {
    sf::RenderWindow window(sf::VideoMode(800, 600), "Démo de Luminosité");
    window.setActive(true);

    IBackend *backend = BackendFactory::create();
    IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(800, 600);

    BrightnessEffect brightness(backend);
    brightness.withStrength(0.2f);

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
        brightness.render(sceneFramebuffer->getTexture());
        window.display();

        time += 0.016f;
    }

    delete sceneFramebuffer;
    delete backend;
    return 0;
}
```
