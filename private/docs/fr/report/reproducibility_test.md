# Test de reproductibilité

## Objectif

Vérifier qu'une personne extérieure au projet est capable d'installer la librairie Shimera et de la mettre en place dans son propre projet **uniquement à partir de notre documentation**, sur une machine vierge, sans aide de l'équipe.

## Protocole

| Élément | Détails |
| --- | --- |
| **Testeuse** | Une étudiante en 3ème année à Epitech, extérieure au projet Shimera |
| **Machine** | Machine vierge (Shimera jamais installé auparavant) |
| **Ressources autorisées** | Documentation de Shimera uniquement |
| **Tâche** | Installer la librairie, la lier à un nouveau projet et afficher une scène avec les shaders Shimera appliqués |

L'équipe n'est pas intervenue pendant le test. Les points de blocage ont été relevés, puis discutés avec la testeuse à la fin de la session.

## Résultats

### Temps nécessaire

**Environ 20 minutes** pour passer d'une machine vierge à un projet fonctionnel avec Shimera installé et les shaders appliqués à la scène.

### Points de blocage

| # | Point de blocage | Description |
| --- | --- | --- |
| 1 | **Lier la librairie au projet** | Une fois la librairie installée sur son ordinateur, la testeuse ne savait pas comment la lier à son propre projet. La documentation n'expliquait pas clairement comment référencer la librairie installée depuis la configuration de build de l'utilisateur. |
| 2 | **Organisation de la scène** | La testeuse ne savait pas où placer le rendu de sa scène pour que les shaders y soient appliqués. La documentation n'indiquait pas clairement quelle partie du code devait être « capturée » par Shimera. |

En dehors de ces deux points, la testeuse n'a rencontré aucune autre difficulté : l'installation en elle-même (dépendances, compilation) s'est déroulée sans problème.

## Corrections apportées

### 1. Lier la librairie

- **Documentation plus claire et plus complète** : la section d'installation a été réécrite pour expliquer, étape par étape, comment lier la librairie installée à un projet existant (configuration de build, chemins d'include, édition de liens), avec un exemple complet.
- **Amélioration future – package xmake** : nous avons discuté de la publication de Shimera sur le **dépôt de packages xmake** (xmake-repo). Une fois en place, l'installation et la liaison se résumeront à une simple déclaration dans le `xmake.lua` de l'utilisateur, gérée par le package manager :

```lua
add_requires("shimera")

target("my_project")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("shimera")
```

Cette amélioration est prévue pour plus tard et supprimera la majorité des étapes d'installation manuelles.

### 2. Organisation de la scène

Pour rendre évident l'endroit où la scène doit être dessinée, nous avons décidé d'introduire des **bornes explicites** dans l'API : `scene->begin()` et `scene->end()`. Tout ce qui est dessiné entre ces deux appels est capturé par Shimera et reçoit les shaders.

```cpp
scene->begin();
    // Dessinez votre scène ici : tout ce qui se trouve entre begin() et end()
    // est capturé et traité par les shaders de Shimera.
scene->end();
```

Cette structure rend l'utilisation attendue explicite, avant même de lire la documentation, et supprime l'ambiguïté rencontrée par la testeuse.

## Bilan

| Élément | Résultat |
| --- | --- |
| Temps d'installation et de mise en place | ~20 minutes |
| Points de blocage | 2 (liaison de la librairie, organisation de la scène) |
| Modifications de la documentation | Guide d'installation et de liaison plus clair et plus complet |
| Modifications de l'API | Bornes `scene->begin()` / `scene->end()` pour délimiter la scène |
| Amélioration prévue | Publication de Shimera sur le dépôt de packages xmake |
