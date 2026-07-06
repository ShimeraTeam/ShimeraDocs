import{_ as a,o as e,c as i,ak as n}from"./chunks/framework.D-xjpKOc.js";const o=JSON.parse(`{"title":"Diagramme d'architecture de Shimera","description":"","frontmatter":{},"headers":[],"relativePath":"fr/devdoc/architecture/architecture_diagram.md","filePath":"fr/devdoc/architecture/architecture_diagram.md"}`),t={name:"fr/devdoc/architecture/architecture_diagram.md"};function l(p,s,r,d,c,h){return e(),i("div",null,[...s[0]||(s[0]=[n(`<h1 id="diagramme-d-architecture-de-shimera" tabindex="-1">Diagramme d&#39;architecture de Shimera <a class="header-anchor" href="#diagramme-d-architecture-de-shimera" aria-label="Permalink to “Diagramme d&#39;architecture de Shimera”">​</a></h1><p>Une vue d&#39;ensemble visuelle de Shimera.</p><p>Sommaire :</p><ol><li><a href="#_1-couches-dinteraction-modules-principaux">Couches d&#39;interaction &amp; modules principaux</a></li><li><a href="#_2-abstraction-du-backend-interfaces-implementations">Abstraction du backend (interfaces -&gt; implémentations)</a></li><li><a href="#_3-flux-de-rendu">Flux de rendu</a></li><li><a href="#_4-dependances-externes">Dépendances externes</a></li><li><a href="#_5-table-de-reference-des-modules">Table de référence des modules</a></li></ol><h2 id="_1-couches-d-interaction-modules-principaux" tabindex="-1">1. Couches d&#39;interaction &amp; modules principaux <a class="header-anchor" href="#_1-couches-d-interaction-modules-principaux" aria-label="Permalink to “1. Couches d&#39;interaction &amp; modules principaux”">​</a></h2><p>La direction des dépendances est strictement à sens unique (haut -&gt; bas) : l&#39;orchestration des effets de haut niveau ne dépend jamais d&#39;un backend concret. Un backend est choisi <strong>à la compilation</strong>, pas à l&#39;exécution.</p><div class="language-mermaid"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">flowchart TB</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph APP[&quot;🖥️ Couche Application : apps hôtes / exemples&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        direction LR</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        EX_GL[&quot;Exemple OpenGL&lt;br/&gt;+ fenêtre/contexte GLFW&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        EX_SFML[&quot;Exemple SFML&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        EX_RL[&quot;Exemple Raylib&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph API[&quot;🏛️ API publique / Façade&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SH[&quot;shimera.h&lt;br/&gt;include global&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SHAPI[&quot;shimera_api.h&lt;br/&gt;macros export/import SHIMERA_API&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph EFFECTS[&quot;🎨 Couche DSL d&#39;effets&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SEB[&quot;ShaderEffectBase&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SE[&quot;ShaderEffect&amp;lt;Derived&amp;gt;&lt;br/&gt;API fluide CRTP&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        PPE[&quot;Effets de post-traitement&lt;br/&gt;Brightness, Contrast, Saturation&lt;br/&gt;Grayscale, Colortint, Distortion&lt;br/&gt;Vignette, ChromaticAberration&lt;br/&gt;GaussianBlur, HDRBloom&lt;br/&gt;Pixelisation, AtmosphericScattering&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        MEB[&quot;MaterialEffectBase&lt;br/&gt;MaterialEffect&amp;lt;Derived&amp;gt;&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        FRESNEL[&quot;FresnelEffect&lt;br/&gt;matériau 3D&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        PIPE[&quot;EffectPipeline&lt;br/&gt;enchaînement de passes&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph KERNEL[&quot;⚙️ Noyau d&#39;abstraction : interfaces&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        FACT[&quot;BackendFactory::create()&lt;br/&gt;sélection du backend à la compilation&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        IB[&quot;IBackend&lt;br/&gt;fabrique de ressources + renderMaterial&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        IFACES[&quot;IFrameBuffer, IPostProcessor, IShader&lt;br/&gt;ITexture, IMaterial, IMesh&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph BACKENDS[&quot;🔌 Adaptateurs de backend : concrets&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        GLB[&quot;Backend OpenGL&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SFB[&quot;Backend SFML&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        RLB[&quot;Backend Raylib&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph SUPPORT[&quot;🧰 Modules de support / utilitaires&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        UNI[&quot;uniform/&lt;br/&gt;variant UniformValue, Vec2/3/4, Mat4, Color&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SCENE[&quot;scene/&lt;br/&gt;Camera, CameraFactory, TransformFactory&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        CONV[&quot;converts/&lt;br/&gt;GlmConvert, conversions Raylib&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        GLU[&quot;glUtils&lt;br/&gt;compilation/liaison shader GLC/ASSERT&quot;]</span></span>
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
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    EFFECTS -. utilise .-&gt; UNI</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    KERNEL -. utilise .-&gt; SCENE</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    BACKENDS -. utilise .-&gt; GLU</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    BACKENDS -. utilise .-&gt; CONV</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    BACKENDS -. utilise .-&gt; UNI</span></span></code></pre></div><p><strong>Responsabilités des couches</strong></p><table tabindex="0"><thead><tr><th>Couche</th><th>Rôle</th></tr></thead><tbody><tr><td>Application</td><td>Possède la fenêtre/le contexte GL (GLFW/SFML/Raylib), pilote la boucle de rendu, possède les objets Shimera.</td></tr><tr><td>API publique / Façade</td><td>En-têtes d&#39;entrée stables + macros d&#39;export ABI (<code>SHIMERA_API</code>).</td></tr><tr><td>DSL d&#39;effets</td><td>Objets d&#39;effet fluides et agnostiques du backend (<code>.with()</code>), chacun encapsulant un post-processeur.</td></tr><tr><td>Noyau d&#39;abstraction</td><td>Interfaces pures + <code>BackendFactory</code>, la frontière qui garde les effets agnostiques du backend.</td></tr><tr><td>Adaptateurs de backend</td><td>Implémentations concrètes OpenGL / SFML / Raylib de chaque interface.</td></tr><tr><td>Support / Utilitaires</td><td>Uniformes typés &amp; maths, aides scène/caméra, conversions glm, aides d&#39;erreurs GL/shaders.</td></tr></tbody></table><h2 id="_2-abstraction-du-backend-interfaces-implementations" tabindex="-1">2. Abstraction du backend (interfaces -&gt; implémentations) <a class="header-anchor" href="#_2-abstraction-du-backend-interfaces-implementations" aria-label="Permalink to “2. Abstraction du backend (interfaces -&gt; implémentations)”">​</a></h2><p><code>IBackend</code> est une fabrique : elle crée chaque ressource de rendu sous forme d&#39;interface, si bien que le code applicatif et les effets ne manipulent que des pointeurs d&#39;interface. Chaque backend concret implémente l&#39;ensemble complet.</p><div class="language-mermaid"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">classDiagram</span></span>
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
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    IBackend ..&gt; IFrameBuffer : crée</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    IBackend ..&gt; IPostProcessor : crée</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    IBackend ..&gt; IShader : crée</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    IBackend ..&gt; ITexture : crée</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    IBackend ..&gt; IMaterial : crée</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    IBackend ..&gt; IMesh : crée</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    OpenGLBackend --|&gt; IBackend</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    SFMLBackend --|&gt; IBackend</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    RaylibBackend --|&gt; IBackend</span></span></code></pre></div><p><strong>Sélection à la compilation</strong> (<code>BackendFactory::create()</code> + définitions <code>xmake.lua</code>) :</p><div class="language-mermaid"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">flowchart LR</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    F[&quot;BackendFactory::create()&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    F --&gt;|SHIMERA_BACKEND_OPENGL| A[&quot;new OpenGLBackend&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    F --&gt;|SHIMERA_BACKEND_SFML| B[&quot;new SFMLBackend&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    F --&gt;|SHIMERA_BACKEND_RAYLIB| C[&quot;new RaylibBackend&quot;]</span></span></code></pre></div><blockquote><p>Chaque artefact compilé (<code>shimera-opengl</code>, <code>shimera-sfml</code>, <code>shimera-raylib</code>) est lié à exactement un seul chemin de backend, il n&#39;y a pas de commutation de plugin à l&#39;exécution.</p></blockquote><h2 id="_3-flux-de-rendu" tabindex="-1">3. Flux de rendu <a class="header-anchor" href="#_3-flux-de-rendu" aria-label="Permalink to “3. Flux de rendu”">​</a></h2><h3 id="_3-1-chaine-de-passes-de-post-traitement-ping-pong" tabindex="-1">3.1 Chaîne de passes de post-traitement (ping-pong) <a class="header-anchor" href="#_3-1-chaine-de-passes-de-post-traitement-ping-pong" aria-label="Permalink to “3.1 Chaîne de passes de post-traitement (ping-pong)”">​</a></h3><p>La pipeline centrale : capturer la scène hors écran, puis appliquer une ou plusieurs passes de shader plein écran, en alternant les framebuffers pour qu&#39;aucune passe ne lise et n&#39;écrive la même cible.</p><div class="language-mermaid"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">flowchart LR</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    SCENE([&quot;Appels de rendu de la scène&quot;]) --&gt; FBA[&quot;Framebuffer A&lt;br/&gt;bind -&gt; render -&gt; unbind&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    FBA --&gt;|getTexture| P1[&quot;Passe d&#39;effet 1&lt;br/&gt;updateUniforms -&gt; quad plein écran&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    P1 --&gt; FBB[&quot;Framebuffer B&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    FBB --&gt;|getTexture| P2[&quot;Passe d&#39;effet 2&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    P2 --&gt; SCREEN([&quot;🖼️ Écran / cible active&quot;])</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    P1 -. ou directement vers l&#39;écran&lt;br/&gt;passe unique .-&gt; SCREEN</span></span></code></pre></div><h3 id="_3-2-chemin-des-materiaux-3d" tabindex="-1">3.2 Chemin des matériaux 3D <a class="header-anchor" href="#_3-2-chemin-des-materiaux-3d" aria-label="Permalink to “3.2 Chemin des matériaux 3D”">​</a></h3><p>En complément du post-traitement, <code>IBackend::renderMaterial()</code> dessine une géométrie ombrée/éclairée (par ex. <code>FresnelEffect</code>) à partir d&#39;un mesh, d&#39;un shader de matériau, d&#39;une caméra et d&#39;une transformation.</p><div class="language-mermaid"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">flowchart LR</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    MESH[&quot;IMesh&lt;br/&gt;positions, normales, indices&quot;] --&gt; RM</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    MAT[&quot;IMaterial&lt;br/&gt;shader de matériau&quot;] --&gt; RM</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    CAM[&quot;Camera&lt;br/&gt;vue / projection&quot;] --&gt; RM</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    XF[&quot;Mat4 transform&quot;] --&gt; RM</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    RM[&quot;IBackend::renderMaterial()&quot;] --&gt; OUT([&quot;Framebuffer / écran&quot;])</span></span></code></pre></div><h3 id="_3-3-flux-de-controle-et-d-uniformes-par-image" tabindex="-1">3.3 Flux de contrôle et d&#39;uniformes par image <a class="header-anchor" href="#_3-3-flux-de-controle-et-d-uniformes-par-image" aria-label="Permalink to “3.3 Flux de contrôle et d&#39;uniformes par image”">​</a></h3><p>Comment un effet transmet ses paramètres CPU au GPU à chaque image (<code>std::visit</code> distribue le <code>UniformValue</code> vers le bon appel <code>glUniform*</code>, les emplacements d&#39;uniformes sont mis en cache).</p><div class="language-mermaid"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sequenceDiagram</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant App</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant Effect as ShaderEffect</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant PP as IPostProcessor</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant Sh as IShader</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant GPU</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    App-&gt;&gt;Effect: render(inputTexture, targetFB)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Note over Effect: ignoré si désactivé</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Effect-&gt;&gt;Effect: updateUniforms()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loop pour chaque paramètre</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        Effect-&gt;&gt;PP: setUniform(name, UniformValue)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        PP-&gt;&gt;Sh: setUniform(...)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        Sh-&gt;&gt;GPU: glUniform* via std::visit (emplacement mis en cache)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Effect-&gt;&gt;PP: render(inputTexture)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    PP-&gt;&gt;GPU: bind shader + bind texture (GL_TEXTURE0) + dessin du quad</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    GPU--&gt;&gt;App: pixels transformés -&gt; cible</span></span></code></pre></div><h2 id="_4-dependances-externes" tabindex="-1">4. Dépendances externes <a class="header-anchor" href="#_4-dependances-externes" aria-label="Permalink to “4. Dépendances externes”">​</a></h2><p><code>GLEW</code>, <code>GLM</code> et une bibliothèque système OpenGL sont <strong>toujours</strong> liées, même les backends SFML et Raylib exécutent leurs passes de shader via OpenGL brut. Les bibliothèques de framework sont sélectionnées par cible.</p><div class="language-mermaid"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">flowchart TB</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph CORE[&quot;Toujours liées (tous les backends)&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        GLEW[&quot;GLEW&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        GLM[&quot;GLM&lt;br/&gt;maths / matrices&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        GLSYS[&quot;Bibliothèque système OpenGL&lt;br/&gt;opengl32, GL, OpenGL.framework&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph OPT[&quot;Spécifique au backend (compilation, optionnel)&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SFML[&quot;SFML&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        RAYLIB[&quot;Raylib&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph HOST[&quot;Hôte / exemple uniquement&quot;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        GLFW[&quot;GLFW&lt;br/&gt;fenêtre de l&#39;exemple OpenGL&quot;]</span></span>
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
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    TGL -. application exemple .-&gt; GLFW</span></span></code></pre></div><p><strong>Matrice de dépendances par cible</strong></p><table tabindex="0"><thead><tr><th>Cible</th><th style="text-align:center;">GLEW</th><th style="text-align:center;">GLM</th><th style="text-align:center;">Bibliothèque système OpenGL</th><th>Framework</th><th>Statut</th></tr></thead><tbody><tr><td><code>shimera-opengl</code></td><td style="text-align:center;">✅</td><td style="text-align:center;">✅</td><td style="text-align:center;">✅</td><td>-</td><td>complet</td></tr><tr><td><code>shimera-sfml</code></td><td style="text-align:center;">✅</td><td style="text-align:center;">✅</td><td style="text-align:center;">✅</td><td>SFML</td><td>complet</td></tr><tr><td><code>shimera-raylib</code></td><td style="text-align:center;">✅</td><td style="text-align:center;">✅</td><td style="text-align:center;">✅</td><td>Raylib</td><td>complet</td></tr></tbody></table><blockquote><p>Ressources à l&#39;exécution : les effets chargent le GLSL depuis <code>res/shader/postprocessing/</code> (et <code>res/shader/material/</code>) par chemin relatif, les shaders doivent donc être livrés avec le binaire.</p></blockquote><h2 id="_5-table-de-reference-des-modules" tabindex="-1">5. Table de référence des modules <a class="header-anchor" href="#_5-table-de-reference-des-modules" aria-label="Permalink to “5. Table de référence des modules”">​</a></h2><table tabindex="0"><thead><tr><th>Module</th><th>Emplacement</th><th>Objectif</th></tr></thead><tbody><tr><td>API publique</td><td><code>include/shimera.h</code>, <code>include/shimera_api.h</code></td><td>Include global + macros d&#39;export ABI.</td></tr><tr><td>Interfaces de backend</td><td><code>include/backend/I*.hpp</code></td><td><code>IBackend</code>, <code>IFrameBuffer</code>, <code>IPostProcessor</code>, <code>IShader</code>, <code>ITexture</code>, <code>IMaterial</code>, <code>IMesh</code>.</td></tr><tr><td>Fabrique de backend</td><td><code>include/backend/BackendFactory.hpp</code>, <code>src/backend/BackendFactory.cpp</code></td><td>Construction du backend à la compilation.</td></tr><tr><td>Backend OpenGL</td><td><code>include/backend/opengl/</code>, <code>src/backend/opengl/</code></td><td>FBO/texture/shader/mesh/matériau natifs + passe plein écran.</td></tr><tr><td>Backend SFML</td><td><code>include/backend/sfml/</code>, <code>src/backend/sfml/</code></td><td>Encapsule <code>sf::RenderTexture</code>/<code>sf::Texture</code> ; passes via OpenGL.</td></tr><tr><td>Backend Raylib</td><td><code>include/backend/raylib/</code>, <code>src/backend/raylib/</code></td><td>Encapsule <code>RenderTexture2D</code> ; passes via OpenGL ; <code>converts/</code> pour caméra/types.</td></tr><tr><td>Effets</td><td><code>include/effects/</code>, <code>src/effects/</code></td><td><code>ShaderEffect&lt;Derived&gt;</code> CRTP + 12 effets de post-traitement.</td></tr><tr><td>Effets de matériau</td><td><code>include/effects/materials/</code>, <code>src/effects/materials/</code></td><td><code>MaterialEffectBase</code> + <code>FresnelEffect</code> (3D).</td></tr><tr><td>Scène</td><td><code>include/scene/</code>, <code>src/scene/</code></td><td><code>Camera</code>, <code>CameraFactory</code>, <code>TransformFactory</code>.</td></tr><tr><td>Uniformes / maths</td><td><code>include/uniform/</code></td><td>Variant <code>UniformValue</code>, <code>Vec2/3/4</code>, <code>Mat4</code>, <code>Color</code>.</td></tr><tr><td>Conversions</td><td><code>include/converts/</code>, <code>src/converts/</code></td><td><code>GlmConvert</code> et conversions de types Raylib.</td></tr><tr><td>Utilitaires GL</td><td><code>include/glUtils.h</code>, <code>src/glUtils.cpp</code></td><td>Macros d&#39;erreurs GL + aides de compilation/liaison de shaders.</td></tr></tbody></table><hr><h3 id="legende" tabindex="-1">Légende <a class="header-anchor" href="#legende" aria-label="Permalink to “Légende”">​</a></h3><ul><li><strong>Flèche pleine</strong> : dépendance directe / flux de données.</li><li><strong>Flèche pointillée</strong> : utilisation optionnelle / conditionnelle.</li></ul>`,36)])])}const k=a(t,[["render",l]]);export{o as __pageData,k as default};
