# Branches

## Introduction

Les branches sont utilisées pour gérer différentes versions de la base de code. Elles permettent aux développeurs de travailler sur de nouvelles fonctionnalités, des corrections de bugs ou des expériences sans affecter la base de code principale.

Ce document fournit des directives et des meilleures pratiques pour la gestion des branches dans notre projet. Suivre ces directives aidera à maintenir une structure de branche propre et organisée, facilitant ainsi la compréhension de l'objectif de chaque branche et la collaboration efficace.

## Avant la stratégie de branche conventionnelle

Avant d'adopter une stratégie de branche conventionnelle, nous avions une approche moins structurée de la gestion des branches. Cela conduisait souvent à de la confusion et à des difficultés pour suivre l'objectif de chaque branche. Nous avions beaucoup de branches avec des préfixes task/ qui n'étaient pas standardisés, ce qui rendait difficile la compréhension du contexte de chaque branche d'un coup d'œil.

## Stratégie de branche conventionnelle

Pour améliorer notre gestion des branches, nous avons adopté une stratégie de branche conventionnelle. Cette stratégie consiste à utiliser des préfixes spécifiques pour différents types de branches, tels que :
- `main/`: pour la branche principale où réside la base de code stable
- `dev/`: pour le travail de développement et l'intégration de nouvelles fonctionnalités
- `feat/`: pour les nouvelles fonctionnalités ou améliorations
- `fix/`: pour les corrections de bugs
- `hotfix/`: pour les corrections urgentes qui doivent être appliquées à la branche principale
- `chore/`: pour les tâches non liées au code comme les mises à jour de dépendances, les mises à jour de documentation

## Un standard reconnu

L'utilisation de préfixes structurés pour les branches est une pierre angulaire du développement collaboratif moderne. Cette approche est largement reconnue et promue par les leaders de l'industrie et les méthodologies suivantes :

- **Atlassian (Gitflow Workflow)**: Atlassian, éditeur de Jira et Bitbucket, a popularisé le modèle “Gitflow”. Ce modèle repose entièrement sur l'utilisation de préfixes pour séparer les cycles de vie des fonctionnalités, des corrections et des versions. https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow

- Micosoft (Azure DevOps): Azure DevOps de Microsoft encourage également l'utilisation de conventions de nommage de branches pour améliorer la collaboration et la gestion du code. https://learn.microsoft.com/en-us/azure/devops/repos/git/git-branching-guidance?view=azure-devops

## Conclusion

En utilisant ces préfixes, nous pouvons facilement identifier l'objectif de chaque branche et maintenir un référentiel plus organisé. Cela aide également lors des revues de code et de la collaboration, car les membres de l'équipe peuvent rapidement comprendre le contexte de chaque branche.

Pour plus d'informations, veuillez consulter le site officiel de Conventional Branch : https://conventional-branch.github.io

Date de mise en œuvre : janvier 2026