# Shaders de Matériaux

**En-tête de base:** `include/effects/materials/MaterialEffectBase.hpp`\
**Base template:** `include/effects/materials/MaterialEffect.inl`

## Description

Les **shaders de matériaux** appliquent un effet à la **surface d'un objet** au moment où il est dessiné, plutôt qu'à une image 2D déjà rendue. Là où un [effet de post-traitement](../shaders/index.md) prend toute l'image rendue comme une texture et la transforme, un matériau est lié à une géométrie et est appliqué sur place, en utilisant les données par sommet de cette géométrie (positions, normales) et le point de vue de la caméra.

Comme les matériaux sont dessinés dans le cadre de la scène, ils **se composent correctement avec tout le reste de ce que vous rendez** : ils respectent la profondeur, masquent et sont masqués par les autres objets, et suivent naturellement la caméra. Vous fournissez un maillage, une caméra et une transformation, la bibliothèque rend l'objet avec le matériau à travers la pipeline native du backend actif.

Un shader de matériau est écrit une seule fois et fonctionne sur tout backend de la dimension correspondante (un shader de matériau 2D fonctionnera sur les backends 2D mais pourrait aussi fonctionner sur les backends 3D, un shader de matériau 3D ne fonctionnera que sur les backends 3D). Vous ne touchez jamais au calcul matriciel ni à la tuyauterie de shader spécifique au backend, la bibliothèque construit les matrices modèle/vue/projection et les transmet au shader pour vous.

::: warning SFML pas encore intégré
Le système de matériaux **n'est pas intrinsèquement limité à la 3D**. La même architecture peut tout aussi bien piloter des matériaux de surface 2D, un backend comme SFML pourrait donc lui aussi supporter les matériaux. Ce n'est simplement **pas encore** branché sur SFML : Shimera ne fournit actuellement aucun shader de matériau 2D, nous avons donc reporté cette intégration pour l'instant plutôt que d'ajouter de la tuyauterie inutilisée. En attendant, appeler une méthode de matériau sur le backend SFML lève une erreur d'exécution claire.

En pratique, les matériaux disponibles **aujourd'hui** sont en 3D et nécessitent une caméra en perspective, utilisez donc les backends **OpenGL** ou **Raylib**.
:::

## Comment ça marche

- **Vous gardez votre géométrie.** Sur Raylib, vous passez au matériau le `Model` que vous avez déjà ; sur OpenGL, vous envoyez des tableaux de sommets/normales/indices via le backend. Dans les deux cas, vous obtenez un handle de maillage indépendant du backend.
- **Le backend effectue le rendu nativement.** Sur Raylib, l'objet est dessiné à travers le moteur de rendu propre à Raylib (il s'insère donc dans votre scène `BeginMode3D` et est testé en profondeur avec les autres objets Raylib). Sur OpenGL, il est dessiné directement avec le test de profondeur.
- **Un seul shader, tous les backends.** Le même GLSL est réutilisé partout. Le backend fournit automatiquement les uniforms standards (`u_model`, `u_view`, `u_projection`, `u_cameraPos`) ; chaque matériau ne pousse que ses propres paramètres.
- **Un matériau, plusieurs objets.** Un matériau est réutilisable : configurez-le une fois, puis définissez une transformation et rendez-le sur autant de maillages que vous le souhaitez, à chaque image.

## Schéma d'utilisation de base

### 1. Créer un Backend
```cpp
#include <shimera.h>
#include "backend/BackendFactory.hpp"

IBackend *backend = BackendFactory::create();
```

### 2. Obtenir un Maillage

La géométrie que vous ombrez est spécifique au backend (c'est l'objet que vous avez déjà), mais les deux approches vous donnent un maillage que vous pouvez rendre avec n'importe quel matériau.

::: code-group
```cpp [OpenGL]
// envoyer des tableaux de positions/normales/indices :
IMesh *mesh = backend->createMesh(positions, normals, indices);
```

