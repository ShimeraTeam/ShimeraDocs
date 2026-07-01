# Stratégie de diffusion de Shimera

## Modèle retenu : Open Source (licence GPL 3.0)

Shimera est et restera un projet **entièrement open source**, distribué sous licence **GNU GPL v3.0**. L'ensemble du code source (cœur de la librairie, backends Raylib/SFML/OpenGL natif, suite de tests, infrastructure de benchmark, documentation) est public et librement consultable, modifiable et redistribuable dans le respect des termes de la GPL 3.0.

## 1. Rationale du modèle choisi

### Pourquoi le full open source ?

- **Nature du projet** : Shimera est une librairie d'abstraction graphique (OpenGL/GLSL au-dessus de Raylib, SFML, OpenGL natif). Ce type d'outil bas niveau gagne en valeur et en confiance précisément parce qu'il est inspectable : un développeur qui choisit une dépendance graphique critique pour son moteur veut pouvoir lire le code, auditer les performances, et ne pas dépendre d'une boîte noire.
- **Crédibilité technique** : L'ouverture totale du code renforce cette dimension : la qualité du code devient elle-même l'argument de vente, pas seulement le résultat final.
- **Effet réseau et adoption** : une librairie de ce type (niche, technique, communauté C++/gamedev) se diffuse principalement par la confiance de pairs et les contributions externes. Un modèle fermé ou partiellement fermé freine fortement cette dynamique dans l'écosystème C++/gamedev qui valorise historiquement l'open source (cf. SFML, raylib, bgfx, etc., tous ouverts).

## 2. Analyse des risques

### Risques liés à la licence GPL 3.0

| Risque | Description | Mitigation |
|---|---|---|
| **Adoption limitée en contexte commercial fermé** | La GPL impose le copyleft : toute application qui lie statiquement Shimera et qui est distribuée doit elle-même être sous GPL-compatible. Des studios ou entreprises voulant intégrer Shimera dans un produit propriétaire fermé seront freinés. | Documenter clairement cette contrainte dès le README. Envisager à terme une LGPL ou un dual-licensing (GPL + licence commerciale payante) si une demande d'usage commercial fermé émerge. |
| **Confusion sur les obligations de la GPL** | Les contributeurs ou utilisateurs novices peuvent mal comprendre ce qu'implique le copyleft (linking statique vs dynamique, distribution vs usage interne). | Ajouter une FAQ licence dans la documentation (`devdoc/` ou `userdoc/`), avec des exemples concrets d'usage autorisé/non autorisé. |
| **Fork hostile ou détournement** | Un tiers peut forker le projet et le faire évoluer dans une direction différente, ou prétendre représenter le projet officiel. | Marque/nom du projet (Shimera) à protéger séparément si besoin (pas couvert par la GPL). Maintenir une présence active (releases, commits réguliers) pour rester la référence du projet. |

### Risques liés à l'ouverture du code en général

| Risque | Description | Mitigation |
|---|---|---|
| **Exposition de failles de sécurité / bugs** | Le code (y compris les bugs connus, comme les erreurs en cours de résolution) est visible publiquement. | Pratique normale en open source ; transparence sur les issues GitHub plutôt qu'un problème. Processus de disclosure responsable si une vraie faille de sécurité critique est trouvée. |
| **Charge de maintenance communautaire** | Des issues, PRs et questions externes demandent du temps de réponse, surtout en period d'examens/stage. | Définir des standards de contribution clairs (CONTRIBUTING.md), templates d'issues/PR, et accepter que certaines contributions attendent. |
| **Vol d'idée sans contribution en retour** | Une entreprise ou un développeur peut utiliser le code et l'idée sans jamais contribuer ni créditer. | Inhérent à l'open source ; partiellement compensé par la GPL (toute distribution dérivée doit rester ouverte). |
| **Dépendance perçue comme projet "étudiant" non mature** | Risque de ne pas être pris au sérieux par des utilisateurs professionnels tant que le projet est jeune. | Documentation soignée, CI/CD robuste, benchmarks chiffrés et reproductibles, badges de build/tests sur le README, releases versionnées. |

## 3. Plan de diffusion

### Phase 1 - Fondations (avant diffusion publique large)
- Avoir un README principal : présentation, exemples de code, captures/GIFs des démos shader, CI.
- Avoir un fichier `LICENSE` (texte complet GPL 3.0) et un `CONTRIBUTING.md`.
- Avoir une beta fonctionnelle et bien documentée.
- Avoir une release taguée sur GitHub (v0.1.0) avec changelog sommaire.

### Phase 2 - Lancement public
- Publier le repo GitHub en visibilité publique avec topics pertinents (`opengl`, `glsl`, `raylib`, `sfml`, `cpp`, `shader-library`).
- Post de lancement sur des communautés ciblées :
  - r/cpp, r/opengl, r/gamedev (Reddit)
  - Forums spécialisés (gamedev.net, Discord raylib/SFML officiels)

### Phase 3 - Croissance et communauté
- Étiqueter des issues pour faciliter les premières contributions externes.
- Mettre en place un canal de discussion (Discord ou GitHub Discussions) pour les utilisateurs/contributeurs.
- Suivre des métriques simples (stars, forks, issues ouvertes/fermées, contributeurs externes) pour évaluer la traction.
- Itérer sur la roadmap publique (fichier `ROADMAP.md`) pour montrer une direction claire au projet.

### Phase 4 - Continuité du projet
- Releases régulières versionnées, changelog tenu à jour.
- Réévaluer périodiquement la licence si un besoin d'usage commercial fermé se manifeste fortement (dual-licensing GPL/commerciale).

## Conclusion

Shimera est diffusé en **open source complet sous GPL 3.0**, un choix cohérent avec la nature technique du projet (librairie graphique bas niveau), l'écosystème C++/gamedev qui valorise l'ouverture. Les principaux risques (copyleft limitant l'usage commercial fermé, charge de maintenance, exposition du code) sont identifiés et mitigés par une documentation claire, une gouvernance de contribution structurée, et une option de réévaluation vers un dual-licensing si le projet gagne en traction commerciale. Le plan de diffusion suit une logique progressive : stabilisation technique -> lancement public ciblé -> animation de communauté -> Continuité du projet.