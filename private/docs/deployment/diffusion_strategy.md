# Shimera Distribution Strategy

## Chosen model: Open Source (GPL 3.0 license)

Shimera is, and will remain, a **fully open source** project, distributed under the **GNU GPL v3.0** license. The entire source code (library core, Raylib/SFML/native OpenGL backends, test suite, benchmark infrastructure, documentation) is public and freely available to read, modify, and redistribute under the terms of GPL 3.0.

## 1. Rationale for the chosen model

### Why full open source?

- **Nature of the project**: Shimera is a graphics abstraction library (OpenGL/GLSL layered over Raylib, SFML, and native OpenGL). This kind of low-level tool gains value and trust precisely because it's inspectable: a developer choosing a critical graphics dependency for their engine wants to be able to read the code, audit performance, and not depend on a black box.
- **Technical credibility**: Full transparency of the code reinforces this dimension: the quality of the code itself becomes the selling point, not just the end result.
- **Network effect and adoption**: a library of this type (niche, technical, C++/gamedev community) spreads mainly through peer trust and external contributions. A closed or partially closed model would significantly hinder this dynamic within the C++/gamedev ecosystem, which has historically valued open source (cf. SFML, raylib, bgfx, etc., all open).

## 2. Risk analysis

### Risks related to the GPL 3.0 license

| Risk | Description | Mitigation |
|---|---|---|
| **Limited adoption in closed commercial contexts** | The GPL enforces copyleft: any application that statically links Shimera and is distributed must itself be GPL-compatible. Studios or companies wanting to integrate Shimera into a closed proprietary product will be deterred. | Clearly document this constraint from the README onward. Consider an LGPL or dual-licensing model (GPL + paid commercial license) down the line if demand for closed commercial use emerges. |
| **Confusion over GPL obligations** | Contributors or novice users may misunderstand what copyleft implies (static vs dynamic linking, distribution vs internal use). | Add a licensing FAQ to the documentation (`devdoc/` or `userdoc/`), with concrete examples of permitted/non-permitted use. |
| **Hostile fork or hijacking** | A third party could fork the project and steer it in a different direction, or claim to represent the official project. | Protect the project's brand/name (Shimera) separately if needed (not covered by the GPL). Maintain an active presence (releases, regular commits) to remain the reference implementation. |

### Risks related to opening the code in general

| Risk | Description | Mitigation |
|---|---|---|
| **Exposure of security flaws / bugs** | The code (including known bugs, such as the errors currently being fixed) is publicly visible. | Normal practice in open source; transparency via GitHub issues rather than a problem. Responsible disclosure process if a genuine critical security flaw is found. |
| **Community maintenance load** | Issues, PRs, and external questions require response time, especially during exam/internship periods. | Define clear contribution standards (CONTRIBUTING.md), issue/PR templates, and accept that some contributions will have to wait. |
| **Idea theft without reciprocal contribution** | A company or developer could use the code and the idea without ever contributing back or crediting it. | Inherent to open source; partially offset by the GPL (any distributed derivative must remain open). |
| **Perceived as an immature "student" project** | Risk of not being taken seriously by professional users while the project is young. | Polished documentation, robust CI/CD, quantified and reproducible benchmarks, build/test badges on the README, versioned releases. |

## 3. Distribution plan

### Phase 1 - Foundations (before wide public release)
- Have a solid main README: overview, code examples, screenshots/GIFs of shader demos, CI.
- Have a `LICENSE` file (full GPL 3.0 text) and a `CONTRIBUTING.md`.
- Have a functional, well-documented beta.
- Have a tagged GitHub release (v0.1.0) with a basic changelog.

### Phase 2 - Public launch
- Make the GitHub repo publicly visible with relevant topics (`opengl`, `glsl`, `raylib`, `sfml`, `cpp`, `shader-library`).
- Launch post on targeted communities:
  - r/cpp, r/opengl, r/gamedev (Reddit)
  - Specialized forums (gamedev.net, official raylib/SFML Discords)

### Phase 3 - Growth and community
- Label issues to facilitate first-time external contributions.
- Set up a discussion channel (Discord or GitHub Discussions) for users/contributors.
- Track simple metrics (stars, forks, open/closed issues, external contributors) to assess traction.
- Iterate on a public roadmap (`ROADMAP.md` file) to show clear direction for the project.

### Phase 4 - Project continuity
- Regular versioned releases, changelog kept up to date.
- Periodically reassess the license if demand for closed commercial use becomes significant (GPL/commercial dual-licensing).

## Conclusion

Shimera is distributed as **fully open source under GPL 3.0**, a choice consistent with the technical nature of the project (low-level graphics library) and the C++/gamedev ecosystem's strong preference for openness. The main risks (copyleft limiting closed commercial use, maintenance load, code exposure) are identified and mitigated through clear documentation, structured contribution governance, and the option to move toward dual-licensing if the project gains commercial traction. The distribution plan follows a progressive logic: technical stabilization -> targeted public launch -> community building -> project continuity.