```cpp [Raylib]
// adopter un Model natif (chargé depuis un fichier ou généré) :
#include "backend/raylib/RaylibMesh.hpp"

Model model = LoadModelFromMesh(GenMeshSphere(1.5f, 48, 48));
shimera::RaylibMesh mesh(model);
```
:::

### 3. Créer un Matériau
```cpp
#include "effects/materials/MyMaterialEffect.hpp"

MyMaterialEffect material(backend);
```

### 4. Configurer le Matériau (Optionnel)

Chaque matériau expose une API fluide de construction, ainsi que les fonctions partagées de placement et d'activation de `MaterialEffectBase` :
```cpp
material.withSomeParameter(1.0f)
        .withAnotherParameter(0.5f);

material.setTransform(Vec3(0.0f, 0.0f, 0.0f));  // position (+ rotation, échelle optionnelles)
```

### 5. Construire une Caméra

::: code-group
```cpp [OpenGL]
// construire une caméra à partir de paramètres de haut niveau (glm reste interne) :
#include "scene/CameraFactory.hpp"

Camera camera = CameraFactory::perspective(
    Vec3(0.0f, 0.0f, 6.0f),   // position
    Vec3(0.0f, 0.0f, 0.0f),   // cible
    Vec3(0.0f, 1.0f, 0.0f),   // haut
    45.0f, 16.0f / 9.0f, 0.1f, 100.0f);
```

```cpp [Raylib]
// convertir votre `Camera3D` existante :
#include "backend/raylib/converts/RaylibCamera.hpp"

Camera camera = shimera::RaylibCamera::toShimera(camera3d);
```
:::

### 6. Rendre l'Objet
```cpp
material.render(*mesh, camera);
```

- Sur **OpenGL**, activez le test de profondeur une fois (`glEnable(GL_DEPTH_TEST)`) et rendez à chaque image.
- Sur **Raylib**, appelez `render()` **à l'intérieur** de `BeginMode3D(...) / EndMode3D(...)` afin que l'objet rejoigne le reste de votre scène 3D.

## API partagée (`MaterialEffectBase`)

Chaque matériau hérite de ces membres.

### `render`

```cpp
void render(IMesh& mesh, const Camera& camera);
```

Dessine `mesh` avec le matériau depuis le point de vue de la caméra donnée. La transformation actuelle du matériau (voir `setTransform`) positionne l'objet. Ne fait rien si le matériau est désactivé.

---

### `setTransform`

```cpp
void setTransform(const Vec3<float>& position,
                  const Vec3<float>& rotationEuler = Vec3(0.0f),
                  const Vec3<float>& scale         = Vec3(1.0f));
```

