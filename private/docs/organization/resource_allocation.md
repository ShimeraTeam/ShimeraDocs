# Resource Allocation and Management

This document describes how we distribute the project's human and material resources on Shimera: who does what, on which machines, and how we assign those resources to tasks while accounting for our availability constraints and our priorities.

## 1. Working context and constraints

We are a team of three. Since September 2025, each of us has lived in a different country, in places very far apart, with large time-zone gaps. Alongside the project, all three of us are enrolled for the year at a foreign university, which adds a competing and variable academic workload (classes, projects, exams).

We have identified two families of constraints:

- **Human availability constraints**: few synchronous slots in common because of the time zones, and available time that fluctuates with each person's university calendar.
- **Material availability constraints**: our single reference machine for GPU measurements is only made available to us by Epitech, on request, two weeks per month. This limited window must be planned for and pooled without blocking day-to-day work.

Our core principle follows from this: we work **asynchronous first**. Work is split into short, independent tasks tracked on a shared board, so that none of us is ever blocked waiting on another time zone.

## 2. Human resources

We have three primary roles. These are our reference responsibilities, but in practice, since all three of us have a solid technical background, each of us reaches beyond the job title and contributes to code, tests and documentation.

| Person | Primary role | Concrete responsibilities on the project |
|---|---|---|
| **Léo Maurel** | Project lead, technical director | Architecture decisions, development of core effects and shaders, and feature development. |
| **Paul Arbez** | Organization lead | Project and documentation organization, legal and licensing strategy, example projects and feature development. |
| **Eddy Gardes** | DevOps, deployment and quality lead | Continuous integration and delivery pipeline, setup and upkeep of the self-hosted GPU runner, test infrastructure, release publishing, pre-commit hooks and code quality, changelog setup and feature development. |

We assign tasks primarily along this base of roles and each person's expertise, but we stay versatile: cross-reviews and the fact that everyone touches code, tests and docs keep us from hitting bottlenecks when one of us is less available because of university.

### 2.1 Identifying the human resources we need

For Shimera, identifying the human resources the project needs was a real decision: the team could be three or four. We did look for a possible fourth member, but Shimera is a research project whose solution had not yet been found, and we did not find anyone motivated enough to commit to that kind of uncertainty. We took that as a filter rather than a setback: a project this exploratory is only carried by people genuinely invested in it, and we preferred three fully committed builders to a fourth who would not be. The real question then became sharper: did the three of us already cover what the project needs, and could we develop the rest ourselves?

Between us, we already held the project's most essential domains, and our profiles fit together:

- **Léo** came up with the original idea for Shimera and already had a foundation in shader creation, the technical heart of the library.
- **Paul** was the most organized of the three and has no trouble taking the lead on coordination, which is why project and documentation organization naturally fell to him. Paul and Léo had also worked together on graphics projects before, so they knew each other's way of working and knew they made a good pair.
- **Eddy** had not worked with Léo or Paul before, but he brought DevOps skills neither of them had, the project genuinely interested him, and we knew he was reliable and hard-working.

The roles therefore mapped cleanly onto our three profiles (see the table above): architecture and core rendering to Léo, project and documentation organization to Paul, CI/CD and GPU infrastructure to Eddy. The skills none of us held at the start (operating the GPU runner, benchmarking, the SFML and Raylib backends, see 2.2) were ones we could develop within our work cycles rather than gaps that justified a new hire, so we treated each as a task in its own right, planned and learned during the project.

### 2.2 The skills the project requires

The skills we need are dictated by what Shimera is and how we build it: a GPU-facing C++ library exposing twelve configurable effects across three backends (OpenGL, SFML, Raylib) on Windows and Linux, released as open source and built by a team spread across several time zones. The table below lists each required skill, why the project's technological and organizational context demands it, and whether we already had it or developed it along the way.

| Required skill | Why the project needs it | Present or developed | Mainly carried by |
|---|---|---|---|
| Modern C++ (C++23) and low-level GPU resource management | The library manipulates GPU buffers, textures and shaders directly; safety and correctness rest on it | Present, deepened during the project | All |
| OpenGL and GLSL shader programming | The effects and the rendering pipeline are written directly against OpenGL and GLSL | Present, deepened during the project | Léo |
| Multi-backend architecture and public API design | A library consumed by third parties over three backends needs a clean, stable abstraction | Present | Léo |
| SFML and Raylib integration | Supporting three windowing backends is part of the specification | Developed during the project | All |
| CI/CD and GitHub Actions | An open-source release needs reproducible cross-platform builds, tests and versioned releases | Present, deepened during the project | Eddy |
| Operating a self-hosted GPU runner | Cloud runners have no GPU; real-GPU tests and benchmarks require a machine we set up and maintain ourselves | Developed during the project | Eddy |
| Performance benchmarking (FPS, VRAM, memory) | We have to measure and prove the library's low runtime overhead | Developed during the project | Eddy |
| Legal and licensing management | Releasing under the GPL while each author keeps the copyright to their own contributions requires a deliberate, documented licensing strategy | Present, deepened during the project | Paul |
| Project organization and team management | Coordinating a distributed, part-time team needs planning, start-of-cycle prioritization and task assignment on GitHub Projects to deliver the beta on schedule | Present, formalized during the project | Paul |
| Distributed, asynchronous collaboration | Working across large time-zone gaps demands a disciplined git and review workflow | Present, formalized during the project | All |

Rather than adding a fourth member, we closed every gap in this table by **learning on the project**: the skills marked "developed" (running the GPU runner, benchmarking, the SFML and Raylib backends) were planned as work of their own and picked up by the person whose role they extended. This is also how we keep the specification's **time and effort** constraints realistic: we only commit to features whose required skills we either already hold or can develop within a cycle, given each person's fluctuating university availability.

