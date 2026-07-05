# Shimera - Security Map

This document describes Shimera's technical protection strategy (C++ graphics abstraction library, OpenGL / Raylib / SFML backends).

## 1. Scope & Threat Model

Before identifying risks, it's essential to define what Shimera is and isn't, in order to frame a relevant analysis rather than a generic one.

Shimera is:
- An **Open Source software library only** (not a service, not an application)
- A library that **handles no user data** (no accounts, no sessions, no personal content)
- A library that **stores no sensitive data** (no database, no persisted user config files)
- A library **with no network service or authentication** (no server, no remote API, no network RCE possible)

**Direct consequence for the scope of this map**: classic risk categories (auth, session management, personal data leaks, network exposure) are **out of scope**, because they are structurally absent from the library. Shimera's real risk lies elsewhere:

- **Memory robustness**: Shimera directly manipulates GPU resources (OpenGL) via low-level code, so classic C++ security risks (buffer overflow, use-after-free, double-free) apply.
- **Public API boundary**: Shimera is integrated into third-party applications. Unvalidated input can propagate from the client app all the way to the graphics driver.
- **Supply chain / CI-CD integrity**: as an Open Source project with a self-hosted runner, the build infrastructure is its own attack surface, independent of the library's code itself.

This map therefore documents **Shimera's actual protection strategy**: what is protected, why, and how, within these boundaries.

## 2. Sensitive Modules

These modules are considered sensitive because they directly manipulate native resources (GPU, memory, files) from input provided by the calling code.

| Module | Role | Why it's sensitive |
|---|---|---|
| **Framebuffers** (`OpenGLFramebuffer` and equivalents) | Allocates GPU FBO/RBO from caller-provided dimensions | Sensitive because it directly manipulates GPU resources |
| **Textures** (`OpenGLTexture` and equivalents) | Allocates GPU textures | Same logic as Framebuffer — low-level GPU manipulation remains an area to monitor |
| **Shaders** (`OpenGLShader` and equivalents) | Loads, compiles, and links GLSL programs from files | Takes caller-provided file paths; manages the lifecycle of a GPU resource (`glProgram`) |
| **EffectPipeline** | Orchestrates multiple post-processing effects using double-buffered (ping-pong) FBOs | The module with the most complex internal state in the project; any mismatch between resize and rendering can trigger undefined behavior |
| **Backend factories** (`create*` for each backend) | Handoff point between Shimera's public API and the native implementation (GL/Raylib/SFML) | Ownership boundary: these functions transfer memory responsibility to the client application |

## 3. Critical Mechanisms

### Ping-pong buffering (`EffectPipeline`)
The effects pipeline alternates between two framebuffers (`m_fboA` / `m_fboB`) to apply multiple chained effects without extra allocation on each pass.
- **Risk**: if `resize()` is called during an in-progress render cycle, or if the FBOs aren't rebuilt synchronously with the source texture, a dimension mismatch can produce undefined GL behavior. Bounds validation on `width`/`height` reduces the risk of aberrant values (negative, zero, excessive) triggering this mismatch, but does not cover the resize/render temporal synchronization itself.
- **Nature of the risk**: correctness/stability, not a vulnerability exploitable by a third party.

### Native state management (bind/unbind)
Each resource (shader, texture, framebuffer) manages its own bind/unbind locally, with no centralized state tracking.
- **Risk**: a missing `unbind()` can let active GPU state leak from one object to another, causing silent rendering bugs that are hard to diagnose.
- **Nature of the risk**: internal robustness, not an attack surface.

### Ownership via raw pointers at backend boundaries
The backends' `create*` functions return raw pointers (`new X()`), leaving it up to the client application to free them.
- **Risk**: memory leak if the caller omits the `delete`, or double-free if ownership is misunderstood.
- **Nature of the risk**: not a vulnerability in itself, but a point of vigilance passed on with every new integration or new backend.

## 4. Access Points (public API boundary)

These are Shimera's public functions that receive input provided by the calling code. This is the boundary between the library's code and uncontrolled external code — the only true "access control point" relevant for a library with no network or authentication.

| Access point | External input | Current validation | Status |
|---|---|---|---|
| Framebuffer constructor (all backends) | `width`, `height` (int) | Bounds checked before being passed to native calls | OK |
| Texture constructor (all backends) | `width`, `height` (int) | Bounds checked before being passed to native calls | OK |
| `EffectPipeline::resize(width, height)` | `int`, `int` | Bounds checked before propagation to internal Framebuffers | OK |
| Shader loading (`loadFromFiles(vertPath, fragPath)`, all backends) | file paths (`std::string`) | None | Monitored - Limited impact (see dedicated section below) |
| `EffectPipeline::get<TEffect>(index)` | numeric index | Checked (`std::out_of_range` exception if absent) | OK |
| Shader compilation (`glCompileShader` + `GL_COMPILE_STATUS` check) | GLSL source | Checked, clean failure via exception | OK |

### Focus: path traversal on shader loading

Analysis of the actual flow (identical across all backends): `path -> file read -> glShaderSource -> glCompileShader -> status check`.

- If the given path escapes the intended assets folder (e.g. `../../file`), the worst realistic case is **unauthorized file reading followed by a clean compilation failure** (since the content is unlikely to be valid GLSL).
- Conditional risk: only relevant if a third-party application using Shimera exposes a path chosen by an untrusted end user (a mod system, external config).
- Minor information leak possible: GLSL compilation error messages may quote fragments of the file read.
- **Status: theoretical, not critical within the current scope.**

## 5. Build Pipeline Vulnerabilities

| Item | Risk | Detail |
|---|---|---|
| Self-hosted runner (physical machine with dedicated GPU) | Low | GitHub configuration compliant with official recommendations: fork workflows blocked by default (approval required), no secrets or write tokens passed to external PRs. **Still depends on reviewer vigilance at approval time.** |
| Backend selection (compile-time) | None | `#ifdef SHIMERA_BACKEND_*` via xmake, no dynamic loading (`dlopen`/`LoadLibrary`), `#error` guard if no backend is defined |

## 6. Summary - Protection Strategy

| What's protected | Why | How |
|---|---|---|
| Shader compilation | Avoid a crash on invalid GLSL | Systematic `GL_COMPILE_STATUS` check, cleanup, and clean exception on failure |
| Backend selection | Avoid ambiguous or incomplete configuration | Compile-time resolution via xmake macros + `#error` guard |
| Memory (leaks, corruption) | Catch memory errors early in the dev cycle | ASan/LSan (Linux), CRT Debug Heap (Windows), run in CI |
| CI access to the self-hosted runner | Prevent arbitrary code execution on a physical machine from an external fork | Mandatory approval for external PR workflows, no secrets or write tokens passed to these workflows (GitHub Actions settings) |
| Dimensions (Framebuffer/Texture/resize) | Avoid passing negative, zero, or excessive values to native graphics calls | Bounds validation (`width > 0 && height > 0 && <= MAX_DIMENSION`) applied consistently across all three backends |

*This document is intended to evolve with each new backend, newly exposed public function, or CI infrastructure change.*