# **20/01/2026 - Abstraction Layer: First Attempt (CRTP-Based)**

## Overview

Before arriving at the current factory-based abstraction layer, we implemented a **CRTP (Curiously Recurring Template Pattern)** approach. This first attempt was **single-pass only** and focused on providing a simple, high-level API for applying one post-processing effect.

**Status:** **DEPRECATED** - Kept in codebase for historical/proof-of-work purposes only (for now, should be removed in future).

**Files:**
- `PostProcessingPipelineBase.inl` - CRTP base class
- `PostProcessingPipeline.inl` - SFML implementation



## Architecture

### PostProcessingPipelineBase (CRTP Base)

**Purpose:** Shared functionality across all backend implementations using CRTP pattern for compile-time polymorphism.

**Code:**
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

**Features:**
- Uniform caching in map
- Method chaining support
- Zero runtime overhead (compile-time polymorphism)

### PostProcessingPipeline (SFML Implementation)

**Purpose:** SFML-specific single-pass post-processing wrapper.

**Components:**
- `sf::RenderTexture` - SFML's off-screen render target
- `SFMLPostProccessor` - Applies the shader effect
- CRTP inheritance from `PostProcessingPipelineBase<PostProcessingPipeline>`

**Workflow:**
```
User renders to renderTexture -> pipeline.render() -> postProcessor applies shader -> screen
```



## Usage Example

```cpp
#define SHIMERA_BACKEND_SFML
#include "backend/PostProcessingPipeline.inl"

int main() {
    sf::RenderWindow window(sf::VideoMode({800, 600}), "SFML Example");
    
    // Create pipeline with single effect
    PostProcessingPipeline pipeline(800, 600, "post.vert", "distortion.frag");
    
    // Set uniforms with chainable API
    pipeline.setUniform("time", 0.0f)
            .setUniform("strength", 0.5f);
    
    sf::CircleShape shape(50.f);
    float time = 0.0f;
    
    while (window.isOpen()) {
        // Render to pipeline's render texture
        auto& target = pipeline.getRenderTexture();
        target.clear(sf::Color::Black);
        target.draw(shape);
        target.display();
        
        // Apply post-processing
        window.clear();
        pipeline.setUniform("time", time += 0.016f);
        pipeline.render();
        
        window.display();
    }
}
```



## Design Principles

### Backend-Specific APIs
Each backend exposed native methods matching its paradigm:
- **SFML:** `getRenderTexture()` + `render()`
- **OpenGL:** `begin()` + `end()`

Users already use backend-specific APIs, so exposing backend-appropriate methods felt natural.

### CRTP for Shared Code
Avoided code duplication for uniform management across backends while maintaining zero runtime overhead.

### Compile-Time Backend Selection
Used `#ifdef SHIMERA_BACKEND_*` for compile-time selection, resulting in smaller binaries and no runtime branching.


## Limitations & Why It Was Replaced

- Only supports one effect at a time
- Can't chain effects (bloom + blur + color grading)
- Can't reuse components across pipelines
- All-or-nothing approach
- Hidden Complexity
- CRTP pattern is non-trivial to understand and extend
- No compiler-enforced interface (manual override tracking)


## Comparison: CRTP vs Factory

| Aspect | CRTP (Old) | Factory (Current) |
|--------|-----------|------------------|
| **Passes** | Single | Multi-pass |
| **Flexibility** | Low (fixed components) | High (create any components) |
| **Learning Curve** | Steep (CRTP knowledge) | Moderate (interfaces) |
| **Overhead** | Zero | Minimal (virtual calls) |
| **Extensibility** | Hard (template magic) | Easy (implement interface) |


## Key Lessons Learned

While the **CRTP** approach was an interesting experiment, we tried too hard to make the implementation as performant as possible at the cost of flexibility and usability. The factory-based design, while slightly more verbose, provides a much more powerful and extensible foundation for future features.

What we learned:
1. **Multi-Pass was Mendatory**: Multi-pass is a big focus for this project, and this wasn't possible with the CRTP design
2. **Flexibility is better**: Negligible virtual call overhead worth the flexibility
3. **Clear Abstractions**: Interfaces easier to understand than template metaprogramming
4. **Composition**: Small, focused components more flexible than one big class


## Comparison

**Old (CRTP):**
```cpp
PostProcessingPipeline pipeline(800, 600, "vert.glsl", "frag.glsl");
pipeline.setUniform("time", t);
pipeline.render();
```

**New (Factory):**
```cpp
IBackend* backend = BackendFactory::create();
IFrameBuffer* fbo = backend->createFrameBuffer(800, 600);
IPostProcessor* effect = backend->createPostProcessor("vert.glsl", "frag.glsl");

effect->setUniform("time", t);
effect->render(fbo->getTexture());
```

As you can see, while the new method require more steps and the old one is more straightforward for single-pass, it is infinitely more flexible for multi-pass. **Although this will be simplified in the future and will require less steps**.


## Code Preservation

For now, the CRTP implementation is preserved with `DEPRECATED` markers for:
- Historical record of design evolution
- Educational purposes (CRTP pattern example)
- Proof of work documentation
- Comparison reference showing why factory approach was chosen

## References

### CRTP Pattern
- [CRTP - Wikipedia (General explaination in programming)](https://en.wikipedia.org/wiki/Curiously_recurring_template_pattern)
- [CRTP Explanation - FluentCpp](https://www.fluentcpp.com/2017/05/12/curiously-recurring-template-pattern/)
- [More C++ Idioms - CRTP](https://en.wikibooks.org/wiki/More_C%2B%2B_Idioms/Curiously_Recurring_Template_Pattern)

### C++ Templates & Polymorphism
- [Template Metaprogramming - cppreference](https://en.cppreference.com/w/cpp/language/templates)
- [Polymorphism - Wikipedia](https://en.wikipedia.org/wiki/Polymorphism_(computer_science))
- [Virtual Functions vs CRTP - Stack Overflow](https://stackoverflow.com/questions/6006614/c-static-polymorphism-crtp-and-using-typedefs-from-derived-classes)
