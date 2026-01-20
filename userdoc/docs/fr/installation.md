# Guide d'Installation - Shimera

Ce guide couvre toutes les méthodes pour installer et intégrer la bibliothèque Shimera dans votre projet.

## Table des matières

- [Prérequis](#prérequis)
- [Compilation de la bibliothèque](#compilation-de-la-bibliothèque)
- [Méthodes d'installation](#méthodes-dinstallation)
  - [Installation système](#installation-système)
  - [Installation locale](#installation-locale)
  - [Sous-module Git](#sous-module-git)
- [Options de compilation](#options-de-compilation)

## Prérequis

### Logiciels requis

- **Compilateur C++** : GCC 7+ ou Clang 5+
- **Standard C++** : C++17 ou supérieur
- **Système de build** : [xmake](https://xmake.io/) 2.5+
- **OpenGL** : Version 3.3 ou supérieure

### Bibliothèques requises

- **GLEW** (OpenGL Extension Wrangler Library)

#### Installation des prérequis

```bash
sudo apt update
sudo apt install build-essential libglew-dev git

# Installer xmake
curl -fsSL https://xmake.io/shget.text | bash
```

## Compilation de la bibliothèque

### 1. Cloner le dépôt

```bash
git clone https://github.com/yourusername/shimera.git
cd shimera
```

### 2. Configurer et compiler

#### Bibliothèque statique (par défaut)

```bash
xmake
```

Cela générera :
- `build/linux/x86_64/release/libshimera.a`

#### Bibliothèque partagée

```bash
xmake f --shared=y
xmake
```

Cela générera :
- `build/linux/x86_64/release/libshimera.so`

### 3. Compiler les exemples (optionnel)

```bash
# Compiler tous les exemples
xmake build

# Compiler un exemple spécifique
cd examples/sfml
xmake build -P .
```

## Méthodes d'installation

### Installation système

Installez Shimera globalement sur votre système pour l'utiliser dans plusieurs projets.

#### Installation

```bash
cd shimera

# Compiler la bibliothèque
xmake

# Installer (nécessite sudo)
sudo xmake install

# Ou spécifier le préfixe d'installation
xmake install -o /usr/local
```

#### Fichiers installés

- En-têtes : `/usr/local/include/`
  - `Framebuffer.h`
  - `PostProcessingQuad.h`
  - `glUtils.h`
  - `shimera.h`
  - `uniform/Uniform.hpp`
  - `uniform/Vec4.hpp`
- Bibliothèque : `/usr/local/lib/libshimera.a` (ou `.so` si partagée)

#### Utilisation dans votre projet

**xmake.lua :**
```lua
add_requires("glew")

target("myapp")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("glew")

    -- Shimera installé système
    add_includedirs("/usr/local/include")
    add_linkdirs("/usr/local/lib")
    add_links("shimera")
```

#### Désinstallation

```bash
cd shimera
sudo xmake uninstall
```

---

### Installation locale

Copiez les fichiers de la bibliothèque directement dans le répertoire de votre projet.

#### Configuration avec bibliothèque statique

**Étape 1 : Compiler et copier les fichiers**

```bash
cd shimera
xmake

# Créer la structure de bibliothèque dans votre projet
mkdir -p /chemin/vers/votre/projet/libs/shimera/include
mkdir -p /chemin/vers/votre/projet/libs/shimera/lib

# Copier les en-têtes
cp -r include/* /chemin/vers/votre/projet/libs/shimera/include/

# Copier la bibliothèque
cp build/linux/x86_64/release/libshimera.a /chemin/vers/votre/projet/libs/shimera/lib/
```

**Étape 2 : Configurer votre projet**

**xmake.lua :**
```lua
add_requires("glew")

target("myapp")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("glew")

    -- Shimera local (statique)
    add_includedirs("libs/shimera/include")
    add_linkdirs("libs/shimera/lib")
    add_links("shimera")
```

**Étape 3 : Utiliser dans le code**

```cpp
#include <shimera.h>

int main() {
    Framebuffer fb(800, 600);
    // ...
}
```

#### Configuration avec bibliothèque partagée

**Étape 1 : Compiler en mode partagé**

```bash
cd shimera
xmake f --shared=y
xmake
```

**Étape 2 : Copier les fichiers**

```bash
# Copier les en-têtes (identique à la version statique)
cp -r include/* /chemin/vers/votre/projet/libs/shimera/include/

# Copier la bibliothèque partagée
cp build/linux/x86_64/release/libshimera.so /chemin/vers/votre/projet/libs/shimera/lib/
```

**Étape 3 : Configurer votre projet**

**xmake.lua :**
```lua
add_requires("glew")

target("myapp")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("glew")

    -- Shimera local (partagé)
    add_includedirs("libs/shimera/include")
    add_linkdirs("libs/shimera/lib")
    add_links("shimera")

    -- Important : Ajouter le chemin d'exécution pour .so/.dll
    add_rpathdirs("libs/shimera/lib")
```

**Alternative : Définir le chemin d'exécution**

Si vous n'utilisez pas `add_rpathdirs()` de xmake :

```bash
# Linux
export LD_LIBRARY_PATH=/chemin/vers/votre/projet/libs/shimera/lib:$LD_LIBRARY_PATH

# Ou copier le .so à côté de votre exécutable
cp libs/shimera/lib/libshimera.so ./build/
```

---

### Sous-module Git

Recommandé pour les projets qui veulent compiler Shimera en même temps que leur code.

#### Configuration

**Étape 1 : Ajouter comme sous-module**

```bash
cd votre-projet
git submodule add https://github.com/yourusername/shimera.git libs/shimera
git submodule update --init --recursive
```

**Étape 2 : Configurer votre projet**

**xmake.lua :**
```lua
add_requires("glew")

-- Inclure la bibliothèque shimera
includes("libs/shimera")

target("myapp")
    set_kind("binary")
    add_files("src/*.cpp")

    -- Lier avec shimera
    add_deps("shimera")
    add_packages("glew")
```

**Étape 3 : Tout compiler**

```bash
xmake
```

Cela va automatiquement :
1. Compiler la bibliothèque Shimera
2. Lier votre projet avec elle

#### Mettre à jour Shimera

```bash
cd libs/shimera
git pull origin main
cd ../..
xmake -r  # Recompiler avec les derniers changements
```

#### Supprimer le sous-module

```bash
git submodule deinit libs/shimera
git rm libs/shimera
rm -rf .git/modules/libs/shimera
```

---

## Options de compilation

### Type de bibliothèque

```bash
# Bibliothèque statique (par défaut)
xmake

# Bibliothèque partagée
xmake f --shared=y
xmake

# Revenir à la version statique
xmake f --shared=n
xmake
```
