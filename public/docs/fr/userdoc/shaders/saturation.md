# Effet de Saturation

**En-tête:** `include/effects/SaturationEffect.hpp`  
**Implémentation:** `src/effects/SaturationEffect.cpp`  
**Shader:** `res/shader/postprocessing/saturation.frag`

## Description

L'effet de saturation ajuste la saturation des couleurs de l'image rendue en interpolant entre une version en niveaux de gris et les couleurs originales. Cela vous permet de contrôler à quel point les couleurs apparaissent vibrantes ou muted, du noir et blanc complet aux couleurs sursaturées.

## Paramètres

| Paramètre | Type | Plage | Défaut | Effet |
|-----------|------|-------|--------|-------|
| `u_strength` | float | `0.0` à `2.0+` | `1.0` | Intensité de la saturation |

### Valeurs des Paramètres

- **`0.0`** - Complètement désaturé (noir et blanc pur)
- **`1.0`** - Aucun changement (couleurs originales)
- **`> 1.0`** - Sursaturé, couleurs plus vivantes (ex: `1.5` = 50% plus saturé)
- **`< 0.0`** à **`1.0`** - Partiellement désaturé

## Utilisation

![Complete Example](../../../res/shaders/saturation.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/SaturationEffect.hpp"

int main() {
    sf::RenderWindow window(sf::VideoMode(800, 600), "Démo de Saturation");
    window.setActive(true);

    IBackend *backend = BackendFactory::create();
    IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(800, 600);

    SaturationEffect saturation(backend);
    saturation.withStrength(1.5f);

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
        saturation.render(sceneFramebuffer->getTexture());
        window.display();

        time += 0.016f;
    }

    delete sceneFramebuffer;
    delete backend;
    return 0;
}
```
