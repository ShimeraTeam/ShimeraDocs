# **{Shimera} Fonctionnement de Shimera**

## Étapes de développement

1. **Exemples sans shaders OpenGL**  
   On commence par créer les exemples sans utiliser de shaders, pour valider le fonctionnement de base.

2. **Ajout direct des shaders**  
   Les shaders sont ensuite intégrés dans les exemples de manière directe, **sans encapsulation ni classes**.

3. **Encapsulation des appels OpenGL**  
   Les appels OpenGL sont encapsulés dans la librairie, permettant aux exemples d’utiliser uniquement SFML.

4. **Encapsulation des appels SFML nécessaires aux shaders**  
   Les appels SFML servant à invoquer les shaders OpenGL sont également encapsulés.

5. **Utilisation simplifiée côté utilisateur**  
   L’utilisateur n’a plus qu’un **seul appel pour afficher un shader**, quel que soit le backend graphique.

---

## Architecture de la librairie

- La partie **OpenGL** est indépendante et fonctionne avec toutes les librairies graphiques supportées.  
- Des **interfaces et abstractions spécifiques** ajoutent les détails pour chaque librairie cible.  
  - Exemple : SFML fournit des appels spécifiques pour invoquer les shaders.  
- L’objectif est de fournir une interface simple et unifiée pour l’utilisateur, masquant toute la complexité des appels bas niveau.

![alt text](/schema-fonctionnement.png)
