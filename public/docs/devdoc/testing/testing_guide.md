# Testing Guide

## Introduction

This document describes the different test categories used in Shimera,
the associated tools, and the target platforms for each.

## 1. Memory Tests

These tests detect memory leaks, invalid accesses, and undefined behavior.

### Linux - AddressSanitizer (ASan) / LeakSanitizer (LSan)

Compiled with ASan/LSan flags, these tests run on Linux and on WSL.

### Windows - CRT Debug Heap

On native Windows, the CRT Debug Heap detects leaks at program exit.
No additional flags are required in MSVC Debug builds.

### Example

::: code-group

````cpp [MemoryTest.cpp]
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


````cpp [main.cpp]
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
````

:::

## 2. Benchmark Tests

These tests measure the performance of backends and shaders in Shimera, and compare them against each other.

They cover the following metrics:

| Metric | Unit | Description |
|---|---|---|
| `avgFps` | frames/s | Average FPS over the entire benchmark run |
| `frames` | count | Total number of frames rendered |
| `totalMs` | ms | Total render time for all frames |
| `vramUsed` | KB | GPU memory consumed at the end of the run |

Each backend is tested across the same scenes with cumulative post-processing effects:

- No effects
- Single effect (e.g. `GaussianBlurEffect`, `VignetteEffect`, `ChromaticAberrationEffect`...)
- Two effects combined
- Three effects combined

### Example

Each benchmark runs **100 warm-up frames** before starting the measurement, then renders **5000 frames** and records the elapsed time.
VRAM is measured before and after pipeline setup using `GL_NVX_gpu_memory_info` (NVIDIA only).

::: code-group

```cpp [BenchmarkSfml.cpp]
void BenchmarkSfml::run() {
    BenchmarkReport report;
    float time = 0.0f;

    // Warm-up phase
    this->setupScene(report);
    for (int i = 0; i < 100; i++) {
        this->renderScene(time);
    }

    // Measured phase
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
```

```cpp [main.cpp]

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
```

:::

Results are saved to `benchmark-results.json`. See [user documentation](../../userdoc/performance/benchmark.md) for the benchmark results.

## 3. Resilience Tests

These tests verify that Shimera handles invalid states and error conditions gracefully,
using [GoogleTest](https://google.github.io/googletest/).

They are split into two categories: tests that run **without a valid GPU context** and tests that run **with one**,
using a shared `ContextTest` fixture that sets up and tears down a window per backend.

### Example

::: code-group

```cpp [ContextTest.hpp]
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
```

```cpp [ResilienceTests.cpp]
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
```

:::

### Coverage

| Test | Expected behavior |
|---|---|
| `BackendFactory::CreateBackendWithoutContext` | Backend created successfully |
| `BackendFactory::CreateBackend` | Backend created successfully |
| `IFrameBuffer::CreateFrameBufferWithoutContext` | Throw an exception (no valid context) |
| `ContextTest::CreateFrameBufferWithBadSize` | Throw an exception (invalid size) |
| `ContextTest::CreateFrameBuffer` | Framebuffer created successfully |
| `EffectPipeline::CreateEffectPipelineWithoutContext` | Empty pipeline, no crash |
| `ContextTest::CreateEffectPipeline` | Empty pipeline created |
| `ContextTest::AddEffect` | Pipeline size increments correctly |
| `ContextTest::GetEffect` | Returns consistent reference |
| `ContextTest::GetEffectNotFound` | Throws `std::out_of_range` |

## 4. Running the Tests

A script is provided for both platforms. It builds all targets and runs the full test suite.

::: code-group

```bash [Linux / WSL]
chmod +x run-tests.sh
./run-tests.sh
```

```bat [Windows]
run-tests.bat
```

:::

The scripts handle the full pipeline:

1. Configure and build (`xmake f -m debug -c -y`)
2. Build each backend and its associated tests
3. Run memory and benchmark tests (with LSan suppression file on Linux)
4. Run resilience tests via GoogleTest

## 5. CI Pipeline

Tests run automatically on GitHub Actions before any merge into `dev` or `master`.

Two pipelines are in place:

| Pipeline | Trigger | Runner |
|---|---|---|
| Build checks | PR or push targeting `dev` or `master` | GitHub-hosted |
| Full test suite | PR or push targeting `dev` or `master` | Self-hosted (Ubuntu 24.04, NVIDIA GPU) |
