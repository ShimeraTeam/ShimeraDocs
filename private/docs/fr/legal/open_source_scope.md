# Périmètre open source

Ce document liste **ce que Shimera ouvre, sous quelle licence, et ce qui reste
privé**. C'est le complément opérationnel de la
[Stratégie de protection juridique](/fr/legal/legal_protection_strategy) (pourquoi
et comment nous protégeons le projet) et de la
[Stratégie de diffusion](/fr/deployment/diffusion_strategy) (pourquoi nous avons
choisi l'open source). À utiliser avant toute publication : une release, un
déploiement de documentation, un nouvel asset, ou un changement de visibilité d'un
dépôt.

## 1. Résumé

Shimera ouvre **deux choses** : l'intégralité du dépôt `Shimera` et la
documentation publique (`ShimeraDocs/public`). Tout le reste reste privé.

| Élément | Statut | Licence | Emplacement |
|---|---|---|---|
| Code source de la librairie (`src/`) | **Ouvert** | `GPL-3.0-only` | `ShimeraTeam/Shimera` |
| Sources des shaders (`res/shader/**/*.slang`, `.frag`, `.vert`) | **Ouvert** | `GPL-3.0-only` | `ShimeraTeam/Shimera` |
| Images d'exécution (`res/imgs/`) | **Ouvert** | `GPL-3.0-only` | `ShimeraTeam/Shimera` |
| Exemples (`examples/`) | **Ouvert** | `GPL-3.0-only` | `ShimeraTeam/Shimera` |
| Scripts de build (`xmake.lua`, `.run/`) | **Ouvert** | `GPL-3.0-only` | `ShimeraTeam/Shimera` |
| Fichiers de gouvernance (`LICENSE`, `AUTHORS.md`, `CONTRIBUTING.md`, `README.md`) | **Ouvert** | n/a (métadonnées du projet) | `ShimeraTeam/Shimera` |
| Binaires de release (`.a`, `.so`, headers) | **Ouvert** | `GPL-3.0-only` | GitHub Releases |
| Documentation utilisateur et développeur (`userdoc/`, `devdoc/`) | **Ouvert** | À décider (voir 3.3) | `ShimeraDocs/public`, GitHub Pages |
| Documentation interne (ce site) | **Privé** | Tous droits réservés | `ShimeraDocs/private` |
| Dépôt e-Soleau, PDF du plan d'action, livrables scolaires | **Privé** | Tous droits réservés | Mainteneurs uniquement |
| Le nom « Shimera » et le logo | **Non licencié** | Non couvert par la GPL | Assets de marque |
| Secrets CI, configuration du runner, identifiants | **Privé** | n/a | Paramètres GitHub |

La règle générale : **tout ce qui est nécessaire pour compiler, utiliser, étudier
et modifier la librairie est ouvert. Tout ce qui relève de la stratégie interne,
des preuves, de la marque ou de l'infrastructure reste privé.**

## 2. Ce qui est ouvert, et pourquoi

### 2.1 L'intégralité du dépôt de la librairie (`ShimeraTeam/Shimera`)

Tout le contenu suivi du dépôt est public et sous licence **GPL-3.0-only**, sans
exception :

- `src/` : le cœur (`Context`, `EffectPipeline`), la couche OpenGL (`GL/`), les
  effets, matériaux, scène, uniforms, et les adaptateurs hôtes (`hosts/` : GLFW,
  SFML, raylib, SDL).
- `res/shader/` : les sources Slang et GLSL de chaque effet et matériau. C'est le
  cœur de la valeur du projet, ouvert volontairement : le copyleft de la GPL est
  ce qui empêche un produit fermé de les réutiliser en silence.
- `res/imgs/` : images utilisées par les exemples.
- `examples/` : programmes autonomes par librairie hôte.
- `xmake.lua` et `.run/` : configuration de build.
- L'historique Git complet, qui fait aussi partie de notre preuve d'antériorité
  (voir la [Stratégie de protection juridique](/fr/legal/legal_protection_strategy),
  section 5.2).

Non publiés (exclus par `.gitignore`) : `build/`, `.xmake/`,
`compile_commands.json`, et `res/shader/generated/` (le GLSL produit par le
pipeline Slang au build ; il dérive des sources Slang et peut toujours être
régénéré).

**Pourquoi tout ouvrir :** la GPL exige que quiconque distribue Shimera puisse
fournir le *code source correspondant complet*, scripts de build compris. Garder
une partie du dépôt privée rendrait nos propres releases non conformes et
casserait l'argument de confiance de la [Stratégie de diffusion](/fr/deployment/diffusion_strategy).

### 2.2 Binaires de release

Les binaires publiés sur GitHub Releases (par exemple
`shimera-X.Y.Z-sfml-windows-x64.zip`) sont des distributions d'une œuvre sous GPL.
Chaque archive **doit** contenir :

- `LICENSE` (texte complet de la GPL-3.0) ;
- `AUTHORS.md` ;
- un `README.md` qui pointe vers le tag source exact (par exemple `v0.3.6`) de
  `ShimeraTeam/Shimera`.

Publier le source sur le même projet GitHub, au tag correspondant au binaire,
satisfait l'obligation de mise à disposition du source (GPL-3.0 section 6).

### 2.3 Documentation publique (`ShimeraDocs/public`)

La documentation utilisateur (`userdoc/`) et développeur (`devdoc/`) est
construite et déployée sur GitHub Pages par le workflow `Documentation`, qui ne
construit que `public/`. Elle est ouverte car les utilisateurs en ont besoin pour
adopter la librairie, et les contributeurs pour suivre le flux de contribution
référencé par `CONTRIBUTING.md` (standards de code, workflow git, guide de tests).

Ouvrir la documentation signifie ouvrir aussi ses **sources**, pas seulement le
site généré. Voir la section 4 pour la séparation de dépôt que cela impose.

## 3. Choix de licence par élément

### 3.1 Code et shaders : `GPL-3.0-only`

Justifié dans la [Stratégie de protection juridique](/fr/legal/legal_protection_strategy),
section 4. Chaque fichier source (`.cpp`, `.hpp`, `.h`, `.inl`, `.slang`, `.frag`,
`.vert`) doit commencer par l'en-tête standard :

```cpp
// SPDX-License-Identifier: GPL-3.0-only
//
// Shimera: a simple way to add visual effects without using any GPU knowledge
// Copyright (C) 2025-2026 The Shimera Authors
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, version 3 of the License.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

L'en-tête ne crée pas la licence (le fichier `LICENSE` s'en charge déjà), mais il
garde la licence attachée au fichier quand celui-ci est copié hors du dépôt, ce
qui est exactement ce qui arrive avec les shaders.

### 3.2 Exemples

Les exemples sont sous GPL comme le reste du dépôt. C'est cohérent : tout
programme construit sur Shimera et distribué est déjà soumis à la GPL, donc une
licence plus permissive sur les seuls exemples ne donnerait pas plus de liberté
aux utilisateurs.

### 3.3 Documentation publique : décision à prendre

`ShimeraDocs` n'a actuellement **aucun fichier de licence**. Par défaut, un
contenu sans licence est « tous droits réservés » : on peut le lire, mais pas
légalement le réutiliser, le traduire ou le corriger.

### 3.4 Nom et logo : non licenciés

La GPL couvre le code, pas la marque. Le nom « Shimera », le logo
(`shimera_logo_v2.1.png`) et l'affiche (`affiche.png`) ne sont **pas** placés sous
GPL. Un fork peut réutiliser le code mais ne doit pas se présenter comme le
Shimera officiel (voir [Stratégie de protection juridique](/fr/legal/legal_protection_strategy),
section 7). Si le logo est utilisé dans la documentation publique ou le README,
indiquer à côté qu'il est exclu de la licence de la documentation.

## 4. Ce qui reste privé, et pourquoi

| Élément | Pourquoi il reste privé |
|---|---|
| `ShimeraDocs/private` (ce site) | Stratégie interne : protection juridique, security map (notre propre surface d'attaque), POC, plan d'action, veille technologique. |
| Archive et accusé de dépôt e-Soleau | Preuve d'antériorité : sa valeur vient du fait qu'elle est scellée et conservée par nous. Seuls son existence et sa date sont mentionnées. |
| `plan_d_action_shimera.pdf` et livrables scolaires | Documents de planification internes, sans utilité pour les utilisateurs. |
| Secrets CI, tokens, configuration du runner self-hosted | Sécurité. Jamais dans aucun dépôt, public ou privé. |
| Conditions commerciales (futur dual-license) | Information commerciale, à rédiger seulement si le dual-licensing est activé. |

::: warning Docs privées et publiques partagent un seul dépôt
`private/` et `public/` sont deux dossiers du **même** dépôt Git `ShimeraDocs`.
Le déploiement ne publie que `public/`, mais rendre le dépôt public exposerait
`private/` **et tout son historique Git**. Pour ouvrir les sources de la
documentation, déplacer `public/` (avec le workflow `Documentation`) dans son
propre dépôt public et garder `ShimeraDocs` privé. À noter aussi : GitHub Pages
sur un dépôt privé nécessite un plan GitHub payant.
:::

## 5. Composants tiers

Shimera n'embarque aucun code source tiers : toutes les dépendances sont
récupérées par xmake au build (`add_requires`). Les archives de release ne
contiennent que la librairie statique ou partagée de Shimera et ses headers.
Toutes les dépendances sont compatibles avec la GPL-3.0.

| Composant | Version | Usage | Licence | Compatible GPL-3.0 |
|---|---|---|---|---|
| GLEW | 2.2.0 | Exécution (lié) | BSD modifiée + MIT | Oui |
| GLM | 1.0.1 | Exécution (header-only) | MIT | Oui |
| GLFW | 3.4 | Exemples / hôte GLFW | zlib | Oui |
| SFML | 3.0.1 | Hôte SFML (optionnel) | zlib | Oui |
| raylib | 5.5 | Hôte raylib (optionnel) | zlib | Oui |
| SDL3, SDL_image | non figée | Hôte SDL (optionnel) | zlib | Oui |
| SPIRV-Cross | 1.3.268 | Build uniquement | Apache-2.0 | Oui (avec la GPL-3.0) |
| Compilateur Slang (`slangc`) | installé par l'utilisateur | Build uniquement | Apache-2.0 avec exception LLVM | Oui |

Règles :

- Si une future release **embarque** une dépendance (par exemple des DLL GLEW
  dans une archive Windows), ajouter un `THIRD_PARTY_NOTICES.md` avec le texte de
  licence de chaque composant embarqué.
- **Ne jamais importer de code ou de shader depuis une source à licence
  incompatible.** Pièges courants en graphisme : Shadertoy (CC BY-NC-SA 3.0 par
  défaut, incompatible GPL), le code de LearnOpenGL (CC BY-NC 4.0, incompatible
  GPL), des extraits de blog sans licence. Réimplémenter à partir de la technique
  ou de la publication d'origine, et la citer en commentaire.

## 6. Checklist avant publication

Avant chaque release ou déploiement de documentation :

- [ ] Chaque fichier source a l'en-tête `SPDX-License-Identifier: GPL-3.0-only`.
- [ ] `LICENSE`, `AUTHORS.md`, `README.md` sont présents à la racine et dans l'archive de release.
- [ ] `AUTHORS.md` liste chaque contributeur dont le travail est mergé.
- [ ] Aucun code ou shader tiers à licence incompatible ou inconnue (section 5).
- [ ] Aucun secret, token, document interne ou élément e-Soleau dans l'arborescence publique ou son historique.
- [ ] Rien de `ShimeraDocs/private` copié dans un dépôt public.
- [ ] Le tag de release correspond aux binaires publiés (disponibilité du source).

## Conclusion

Shimera ouvre **l'intégralité du dépôt de la librairie** (code, shaders, exemples,
scripts de build, historique), **ses binaires** et **sa documentation publique** :
tout ce dont on a besoin pour utiliser, comprendre et améliorer la librairie. Il
garde **sa documentation interne, ses preuves, sa marque et son
infrastructure** privées. La partie ouverte est protégée par la GPL-3.0-only ; la
partie privée est ce qui permet à l'équipe de prouver la paternité, défendre le
nom, et conserver les options de licence futures décrites dans la
[Stratégie de protection juridique](/fr/legal/legal_protection_strategy).
