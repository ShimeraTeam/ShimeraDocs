# Shimera - Conventions de Code

Ce document définit les conventions de codage utilisées dans le projet Shimera.  
Son objectif est d'assurer cohérence, lisibilité et maintenabilité sur l'ensemble du code.

## 1. Conventions de Nommage

### Règles Générales

- Utiliser des noms descriptifs (éviter les abréviations sauf si elles sont largement connues)
- L'anglais pour tout (variables, fonctions, commentaires)

### Styles de Nommage

| Élément | Style | Exemple |
|--------|-------|---------|
| Classes / Structs | `PascalCase` | `Framebuffer` |
| Fonctions / Méthodes | `camelCase` | `bind()` |
| Variables | `camelCase` | `width` |
| Constantes | `UPPER_SNAKE_CASE` | `FRAMES` |
| Namespaces | `lowercase` | `shimera` |

### Définition des styles

- `PascalCase` : chaque mot commence par une majuscule, sans espace
- `camelCase` : première lettre en minuscule, puis chaque nouveau mot commence par une majuscule
- `snake_case` : mots séparés par des underscores `_`, tout en minuscules
- `UPPER_SNAKE_CASE` : identique à `snake_case` mais en majuscules, utilisé pour les constantes
- `lowercase` : tout en minuscules, sans séparation

## 2. Organisation des Fichiers

Shimera suit une structure modulaire et orientée fonctionnalité.

### Règles

- Une responsabilité par fichier
- Une classe principale par paire `.hpp/.cpp` dans la mesure du possible

### Nommage des Fichiers

Style : `PascalCase` pour les headers et les sources, correspondant au nom de la classe.

- Headers : `Framebuffer.hpp`
- Sources : `Framebuffer.cpp`

## 3. Structure des Classes

### Règles

- Éviter les variables membres publiques
- Garder les classes ciblées et concises

### Ordre Recommandé des Membres

1. Types publics
2. Constructeurs / Destructeur
3. Méthodes publiques
4. Méthodes protégées
5. Méthodes privées
6. Variables membres

### Exemple

```cpp
class SHIMERA_API Framebuffer
{
    public:
        Framebuffer(int w, int h);
        ~Framebuffer();
        void bind() const;
        void unbind() const;
        unsigned int getTexture() const;

    protected:

    private:
        unsigned int fbo, texture, rbo;
        int width, height;
};
```

## 4. Conventions C++ Modernes

- Utiliser `const` dès que possible
- Préférer les références (`&`) aux copies inutiles
- Utiliser `nullptr` au lieu de `NULL`
- Favoriser `std::vector`, `std::string` plutôt que les pointeurs bruts

## 5. Documentation

### Règles

- Documenter toutes les fonctions publiques destinées à être utilisées par l'utilisateur
- Éviter les commentaires évidents (`i = i + 1; // increment i`)
- Maintenir les commentaires à jour avec les modifications du code

### Exemple

```cpp
/**
 * Creates a shader program from vertex and fragment shaders.
 *
 * @param vertexShader Path to vertex shader file
 * @param fragmentShader Path to fragment shader file
 * @return ID of the created shader program
 */
unsigned int Shader::CreateShader(const std::string& vertexShader, const std::string& fragmentShader);
```

## 6. Bonnes Pratiques Générales

- Privilégier la cohérence au-dessus des préférences personnelles
- Favoriser la lisibilité et la simplicité
- Écrire le code comme si un autre développeur (ou toi dans le futur) devait le maintenir

Les conventions de code existent pour soutenir la clarté et la scalabilité.

## Références
- [Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html)
- [Microsoft design guidelines](https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines)