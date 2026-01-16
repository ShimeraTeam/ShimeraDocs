# Installation Guide - Shimera

This guide covers all methods to install and integrate the Shimera library into your project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Building the Library](#building-the-library)
- [Installation Methods](#installation-methods)
  - [System-Wide Installation](#system-wide-installation)
  - [Local Installation](#local-installation)
  - [Git Submodule](#git-submodule)
- [Build Options](#build-options)

## Prerequisites

### Required Software

- **C++ Compiler**: GCC 7+ or Clang 5+
- **C++ Standard**: C++17 or higher
- **Build System**: [xmake](https://xmake.io/) 2.5+
- **OpenGL**: Version 3.3 or higher

### Required Libraries

- **GLEW** (OpenGL Extension Wrangler Library)

#### Installing Prerequisites

```bash
sudo apt update
sudo apt install build-essential libglew-dev git

# Install xmake
curl -fsSL https://xmake.io/shget.text | bash
```

## Building the Library

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/shimera.git
cd shimera
```

### 2. Configure and Build

#### Static Library (Default)

```bash
xmake
```

This will generate:
- `build/linux/x86_64/release/libshimera.a`

#### Shared Library

```bash
xmake f --shared=y
xmake
```

This will generate:
- `build/linux/x86_64/release/libshimera.so`

### 3. Build Examples (Optional)

```bash
# Build all examples
xmake build

# Build specific example
cd examples/sfml
xmake build -P .
```

## Installation Methods

### System-Wide Installation

Install Shimera globally on your system for use in multiple projects.

#### Installation

```bash
cd shimera

# Build the library
xmake

# Install (requires sudo)
sudo xmake install

# Or specify installation prefix
xmake install -o /usr/local
```

#### Files Installed

- Headers: `/usr/local/include/`
  - `Framebuffer.h`
  - `PostProcessingQuad.h`
  - `glUtils.h`
  - `shimera.h`
  - `uniform/Uniform.hpp`
  - `uniform/Vec4.hpp`
- Library: `/usr/local/lib/libshimera.a` (or `.so` if shared)

#### Using in Your Project

**xmake.lua:**
```lua
add_requires("glew")

target("myapp")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("glew")

    -- System-installed shimera
    add_includedirs("/usr/local/include")
    add_linkdirs("/usr/local/lib")
    add_links("shimera")
```

#### Uninstallation

```bash
cd shimera
sudo xmake uninstall
```

---

### Local Installation

Copy library files directly into your project directory.

#### Static Library Setup

**Step 1: Build and Copy Files**

```bash
cd shimera
xmake

# Create library structure in your project
mkdir -p /path/to/your/project/libs/shimera/include
mkdir -p /path/to/your/project/libs/shimera/lib

# Copy headers
cp -r include/* /path/to/your/project/libs/shimera/include/

# Copy library
cp build/linux/x86_64/release/libshimera.a /path/to/your/project/libs/shimera/lib/
```

**Step 2: Configure Your Project**

**xmake.lua:**
```lua
add_requires("glew")

target("myapp")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("glew")

    -- Local shimera (static)
    add_includedirs("libs/shimera/include")
    add_linkdirs("libs/shimera/lib")
    add_links("shimera")
```

**Step 3: Use in Code**

```cpp
#include <shimera.h>

int main() {
    Framebuffer fb(800, 600);
    // ...
}
```

#### Shared Library Setup

**Step 1: Build in Shared Mode**

```bash
cd shimera
xmake f --shared=y
xmake
```

**Step 2: Copy Files**

```bash
# Copy headers (same as static)
cp -r include/* /path/to/your/project/libs/shimera/include/

# Copy shared library
cp build/linux/x86_64/release/libshimera.so /path/to/your/project/libs/shimera/lib/
```

**Step 3: Configure Your Project**

**xmake.lua:**
```lua
add_requires("glew")

target("myapp")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("glew")

    -- Local shimera (shared)
    add_includedirs("libs/shimera/include")
    add_linkdirs("libs/shimera/lib")
    add_links("shimera")

    -- Important: Add runtime path for .so/.dll
    add_rpathdirs("libs/shimera/lib")
```

**Alternative: Set Runtime Path**

If not using xmake's `add_rpathdirs()`:

```bash
# Linux
export LD_LIBRARY_PATH=/path/to/your/project/libs/shimera/lib:$LD_LIBRARY_PATH

# Or copy .so next to your executable
cp libs/shimera/lib/libshimera.so ./build/
```

---

### Git Submodule

Recommended for projects that want to build Shimera alongside their code.

#### Setup

**Step 1: Add as Submodule**

```bash
cd your-project
git submodule add https://github.com/yourusername/shimera.git libs/shimera
git submodule update --init --recursive
```

**Step 2: Configure Your Project**

**xmake.lua:**
```lua
add_requires("glew")

-- Include shimera library
includes("libs/shimera")

target("myapp")
    set_kind("binary")
    add_files("src/*.cpp")

    -- Link with shimera
    add_deps("shimera")
    add_packages("glew")
```

**Step 3: Build Everything**

```bash
xmake
```

This will automatically:
1. Build the Shimera library
2. Link your project with it

#### Updating Shimera

```bash
cd libs/shimera
git pull origin main
cd ../..
xmake -r  # Rebuild with latest changes
```

#### Removing Submodule

```bash
git submodule deinit libs/shimera
git rm libs/shimera
rm -rf .git/modules/libs/shimera
```

---

## Build Options

### Library Type

```bash
# Static library (default)
xmake

# Shared library
xmake f --shared=y
xmake

# Switch back to static
xmake f --shared=n
xmake
```