# Why does Shimera offer both types of libraries?

Shimera is available in two formats:
- **Static library** (`libshimera.a`) - Default
- **Shared library** (`libshimera.so`) - With `xmake f --shared=y`

## Difference between the two

### Static Library (`.a`)
Shimera's code is copied directly into your executable during compilation.

**Advantages:**
- ✅ Single file to distribute
- ✅ No external dependencies
- ✅ Works immediately everywhere

**Disadvantages:**
- ❌ Larger executable
- ❌ Need to recompile for updates

### Shared Library (`.so`)
Shimera's code remains in a separate file, loaded when your program starts.

**Advantages:**
- ✅ Smaller executable
- ✅ Multiple programs can share the same library
- ✅ Update without recompilation

**Disadvantages:**
- ❌ Two files to distribute (executable + `.so`)
- ❌ Additional configuration (RPATH, LD_LIBRARY_PATH)

## Why have both?

Many recognized graphics libraries like **SFML**, **SDL**, or **GLFW** give users this choice. We decided to follow this standard practice to offer the same flexibility.

**Static by default** because Shimera primarily targets:
- Indie games (need for simple distribution)
- Graphics demonstrations (portability)
- Educational projects (ease of use)

**Shared available** for advanced cases:
- Suite of graphical tools sharing the library
- System installations (multiple applications use Shimera)
- Active development environments

## Which version to choose?

**Use static (default) if:**
- You're distributing a standalone application
- You want simplicity (single file)
- You're making a prototype or educational project

**Use shared if:**
- You have multiple applications using Shimera
- You're doing a system installation
- You want to save disk space

---