## 3. Material resources

### 3.1 The reference GPU runner

Our central material resource is a **virtual machine hosted on a dedicated server, equipped with an NVIDIA Quadro RTX 5000**. We use it as a **self-hosted GitHub Actions runner**: it runs the test suite and the benchmarks on a real GPU, which the free cloud runners cannot do.

This machine is our **measurement reference**. The benchmark results it produces (frames per second, VRAM used per effect, across the OpenGL, SFML and Raylib backends) are committed automatically and are authoritative for comparing performance over time.

We only have access to this machine **two weeks per month**, on request from Epitech. This window is a hard constraint: we concentrate the tests and benchmarks that depend on it during that period, and we organize our work cycles around it.

### 3.2 Our development machines

Each of us has a personal machine with a GPU:

| Machine | GPU |
|---|---|
| Machine 1 | NVIDIA RTX 5060 |
| Machine 2 | NVIDIA RTX 4070 (laptop) |
| Machine 3 | NVIDIA RTX 5060 (laptop) |

These machines are used for everyday development: writing code, fast iteration on shaders, visual validation of effects and local measurements. Those local measurements stay secondary and are always compared to the reference runner, which remains the only stable comparison baseline across our different setups.

### 3.3 The cloud runners

For everything that does not need a dedicated GPU, we rely on the **GitHub-hosted runners** (`ubuntu-latest`, `windows-latest`). They handle cross-platform compilation (Linux and Windows, static and shared, across the three backends) and the production of release binaries. This keeps these heavy, parallelizable tasks off our own machines.

### 3.4 Collaboration tools

Being spread across several time zones, our coordination tooling is a resource in its own right:

| Tool | Use |
|---|---|
| **GitHub** | Code hosting, issues, pull requests and reviews, automation via GitHub Actions. |
| **GitHub Projects** | Backlog and task-tracking board: this is where we visualize workload, progress and the assignment of each task. |
| **Discord** and **Teams** | Day-to-day communication, asynchronous as well as synchronous when our slots overlap. |
| **Google Drive** | Shared documents and storage of common files. |

## 4. Assigning resources to tasks

### 4.1 Work cycles

We organize work in cycles. We first ran two-week cycles, but that pace proved too short to deliver a coherent increment between checkpoints. We therefore moved to **one-month cycles**.

At the start of each cycle, we hold a **meeting** to reset priorities and plan the next cycle: we choose the tasks to carry out, estimate them and distribute them. This monthly rhythm aligns with the two-week window during which the GPU runner is available, letting us place testing and benchmarking tasks at the right point in the cycle.

### 4.2 Assigning people

We assign each task to the person whose role and expertise fit best, while accounting for priorities and workload:

- **Internal priorities**: the priorities set during the start-of-cycle meeting. The objective driving the current cycle is the delivery of the **beta, on 7 July 2026**, which brings together twenty-five features (twelve configurable shader effects) across the three OpenGL, SFML and Raylib backends, on Windows and Linux.
- **External priorities**: each person's university calendar. During exam or deadline periods, we reduce the load of the person concerned and redistribute critical tasks to whoever is most available.
- **Workload estimation**: every task is described in an issue and placed on the GitHub Projects board, giving us a shared view of estimated load and avoiding overloading anyone.

### 4.3 Assigning machines

Each type of task is routed to the most suitable material resource, so as to make the best use of the reference runner, which is our scarcest resource:

| Task | Assigned resource | Justification |
|---|---|---|
| Authoritative benchmarks and performance measurements | Reference GPU runner (Quadro RTX 5000) | Only machine with a stable, known configuration; guarantees reproducible measurements comparable over time. |
| Automated GPU tests in continuous integration | Reference GPU runner | Requires a real GPU and a display, unavailable on cloud runners. |
| Development, shader iteration, visual validation | Development machines (RTX 5060 / 4070 / 5060 laptops) | Available locally and immediately, without putting the reference on hold. |
| Cross-platform compilation and release binaries | GitHub cloud runners (Linux / Windows) | Parallelizable tasks with no need for a dedicated GPU; free up our machines. |

Because the reference runner is only available two weeks per month, we group onto that window the tests and benchmarks that depend on it. For the rest of the month, development and validation happen on our local machines, which ensures that this scarce resource is never a day-to-day bottleneck.

### 4.4 Respecting constraints in planning

Our planning is designed to absorb our availability constraints:

- **Asynchronous split**: short, independent tasks, a conventional branch strategy (`feat/`, `fix/`, `chore/`, etc.) and reviewed pull requests, so work moves forward without depending on a common slot.
- **Pooling the reference runner**: GPU runs go through the continuous-integration queue, during the two-week window when the runner is available. We do not depend on this single machine for everyday development, which happens on our local machines.
- **Reprioritization per cycle**: the start-of-cycle meeting is when we readjust priorities according to real progress and each person's availability. If a delay builds up, for instance because of an exam period, the least critical tasks are pushed to the next cycle rather than delaying the planned delivery.

## Conclusion

Our resources fall into three families: people (three complementary but versatile roles), machines (one reference GPU runner, our development machines and the cloud runners) and collaboration tooling (GitHub, GitHub Projects, Discord, Teams, Google Drive). We assign them to tasks in one-month cycles, whose priorities are set at the start-of-cycle meeting, based on role, expertise, internal and external priorities and estimated workload. The whole setup is built to respect our two main constraints: limited human availability shifted by time zones and university, and the availability of our single reference machine, accessible two weeks per month, that we pool without blocking day-to-day work.
