# Shimera Technology Watch

> How the team stays informed on the technologies Shimera relies on, and turns that information into concrete decisions.

## Purpose

Shimera is a low-level C++23 graphics library that layers post-processing shader effects over OpenGL, SFML, and raylib. These are mature, stable technologies, but the stack is deep: graphics APIs are wide and full of driver-specific behavior, and the surrounding tooling (windowing libraries, build system, CI/CD, documentation) still ships the occasional breaking release.

Technology watch is our organized effort to stay on top of that surface area. The goal is not to react to constant churn, but to keep a small set of high-signal channels under regular review so that:

- we notice breaking changes and deprecations before they hit our users;
- we adopt community best practices instead of reinventing them;
- our repository structure and deployment stay aligned with how comparable open-source graphics libraries are built;
- our technical choices (documented in the [Technology Comparative Briefs](/library/technology_comparative_briefs)) remain justified over time.

This document describes the four channels we monitor and how each one feeds back into the project.

## Scope: technologies under watch

The watch is centered on the technologies actually used in the repository.

| Domain | Technology | Why we watch it |
| --- | --- | --- |
| Language | C++23 | New standard features, compiler support (GCC/Clang/MSVC), RAII patterns for GPU resources |
| Graphics API | OpenGL 3.3+, GLEW | Extension support, driver behavior, deprecation of legacy paths |
| Shaders | GLSL | Version compatibility, portability pitfalls between drivers |
| Math | GLM | API changes, alignment/SIMD considerations |
| Backends | SFML 3, raylib, SDL3 (exploratory) | Major releases and API breaks |
| Build | xmake | Package manager updates, toolchain configuration, cross-platform builds |
| CI/CD & hosting | GitHub Actions, GitHub Releases | Action version bumps, runner image changes, release workflow patterns |
| Documentation | VitePress | Alpha channel updates, config format changes |

## Watch channel 1: Reddit, community monitoring

**Role:** track the pulse of the C++ and graphics-programming communities: what problems people hit, which tools gain or lose traction, and how a library like ours is received.

Reddit is our primary informal channel because the C++/gamedev ecosystem is highly active there and historically values open source (the same communities behind SFML, raylib, and bgfx). We follow:

| Subreddit | What we watch for |
| --- | --- |
| r/cpp | C++23 adoption, compiler news, library design conventions |
| r/opengl | Driver quirks, shader portability issues, framebuffer and post-processing patterns, world-space rendering techniques |
| r/raylib | OpenGL interop with raylib, shader integration in raylib, community examples |
| r/sfml | OpenGL interop with SFML, community examples |
| r/sdl | OpenGL interop with SDL, community examples |
| r/vulkan | Signals on where the graphics ecosystem is heading (relevant to our long-term API strategy) |

**How it feeds the project:** community threads directly informed several comparative decisions already recorded in the project (for example, language-choice discussions on r/opengl cited in the comparative briefs). Reddit is also part of our [distribution strategy](/deployment/diffusion_strategy): the public launch plan targets r/cpp, r/opengl, and r/gamedev, so monitoring these communities beforehand tells us how to frame the announcement and what objections to expect.

**Practical rule:** community opinion is a signal, not a source of truth. Anything actionable found on Reddit is confirmed against official documentation before it changes the codebase.

## Watch channel 2: Stack Overflow, best practices and problem solving

**Role:** resolve concrete, reproducible engineering problems and align our implementation with established best practices.

When we hit a precise technical wall (a shader that compiles on one driver but not another, a framebuffer that misbehaves on resize, an xmake configuration that will not link), Stack Overflow is the fastest path to a vetted, upvoted answer. We monitor and search these tags:

| Tag | Typical use |
| --- | --- |
| `[opengl]` | Context creation, framebuffer objects, texture formats |
| `[glsl]` | Uniform handling, precision qualifiers, version pragmas |
| `[c++]` / `[c++23]` | Modern language idioms, templates, RAII resource wrappers |
| `[sfml]` / `[raylib]` | Backend-specific OpenGL interop |
| `[glew]` | Extension loading and initialization order |
| `[framebuffer]` | Render-to-texture, the pattern at the core of our post-processing pipeline |

**How it feeds the project:** the recurring engineering themes in the codebase (the framebuffer/render-to-texture pipeline, the per-backend shader and texture abstractions, correct GLEW initialization order) are exactly the areas where Stack Overflow answers save hours

**Practical rule:** we prefer accepted, recent, high-vote answers, and we verify the referenced API against the official documentation before merging. Snippets are adapted to our RAII wrappers, never copied verbatim.

## Watch channel 3: GitHub, structure and deployment models

**Role:** model our repository structure, CI/CD, and release process on how mature open-source graphics libraries are actually organized.

GitHub is where we observe *how comparable projects are built and shipped*, not just their code. We study reference repositories as structural templates:

