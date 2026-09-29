# Open Source Scope

This document lists **what Shimera opens, under which license, and what stays
private**. It is the operational companion of the
[Legal Protection Strategy](/legal/legal_protection_strategy) (why and how we
protect the project) and of the [Diffusion Strategy](/deployment/diffusion_strategy)
(why we chose open source). Use it before any publication: a release, a
documentation deployment, a new asset, or a change of visibility of a repository.

## 1. Summary

Shimera opens **two things**: the whole `Shimera` repository and the public
documentation (`ShimeraDocs/public`). Everything else stays private.

| Element | Status | License | Where |
|---|---|---|---|
| Library source code (`src/`) | **Open** | `GPL-3.0-only` | `ShimeraTeam/Shimera` |
| Shader sources (`res/shader/**/*.slang`, `.frag`, `.vert`) | **Open** | `GPL-3.0-only` | `ShimeraTeam/Shimera` |
| Runtime images (`res/imgs/`) | **Open** | `GPL-3.0-only` | `ShimeraTeam/Shimera` |
| Examples (`examples/`) | **Open** | `GPL-3.0-only` | `ShimeraTeam/Shimera` |
| Build scripts (`xmake.lua`, `.run/`) | **Open** | `GPL-3.0-only` | `ShimeraTeam/Shimera` |
| Governance files (`LICENSE`, `AUTHORS.md`, `CONTRIBUTING.md`, `README.md`) | **Open** | n/a (project metadata) | `ShimeraTeam/Shimera` |
| Release binaries (`.a`, `.so`, headers) | **Open** | `GPL-3.0-only` | GitHub Releases |
| User and developer documentation (`userdoc/`, `devdoc/`) | **Open** | To decide (see 3.3) | `ShimeraDocs/public`, GitHub Pages |
| Internal documentation (this site) | **Private** | All rights reserved | `ShimeraDocs/private` |
| e-Soleau deposit, action plan PDF, school deliverables | **Private** | All rights reserved | Maintainers only |
| The "Shimera" name and logo | **Not licensed** | Not covered by the GPL | Brand assets |
| CI secrets, runner configuration, credentials | **Private** | n/a | GitHub settings |

The rule of thumb: **everything needed to build, use, study and modify the
library is open. Everything that is internal strategy, proof, brand, or
infrastructure stays private.**

## 2. What is open, and why

### 2.1 The whole library repository (`ShimeraTeam/Shimera`)

The entire tracked content of the repository is public and licensed under
**GPL-3.0-only**, with no exception:

- `src/`: core (`Context`, `EffectPipeline`), the OpenGL layer (`GL/`), effects,
  materials, scene, uniforms, and the host adapters (`hosts/`: GLFW, SFML, raylib,
  SDL).
- `res/shader/`: Slang and GLSL sources of every effect and material. These are
  the heart of the project's value and are opened on purpose: the GPL copyleft
  is what prevents a closed product from reusing them silently.
- `res/imgs/`: runtime images used by the examples.
- `examples/`: standalone programs per host library.
- `xmake.lua` and `.run/`: build configuration.
- The full Git history, which is also part of our anteriority proof (see the
  [Legal Protection Strategy](/legal/legal_protection_strategy), section 5.2).

Not published (excluded by `.gitignore`): `build/`, `.xmake/`,
`compile_commands.json`, and `res/shader/generated/` (the GLSL produced by the
Slang pipeline at build time; it is derived from the Slang sources and can always
be regenerated from them).

**Why open all of it:** the GPL requires that anyone who distributes Shimera can
also provide the *complete corresponding source*, including build scripts. Keeping
part of the repository private would make our own releases non-compliant and would
break the trust argument of the [Diffusion Strategy](/deployment/diffusion_strategy).

### 2.2 Release binaries

Binaries published on GitHub Releases (for example `shimera-X.Y.Z-sfml-windows-x64.zip`)
are distributions of a GPL work. Each archive **must** contain:

- `LICENSE` (full GPL-3.0 text);
- `AUTHORS.md`;
- a `README.md` that points to the exact source tag (for example `v0.3.6`) in
  `ShimeraTeam/Shimera`.

Publishing the source on the same GitHub project, at the tag matching the
binary, satisfies the GPL source-availability requirement (GPL-3.0 section 6).

### 2.3 Public documentation (`ShimeraDocs/public`)

The user documentation (`userdoc/`) and developer documentation (`devdoc/`) are
built and deployed to GitHub Pages by the `Documentation` workflow, which only
builds `public/`. They are open because users need them to adopt the library,
and contributors need them to follow the contribution flow referenced by
`CONTRIBUTING.md` (code standards, git workflow, testing guide).

Opening the documentation means opening its **sources** too, not only the
rendered website. See section 4 for the repository split this requires.

## 3. Licensing choices per element

### 3.1 Code and shaders: `GPL-3.0-only`

Justified in the [Legal Protection Strategy](/legal/legal_protection_strategy),
section 4. Every source file (`.cpp`, `.hpp`, `.h`, `.inl`, `.slang`, `.frag`,
`.vert`) must start with the standard header:

