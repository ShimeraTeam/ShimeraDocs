# Effet de Diffusion Atmosphérique

**En-tête:** `include/effects/AtmosphericScatteringEffect.hpp`  
**Implémentation:** `src/effects/AtmosphericScatteringEffect.cpp`  
**Shader:** `res/shader/postprocessing/atmospheric_scattering.frag`

## Description

L'effet de diffusion atmosphérique est une atmosphère planétaire, inspiré de son fonctionnement en physique, fonctionnant en post-traitement. Il effectue un ray-marching à travers une coquille atmosphérique sphérique autour d'une planète, en accumulant la lumière solaire diffusée pour produire un halo lumineux, un terminateur jour/nuit et une couleur de ciel dépendante de la longueur d'onde (ciels bleus, couchers de soleil rougeoyants).

Contrairement aux autres effets, celui-ci est **uniquement en 3D** : il reconstruit les rayons de vue en espace monde à partir de la caméra et lit le **depth buffer** de la scène pour savoir où la géométrie solide masque l'atmosphère. Vous fournissez des informations de haut niveau sur la caméra et la planète, la bibliothèque construit les matrices nécessaires en interne, vous ne touchez donc jamais au calcul matriciel.

::: warning Effet uniquement 3D
Cet effet nécessite une caméra en perspective et un depth buffer échantillonnable, il n'est donc **pas disponible sur le backend SFML (2D)**. Utilisez les backends **OpenGL** ou **Raylib**. Le framebuffer de scène doit être créé avec l'échantillonnage de profondeur activé (`createFrameBuffer(width, height, true)`).
:::

## Paramètres

### Planète & Atmosphère

| Paramètre | Type | Défaut | Effet |
|-----------|------|--------|-------|
| Centre de la planète | Vec3&lt;float&gt; | `(0, 0, 0)` | Centre de la planète en espace monde |
| Rayon de la planète | float | `100.0` | Rayon de la surface solide de la planète |
| Rayon de l'atmosphère | float | `120.0` | Rayon externe de la coquille atmosphérique (doit être &gt; rayon de la planète) |
| `m_uDensityFalloff` | float | `4.0` | Vitesse de décroissance de la densité de l'air avec l'altitude |
| `m_uScatterCoefficients` | Vec3&lt;float&gt; | `(5.5, 13.0, 22.4)` | Force de diffusion par canal (RVB) — détermine la couleur du ciel |

### Éclairage

| Paramètre | Type | Défaut | Effet |
|-----------|------|--------|-------|
| Direction du soleil | Vec3&lt;float&gt; | `(0, 1, 0)` | Direction vers le soleil (normalisée en interne) |

### Qualité

| Paramètre | Type | Défaut | Effet |
|-----------|------|--------|-------|
| Échantillons de profondeur optique | int | `16` | Échantillons le long des rayons solaires (limité à &ge; 2) |
| Points de diffusion | int | `16` | Échantillons le long du rayon de vue (limité à &ge; 2) |

### Caméra

Ces valeurs sont normalement synchronisées avec la caméra de votre scène à chaque image plutôt que définies une seule fois.

| Paramètre | Type | Défaut | Effet |
|-----------|------|--------|-------|
| `m_uCameraPos` | Vec3&lt;float&gt; | `(0, 0, 0)` | Position de la caméra en espace monde |
| `m_uCameraTarget` | Vec3&lt;float&gt; | `(0, 0, 0)` | Point regardé par la caméra |
| `m_uCameraUp` | Vec3&lt;float&gt; | `(0, 1, 0)` | Vecteur « haut » de la caméra |
| `m_fovYDegrees` | float | `45.0` | Champ de vision vertical, en degrés |
| `m_aspect` | float | `16/9` | Rapport d'aspect du viewport (largeur / hauteur) |
| `m_uNear` | float | `0.1` | Plan proche de la caméra (doit correspondre à celui de la scène) |
| `m_uFar` | float | `1000.0` | Plan lointain de la caméra (doit correspondre à celui de la scène) |

### Valeurs des Paramètres

- Le **rayon de l'atmosphère** doit être plus grand que le rayon de la planète. Un rapport d'environ `1.2`–`2.0×` le rayon de la planète donne une épaisseur d'atmosphère crédible.

- **`m_uDensityFalloff`**:
  - `1.0` - Atmosphère épaisse et brumeuse atteignant une haute altitude
  - `4.0` - Décroissance équilibrée (par défaut)
  - `10.0+` - Atmosphère fine collée à la surface

