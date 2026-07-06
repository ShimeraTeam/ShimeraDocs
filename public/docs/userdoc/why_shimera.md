# Why Shimera?

Shimera is a C++ library designed to simplify the integration of visual effects (shaders) into OpenGL, SFML, and Raylib projects.

This document explains what sets Shimera apart from existing alternatives, across four axes: architecture, performance, ease of integration, and developer productivity.

## Architectural innovation

Most shader libraries are tied to a single rendering backend: you pick Raylib, SFML, or native OpenGL, and you're locked in. Shimera starts from a different observation: these backends ultimately expose the same underlying OpenGL pipeline, just with different conventions.

Shimera therefore introduces an abstraction layer that unifies these conventions. Concretely, this means:

- The ability to use Shimera with the backend of your choice (native OpenGL, Raylib, or SFML), without changing how you work.
- Simplified management of one or several visual effects, organized into a multi-pass pipeline.

For more details on Shimera's architecture, see the [Architecture](./architecture/technical_architecture.md) page.

## Performance

Simplifying code doesn't mean sacrificing performance. Shimera is designed to stay as fast as a hand-written OpenGL implementation, and each backend is benchmarked on real hardware to prove it, using a reproducible methodology (measuring average FPS and frame time over a constant number of frames, after a warm-up phase).

| Backend | Average FPS | Average frame time | GPU |
|---|---|---|---|
| Native OpenGL | 4,632 fps | 0.216 ms | Quadro RTX 5000 |
| Raylib | 5,128 fps | 0.195 ms | Quadro RTX 5000 |
| SFML | 4,588 fps | 0.220 ms | Quadro RTX 5000 |

These results, measured on a dedicated server, show that Shimera keeps pace regardless of the chosen backend. Full details are available on the [Benchmarks](./performance/benchmarks.md) page.

## Simplified shader integration

Setting up a multi-pass post-processing pipeline (distortion, Gaussian blur, vignette, HDR bloom...) by hand involves manually managing the creation of intermediate framebuffers, chaining the passes, binding textures between each effect, and compiling/linking each shader.

With Shimera, that same pipeline is written in a few declarative lines:

```cpp
EffectPipeline pipeline(backend, videoMode.size.x, videoMode.size.y);
pipeline.addEffect<shimera::GaussianBlurEffect>()
        .addEffect<shimera::AtmosphericScatteringEffect>()
        .addEffect<shimera::DistortionEffect>()
        .build();

auto &blur = effects.get<shimera::GaussianBlurEffect>();
blur.withSigma(5.0f)
    .withSamples(15)
    .withResolution(shimera::Vec2(960.0f, 540.0f));

// ... in the render loop
pipeline.get<DistortionEffect>().m_uTime = clock.getElapsedTime().asSeconds();
sceneFramebuffer->unbind();
pipeline.render(sceneFramebuffer->getTexture());
```

Managing the intermediate steps between each effect, passing data from one effect to the next, and the ordering of passes are all handled internally. The developer declares which effects they want and in what order, and Shimera takes care of the rest. They can then access each effect's uniforms to update them as needed.

## Developer productivity

This is where Shimera's real value lies: turning hundreds of lines of framebuffer management, uniforms, and render passes into a handful of method calls. A 3-effect post-processing pipeline, which would normally require manually managing 3 framebuffers, their output textures, and the chaining between each shader, is reduced to a single call per effect.

The result: a developer integrating Shimera goes from a native OpenGL integration that would normally take dozens to hundreds of lines (framebuffers, shaders, uniforms, error handling) down to a few declarative lines, without losing any low-level control when they need it.

## Conclusion

Shimera stands out through:

- **A flexible architecture**: the same post-processing pipeline works with native OpenGL, Raylib, or SFML, without changing how you work.
- **Real performance**: benchmarks show Shimera keeps pace on every backend, with no hidden trade-offs.
- **Simplified integration**: a multi-pass pipeline that would take hundreds of lines to write by hand is declared in a few calls.
- **A genuine time saver**: less code to write and maintain, so you can focus on visual effects rather than OpenGL mechanics.

In short, Shimera isn't a new rendering engine to learn, but a shortcut to a clean, performant, and reusable visual effects pipeline across projects.