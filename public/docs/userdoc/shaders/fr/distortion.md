# Effet de Distorsion

**En-tête:** `include/effects/DistortionEffect.hpp`  
**Implémentation:** `src/effects/DistortionEffect.cpp`  
**Shader:** `res/shader/postprocessing/distortion.frag`

## Description

L'effet de distorsion déforme et dénature l'image rendue en utilisant du bruit Perlin animé. Cela crée des déformations organiques et fluides utiles pour les ondulations d'eau, les vagues de chaleur, les effets magiques, ou les retours visuels désorientants. L'effet est entièrement animable avec des paramètres basés sur le temps.

## Paramètres

| Paramètre | Type | Plage | Défaut | Effet |
|-----------|------|-------|--------|-------|
| `time` | float | `0.0` à `∞` | `0.0` | Temps d'animation en secondes |
| `noiseScale` | float | `0.1` à `10.0+` | `3.0` | Fréquence du motif de bruit |
| `distortionStrength` | float | `0.0` à `0.5+` | `0.13` | Magnitude de la déformation |
| `timeScale` | float | `0.01` à `1.0+` | `0.1` | Multiplicateur de vitesse d'animation |

### Valeurs des Paramètres

- **`time`**:
  - Incrémenté automatiquement chaque image
  - Contrôle la progression de l'animation
  - Exemple: `time += deltaTime`

- **`noiseScale`**:
  - `1.0` - Grandes ondes lisses
  - `3.0` - Ondulations moyennes (standard)
  - `6.0` - Distorsions fines et détaillées
  - `10.0+` - Effets très granulaires

- **`distortionStrength`**:
  - `0.0` - Pas de distorsion
  - `0.1` - Effet subtil
  - `0.2` - Déformation modérée
  - `0.3+` - Déformation extrême

- **`timeScale`**:
  - `0.05` - Animation très lente
  - `0.1` - Vitesse normale (par défaut)
  - `0.3` - Animation rapide
  - `0.5+` - Changements très rapides

## Utilisation

### Utilisation Basique

```cpp
#include <SFML/Graphics.hpp>
#include <optional>
#include "backend/BackendFactory.hpp"
#include "effects/DistortionEffect.hpp"

int main() {
  sf::RenderWindow window(sf::VideoMode(800, 600), "Démo de Distorsion");
  window.setActive(true);

  IBackend *backend = BackendFactory::create();
  IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(800, 600);

  DistortionEffect distortion(backend);
  distortion.withDistortionStrength(0.15f)
        .withNoiseScale(3.0f)
        .withTimeScale(0.1f);

  float time = 0.0f;
  while (window.isOpen()) {
    while (const std::optional event = window.pollEvent()) {
      if (event->is<sf::Event::Closed>()) window.close();
    }

    auto *rt = static_cast<sf::RenderTexture*>(sceneFramebuffer->getNativeRenderTarget());
    rt->clear(sf::Color::Black);
    // ... dessinez votre scène sur rt ...
    sceneFramebuffer->unbind();

    distortion.time = time;
    window.setActive(true);
    distortion.render(sceneFramebuffer->getTexture());

    time += 0.016f;
    window.display();
  }

  delete sceneFramebuffer;
  delete backend;
  return 0;
}
```

### Exemples Pratiques

```cpp
// Effet d'ondulation d'eau
DistortionEffect waterRipple(backend);
waterRipple.withNoiseScale(4.0f)
           .withDistortionStrength(0.2f)
           .withTimeScale(0.15f);

// Effet de vague de chaleur / mirage
DistortionEffect heatWave(backend);
heatWave.withNoiseScale(2.0f)
        .withDistortionStrength(0.1f)
        .withTimeScale(0.08f);

// Effet magique / mystique
DistortionEffect magic(backend);
magic.withNoiseScale(1.5f)
     .withDistortionStrength(0.25f)
     .withTimeScale(0.12f);

// Effet sous-marin
DistortionEffect underwater(backend);
underwater.withNoiseScale(5.0f)
          .withDistortionStrength(0.18f)
          .withTimeScale(0.1f);

// Intoxication / vertige
DistortionEffect drunk(backend);
drunk.withNoiseScale(1.0f)
     .withDistortionStrength(0.3f)
     .withTimeScale(0.2f);

// Trip acide / psychédélique
DistortionEffect psychedelic(backend);
psychedelic.withNoiseScale(0.8f)
           .withDistortionStrength(0.4f)
           .withTimeScale(0.25f);
```
