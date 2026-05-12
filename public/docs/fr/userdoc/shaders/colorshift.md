# Effet de Décalage Couleur

**En-tête:** `include/effects/ColorshiftEffect.hpp`  
**Implémentation:** `src/effects/ColorshiftEffect.cpp`  
**Shader:** `res/shader/postprocessing/colorshift.frag`

## Description

L'effet de décalage couleur applique une teinte ou un filtre de couleur à l'image rendue en fusionnant les couleurs originales avec une couleur RGB uniforme. Cela crée des superpositions colorées utiles pour les effets atmosphériques, les changements de ton émotionnel, ou le filtrage environnemental.

## Paramètres

| Paramètre | Type | Plage | Défaut | Effet |
|-----------|------|-------|--------|-------|
| `u_tint` | Vec3<float> | `(0,0,0)` à `(1,1,1)` | `(0,0,0)` | Couleur de teinte RGB à fusionner avec l'original |  

### Valeurs de Couleur

Chaque composant RGB varie de `0.0` à `1.0`:

- **`(0.0, 0.0, 0.0)`** - Pas de teinte (couleurs originales)
- **`(1.0, 0.0, 0.0)`** - Teinte rouge
- **`(0.0, 1.0, 0.0)`** - Teinte verte
- **`(0.0, 0.0, 1.0)`** - Teinte bleue
- **`(1.0, 1.0, 0.0)`** - Teinte jaune
- **`(1.0, 0.0, 1.0)`** - Teinte magenta
- **`(0.0, 1.0, 1.0)`** - Teinte cyan
- **`(0.5, 0.5, 0.5)`** - Gris neutre (désature légèrement)

## Utilisation

![Complete Example](../../../res/shaders/colorShift.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/ColorshiftEffect.hpp"
#include "uniform/Vec3.hpp"

int main() {
    sf::RenderWindow window(sf::VideoMode(800, 600), "Démo de Décalage Couleur");
    window.setActive(true);

    IBackend *backend = BackendFactory::create();
    IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(800, 600);

    ColorshiftEffect colorshift(backend);
    colorshift.withTint(Vec3<float>(1.0f, 0.0f, 0.0f));

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
        colorshift.render(sceneFramebuffer->getTexture());
        window.display();

        time += 0.016f;
    }

    delete sceneFramebuffer;
    delete backend;
    return 0;
}
```
