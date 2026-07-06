# Pourquoi Shimera ?

Shimera est une bibliothèque C++ conçue pour simplifier l'intégration d'effets visuels (shaders) dans des projets OpenGL, SFML et Raylib.

Ce document explique ce qui différencie Shimera des alternatives existantes, sur quatre axes : architecture, performance, simplicité d'intégration, et productivité.

## Innovation architecturale
 
La plupart des bibliothèques de shaders sont liées à un seul backend de rendu : on choisit Raylib, SFML ou OpenGL natif, et on s'y enferme. Shimera part d'un constat différent : ces backends exposent finalement le même pipeline OpenGL sous-jacent, simplement avec des conventions différentes.
 
Shimera introduit donc une couche d'abstraction qui unifie ces conventions. Concrètement, cela veut dire :
 
- La possibilité d'utiliser Shimera avec le backend de son choix (OpenGL natif, Raylib ou SFML), sans changer sa façon de travailler.
- Une gestion simplifiée d'un ou plusieurs effets visuels, organisés en pipeline multi-passes.

Pour plus de détails sur l'architecture de Shimera, voir la page [Architecture](./architecture/technical_architecture.md).

## Performance

Simplifier l'écriture du code ne veut pas dire sacrifier les performances. Shimera est conçu pour rester aussi rapide qu'une implémentation OpenGL écrite à la main, et chaque backend est benchmarké sur du matériel réel pour le prouver, avec une méthodologie reproductible (mesure du FPS moyen et du temps par frame sur un nombre de frames constant, après une phase de warm-up).

| Backend | FPS moyen | Frame time moyen | GPU |
|---|---|---|---|
| OpenGL natif | 4,632 fps | 0.216 ms | Quadro RTX 5000 |
| Raylib | 5,128 fps | 0,195 ms | Quadro RTX 5000 |
| SFML | 4,588 fps | 0,220 ms | Quadro RTX 5000 |

Ces résultats, mesurés sur un serveur dédié, montrent que Shimera tient la cadence quel que soit le backend choisi. Le détail complet est disponible sur la page [Benchmarks](./performance/benchmarks.md).

## Intégration de Shader simplifiée

Mettre en place un pipeline de post-processing multi-passes (distortion, flou gaussien, vignette, bloom HDR...) à la main implique de gérer manuellement la création des framebuffers intermédiaires, l'enchaînement des passes, le binding des textures entre chaque effet, et la compilation/liaison de chaque shader.

Avec Shimera, ce même pipeline s'écrit en quelques lignes déclaratives :

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

// ... dans la boucle de rendu
pipeline.get<DistortionEffect>().m_uTime = clock.getElapsedTime().asSeconds();
sceneFramebuffer->unbind();
pipeline.render(sceneFramebuffer->getTexture());
```

La gestion des étapes intermédiaires entre chaque effet, le passage des données d'un effet à l'autre, et l'ordre des passes sont entièrement pris en charge en interne. Le développeur déclare quels effets il veut et dans quel ordre, et Shimera s'occupe du reste. Il peut ensuite accéder aux uniforms de chaque effet pour les mettre à jour à sa guise.

## Productivité pour les développeurs

Le vrai gain de Shimera est là : transformer des centaines de lignes de gestion de framebuffers, de uniforms et de passes de rendu en quelques appels de méthode. Un pipeline de post-processing à 3 effets qui nécessiterait normalement de la gestion manuelle de 3 framebuffers, de leurs textures de sortie, et du chaînage entre chaque shader, se réduit à un appel par effet.

Le résultat : un développeur qui intègre Shimera passe d'une intégration OpenGL qui prendrait normalement des dizaines à des centaines de lignes (framebuffers, shaders, uniforms, gestion d'erreurs) à quelques lignes déclaratives, sans rien perdre en contrôle bas-niveau quand il en a besoin.

## Conclusion

Shimera est une bibliothèque qui se distingue par :

- **Une architecture flexible** : le même pipeline de post-processing fonctionne avec OpenGL natif, Raylib ou SFML, sans changer sa façon de travailler.
- **Des performances réelles** : les benchmarks montrent que Shimera tient la cadence sur chaque backend, sans compromis caché.
- **Une intégration simplifiée** : un pipeline multi-passes qui prendrait des centaines de lignes à écrire à la main se déclare en quelques appels.
- **Un vrai gain de temps** : moins de code à écrire et à maintenir, pour se concentrer sur les effets visuels plutôt que sur la mécanique OpenGL.

En résumé, Shimera n'est pas un nouveau moteur de rendu à apprendre, mais un raccourci pour obtenir un pipeline d'effets visuels propre, performant, et réutilisable d'un projet à l'autre.

