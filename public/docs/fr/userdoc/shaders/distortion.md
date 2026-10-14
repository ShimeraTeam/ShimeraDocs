# Effet de Distorsion

**Classe :** `shimera::Distortion`  
**En-tête :** `effects/Distortion.hpp`  
**Implémentation :** `src/effects/Distortion.cpp`  
**Shader :** `res/shader/postprocessing/distortion.slang`

## Description

L'effet de distorsion déforme l'image en décalant chaque pixel selon un bruit de gradient animé (un bruit proche du bruit de Perlin). Il crée des déformations organiques et fluides, utiles pour des ondulations d'eau, des vagues de chaleur, des effets magiques ou un retour visuel désorientant.

L'effet ne gère pas le temps lui-même : vous lui donnez le temps actuel à chaque frame avec `withTime()`. Sans cela, la distorsion est quand même appliquée, mais figée.

## Constructeur

```cpp
explicit Distortion(float noiseScale = 3.0f,
                    float distortionStrength = 0.13f,
                    float timeScale = 0.1f);
```

Le temps démarre à `0.0` et n'est réglé qu'avec `withTime()`.

## Paramètres

| Paramètre | Setter / Getter | Type | Plage | Défaut | Effet |
|-----------|-----------------|------|-------|--------|-------|
| `time` | `withTime()` / `getTime()` | float | `0.0` à `∞` | `0.0` | Temps de l'animation, en général en secondes |
| `noiseScale` | `withNoiseScale()` / `getNoiseScale()` | float | `0.1` à `10.0+` | `3.0` | Fréquence du motif de bruit |
| `distortionStrength` | `withDistortionStrength()` / `getDistortionStrength()` | float | `0.0` à `0.5+` | `0.13` | Amplitude de la déformation |
| `timeScale` | `withTimeScale()` / `getTimeScale()` | float | `0.01` à `1.0+` | `0.1` | Multiplicateur de vitesse de l'animation |

### Valeurs des paramètres

- **`time`** :
  - Réglez-le à chaque frame avec le temps écoulé de votre programme
  - Le motif de bruit défile en diagonale sur l'écran quand le temps augmente
  - Exemple : `distortion.withTime(clock.getElapsedTime().asSeconds())`

- **`noiseScale`** :
  - `1.0` - Grandes vagues douces
  - `3.0` - Ondulations moyennes (défaut)
  - `6.0` - Distorsions fines et détaillées
  - `10.0+` - Effet très granuleux

- **`distortionStrength`** :
  - `0.0` - Pas de distorsion
  - `0.05` - Léger miroitement
  - `0.1` - Déformation visible
  - `0.2` - Forte déformation
  - `0.3+` - Déformation extrême

- **`timeScale`** :
  - `0.05` - Animation très lente
  - `0.1` - Vitesse normale (défaut)
  - `0.3` - Animation rapide
  - `0.5+` - Changements très rapides

## Utilisation

![Example](../../../res/shaders/distortion.gif)

```cpp
#include <shimera.hpp>

shimera::EffectPipeline fx(960, 540);
fx.add<shimera::Distortion>(3.0f, 0.15f, 0.1f); // noiseScale, distortionStrength, timeScale

// Garder une référence pour mettre le temps à jour à chaque frame
auto& distortion = fx.get<shimera::Distortion>();

while (running) {
    // ... dessinez la scène dans la cible hôte ...

    distortion.withTime(elapsedSeconds);
    fx.render(scene);
}
```

Sources de temps selon la bibliothèque hôte :

| Bibliothèque hôte | Temps écoulé |
|-------------------|--------------|
| SFML | `clock.getElapsedTime().asSeconds()` (avec une `sf::Clock`) |
| raylib | `static_cast<float>(GetTime())` |
| SDL3 | `SDL_GetTicks() / 1000.0f` |
| GLFW | `static_cast<float>(glfwGetTime())` |

Voir [Shaders & Effets](./index.md#exemple-complet-sfml) pour un programme complet.