- **`m_uScatterCoefficients`** contrôle la couleur du ciel. Des valeurs plus élevées diffusent davantage ce canal. La valeur par défaut `(5.5, 13.0, 22.4)` diffuse le bleu le plus fortement (type Rayleigh), donnant des ciels bleus en journée et des couchers de soleil chauds près du terminateur.

- La **qualité** (échantillons de profondeur optique × points de diffusion) est le principal réglage performance/qualité — le coût croît avec le produit des deux. `16 × 16` est un bon équilibre ; réduisez pour la performance, augmentez pour des dégradés plus lisses.

::: tip Faites correspondre la caméra à votre scène
Le depth buffer de la scène est créé en utilisant la projection de votre moteur. Pour un masquage correct, gardez `m_fovYDegrees`, `m_aspect`, `m_uNear` et `m_uFar` synchronisés avec la caméra utilisée pour rendre la scène.
:::

## Utilisation

### Utilisation Basique (Raylib)

![Example](../../../res/shaders/atmospheric_scattering.gif)

```cpp
#include "raylib.h"
#include <GL/glew.h>
#include <shimera.h>
#include "backend/BackendFactory.hpp"
#include "effects/AtmosphericScatteringEffect.hpp"

using namespace shimera;

int main() {
    const int screenWidth = 960;
    const int screenHeight = 540;

    InitWindow(screenWidth, screenHeight, "Démo de Diffusion Atmosphérique");
    glewInit();

    Camera camera = { 0 };
    camera.position = { 10.0f, 10.0f, 10.0f };
    camera.target   = { 0.0f, 0.0f, 0.0f };
    camera.up       = { 0.0f, 1.0f, 0.0f };
    camera.fovy     = 25.0f;
    camera.projection = CAMERA_PERSPECTIVE;

    Vector3 planetPosition = { 0.0f, 0.0f, 0.0f };

    IBackend *backend = BackendFactory::create();

    // L'échantillonnage de profondeur DOIT être activé pour cet effet (troisième argument = true)
    IFrameBuffer *sceneFramebuffer = backend->createFrameBuffer(screenWidth, screenHeight, true);

    AtmosphericScatteringEffect atmo(backend);
    atmo.withPlanet({0, 0, 0}, 1.0f, 1.6f)   // centre, rayon planète, rayon atmosphère
        .withSun({1.0f, 1.0f, 0.0f})          // direction vers le soleil
        .withQuality(16, 16);

    SetTargetFPS(60);

    while (!WindowShouldClose()) {
        // Synchronise la caméra de l'effet avec celle de la scène à chaque image
        atmo.m_uCameraPos    = Vec3(camera.position.x, camera.position.y, camera.position.z);
        atmo.m_uCameraTarget = Vec3(camera.target.x,   camera.target.y,   camera.target.z);
        atmo.m_uCameraUp     = Vec3(camera.up.x,        camera.up.y,        camera.up.z);
        atmo.m_fovYDegrees   = camera.fovy;
        atmo.m_aspect        = (float)screenWidth / screenHeight;

        atmo.withDepth(sceneFramebuffer->getDepthTexture());

        // 1. Rendre la scène 3D dans le framebuffer avec profondeur activée
        sceneFramebuffer->bind();
        sceneFramebuffer->clear(Color{0, 0, 0, 1});
            BeginMode3D(camera);
                DrawSphere(planetPosition, 1.0f, {.r = 53, .g = 88, .b = 29, .a = 255});
            EndMode3D();
        sceneFramebuffer->unbind();

        // 2. Appliquer l'atmosphère (lit automatiquement la couleur + la profondeur de la scène)
        BeginDrawing();
            ClearBackground(BLACK);
            atmo.render(sceneFramebuffer->getTexture());
        EndDrawing();
    }

    CloseWindow();
    delete sceneFramebuffer;
    delete backend;
    return 0;
}
```

### Notes

- **Dessinez votre planète au rayon de la planète.** Dans l'exemple, la sphère est dessinée avec un rayon de `1.0` pour correspondre à `withPlanet(..., 1.0f, ...)`, et la coquille atmosphérique (`1.6`) s'étend au-delà pour former le halo visible.
- **`withDepth()` est obligatoire.** Appelez-le avec la texture de profondeur du framebuffer de scène (`getDepthTexture()`). Oublier le drapeau `true` sur `createFrameBuffer` lèvera une erreur claire lorsque la texture de profondeur sera demandée.