| Reference repository | What we borrow / compare |
| --- | --- |
| raylib | Example-driven layout, simple public API surface, release packaging |
| SFML | Backend/module separation, versioned releases, documentation structure |
| glfw / GLEW | Minimal C API surface, cross-platform build matrices |
| bgfx | Multi-backend abstraction strategy, shader tooling organization |
| godot | Multi-backend rendering architecture (OpenGL/Vulkan), contribution governance, release cadence |
| blender | Large-scale C/C++ codebase organization, cross-platform build and packaging, documentation practices |

We also watch the **GitHub Actions** ecosystem, since our entire delivery pipeline runs on it. The repository already uses several workflow models directly informed by this watch:

- **CI** (`ci-build`, `ci-tests`): build and test on every change.
- **CD** (`cd-release`): a build matrix across `ubuntu-latest`/`windows-latest`, the three backends (`opengl`, `sfml`, `raylib`), and architectures, packaging `.so`/`.a`/`.dll`/`.lib` artifacts and publishing GitHub Releases (with pre-release detection) on `v*` tags.
- **Submodules** (`update-submodules`): the `learnings/` folders and the docs site are wired in as Git submodules.
- **Docs deployment** (`vitepress`): the public documentation builds and deploys to `gh-pages`.
- **Mirroring** (`mirror_to_epitech`): the repository is mirrored to the school infrastructure.

**How it feeds the project:** watching how raylib and SFML tag releases, package binaries, and label issues shaped our own tagged-release model (`v0.1.0`, changelog-driven releases) and the topics/labels plan in the distribution strategy. Following Action version changes (for example checkout, upload-artifact, and gh-release action major bumps) is a maintenance necessity: our `cd-release` workflow pins specific major versions and must be updated as those actions evolve.

**Practical rule:** we treat a pattern as adoptable when it appears consistently across several established libraries, not because a single trending repo uses it.

## Watch channel 4: Official documentation, reference for the technologies used

**Role:** the authoritative source. Every decision that touches an API is validated here before it ships.

Official documentation is the final checkpoint of the watch: it resolves the ambiguity that community channels leave open. We keep a curated set of primary references, one per technology in the stack:

| Technology | Primary reference |
| --- | --- |
| OpenGL | Khronos OpenGL Registry, <https://registry.khronos.org/OpenGL/> and <https://docs.gl> |
| GLSL | Khronos GLSL specifications (via the OpenGL registry) |
| GLEW | <https://glew.sourceforge.net/> |
| GLM | <https://github.com/g-truc/glm> (manual and API docs) |
| SFML | <https://www.sfml-dev.org/documentation/> and the 3.0 tutorials |
| raylib | <https://www.raylib.com/> cheatsheet and the raylib wiki |
| SDL3 | <https://wiki.libsdl.org/SDL3/> |
| xmake | <https://xmake.io/> |
| VitePress | <https://vitepress.dev/> |
| GitHub Actions | <https://docs.github.com/actions> |
| Learning resource | <https://learnopengl.com/> (foundational OpenGL learning, reflected in the `learnings/LearningOpenGL*` submodules) |

**How it feeds the project:** the comparative briefs already cite official OpenGL and SFML documentation to justify the C++/OpenGL/GLSL choices. Version watch is critical here: the SFML 2 to 3 transition was a breaking change, xmake's package definitions change between releases, and VitePress is tracked on an alpha channel (`^2.0.0-alpha.15`), so we read release notes before bumping any dependency.

**Practical rule:** documentation is the source of truth; when it contradicts a Reddit thread or an old Stack Overflow answer, the documentation wins.

## Watch process and cadence

The four channels form a funnel: informal signal at the top, authoritative validation at the bottom.

| Channel | Nature | Typical cadence | Output |
| --- | --- | --- | --- |
| Reddit | Trends, community sentiment | Continuous / weekly skim | Awareness, launch framing, topics to investigate |
| Stack Overflow | Concrete problem solving | On demand, per problem | Vetted solutions adapted to our code |
| GitHub | Structure & deployment models | Per release cycle, when a question arises | Repo layout, CI/CD, release patterns |
| Official docs | Authoritative reference | Before every dependency or API change | Validated, shippable decisions |

The typical flow: a signal spotted on **Reddit** or hit as a bug becomes a precise question answered on **Stack Overflow**; the structural or deployment side is modeled on **GitHub**; and nothing is merged until it is confirmed against the **official documentation**.

## References

- Technology decisions: [Technology Comparative Briefs](/library/technology_comparative_briefs)
- Distribution and community launch: [Diffusion Strategy](/deployment/diffusion_strategy)
- Technical environment: [Technical Environment](/deployment/technology_environment)
- OpenGL registry: <https://registry.khronos.org/OpenGL/>
- learnopengl.com: <https://learnopengl.com/>
- raylib: <https://www.raylib.com/>
- SFML: <https://www.sfml-dev.org/>
- xmake: <https://xmake.io/>
- VitePress: <https://vitepress.dev/>