```cpp
// SPDX-License-Identifier: GPL-3.0-only
//
// Shimera: a simple way to add visual effects without using any GPU knowledge
// Copyright (C) 2025-2026 The Shimera Authors
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, version 3 of the License.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

The header is not what creates the license (the `LICENSE` file already does), but
it keeps the license attached to a file when the file is copied out of the
repository, which is exactly what happens with shaders.

### 3.2 Examples

Examples are GPL like the rest of the repository. This is consistent: any program
built on Shimera and distributed is already bound by the GPL, so a more permissive
license on the examples alone would not give users more freedom.

### 3.3 Public documentation: decision needed

`ShimeraDocs` currently has **no license file**. By default, unlicensed content is
"all rights reserved": people can read it but not legally reuse, translate or
fix it.

### 3.4 Name and logo: not licensed

The GPL covers code, not the brand. The name "Shimera", the logo
(`shimera_logo_v2.1.png`) and the poster (`affiche.png`) are **not** placed under
the GPL. A fork may reuse the code but must not present itself as the official
Shimera (see [Legal Protection Strategy](/legal/legal_protection_strategy),
section 7). If the logo is used in the public documentation or the README, state
next to it that it is excluded from the documentation license.

## 4. What stays private, and why

| Element | Why it stays private |
|---|---|
| `ShimeraDocs/private` (this site) | Internal strategy: legal protection, security map (our own attack surface), POCs, action plan, technology watch. |
| e-Soleau archive and receipt | Proof of anteriority: its value comes from being sealed and kept by us. Only its existence and date are mentioned. |
| `plan_d_action_shimera.pdf` and school deliverables | Internal planning documents, not useful to users. |
| CI secrets, tokens, self-hosted runner setup | Security. Never in any repository, public or private. |
| Commercial terms (future dual license) | Business information, to be written only if dual licensing is activated. |

::: warning Private and public docs share one repository
`private/` and `public/` are two folders of the **same** `ShimeraDocs` Git
repository. The deployment only publishes `public/`, but making the repository
public would expose `private/` **and its whole Git history**. To open the
documentation sources, move `public/` (with the `Documentation` workflow) into
its own public repository and keep `ShimeraDocs` private. Also note that GitHub
Pages on a private repository requires a paid GitHub plan.
:::

## 5. Third-party components

Shimera does not vendor any third-party source: all dependencies are fetched by
xmake at build time (`add_requires`). Release archives only contain Shimera's own
static or shared library and headers. All dependencies are compatible with
GPL-3.0.

| Component | Version | Use | License | GPL-3.0 compatible |
|---|---|---|---|---|
| GLEW | 2.2.0 | Runtime (linked) | Modified BSD + MIT | Yes |
| GLM | 1.0.1 | Runtime (header-only) | MIT | Yes |
| GLFW | 3.4 | Examples / GLFW host | zlib | Yes |
| SFML | 3.0.1 | SFML host (optional) | zlib | Yes |
| raylib | 5.5 | raylib host (optional) | zlib | Yes |
| SDL3, SDL_image | unpinned | SDL host (optional) | zlib | Yes |
| SPIRV-Cross | 1.3.268 | Build-time only | Apache-2.0 | Yes (with GPL-3.0) |
| Slang compiler (`slangc`) | user-installed | Build-time only | Apache-2.0 with LLVM exception | Yes |

Rules:

- If a future release **bundles** a dependency (for example GLEW DLLs in a
  Windows archive), add a `THIRD_PARTY_NOTICES.md` with each bundled component's
  license text.
- **Never import code or shaders from a source with an incompatible license.**
  Common traps in graphics: Shadertoy (CC BY-NC-SA 3.0 by default, not
  GPL-compatible), LearnOpenGL code (CC BY-NC 4.0, not GPL-compatible), blog
  snippets with no license. Reimplement from the underlying technique or paper
  instead, and cite it in a comment.

## 6. Pre-publication checklist

Before each release or documentation deployment:

- [ ] Every source file has the `SPDX-License-Identifier: GPL-3.0-only` header.
- [ ] `LICENSE`, `AUTHORS.md`, `README.md` are present at the root and in the release archive.
- [ ] `AUTHORS.md` lists every contributor whose work is merged.
- [ ] No third-party code or shader with an incompatible or unknown license (section 5).
- [ ] No secret, token, internal document, or e-Soleau material in the public tree or its history.
- [ ] Nothing from `ShimeraDocs/private`copied into a public repository.
- [ ] The release tag matches the published binaries (source availability).

## Conclusion

Shimera opens **the whole library repository** (code, shaders, examples, build
scripts, history), **its binaries** and **its public documentation**: everything
someone needs to use, understand, and improve the library. It keeps **its
internal documentation, its proofs, its brand and its
infrastructure** private. The open part is protected by the GPL-3.0-only; the
private part is what lets the team prove authorship, defend the name, and keep the
future licensing options described in the
[Legal Protection Strategy](/legal/legal_protection_strategy).
