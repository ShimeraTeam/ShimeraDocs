# Injection OpenGL 5 Mars 2025

## Vue d'ensemble
Ce document est le résultat d'un POC (Proof of Concept) visant à démontrer comment injecter des shaders OpenGL dans une application utilisant SFML/SDL/Raylib tout en encapsulant tous les appels OpenGL dans une bibliothèque dédiée. L'objectif est de prouver que nous pouvons créer une bibliothèque générique utilisable avec plusieurs bibliothèques graphiques sans exposer les détails d'OpenGL à l'utilisateur final.

## Stack technique
- **Langage**: C++
- **Bibliothèques graphiques**: SFML, SDL, Raylib
- **Version OpenGL**: 3.3 Core Profile
- **Système de build**: CMake

## Approche technique
Nous avons commencé par créer des applications exemples utilisant SFML, SDL et Raylib. Chaque application initialise son contexte graphique respectif, sa fenêtre et dessine des formes basiques en utilisant leurs méthodes de rendu natives.

Ensuite, nous avons développé une bibliothèque OpenGL dédiée qui encapsule tous les appels OpenGL. Cette bibliothèque fournit une API simple pour initialiser OpenGL, compiler des shaders et rendre des objets. La bibliothèque est conçue pour être indépendante de la bibliothèque graphique utilisée par l'application.

Après cela, nous avons tenté de récupérer le contexte de chaque bibliothèque graphique et de le transmettre à notre bibliothèque OpenGL. Puis, nous avons essayé d'appliquer des shaders de post-traitement au contexte créé par chaque bibliothèque graphique et de rendre la sortie finale à l'écran en utilisant OpenGL pour démontrer que notre bibliothèque peut fonctionner de manière générique avec différentes bibliothèques graphiques.

## Résultats
Le POC n'a pas réussi à atteindre le résultat souhaité. Bien que nous ayons pu créer la bibliothèque OpenGL dédiée et compiler les shaders, nous avons rencontré des défis importants lors de l'intégration avec les bibliothèques graphiques.

1. **Gestion du contexte**: Certaines bibliothèques graphiques comme Raylib gèrent leur propre contexte OpenGL, ce qui rend difficile le partage du contexte avec notre bibliothèque OpenGL. Cela a entraîné des problèmes où les appels OpenGL effectués par notre bibliothèque n'affectaient pas le rendu effectué par les bibliothèques graphiques.

2. **Compatibilité des versions**: C'est un exemple spécifique, SDL n'utilise pas nécessairement OpenGL pour le rendu. Il choisit le meilleur backend disponible sur le système (Direct3D, Vulkan, Metal, etc.) et si nous le forçons à utiliser OpenGL, nous ne pouvons utiliser SDL que pour créer une fenêtre, créer un contexte et gérer les événements d'entrée. Cela signifie que tout le rendu doit être effectué en utilisant des appels OpenGL, ce qui va à l'encontre de l'objectif d'utiliser les capacités de rendu de SDL.

## Conclusion
Le POC a mis en évidence les complexités liées à l'intégration d'une bibliothèque OpenGL dédiée avec diverses bibliothèques graphiques. Bien que l'idée de créer une bibliothèque d'injection OpenGL générique soit séduisante, les défis pratiques liés à la gestion du contexte et à la compatibilité des versions rendent difficile une intégration générique.

Les travaux futurs pourraient explorer des approches alternatives, telles que l'encapsulation de la logique de rendu au sein de chaque bibliothèque graphique tout en tirant parti d'OpenGL pour les effets de shader. De plus, une investigation plus approfondie des capacités et limitations spécifiques de chaque bibliothèque graphique pourrait fournir des informations sur des stratégies d'intégration plus efficaces.
