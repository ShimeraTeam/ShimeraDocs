# Commits

## Introduction

Ce document fournit des directives et des meilleures pratiques établies pour la gestion des commits dans notre projet. Le respect de ces directives aidera à maintenir un historique de commit propre et organisé, facilitant ainsi la compréhension des modifications apportées à la base de code pour tout le monde.

## Avant les Conventional Commits

Avant d'adopter les **Conventional Commits**, nous utilisions notre propre format de message de commit. Le format était le suivant :

```<type en majuscules>: <sujet>```

Où :
- `<type en majuscules>` : Le type du commit, tel que `ADD`, `FIX`, `UPDATE`, etc.
- `<sujet>` : Une brève description des modifications apportées dans le commit.

## Pourquoi nous avons adopté les Conventional Commits

Nous avons adopté la spécification **Conventional Commits** pour standardiser nos messages de commit et améliorer la lisibilité de notre historique de commits. Le format Conventional Commits offre un moyen clair et cohérent de décrire les changements effectués dans chaque commit, ce qui permet aux développeurs de comprendre plus facilement le but de chaque modification. De plus, comme **Shimera** est un projet open-source, suivre un format de message de commit largement reconnu comme Conventional Commits aide les contributeurs externes à comprendre l'historique de nos commits et encourage davantage de contributions au projet.

## Un standard reconnu

L’adoption des **Conventional Commits** est largement reconnue au sein de la communauté technologique :

- Initialement inspirée par les règles de messages de commit d’Angular, cette approche est devenue une méthode de référence pour structurer les workflows de développement professionnels.  
https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md

- Elle est utilisée et promue dans de nombreux projets open-source et industriels afin d’améliorer la lisibilité des commits, d’automatiser le versioning et de simplifier la génération de changelogs.  
  Des organisations comme la **NASA** l’utilisent dans des projets tels que F´ (F Prime).  
https://github.com/nasa/fprime/discussions/2758

## Format des Conventional Commits

Le format Conventional Commits se compose de la structure suivante :

```
<type>(portée optionnelle): <description>
```

Où :
- `<type>` : Le type du commit, tel que `feat`, `fix`, `docs`, `style`, `refactor`, etc.
- `(portée optionnelle)` : Une portée optionnelle qui fournit un contexte supplémentaire sur le commit, comme la zone de la base de code affectée par le changement.
- `<description>` : Une brève description des modifications apportées dans le commit.

## Conclusion

En suivant la spécification **Conventional Commits**, nous pouvons maintenir un historique de commit propre et organisé, facile à comprendre tant pour les contributeurs internes qu'externes. Cela aidera à améliorer la collaboration et permettra à chacun de suivre plus facilement les changements dans la base de code.

Pour plus d’informations, consultez le site officiel de Conventional Commits : [https://www.conventionalcommits.org/](https://www.conventionalcommits.org/).

Date de mise en place: Janvier 2026