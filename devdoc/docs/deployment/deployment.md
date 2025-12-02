# **{Shimera} Deployment**
> A guide describing how our repository and CI/CD are structured.

## Table of Contents
1. [Versioning Organization](#versioning-organization)
2. [CI/CD](#ci-cd)

## Versioning Organization
---

The project, being in communication with multiple external sources and requiring a robust verification suite before production, needs a properly structured Git repository. The theoretical structure is as follows:

```
                      ┌─ feat
                      │
       ┌─ dev ┬───────┼─ task
       │      │       │
main ──┤      └─ fix  └─ research
       │
       └─ hotfix
```

Branch types are defined as follows:
- **main**: the main branch containing stable code deployed to production.
- **hotfix**: for urgent bug fixes in production.
- **dev**: for testing new features before deployment.
- **fix**: for bug fixes.
- **task**: for specific tasks or improvements.
- **feat**: for new features under development.
- **research**: for research and experimentation.

## CI/CD
---
