# Guide de test

## Introduction

Ce document décrit les différentes catégories de tests utilisées dans Shimera,
les outils associés, et les plateformes cibles pour chacun.

## 1. Tests mémoire

Ces tests détectent les fuites mémoire, les accès invalides et les comportements indéfinis.

### Linux - AddressSanitizer (ASan) / LeakSanitizer (LSan)

Compilés avec les flags ASan/LSan, ces tests s'exécutent sur Linux et sur WSL.

### Windows - CRT Debug Heap

Sur Windows natif, le CRT Debug Heap détecte les fuites à la fin du programme.
Aucun flag supplémentaire n'est requis dans les builds Debug MSVC.

### Exemple

::: code-group

`````cpp [MemoryTest.cpp]
#include "MemoryTest.hpp"
#include "backend/BackendFactory.hpp"

#ifdef _WIN32
    #define _CRTDBG_MAP_ALLOC
    #include <crtdbg.h>
#endif

void MemoryTest::run() {
    #ifdef _WIN32
        _CrtSetDbgFlag(_CRTDBG_ALLOC_MEM_DF | _CRTDBG_LEAK_CHECK_DF);
    #endif

    // Test 1 : backend
    {
        const shimera::IBackend *backend = shimera::BackendFactory::create();
        delete backend;
    }

    // Test 2 : framebuffers
    {
        shimera::IBackend *backend = shimera::BackendFactory::create();
        const shimera::IFrameBuffer *fb1 = backend->createFrameBuffer(960, 540);
        const shimera::IFrameBuffer *fb2 = backend->createFrameBuffer(960, 540);
        delete fb1;
        delete fb2;
        delete backend;
    }
    #ifdef _WIN32
        _CrtSetReportMode(_CRT_WARN, _CRTDBG_MODE_FILE);
        _CrtSetReportFile(_CRT_WARN, _CRTDBG_FILE_STDERR);
        _CrtDumpMemoryLeaks();
    #endif
}
`````


`````cpp [main.cpp]
#include "raylib.h"
#include <GL/glew.h>
#include "memory/MemoryTest.hpp"

int main() {
    InitWindow(960, 540, "Raylib shimera tests");
    glewInit();

    MemoryTest memoryTest;
    memoryTest.run();
    return 0;
}
`````

:::

## 2. Tests de performance (benchmarks)

Ces tests mesurent les performances des backends et des shaders dans Shimera, et les comparent entre eux.

Ils couvrent les métriques suivantes :

| Métrique | Unité | Description |
|---|---|---|
| `avgFps` | frames/s | FPS moyen sur toute la durée du benchmark |
| `frames` | nombre | Nombre total de frames rendues |
| `totalMs` | ms | Temps de rendu total pour toutes les frames |
| `vramUsed` | KB | Mémoire GPU consommée en fin d'exécution |

Chaque backend est testé sur les mêmes scènes avec des effets de post-processing cumulatifs :

- Aucun effet
- Un seul effet (ex. `GaussianBlurEffect`, `VignetteEffect`, `ChromaticAberrationEffect`...)
- Deux effets combinés
- Trois effets combinés

### Exemple

Chaque benchmark exécute **100 frames de chauffe** avant de démarrer la mesure, puis rend **5000 frames** et enregistre le temps écoulé.
La VRAM est mesurée avant et après la mise en place du pipeline via `GL_NVX_gpu_memory_info` (NVIDIA uniquement).

::: code-group

`````cpp [BenchmarkSfml.cpp]
void BenchmarkSfml::run() {
    BenchmarkReport report;
    float time = 0.0f;

    // Phase de chauffe
    this->setupScene(report);
    for (int i = 0; i < 100; i++) {
        this->renderScene(time);
    }

    // Phase de mesure
    auto start = std::chrono::high_resolution_clock::now();

    for (int i = 0; i < FRAMES; i++) {
        this->renderScene(time);
    }

    auto end = std::chrono::high_resolution_clock::now();
    int totalMs = std::chrono::duration<double, std::milli>(end - start).count();
    int avgFps  = FRAMES / (totalMs / 1000.0);

    report.setGpu(reinterpret_cast<const char*>(glGetString(GL_RENDERER)))
          .setBackend("Sfml")
          .setEffects(m_pipeline.getEffectsNames())
          .setAvgFps(avgFps)
          .setTotalMs(totalMs)
          .setFrames(FRAMES);
    report.save("../../../../benchmark-results.json");

    delete m_sceneFramebuffer;
    return;
}
`````

