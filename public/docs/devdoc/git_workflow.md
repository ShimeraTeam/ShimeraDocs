# Git Workflow Guide

## Introduction

This guide centralizes the contribution rules for developers working on the project.
It combines branch naming, commit conventions, and Git hooks setup in a single place.

## 1. Branch Naming

We use a conventional branching strategy to keep the repository clean and easy to navigate.

Use one of these prefixes:

- `main/`: stable production branch
- `dev/`: integration and ongoing development
- `feat/`: new feature or enhancement
- `fix/`: bug fix
- `hotfix/`: urgent production fix
- `chore/`: maintenance tasks (dependencies, docs, tooling)

Example branch names:

- `feat/post-processing-bloom`
- `fix/framebuffer-resize-crash`
- `chore/update-docs-links`

Reference: [Conventional Branch](https://conventional-branch.github.io)

## 2. Commit Messages

Follow the Conventional Commits format:

```text
<type>(optional scope): <description>
```

Common commit types:

- `feat`: new feature
- `fix`: bug fix
- `build`: build system or dependencies
- `chore`: maintenance work
- `ci`: CI/CD changes
- `docs`: documentation updates
- `style`: formatting/style changes only
- `refactor`: code refactor without behavior change
- `perf`: performance improvement
- `test`: tests added or updated

Examples:

- `feat(renderer): add chromatic aberration effect`
- `fix(opengl): prevent invalid framebuffer bind`
- `docs(devdoc): merge quality contribution guidelines`

Reference: [Conventional Commits](https://www.conventionalcommits.org/)

## 3. Git Hooks With pre-commit

Native Git hooks are local and not versioned. We use **pre-commit** so everyone runs the same checks.

### Pre-requisites

- Python 3.6+
- pip
- Git

### Install pre-commit

```bash
pip install pre-commit
pre-commit --version
```

### Activate hooks

From the repository root:

```bash
pre-commit install
```

### Run all checks once

```bash
pre-commit run --all-files
```

### Skip hooks temporarily (not recommended)

```bash
git commit --no-verify -m "Your commit message"
```

Reference: [pre-commit](https://pre-commit.com/)

## 4. Recommended Contribution Flow

1. Create a branch with the appropriate prefix.
2. Implement your change.
3. Run hooks and tests locally.
4. Write clear Conventional Commit messages.
5. Open your pull request targeting the expected branch.

Keeping this workflow consistent helps reviews move faster and keeps project history readable.