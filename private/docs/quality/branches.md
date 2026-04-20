# Branches

## Introduction

Branches are used to manage different versions of the codebase. They allow developers to work on new features, bug fixes, or experiments without affecting the main codebase.

This document provides guidelines and best practices for managing branches in our project. Following these guidelines will help maintain a clean and organized branch structure, making it easier for everyone to understand the purpose of each branch and collaborate effectively.

## Before Conventional Branch

Before adopting a conventional branching strategy, we had a less structured approach to branch management. This often led to confusion and difficulties in tracking the purpose of each branch. We had a lot of branches with task/ prefixes that were not standardized, making it hard to understand the context of each branch at a glance.

## Conventional Branching Strategy

To improve our branch management, we adopted a conventional branching strategy. This strategy involves using specific prefixes for different types of branches, such as:
- `main/`: for the main branch where the stable codebase resides
- `dev/`: for development work and integration of new features
- `feat/`: for new features or enhancements
- `fix/`: for bug fixes
- `hotfix/`: for urgent fixes that need to be applied to the main branch
- `chore/`: for non-code tasks like dependency, docs updates

## A Recognized Standard

The use of structured prefixes for branches is a cornerstone of modern collaborative development. This approach is widely recognized and promoted by the following industry leaders and methodologies:

- **Atlassian (Gitflow Workflow)**: Atlassian, publisher of Jira and Bitbucket, has popularized the “Gitflow” model. This model relies entirely on the use of prefixes to separate the lifecycles of features, fixes and versions. https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow

- Micosoft (Azure DevOps): Microsoft’s Azure DevOps also encourages the use of branch naming conventions to improve collaboration and code management. https://learn.microsoft.com/en-us/azure/devops/repos/git/git-branching-guidance?view=azure-devops

## Conclusion

By using these prefixes, we can easily identify the purpose of each branch and maintain a more organized repository. This also helps in code reviews and collaboration, as team members can quickly understand the context of each branch.

For more information, please refer to the official Conventional Branch website: https://conventional-branch.github.io

Date of implementation: January 2026