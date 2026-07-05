# Effet Fresnel

**En-tête:** `include/effects/materials/FresnelEffect.hpp`\
**Implémentation:** `src/effects/materials/FresnelEffect.cpp`\
**Shaders:** `res/shader/material/fresnel.vert`, `res/shader/material/fresnel.frag`

## Description

L'effet Fresnel est un **matériau** qui met en valeur la surface d'un objet 3D en fonction de l'angle de vue. Les surfaces tournées à l'opposé de la caméra (la silhouette / les angles rasants) brillent, tandis que les surfaces faisant face à la caméra restent sombres. C'est l'apparence classique derrière l'**éclairage de bordure** (rim lighting), les **champs de force**, les **hologrammes**, les **boucliers d'énergie**, et le bord lumineux du verre ou de l'eau.

Il reproduit le phénomène de Fresnel du monde réel (les surfaces deviennent plus réfléchissantes sous un angle rasant) grâce à l'approximation de Schlick :

```
fresnel = reflectance + (1 - reflectance) * pow(1 - dot(N, V), power)
```

où `N` est la normale de la surface et `V` la direction vers la caméra. Le résultat est proche de `~0` face à la caméra et de `~1` à la silhouette, puis teinté par votre couleur et mis à l'échelle par l'intensité.

::: tip Ceci est un matériau, pas un post-traitement
Fresnel est appliqué à un **maillage** au moment où il est dessiné, pas à l'image finale. Si vous n'avez pas encore mis en place les matériaux, lisez d'abord [Shaders de Matériaux](./material_shaders.md), qui couvre les backends, les maillages, les caméras, les transformations et l'appel de rendu. Cette page ne documente que les paramètres spécifiques à Fresnel.
:::

## Paramètres

| Constructeur | Uniform | Type | Défaut | Effet |
|--------------|---------|------|--------|-------|
| `withColor` | `u_color` | Vec3&lt;float&gt; | `(0.3, 0.7, 1.0)` | Couleur de la lueur de bordure (RVB, 0–1) |
| `withPower` | `u_power` | float | `3.0` | Netteté du dégradé, à quelle vitesse la lueur apparaît vers le bord |
| `withReflectance` | `u_reflectance` | float | `0.04` | Réflectance de base lorsqu'on regarde de face (le terme « F0 ») |
| `withIntensity` | `u_intensity` | float | `1.5` | Multiplicateur global appliqué à l'effet |

### Valeurs des paramètres

- **`withColor`** : la couleur de la lueur.

- **`withPower`** : contrôle la largeur de la bordure :
  - `1.0` - `2.0` : lueur large et douce couvrant une grande partie de la surface
  - `3.0` : bordure équilibrée (défaut)
  - `5.0`+ : bordure fine et nette

- **`withReflectance`** : à quel point la surface brille lorsqu'elle vous fait face directement :
  - `0.0` : entièrement sombre de face, lueur uniquement à la silhouette
  - `0.04` : une faible lueur de base (défaut, proche d'un diélectrique)
  - `0.2`+ : toute la surface prend une teinte visible

- **`withIntensity`** : met à l'échelle le résultat final. Augmentez-la pour rendre la bordure plus lumineuse/saturée, diminuez-la pour un effet subtil. Des valeurs supérieures à `1.0` poussent la bordure vers le blanc/la surexposition.

## Surfaces planes vs. courbes

Comme Fresnel dépend de la normale de la surface, il se comporte très différemment sur une géométrie courbe et sur une géométrie plane :

- **Les surfaces courbes** (sphères) ont des normales qui varient continuellement, vous obtenez donc un dégradé lisse, un objet à l'aspect solide avec une bordure lumineuse.
- **Les faces plates** (cubes) partagent une seule normale par face, donc toute la face obtient une valeur proche de `0` : les faces sont presque invisibles et seules les **arêtes** brillent. Il s'agit du comportement attendu de Fresnel, pas d'un bug.

Le shader produit `alpha = fresnel`, donc sous un mélange alpha, une face plate est majoritairement transparente. Si vous voulez qu'une boîte paraisse solide, donnez-lui une couleur de base en dessous (mélangez une couleur de base dans le shader, ou dessinez d'abord une passe de base) plutôt que de compter uniquement sur Fresnel (aucun matériau de base n'est disponible pour l'instant).

## Utilisation

### Utilisation de base (Raylib)

```cpp
#include "raylib.h"
#include <shimera.h>
#include "backend/BackendFactory.hpp"
#include "backend/raylib/RaylibMesh.hpp"
#include "backend/raylib/converts/RaylibCamera.hpp"
#include "effects/materials/FresnelEffect.hpp"

int main() {
    InitWindow(960, 540, "Shimera - Démo Fresnel");

    Camera3D camera = { 0 };
    camera.position   = { 6.0f, 4.0f, 6.0f };
    camera.target     = { 0.0f, 0.0f, 0.0f };
    camera.up         = { 0.0f, 1.0f, 0.0f };
    camera.fovy       = 45.0f;
    camera.projection = CAMERA_PERSPECTIVE;

    shimera::IBackend *backend = shimera::BackendFactory::create();

    Model model = LoadModelFromMesh(GenMeshSphere(1.5f, 48, 48));
    shimera::RaylibMesh mesh(model);

    shimera::FresnelEffect fresnel(backend);
    fresnel.withColor(shimera::Vec3(0.3f, 0.7f, 1.0f))
           .withPower(3.0f)
           .withReflectance(0.04f)
           .withIntensity(1.5f);
    fresnel.setTransform(shimera::Vec3(0.0f, 0.0f, 0.0f));

    SetTargetFPS(60);
    while (!WindowShouldClose()) {
        UpdateCamera(&camera, CAMERA_THIRD_PERSON);
        shimera::Camera shCam = shimera::RaylibCamera::toShimera(camera);

        BeginDrawing();
            ClearBackground(BLACK);
            BeginMode3D(camera);
                fresnel.render(mesh, shCam);                // lueur de bordure sur la sphère
                DrawCube({5, 0, 0}, 2.0f, 2.0f, 2.0f, RED);  // objet Raylib intact
            EndMode3D();
        EndDrawing();
    }

    UnloadModel(model);
    delete backend;
    CloseWindow();
    return 0;
}
```

### OpenGL

Le matériau Fresnel fonctionne de manière identique sur OpenGL, seules la création du maillage et la caméra diffèrent (tableaux via `createMesh`, caméra via `CameraFactory`), et vous activez vous-même le test de profondeur. Consultez [Shaders de Matériaux](./material_shaders.md#exemple-complet-opengl) pour le squelette OpenGL complet, puis configurez le matériau exactement comme ci-dessus :

```cpp
FresnelEffect fresnel(backend);
fresnel.withColor(Vec3(0.3f, 0.6f, 1.0f))
       .withPower(3.0f)
       .withReflectance(0.04f)
       .withIntensity(1.5f);
```

## Compatibilité des Backends

| Backend | Fresnel |
|---------|---------|
| ✅ **OpenGL** (GLFW, SDL) | Supporté |
| ✅ **Raylib** | Supporté (se compose avec votre scène Raylib) |
| ⏳ **SFML** | Non disponible (les matériaux ne sont pas encore intégrés sur le backend 2D) |

> Fresnel est un matériau 3D et nécessite une caméra en perspective. Voir [Shaders de Matériaux → Compatibilité des Backends](./material_shaders.md#compatibilité-des-backends) pour plus de détails.

## Voir Aussi

- [Shaders de Matériaux](./material_shaders.md) : le système de matériaux, sa mise en place et l'API partagée
