# **20/01/2026 - Couche d'Abstraction : Première Tentative (Basée sur du CRTP)**

## Vue d'Ensemble

Avant d'arriver à la couche d'abstraction actuelle basée sur la factory, nous avons implémenté une approche **CRTP (Curiously Recurring Template Pattern)**. Cette première tentative était **single-pass uniquement** et se concentrait sur la fonctionnalités d'une API simple et de haut niveau pour appliquer un effet de post-traitement.

**Statut :** Conservé dans le code source à des fins historiques/de preuve de travail uniquement (pour l'instant, devrait être supprimé dans le futur).

**Fichiers :**
- `PostProcessingPipelineBase.inl` - Classe de base CRTP
- `PostProcessingPipeline.inl` - Implémentation SFML



## Architecture

### PostProcessingPipelineBase (Base CRTP)

**Objectif :** Fonctionnalité partagée entre toutes les implémentations de backend utilisant le patron CRTP pour le polymorphisme à la compilation.

**Code :**
```cpp
template<typename C>
class PostProcessingPipelineBase {
public:
    C& setUniform(const std::string& name, const UniformValue& value) {
        uniforms[name] = value;
        static_cast<C*>(this)->applyUniform(name, value);
        return *static_cast<C*>(this);  // Enables method chaining
    }
    
    void resize(int w, int h) {
        width = w;
        height = h;
        static_cast<C*>(this)->onResize(w, h);
    }

protected:
    std::map<std::string, UniformValue> uniforms;
    int width = 0;
    int height = 0;
};
```

**Caractéristiques :**
- Mise en cache des uniforms dans une map
- Support du chaînage de méthodes
- Aucune surcharge à l'exécution (polymorphisme à la compilation)

### PostProcessingPipeline (Implémentation SFML)

**Objectif :** Wrapper de post-traitement single-pass spécifique à SFML.

**Composants :**
- `sf::RenderTexture` - Cible de rendu hors écran de SFML
- `SFMLPostProcessor` - Applique l'effet du shader
- Héritage CRTP de `PostProcessingPipelineBase<PostProcessingPipeline>`

**Flux de travail :**
```
L'utilisateur rend vers renderTexture -> pipeline.render() -> postProcessor applique le shader -> écran
```



## Exemple d'Utilisation

```cpp
#define SHIMERA_BACKEND_SFML
#include "backend/PostProcessingPipeline.inl"

int main() {
    sf::RenderWindow window(sf::VideoMode({800, 600}), "SFML Example");
    
    // Créer le pipeline avec un seul effet
    PostProcessingPipeline pipeline(800, 600, "post.vert", "distortion.frag");
    
    // Définir les uniforms avec l'API chaînable
    pipeline.setUniform("time", 0.0f)
            .setUniform("strength", 0.5f);
    
    sf::CircleShape shape(50.f);
    float time = 0.0f;
    
    while (window.isOpen()) {
        // Rendre vers la texture de rendu du pipeline
        auto& target = pipeline.getRenderTexture();
        target.clear(sf::Color::Black);
        target.draw(shape);
        target.display();
        
        // Appliquer le post-traitement
        window.clear();
        pipeline.setUniform("time", time += 0.016f);
        pipeline.render();
        
        window.display();
    }
}
```



## Principes de Conception

### APIs Spécifiques au Backend
Chaque backend exposait des méthodes natives correspondant à son paradigme :
- **SFML :** `getRenderTexture()` + `render()`
- **OpenGL :** `begin()` + `end()`

Les utilisateurs utilisent déjà des APIs spécifiques au backend, donc exposer des méthodes appropriées au backend semblait naturel.

### CRTP pour le Code Partagé
Évite la duplication de code pour la gestion des uniforms entre les backends tout en maintenant une surcharge nulle à l'exécution.

### Sélection du Backend à la Compilation
Utilise `#ifdef SHIMERA_BACKEND_*` pour la sélection à la compilation, résultant en des binaires plus petits et aucun branchement à l'exécution.


## Limitations & Pourquoi ça a été remplacé

- Supporte seulement un effet à la fois
- Ne peut pas enchaîner les effets (bloom + flou + color grading)
- Ne peut pas réutiliser les composants entre les pipelines
- Approche tout-ou-rien
- Complexité "Cachée"
- Le patron CRTP n'est pas trivial à comprendre et étendre
- Pas d'interface imposée par le compilateur (suivi manuel des overrides)


## Comparaison : CRTP vs Factory

| Aspect | CRTP (Ancien) | Factory (Actuel) |
|--------|-----------|------------------|
| **Passes** | Single | Multi-pass |
| **Flexibilité** | Faible (composants fixes) | Élevée (créer n'importe quel composant) |
| **Courbe d'Apprentissage** | Raide (connaissance CRTP) | Modérée (interfaces) |
| **Surcharge** | Nulle | Minimale (appels virtuels) |
| **Extensibilité** | Difficile (magie des templates) | Facile (implémenter l'interface) |


## Leçons Clés Apprises

Bien que l'approche **CRTP** ait été une expérience intéressante, nous avons trop essayé de rendre l'implémentation aussi performante que possible au détriment de la flexibilité et de l'utilisabilité. La conception basée sur la factory, bien que légèrement plus verbeuse, fournit une base beaucoup plus puissante et extensible pour les fonctionnalités futures.

Ce que nous avons appris :
1. **Multi-Pass était obligatoire** : Le multi-pass est un objectif majeur pour ce projet, et ce n'était pas possible avec la conception CRTP
2. **La flexibilité est meilleure** : La surcharge négligeable des appels virtuels vaut la flexibilité
3. **Abstractions claires** : Les interfaces sont plus faciles à comprendre que la métaprogrammation de templates
4. **Composition** : Les petits composants ciblés sont plus flexibles qu'une grande classe


## Comparaison

**Ancien (CRTP) :**
```cpp
PostProcessingPipeline pipeline(800, 600, "vert.glsl", "frag.glsl");
pipeline.setUniform("time", t);
pipeline.render();
```

**Nouveau (Factory) :**
```cpp
IBackend* backend = BackendFactory::create();
IFrameBuffer* fbo = backend->createFrameBuffer(800, 600);
IPostProcessor* effect = backend->createPostProcessor("vert.glsl", "frag.glsl");

effect->setUniform("time", t);
effect->render(fbo->getTexture());
```

Comme vous pouvez le voir, bien que la nouvelle méthode nécessite plus d'étapes et que l'ancienne soit plus directe pour le single-pass, elle est infiniment plus flexible pour le multi-pass. **Bien que cela sera simplifié dans le futur et nécessitera moins d'étapes**.


## Préservation du Code

Pour l'instant, l'implémentation CRTP est préservée avec des marqueurs `DEPRECATED` pour :
- Enregistrement historique de l'évolution de la conception
- Objectifs éducatifs (exemple de patron CRTP)
- Documentation de preuve de travail
- Référence de comparaison montrant pourquoi l'approche factory a été choisie

## Références

### Patron CRTP
- [CRTP - Wikipedia (Explication générale en programmation)](https://en.wikipedia.org/wiki/Curiously_recurring_template_pattern)
- [Explication CRTP - FluentCpp](https://www.fluentcpp.com/2017/05/12/curiously-recurring-template-pattern/)
- [More C++ Idioms - CRTP](https://en.wikibooks.org/wiki/More_C%2B%2B_Idioms/Curiously_Recurring_Template_Pattern)

### Templates C++ & Polymorphisme
- [Métaprogrammation de Templates - cppreference](https://en.cppreference.com/w/cpp/language/templates)
- [Polymorphisme - Wikipedia](https://en.wikipedia.org/wiki/Polymorphism_(computer_science))
- [Fonctions Virtuelles vs CRTP - Stack Overflow](https://stackoverflow.com/questions/6006614/c-static-polymorphism-crtp-and-using-typedefs-from-derived-classes)
