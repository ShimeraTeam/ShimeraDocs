# Commits

## Introduction

This document provides guidelines and best practices set up for managing commits in our project. Following these guidelines will help maintain a clean and organized commit history, making it easier for everyone to understand the changes made to the codebase.

## Before Conventional Commits

Before we adopted the **Conventional Commits**, we used our own commit message format. The format was as follows:

```<type in uppercase>: <subject>```

Where:
- `<type in uppercase>`: The type of the commit, such as `ADD`, `FIX`, `UPDATE`, etc.
- `<subject>`: A brief description of the changes made in the commit.

## Why We Adopted Conventional Commits

We adopted the **Conventional Commits** specification to standardize our commit messages and improve the readability of our commit history. The Conventional Commits format provides a clear and consistent way to describe the changes made in each commit, making it easier for developers to understand the purpose of each change. Additionally, as **Shimera** is an open-source project, following a widely recognized commit message format like Conventional Commits helps external contributors understand our commit history and encourages more contributions to the project.

## A Recognized Standard

The adoption of **Conventional Commits** is widely recognized within the tech community:

- Initially inspired by Angular's commit message guidelines, this approach has become a reference method for structuring professional development workflows.
https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md

- It is used and promoted in many open-source and industrial projects to improve commit readability, automate versioning, and simplify changelog generation.  
  Organizations like **NASA** use it in projects such as F´ (F Prime).
https://github.com/nasa/fprime/discussions/2758

## Conventional Commits Format

The Conventional Commits format consists of the following structure:

```
<type>(optional scope): <description>
```

Where:
- `<type>`: The type of the commit, such as `feat`, `fix`, `docs`, `style`, `refactor`, etc.
- `(optional scope)`: An optional scope that provides additional context about the commit, such as the area of the codebase affected by the change.
- `<description>`: A brief description of the changes made in the commit.

## Conclusion

By following the **Conventional Commits** specification, we can maintain a clean and organized commit history that is easy to understand for both internal and external contributors. This will help improve collaboration and make it easier for everyone to track changes in the codebase.

For more information, please refer to the official Conventional Commits website: [https://www.conventionalcommits.org/](https://www.conventionalcommits.org/).

Date of implementation: January 2026