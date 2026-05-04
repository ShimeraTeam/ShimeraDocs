# Guide de Workflow Git

## Introduction

Ce guide centralise les règles de contribution pour les développeurs travaillant sur le projet.
Il combine la nomenclature des branches, les conventions de commit et la configuration des Git hooks en un seul endroit.

## 1. Nomenclature des branches

Nous utilisons une stratégie de branchement conventionnelle pour garder le dépôt propre et facile à naviguer.

Utilisez l'un de ces préfixes :

- `main/` : branche production stable
- `dev/` : intégration et développement en cours
- `feat/` : nouvelle fonctionnalité ou amélioration
- `fix/` : correction de bug
- `hotfix/` : correction urgente de production
- `chore/` : tâches de maintenance (dépendances, docs, outils)

Exemples de noms de branches :

- `feat/post-processing-bloom`
- `fix/framebuffer-resize-crash`
- `chore/update-docs-links`

Référence : [Conventional Branch](https://conventional-branch.github.io)

## 2. Messages de commit

Suivez le format Conventional Commits :

```text
<type>(scope optionnel): <description>
```

Types de commit courants :

- `feat` : nouvelle fonctionnalité
- `fix` : correction de bug
- `build` : système de build ou dépendances
- `chore` : travaux de maintenance
- `ci` : modifications CI/CD
- `docs` : mises à jour de documentation
- `style` : changements de formatage/style uniquement
- `refactor` : refactorisation sans changement de comportement
- `perf` : amélioration de performance
- `test` : tests ajoutés ou mis à jour

Exemples :

- `feat(renderer): add chromatic aberration effect`
- `fix(opengl): prevent invalid framebuffer bind`
- `docs(devdoc): merge quality contribution guidelines`

Référence : [Conventional Commits](https://www.conventionalcommits.org/)

## 3. Git Hooks avec pre-commit

Les Git hooks natifs sont locaux et non versionnés. Nous utilisons **pre-commit** afin que tout le monde exécute les mêmes vérifications.

### Prérequis

- Python 3.6+
- pip
- Git

### Installer pre-commit

```bash
pip install pre-commit
pre-commit --version
```

### Activer les hooks

À partir de la racine du dépôt :

```bash
pre-commit install
```

### Exécuter toutes les vérifications une fois

```bash
pre-commit run --all-files
```

### Ignorer les hooks temporairement (non recommandé)

```bash
git commit --no-verify -m "Votre message de commit"
```

Référence : [pre-commit](https://pre-commit.com/)

## 4. Workflow de contribution recommandé

1. Créez une branche avec le préfixe approprié.
2. Implémentez votre changement.
3. Exécutez les hooks et les tests localement.
4. Écrivez des messages Conventional Commit clairs.
5. Ouvrez votre pull request en ciblant la branche attendue.

Garder ce workflow cohérent aide les révisions à avancer plus rapidement et garde l'historique du projet lisible.
