# Shimera - Coding Standards

This document defines the coding conventions used across the Shimera project.  
Its goal is to ensure consistency, readability, and maintainability across the entire codebase.

## 1. Naming Conventions

### General Rules

- Use descriptive names (avoid abbreviations unless widely understood)
- English for everything (variables, functions, comments)

### Naming Styles

| Element | Style | Example |
|--------|-------|---------|
| Classes / Structs | `PascalCase` | `Framebuffer` |
| Functions / Methods | `camelCase` | `bind()` |
| Variables | `camelCase` | `width`|
| Constants | `UPPER_SNAKE_CASE` | `FRAMES` |
| Namespaces | `lowercase` | `shimera` |

### Style Definitions
 
- `PascalCase`: each word starts with an uppercase letter, no spaces
- `camelCase`: first letter lowercase, then each new word starts with an uppercase letter
- `snake_case`: words separated by underscores `_`, all lowercase
- `UPPER_SNAKE_CASE`: same as `snake_case` but in uppercase, used for constants
- `lowercase`: all lowercase, no separation

## 2. File Organization

Shimera follows a modular and feature-based structure.

### Rules

- One responsibility per file
- One main class per `.hpp/.cpp` pair when possible

### File Naming

Style: `PascalCase` for both headers and sources, matching the class name.
- Headers: `Framebuffer.hpp`
- Sources: `Framebuffer.cpp`

## 3. Class Structure

### Rules

- Avoid public member variables
- Keep classes focused and small

### Recommended Member Order

1. Public types
2. Constructors / Destructor
3. Public methods
4. Protected methods
5. Private methods
6. Member variables

### Example

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

## 4. Modern C++ Conventions
 
- Use `const` whenever possible
- Prefer references (`&`) over unnecessary copies
- Use `nullptr` instead of `NULL`
- Favor `std::vector`, `std::string` over raw pointers


## 5. Documentation

### Rules

- Document all public functions that are going to be used by the user
- Avoid obvious comments (`i = i + 1; // increment i`)
- Keep comments up to date with code changes

### Example

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

## 6. General Guidelines

- Keep consistency above personal preference
- Favor readability over cleverness
- Write code as if another developer (or future you) will maintain it

Coding standards exist to support clarity and scalability.

## References
 
- [Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html)
- [Microsoft design guidelines](https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/)
