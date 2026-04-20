# Git Hooks

## Introduction

Git hooks are scripts that run automatically at certain points in the Git workflow. They can be used to enforce coding standards, run tests, or automate other tasks before or after specific Git actions, such as committing or pushing code.

But, native hooks have limitations, they are not versioned with the repository, making it difficult to share them among team members.

**pre-commit** is a framework that helps manage and maintain multi-language pre-commit hooks. It allows you to define hooks in a configuration file, which can then be shared across the team.

## Why use pre-commit?

Using pre-commit offers several advantages:

- **Consistency**: Ensures that all team members run the same checks before committing code.
- **Automation**: Automates repetitive tasks, reducing the chance of human error.
- **Version Control**: Hooks are stored in the repository, making it easy to share and update them.
- **Multi-language Support**: Supports hooks written in various programming languages.

## Pre-commit Setup

### Pre-requisites

- Python 3.6 or higher
- pip (Python package installer)
- Git

To get started with pre-commit, follow these steps:

### Install pre-commit

You can install pre-commit using pip:

```bash
pip install pre-commit
```

Then verify the installation:

```bash
pre-commit --version
```

### Activate hooks in your repository

Navigate to your Git repository and run:

```bash
pre-commit install
```

This command sets up the Git hooks to use pre-commit.

### First run

To run the hooks against all files (not just the staged ones), use:

```bash
pre-commit run --all-files
```

This is useful for the initial setup to ensure that all existing code complies with the defined hooks.

### Deactivate hooks
If you need to temporarily disable the pre-commit hooks, you can use the `--no-verify` option with your Git commands, for example:

```bash
git commit --no-verify -m "Your commit message"
```

For more informations, visit the official pre-commit documentation: [https://pre-commit.com/](https://pre-commit.com/)

**Implementation date:** January 2026