`````cpp [main.cpp]

#define GL_GPU_MEM_INFO_TOTAL_AVAILABLE_MEM_NVX 0x9048
#define GL_GPU_MEM_INFO_CURRENT_AVAILABLE_MEM_NVX 0x9049

int main() {
    sf::RenderWindow window(sf::VideoMode({960, 540}), "Sfml shimera tests");
    window.setActive(true);
    glewInit();

    shimera::IBackend *backend = shimera::BackendFactory::create();
    TestRunner runner;
    GLint vramBefore = 0;
    GLint vramAfter = 0;
    GLint vramUsed = 0;

    // Benchmark DistortionEffect
    glGetIntegerv(GL_GPU_MEM_INFO_CURRENT_AVAILABLE_MEM_NVX, &vramBefore);
    shimera::EffectPipeline pipelineDistortion(backend, 640, 480);
    pipelineDistortion.addEffect<shimera::DistortionEffect>();
    glGetIntegerv(GL_GPU_MEM_INFO_CURRENT_AVAILABLE_MEM_NVX, &vramAfter);
    vramUsed = vramBefore - vramAfter;
    runner.add(std::make_unique<BenchmarkSfml>( "Benchmark Sfml DistortionEffect", window, backend, std::move(pipelineDistortion), vramUsed));

    // Benchmark ColortintEffect
    glGetIntegerv(GL_GPU_MEM_INFO_CURRENT_AVAILABLE_MEM_NVX, &vramBefore);
    shimera::EffectPipeline pipelineColortint(backend, 640, 480);
    pipelineColortint.addEffect<shimera::ColortintEffect>(shimera::Vec3<float>(0.5f, 0.2f, 0.8f));
    glGetIntegerv(GL_GPU_MEM_INFO_CURRENT_AVAILABLE_MEM_NVX, &vramAfter);
    vramUsed = vramBefore - vramAfter;
    runner.add(std::make_unique<BenchmarkSfml>( "Benchmark Sfml ColortintEffect", window, backend, std::move(pipelineColortint), vramUsed));

    runner.runAll();

    delete backend;
    window.close();
    exit(0);
}
`````

:::

Les résultats sont sauvegardés dans `benchmark-results.json`. Voir la [documentation utilisateur](../../userdoc/performance/benchmark.md) pour les résultats des benchmarks.

## 3. Tests de résilience

Ces tests vérifient que Shimera gère correctement les états invalides et les conditions d'erreur,
en utilisant [GoogleTest](https://google.github.io/googletest/).

Ils sont divisés en deux catégories : les tests qui s'exécutent **sans contexte GPU valide** et ceux qui s'exécutent **avec un contexte**,
via un fixture partagé `ContextTest` qui initialise et détruit une fenêtre par backend.

### Exemple

::: code-group

`````cpp [ContextTest.hpp]
class ContextTest : public ::testing::Test {
protected:
#ifdef SHIMERA_BACKEND_OPENGL
    static inline GLFWwindow* m_window = nullptr;
#elif defined(SHIMERA_BACKEND_SFML)
    static inline sf::Window* m_window = nullptr;
#endif
    static void SetUpTestSuite() { ... }
    static void TearDownTestSuite() { ... }
};
`````

`````cpp [ResilienceTests.cpp]
TEST(BackendFactory, CreateBackendWithoutContext) {
    const IBackend* backend = BackendFactory::create();
    EXPECT_NE(backend, nullptr);
    delete backend;
}

TEST_F(ContextTest, AddEffect) {
    IBackend* backend = BackendFactory::create();
    EXPECT_NE(backend, nullptr);
    EffectPipeline pipeline(backend, 800, 600);
    EXPECT_EQ(pipeline.size(), 0);
    pipeline.addEffect<DistortionEffect>();
    EXPECT_EQ(pipeline.size(), 1);
    delete backend;
}
`````

:::

### Couverture

| Test | Comportement attendu |
|---|---|
| `BackendFactory::CreateBackendWithoutContext` | Backend créé avec succès |
| `BackendFactory::CreateBackend` | Backend créé avec succès |
| `IFrameBuffer::CreateFrameBufferWithoutContext` | Lève une exception (pas de contexte valide) |
| `ContextTest::CreateFrameBufferWithBadSize` | Lève une exception (taille invalide) |
| `ContextTest::CreateFrameBuffer` | Framebuffer créé avec succès |
| `EffectPipeline::CreateEffectPipelineWithoutContext` | Pipeline vide, pas de crash |
| `ContextTest::CreateEffectPipeline` | Pipeline vide créé |
| `ContextTest::AddEffect` | La taille du pipeline s'incrémente correctement |
| `ContextTest::GetEffect` | Retourne une référence cohérente |
| `ContextTest::GetEffectNotFound` | Lève `std::out_of_range` |

## 4. Exécution des tests

Un script est fourni pour chaque plateforme. Il compile toutes les cibles et exécute la suite de tests complète.

::: code-group

`````bash [Linux / WSL]
chmod +x run-tests.sh
./run-tests.sh
`````

`````bat [Windows]
run-tests.bat
`````

:::

Les scripts gèrent l'ensemble du pipeline :

1. Configurer et compiler (`xmake f -m debug -c -y`)
2. Compiler chaque backend et ses tests associés
3. Exécuter les tests mémoire et les benchmarks (avec fichier de suppression LSan sur Linux)
4. Exécuter les tests de résilience via GoogleTest

## 5. Pipeline CI

Les tests s'exécutent automatiquement sur GitHub Actions avant tout merge dans `dev` ou `master`.

Deux pipelines sont en place :

| Pipeline | Déclencheur | Runner |
|---|---|---|
| Vérifications de build | PR ou push ciblant `dev` ou `master` | Hébergé par GitHub |
| Suite de tests complète | PR ou push ciblant `dev` ou `master` | Auto-hébergé (Ubuntu 24.04, GPU NVIDIA) |