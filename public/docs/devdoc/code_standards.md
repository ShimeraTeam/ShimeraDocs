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

### Shimera specific Naming Styles : Class Members Uniforms

Class members that are tied to a shader uniform must use the prefix `u`.

Examples: `uTint`, `uStrength`... (should most likely be called `m_uTint`, see [Class Member Prefix](#class-member-prefix-m_))

## 2. File Organization

Shimera follows a modular and feature-based structure.

### Rules

- One responsibility per file
- One main class per `.hpp/.cpp` pair when possible

### File Naming

Style: `PascalCase` for both headers and sources, matching the class name.
- Headers: `Framebuffer.hpp`
- Sources: `Framebuffer.cpp`

### Inline / Template Definitions (`.inl`)

When a header (`.hpp`) contains inline function definitions or template definitions, use the file extension `.inl` instead.

- No inline function definitions or template definitions : `Framebuffer.hpp`
- Contains inline function definitions or template definitions : `Framebuffer.inl`

## 3. Class Structure

### Rules

- Avoid public member variables
- Keep classes focused and small

### Class Member Prefix (`m_`)

To clearly distinguish class data members from local variables and parameters, prefix non-static member variables with `m_`.

- Member variables: `m_<camelCase>` (e.g. `m_width`, `m_shaderProgram`)
- Function parameters/local variables: `camelCase` without prefix (e.g. `width`, `shaderProgram`)

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
        Framebuffer(int width, int height);
        ~Framebuffer();
        void bind() const;
        void unbind() const;
        unsigned int getTexture() const;

    protected:

    private:
        unsigned int m_fbo, m_texture, m_rbo;
        int m_width, m_height;
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

## 7. Automatic Checks with clang-tidy

- Shimera uses `clang-tidy` for static analysis and to enforce coding standards.
- Checks are configured in the `.clang-tidy` file at the project root.

`clang-tidy` runs automatically via git hooks, see [Git Workflow](git_workflow.md) for more details.

## References
 
- [Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html)
- [Microsoft design guidelines](https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/)
- [Clang-Tidy Checks](https://clang.llvm.org/extra/clang-tidy/)
