# Pourquoi Shimera propose les deux types de librairies ?

Shimera est disponible en deux formats :
- **Librairie statique** (`libshimera.a`) - Par défaut
- **Librairie partagée** (`libshimera.so`) - Avec `xmake f --shared=y`

## Différence entre les deux

### Librairie Statique (`.a`)
Le code de Shimera est copié directement dans votre exécutable lors de la compilation.

**Avantages :**
- ✅ Un seul fichier à distribuer
- ✅ Pas de dépendances externes
- ✅ Fonctionne immédiatement partout

**Inconvénients :**
- ❌ Exécutable plus gros
- ❌ Besoin de recompiler pour les mises à jour

### Librairie Partagée (`.so`)
Le code de Shimera reste dans un fichier séparé, chargé au lancement de votre programme.

**Avantages :**
- ✅ Exécutable plus petit
- ✅ Plusieurs programmes peuvent partager la même librairie
- ✅ Mise à jour sans recompilation

**Inconvénients :**
- ❌ Deux fichiers à distribuer (exécutable + `.so`)
- ❌ Configuration supplémentaire (RPATH, LD_LIBRARY_PATH)

## Pourquoi avoir les deux ?

De nombreuses librairies graphiques reconnues comme **SFML**, **SDL**, ou **GLFW** laissent ce choix à l'utilisateur. Nous avons décidé de suivre cette pratique standard pour offrir la même flexibilité.

**Statique par défaut** car Shimera cible principalement :
- Les jeux indépendants (besoin de simplicité de distribution)
- Les démonstrations graphiques (portabilité)
- Les projets éducatifs (facilité d'utilisation)

**Partagée disponible** pour les cas avancés :
- Suite d'outils graphiques partageant la librairie
- Installations système (plusieurs applications utilisent Shimera)
- Environnements de développement actif

## Quelle version choisir ?

**Utilisez la statique (défaut) si :**
- Vous distribuez une application standalone
- Vous voulez la simplicité (un seul fichier)
- Vous faites un prototype ou un projet éducatif

**Utilisez la partagée si :**
- Vous avez plusieurs applications utilisant Shimera
- Vous faites une installation système
- Vous voulez économiser de l'espace disque

---