Place, oriente et met à l'échelle l'objet en espace monde. La rotation est en **degrés** (angles d'Euler). La matrice est construite en interne, vous ne manipulez jamais de calcul matriciel. Appelez-la par objet entre les appels à `render()` pour réutiliser un même matériau sur plusieurs objets.

| Paramètre | Description |
|-----------|-------------|
| `position` | Position de l'objet en espace monde |
| `rotationEuler` | Rotation en degrés autour de X, Y, Z (défaut : aucune) |
| `scale` | Échelle par axe (défaut : `1, 1, 1`) |

---

### `setEnabled` / `isEnabled`

```cpp
void setEnabled(bool enabled);
bool isEnabled() const;
```

Active ou désactive le matériau. Le `render()` d'un matériau désactivé ne fait rien.

---

### Constructeurs de paramètres fluides

Chaque matériau concret ajoute ses propres setters `withXxx(...)` qui retournent `*this`, ils peuvent donc être chaînés (voir les pages de chaque matériau pour les paramètres que chacun supporte).

```cpp
material.withSomeParameter(2.0f)
        .withAnotherParameter(0.5f);
```

## Compatibilité des Backends

| Backend | Matériaux |
|---------|-----------|
| ✅ **OpenGL** | Supporté |
| ✅ **Raylib** | Supporté (se compose avec votre scène Raylib) |
| ⏳ **SFML** | Pas encore intégré — techniquement possible, reporté jusqu'à ce qu'il existe un matériau 2D |

> Le support SFML a été **volontairement reporté**, pas écarté : l'architecture permettrait un matériau 2D, mais il n'existe pas encore de shader de matériau 2D justifiant l'intégration. En attendant, créer ou rendre un matériau sur le backend SFML lève une `std::runtime_error` avec un message clair, de sorte que cela échoue bruyamment plutôt que silencieusement.

## Exemple Complet (OpenGL)

Remplacez `MyMaterialEffect` par un matériau concret (voir les pages de chaque matériau).

```cpp
#include <GLFW/glfw3.h>
#include <GL/glew.h>
#include <shimera.h>
#include "backend/BackendFactory.hpp"
#include "scene/CameraFactory.hpp"
#include "effects/materials/MyMaterialEffect.hpp"

using namespace shimera;

int main() {
    // ... créer une fenêtre GLFW + glewInit() ...

    IBackend *backend = BackendFactory::create();

    // Géométrie : envoyez vos données de sommets (positions + normales + indices)
    IMesh *mesh = backend->createMesh(positions, normals, indices);

    MyMaterialEffect material(backend);
    material.withSomeParameter(1.0f);
    material.setTransform(Vec3(0.0f, 0.0f, 0.0f));

    glEnable(GL_DEPTH_TEST);

    while (/* fenêtre ouverte */) {
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        Camera camera = CameraFactory::perspective(
            Vec3(0.0f, 0.0f, 6.0f), Vec3(0.0f), Vec3(0.0f, 1.0f, 0.0f),
            45.0f, 16.0f / 9.0f, 0.1f, 100.0f);

        material.render(*mesh, camera);

        // ... swap des buffers, gestion des événements ...
    }

    delete mesh;
    delete backend;
    return 0;
}
```

## Exemple Complet (Raylib)

Sur Raylib, le matériau vit à l'intérieur de votre scène `BeginMode3D` habituelle, il est donc testé en profondeur et se compose avec tout autre objet Raylib (ici, un cube).

```cpp
#include "raylib.h"
#include <shimera.h>
#include "backend/BackendFactory.hpp"
#include "backend/raylib/RaylibMesh.hpp"
#include "backend/raylib/converts/RaylibCamera.hpp"
#include "effects/materials/MyMaterialEffect.hpp"

int main() {
    InitWindow(960, 540, "Shimera - Démo Matériau");

    Camera3D camera = { 0 };
    camera.position   = { 10.0f, 10.0f, 10.0f };
    camera.target     = { 0.0f, 0.0f, 0.0f };
    camera.up         = { 0.0f, 1.0f, 0.0f };
    camera.fovy       = 25.0f;
    camera.projection = CAMERA_PERSPECTIVE;

    shimera::IBackend *backend = shimera::BackendFactory::create();

    Model model = LoadModelFromMesh(GenMeshSphere(1.5f, 48, 48));
    shimera::RaylibMesh mesh(model);

    shimera::MyMaterialEffect material(backend);
    material.withSomeParameter(1.0f);
    material.setTransform(shimera::Vec3(0.0f, 0.0f, 0.0f));

    SetTargetFPS(60);
    while (!WindowShouldClose()) {
        UpdateCamera(&camera, CAMERA_THIRD_PERSON);
        shimera::Camera shCam = shimera::RaylibCamera::toShimera(camera);

        BeginDrawing();
            ClearBackground(BLACK);
            BeginMode3D(camera);
                material.render(mesh, shCam);              // matériau Shimera
                DrawCube({5, 0, 0}, 2.0f, 2.0f, 2.0f, RED); // objet Raylib intact
            EndMode3D();
        EndDrawing();
    }

    UnloadModel(model);
    delete backend;
    CloseWindow();
    return 0;
}
```

## Matériaux Disponibles

- Consultez les pages de chaque matériau pour les effets fournis par Shimera et les paramètres que chacun expose.
