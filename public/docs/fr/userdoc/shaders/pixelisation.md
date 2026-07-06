# Effet Pixelisation

**En-tête:** `include/effects/PixelisationEffect.hpp`  
**Implémentation:** `src/effects/PixelisationEffect.cpp`  
**Shader:** `res/shader/postprocessing/pixelisation.frag`

## Description

L'effet Pixelisation applique un rendu rétro façon pixel art à l'image en alignant les coordonnées UV sur une grille de taille configurable. Chaque « bloc de pixel » échantillonne la couleur au centre de sa cellule, créant une apparence grossière et basse résolution. La grille peut être dimensionnée indépendamment sur les axes X et Y, et un décalage optionnel permet de déplacer la grille sur l'écran.

## Paramètres

| Paramètre | Type | Plage | Défaut | Effet |
|-----------|------|-------|--------|-------|
| `u_pixelSizeX` | float | `1.0` à largeur écran | `4.0` | Largeur de chaque bloc en pixels écran |
| `u_pixelSizeY` | float | `1.0` à hauteur écran | `4.0` | Hauteur de chaque bloc en pixels écran |
| `u_resolution` | Vec2&lt;float&gt; | pixels | `(1920, 1080)` | Résolution de l'écran pour calculer le pas UV |
| `u_offset` | Vec2&lt;float&gt; | espace UV (0–1) | `(0, 0)` | Décalage de l'origine de la grille en coordonnées UV |

### Valeurs des Paramètres

- **`u_pixelSizeX` / `u_pixelSizeY`**:
  - `1.0` - Pas de pixelisation (résolution originale)
  - `4.0` - Aspect pixel art subtil (défaut)
  - `8.0` - Apparence clairement en blocs
  - `16.0` - Effet rétro prononcé
  - `32.0+` - Pixelisation extrême et très grossière

- **`u_resolution`**:
  - Doit correspondre à la résolution réelle de la cible de rendu pour que les pas UV soient calculés correctement
  - `(960, 540)` - Fenêtre basse résolution
  - `(1920, 1080)` - Full HD (défaut)
  - `(2560, 1440)` - Affichage 1440p

- **`u_offset`**:
  - `(0, 0)` - Origine de la grille en haut à gauche (défaut)
  - Toute valeur non nulle déplace la grille sur l'écran, ce qui peut servir à l'animer ou à la faire vaciller

## Utilisation

### Utilisation Basique

![Exemple Complet](../../../res/shaders/pixelisation.gif)

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/PixelisationEffect.hpp"
#include "uniform/Vec2.hpp"

int main() {
  sf::RenderWindow window(sf::VideoMode(960, 540), "Démo Pixelisation");
  window.setActive(true);

  IBackend *backend = BackendFactory::create();
  IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(960, 540);

  PixelisationEffect pixelisation(backend);
  pixelisation.withPixelSize(8.0f)
              .withResolution(Vec2<float>(960.0f, 540.0f));

  while (window.isOpen()) {
    while (const std::optional event = window.pollEvent()) {
      if (event->is<sf::Event::Closed>()) window.close();
    }

    auto *rt = static_cast<sf::RenderTexture*>(sceneFramebuffer->getNativeRenderTarget());
    rt->clear(sf::Color::Black);
    // ... dessinez votre scène sur rt ...
    sceneFramebuffer->unbind();

    window.setActive(true);
    pixelisation.render(sceneFramebuffer->getTexture());
    window.display();
  }

  delete sceneFramebuffer;
  delete backend;
  return 0;
}
```

### Blocs non carrés

`withPixelSizeX` et `withPixelSizeY` permettent de définir les dimensions des blocs indépendamment pour un rendu pixel art étiré ou aplati :

```cpp
PixelisationEffect pixelisation(backend);
pixelisation.withPixelSizeX(16.0f)   // blocs larges
            .withPixelSizeY(4.0f)    // blocs courts
            .withResolution(Vec2<float>(1920.0f, 1080.0f));
```
