import{_ as a,o as e,c as i,ak as n}from"./chunks/framework.D-xjpKOc.js";const o=JSON.parse('{"title":"Shimera Architecture Diagram","description":"","frontmatter":{},"headers":[],"relativePath":"devdoc/architecture/architecture_diagram.md","filePath":"devdoc/architecture/architecture_diagram.md"}'),t={name:"devdoc/architecture/architecture_diagram.md"};function l(p,s,r,d,h,c){return e(),i("div",null,[...s[0]||(s[0]=[n(`<h1 id="shimera-architecture-diagram" tabindex="-1">Shimera Architecture Diagram <a class="header-anchor" href="#shimera-architecture-diagram" aria-label="Permalink to “Shimera Architecture Diagram”">​</a></h1><p>A visual overview of Shimera.</p><p>Contents:</p><ol><li><a href="#_1-interaction-layers-core-modules">Interaction layers &amp; core modules</a></li><li><a href="#_2-backend-abstraction-interfaces-implementations">Backend abstraction (interfaces -&gt; implementations)</a></li><li><a href="#_3-rendering-flow">Rendering flow</a></li><li><a href="#_4-external-dependencies">External dependencies</a></li><li><a href="#_5-module-reference-table">Module reference table</a></li></ol><h2 id="_1-interaction-layers-core-modules" tabindex="-1">1. Interaction layers &amp; core modules <a class="header-anchor" href="#_1-interaction-layers-core-modules" aria-label="Permalink to “1. Interaction layers &amp; core modules”">​</a></h2><p>Dependency direction is strictly one-way (top -&gt; bottom): high-level effect orchestration never depends on a concrete backend. A backend is chosen <strong>at compile time</strong>, not at runtime.</p><div class="language-mermaid"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">flowchart TB</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph APP[&quot;🖥️ Application Layer: host apps / examples&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        direction LR</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        EX_GL[&quot;OpenGL example&lt;br/&gt;+ GLFW window/context&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        EX_SFML[&quot;SFML example&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        EX_RL[&quot;Raylib example&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph API[&quot;🏛️ Public API / Facade&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SH[&quot;shimera.h&lt;br/&gt;umbrella include&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SHAPI[&quot;shimera_api.h&lt;br/&gt;SHIMERA_API export/import macros&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph EFFECTS[&quot;🎨 Effect DSL Layer&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SEB[&quot;ShaderEffectBase&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SE[&quot;ShaderEffect&amp;lt;Derived&amp;gt;&lt;br/&gt;CRTP fluent API&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        PPE[&quot;Post-process effects&lt;br/&gt;Brightness, Contrast, Saturation&lt;br/&gt;Grayscale, Colortint, Distortion&lt;br/&gt;Vignette, ChromaticAberration&lt;br/&gt;GaussianBlur, HDRBloom&lt;br/&gt;Pixelisation, AtmosphericScattering&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        MEB[&quot;MaterialEffectBase&lt;br/&gt;MaterialEffect&amp;lt;Derived&amp;gt;&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        FRESNEL[&quot;FresnelEffect&lt;br/&gt;3D material&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        PIPE[&quot;EffectPipeline&lt;br/&gt;pass chaining&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph KERNEL[&quot;⚙️ Abstraction Kernel: interfaces&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        FACT[&quot;BackendFactory::create()&lt;br/&gt;compile-time backend selection&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        IB[&quot;IBackend&lt;br/&gt;resource factory + renderMaterial&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        IFACES[&quot;IFrameBuffer, IPostProcessor, IShader&lt;br/&gt;ITexture, IMaterial, IMesh&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph BACKENDS[&quot;🔌 Backend Adapters: concrete&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        GLB[&quot;OpenGL backend&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SFB[&quot;SFML backend&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        RLB[&quot;Raylib backend&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph SUPPORT[&quot;🧰 Support / Utility Modules&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        UNI[&quot;uniform/&lt;br/&gt;UniformValue variant, Vec2/3/4, Mat4, Color&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SCENE[&quot;scene/&lt;br/&gt;Camera, CameraFactory, TransformFactory&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        CONV[&quot;converts/&lt;br/&gt;GlmConvert, Raylib converts&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        GLU[&quot;glUtils&lt;br/&gt;GLC/ASSERT shader compile/link&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    APP --&gt; API</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    API --&gt; EFFECTS</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    EFFECTS --&gt; KERNEL</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    KERNEL --&gt; BACKENDS</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    FACT --&gt; IB</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    IB --&gt; GLB</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    IB --&gt; SFB</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    IB --&gt; RLB</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    EFFECTS -. uses .-&gt; UNI</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    KERNEL -. uses .-&gt; SCENE</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    BACKENDS -. use .-&gt; GLU</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    BACKENDS -. use .-&gt; CONV</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    BACKENDS -. use .-&gt; UNI</span></span></code></pre></div><p><strong>Layer responsibilities</strong></p><table tabindex="0"><thead><tr><th>Layer</th><th>Role</th></tr></thead><tbody><tr><td>Application</td><td>Owns the window/GL context (GLFW/SFML/Raylib), drives the frame loop, owns Shimera objects.</td></tr><tr><td>Public API / Facade</td><td>Stable entry headers + ABI export macros (<code>SHIMERA_API</code>).</td></tr><tr><td>Effect DSL</td><td>Backend-agnostic, fluent effect objects (<code>.with()</code>), each wrapping one post-processor.</td></tr><tr><td>Abstraction Kernel</td><td>Pure interfaces + <code>BackendFactory</code>, the seam that keeps effects backend-agnostic.</td></tr><tr><td>Backend Adapters</td><td>Concrete OpenGL / SFML / Raylib implementations of every interface.</td></tr><tr><td>Support / Utility</td><td>Typed uniforms &amp; math, scene/camera helpers, glm conversions, GL error/shader helpers.</td></tr></tbody></table><h2 id="_2-backend-abstraction-interfaces-implementations" tabindex="-1">2. Backend abstraction (interfaces -&gt; implementations) <a class="header-anchor" href="#_2-backend-abstraction-interfaces-implementations" aria-label="Permalink to “2. Backend abstraction (interfaces -&gt; implementations)”">​</a></h2><p><code>IBackend</code> is a factory: it creates every rendering resource as an interface, so application and effect code hold only interface pointers. Each concrete backend implements the full set.</p><div class="language-mermaid"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">classDiagram</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    class IBackend {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;&lt;interface&gt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +createFrameBuffer(w, h, samplableDepth) IFrameBuffer</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +createPostProcessor(vert, frag) IPostProcessor</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +createMesh(positions, normals, indices) IMesh</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +createMaterial(vert, frag) IMaterial</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +renderMaterial(material, mesh, camera, transform)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +createTexture(w, h) ITexture</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +createShader(vert, frag) IShader</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    class IFrameBuffer {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;&lt;interface&gt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +bind()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +unbind()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +clear(Color)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +resize(w, h)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +getTexture() ITexture</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +getNativeRenderTarget()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    class IPostProcessor {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;&lt;interface&gt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +setShader(IShader)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +render(ITexture)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +setUniform(name, UniformValue)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    class IShader {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;&lt;interface&gt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +bind()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +unbind()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +setUniform(name, UniformValue)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    class ITexture {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;&lt;interface&gt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +bind()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        +getNativeHandle()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    class IMaterial {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;&lt;interface&gt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    class IMesh {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;&lt;interface&gt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    IBackend ..&gt; IFrameBuffer : creates</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    IBackend ..&gt; IPostProcessor : creates</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    IBackend ..&gt; IShader : creates</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    IBackend ..&gt; ITexture : creates</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    IBackend ..&gt; IMaterial : creates</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    IBackend ..&gt; IMesh : creates</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    OpenGLBackend --|&gt; IBackend</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    SFMLBackend --|&gt; IBackend</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    RaylibBackend --|&gt; IBackend</span></span></code></pre></div><p><strong>Compile-time selection</strong> (<code>BackendFactory::create()</code> + <code>xmake.lua</code> defines):</p><div class="language-mermaid"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">flowchart LR</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    F[&quot;BackendFactory::create()&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    F --&gt;|SHIMERA_BACKEND_OPENGL| A[&quot;new OpenGLBackend&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    F --&gt;|SHIMERA_BACKEND_SFML| B[&quot;new SFMLBackend&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    F --&gt;|SHIMERA_BACKEND_RAYLIB| C[&quot;new RaylibBackend&quot;]</span></span></code></pre></div><blockquote><p>Each built artifact (<code>shimera-opengl</code>, <code>shimera-sfml</code>, <code>shimera-raylib</code>) is bound to exactly one backend path, there is no runtime plugin switching.</p></blockquote><h2 id="_3-rendering-flow" tabindex="-1">3. Rendering flow <a class="header-anchor" href="#_3-rendering-flow" aria-label="Permalink to “3. Rendering flow”">​</a></h2><h3 id="_3-1-post-processing-pass-chain-ping-pong" tabindex="-1">3.1 Post-processing pass chain (ping-pong) <a class="header-anchor" href="#_3-1-post-processing-pass-chain-ping-pong" aria-label="Permalink to “3.1 Post-processing pass chain (ping-pong)”">​</a></h3><p>The core pipeline: capture the scene offscreen, then apply fullscreen shader passes, alternating framebuffers so no pass reads and writes the same target.</p><div class="language-mermaid"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">flowchart LR</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    SCENE([&quot;Scene draw calls&quot;]) --&gt; FBA[&quot;Framebuffer A&lt;br/&gt;bind -&gt; render -&gt; unbind&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    FBA --&gt;|getTexture| P1[&quot;Effect Pass 1&lt;br/&gt;updateUniforms -&gt; fullscreen quad&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    P1 --&gt; FBB[&quot;Framebuffer B&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    FBB --&gt;|getTexture| P2[&quot;Effect Pass 2&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    P2 --&gt; SCREEN([&quot;🖼️ Screen / active target&quot;])</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    P1 -. or direct to screen&lt;br/&gt;single-pass .-&gt; SCREEN</span></span></code></pre></div><h3 id="_3-2-3d-material-path" tabindex="-1">3.2 3D material path <a class="header-anchor" href="#_3-2-3d-material-path" aria-label="Permalink to “3.2 3D material path”">​</a></h3><p>Alongside post-processing, <code>IBackend::renderMaterial()</code> draws lit/shaded geometry (e.g. the <code>FresnelEffect</code>) using a mesh, material shader, camera and transform.</p><div class="language-mermaid"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">flowchart LR</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    MESH[&quot;IMesh&lt;br/&gt;positions, normals, indices&quot;] --&gt; RM</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    MAT[&quot;IMaterial&lt;br/&gt;material shader&quot;] --&gt; RM</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    CAM[&quot;Camera&lt;br/&gt;view / projection&quot;] --&gt; RM</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    XF[&quot;Mat4 transform&quot;] --&gt; RM</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    RM[&quot;IBackend::renderMaterial()&quot;] --&gt; OUT([&quot;Framebuffer / screen&quot;])</span></span></code></pre></div><h3 id="_3-3-per-frame-control-uniform-flow" tabindex="-1">3.3 Per-frame control &amp; uniform flow <a class="header-anchor" href="#_3-3-per-frame-control-uniform-flow" aria-label="Permalink to “3.3 Per-frame control &amp; uniform flow”">​</a></h3><p>How an effect pushes CPU-side parameters to the GPU each frame (<code>std::visit</code> dispatches the <code>UniformValue</code> variant to the right <code>glUniform*</code> call, uniform locations are cached).</p><div class="language-mermaid"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sequenceDiagram</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant App</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant Effect as ShaderEffect</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant PP as IPostProcessor</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant Sh as IShader</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant GPU</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    App-&gt;&gt;Effect: render(inputTexture, targetFB)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Note over Effect: skip if disabled</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Effect-&gt;&gt;Effect: updateUniforms()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loop each parameter</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        Effect-&gt;&gt;PP: setUniform(name, UniformValue)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        PP-&gt;&gt;Sh: setUniform(...)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        Sh-&gt;&gt;GPU: glUniform* via std::visit (cached location)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Effect-&gt;&gt;PP: render(inputTexture)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    PP-&gt;&gt;GPU: bind shader + bind texture (GL_TEXTURE0) + draw quad</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    GPU--&gt;&gt;App: transformed pixels -&gt; target</span></span></code></pre></div><h2 id="_4-external-dependencies" tabindex="-1">4. External dependencies <a class="header-anchor" href="#_4-external-dependencies" aria-label="Permalink to “4. External dependencies”">​</a></h2><p><code>GLEW</code>, <code>GLM</code> and an OpenGL system library are <strong>always</strong> linked, even the SFML and Raylib backends run their shader passes through raw OpenGL. Framework libraries are selected per target.</p><div class="language-mermaid"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">flowchart TB</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph CORE[&quot;Always linked (every backend)&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        GLEW[&quot;GLEW&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        GLM[&quot;GLM&lt;br/&gt;math / matrices&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        GLSYS[&quot;OpenGL system lib&lt;br/&gt;opengl32, GL, OpenGL.framework&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph OPT[&quot;Backend-specific (compile-time, optional)&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SFML[&quot;SFML&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        RAYLIB[&quot;Raylib&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph HOST[&quot;Host / example only&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        GLFW[&quot;GLFW&lt;br/&gt;OpenGL example window&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    TGL[&quot;shimera-opengl&quot;] --&gt; GLEW</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    TGL --&gt; GLM</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    TGL --&gt; GLSYS</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    TSF[&quot;shimera-sfml&quot;] --&gt; GLEW</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    TSF --&gt; GLM</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    TSF --&gt; GLSYS</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    TSF --&gt; SFML</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    TRL[&quot;shimera-raylib&quot;] --&gt; GLEW</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    TRL --&gt; GLM</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    TRL --&gt; GLSYS</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    TRL --&gt; RAYLIB</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    TGL -. example app .-&gt; GLFW</span></span></code></pre></div><p><strong>Per-target dependency matrix</strong></p><table tabindex="0"><thead><tr><th>Target</th><th style="text-align:center;">GLEW</th><th style="text-align:center;">GLM</th><th style="text-align:center;">OpenGL syslib</th><th>Framework</th><th>Status</th></tr></thead><tbody><tr><td><code>shimera-opengl</code></td><td style="text-align:center;">✅</td><td style="text-align:center;">✅</td><td style="text-align:center;">✅</td><td>-</td><td>complete</td></tr><tr><td><code>shimera-sfml</code></td><td style="text-align:center;">✅</td><td style="text-align:center;">✅</td><td style="text-align:center;">✅</td><td>SFML</td><td>complete</td></tr><tr><td><code>shimera-raylib</code></td><td style="text-align:center;">✅</td><td style="text-align:center;">✅</td><td style="text-align:center;">✅</td><td>Raylib</td><td>complete</td></tr></tbody></table><blockquote><p>Runtime resources: effects load GLSL from <code>res/shader/postprocessing/</code> (and <code>res/shader/material/</code>) by relative path, so shaders must ship alongside the binary.</p></blockquote><h2 id="_5-module-reference-table" tabindex="-1">5. Module reference table <a class="header-anchor" href="#_5-module-reference-table" aria-label="Permalink to “5. Module reference table”">​</a></h2><table tabindex="0"><thead><tr><th>Module</th><th>Location</th><th>Purpose</th></tr></thead><tbody><tr><td>Public API</td><td><code>include/shimera.h</code>, <code>include/shimera_api.h</code></td><td>Umbrella include + ABI export macros.</td></tr><tr><td>Backend interfaces</td><td><code>include/backend/I*.hpp</code></td><td><code>IBackend</code>, <code>IFrameBuffer</code>, <code>IPostProcessor</code>, <code>IShader</code>, <code>ITexture</code>, <code>IMaterial</code>, <code>IMesh</code>.</td></tr><tr><td>Backend factory</td><td><code>include/backend/BackendFactory.hpp</code>, <code>src/backend/BackendFactory.cpp</code></td><td>Compile-time backend construction.</td></tr><tr><td>OpenGL backend</td><td><code>include/backend/opengl/</code>, <code>src/backend/opengl/</code></td><td>Native FBO/texture/shader/mesh/material + fullscreen pass.</td></tr><tr><td>SFML backend</td><td><code>include/backend/sfml/</code>, <code>src/backend/sfml/</code></td><td>Wraps <code>sf::RenderTexture</code>/<code>sf::Texture</code>; passes via OpenGL.</td></tr><tr><td>Raylib backend</td><td><code>include/backend/raylib/</code>, <code>src/backend/raylib/</code></td><td>Wraps <code>RenderTexture2D</code>; passes via OpenGL; <code>converts/</code> for camera/types.</td></tr><tr><td>Effects</td><td><code>include/effects/</code>, <code>src/effects/</code></td><td>CRTP <code>ShaderEffect&lt;Derived&gt;</code> + 12 post-process effects.</td></tr><tr><td>Material effects</td><td><code>include/effects/materials/</code>, <code>src/effects/materials/</code></td><td><code>MaterialEffectBase</code> + <code>FresnelEffect</code> (3D).</td></tr><tr><td>Scene</td><td><code>include/scene/</code>, <code>src/scene/</code></td><td><code>Camera</code>, <code>CameraFactory</code>, <code>TransformFactory</code>.</td></tr><tr><td>Uniforms / math</td><td><code>include/uniform/</code></td><td><code>UniformValue</code> variant, <code>Vec2/3/4</code>, <code>Mat4</code>, <code>Color</code>.</td></tr><tr><td>Converts</td><td><code>include/converts/</code>, <code>src/converts/</code></td><td><code>GlmConvert</code> and Raylib type conversions.</td></tr><tr><td>GL utilities</td><td><code>include/glUtils.h</code>, <code>src/glUtils.cpp</code></td><td>GL error macros + shader compile/link helpers.</td></tr></tbody></table><hr><h3 id="legend" tabindex="-1">Legend <a class="header-anchor" href="#legend" aria-label="Permalink to “Legend”">​</a></h3><ul><li><strong>Solid arrow</strong>: direct dependency / data flow.</li><li><strong>Dashed arrow</strong>: optional / conditional use.</li></ul>`,36)])])}const k=a(t,[["render",l]]);export{o as __pageData,k as default};
