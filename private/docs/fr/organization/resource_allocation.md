# Allocation et gestion des ressources

Ce document décrit comment nous répartissons les ressources humaines et matérielles du projet Shimera : qui fait quoi, avec quelles machines, et comment nous affectons ces ressources aux tâches en tenant compte de nos contraintes de disponibilité et de nos priorités.

## 1. Contexte et contraintes de travail

Nous sommes une équipe de trois personnes. Depuis septembre 2025, nous vivons chacun dans un pays différent, à des endroits très éloignés les uns des autres, avec de gros décalages horaires. En parallèle du projet, nous suivons tous les trois une année dans une université étrangère, ce qui ajoute une charge académique concurrente et variable (cours, projets, examens).

Nous avons mis en lumière deux familles de contraintes:

- **Contraintes de disponibilité humaine** : peu de créneaux synchrones communs à cause des fuseaux horaires, et un temps disponible qui fluctue selon le calendrier universitaire de chacun.
- **Contraintes de disponibilité matérielle** : notre unique machine de référence pour les mesures GPU ne nous est mise à disposition par Epitech, sur demande, que deux semaines par mois. Cette fenêtre limitée doit être planifiée et mutualisée sans bloquer le travail quotidien.

Notre principe de base en découle : nous travaillons en **asynchrone d'abord**. Le travail est découpé en tâches courtes et indépendantes, suivies sur un tableau partagé, de façon à ce qu'aucun de nous ne soit bloqué en attendant un autre fuseau horaire.

## 2. Ressources humaines

Nous avons trois rôles principaux. Ce sont nos responsabilités de référence, mais dans la pratique, ayant tout les trois un bon baggage technique, chacun déborde de son intitulé et contribue au code, aux tests et à la documentation.

| Personne | Rôle principal | Responsabilités concrètes sur le projet |
|---|---|---|
| **Léo Maurel** | Chef de projet, directeur technique | Décisions d'architecture, développement des effets et shaders cœur et développement de fonctionnalités.|
| **Paul Arbez** | Responsable organisation | Organisation du projet et de la documentation, stratégie juridique et de licence, projets d'exemple et développement de fonctionnalités. |
| **Eddy Gardes** | DevOps, responsable déploiement et qualité | Chaîne d'intégration et de déploiement continu, installation et maintien du runner GPU self-hosted, infrastructure de tests, publication des releases, hooks pre-commit et qualité de code, mise en place du changelog et  développement de fonctionnalités. |

Nous répartissons les tâches en priorité selon ce socle de rôles et selon l'expertise de chacun, mais nous restons polyvalents : les revues croisées et le fait que tout le monde touche au code, aux tests et à la doc nous évitent les points de blocage quand l'un d'entre nous est moins disponible à cause de l'université.

### 2.1 Identifier les ressources humaines nécessaires

Pour Shimera, identifier les ressources humaines dont le projet a besoin a été une véritable décision : l'équipe pouvait compter trois ou quatre personnes. Nous avons cherché une éventuelle quatrième personne, mais Shimera est un projet de recherche dont la solution n'avait pas encore été trouvée, et nous n'avons trouvé personne d'assez motivé pour s'engager dans cette incertitude. Nous l'avons pris comme un filtre plutôt qu'un frein : un projet aussi exploratoire ne se porte qu'avec des personnes réellement investies, et nous préférions trois personnes pleinement engagées à une quatrième qui ne le serait pas. La vraie question est alors devenue plus précise : à trois, couvrions-nous déjà ce dont le projet a besoin, et pouvions-nous développer le reste nous-mêmes ?

À nous trois, nous couvrions déjà les domaines les plus essentiels du projet, et nos profils se complétaient :

- **Léo** est à l'origine de l'idée de Shimera et avait déjà des bases en création de shaders, le cœur technique de la librairie.
- **Paul** était le plus organisé des trois et n'a aucune difficulté à prendre le lead sur la coordination, ce qui lui a naturellement confié l'organisation du projet et de la documentation. Paul et Léo avaient par ailleurs déjà travaillé ensemble sur des projets graphiques : ils connaissaient leurs façons de travailler et savaient qu'ils formaient un bon binôme.
- **Eddy** n'avait jamais travaillé avec Léo ni Paul auparavant, mais il apportait des compétences DevOps qu'aucun d'eux n'avait, le projet l'intéressait réellement, et nous savions qu'il était fiable et travailleur.

Les rôles se sont donc répartis proprement sur nos trois profils (voir le tableau ci-dessus) : l'architecture et le rendu cœur à Léo, l'organisation du projet et de la documentation à Paul, la CI/CD et l'infrastructure GPU à Eddy. Les compétences qu'aucun de nous ne possédait au départ (exploitation du runner GPU, benchmarking, backends SFML et Raylib, voir 2.2) étaient de celles que nous pouvions développer dans nos cycles de travail plutôt que des manques justifiant un recrutement : nous avons donc traité chacune comme une tâche à part entière, planifiée et acquise pendant le projet.

### 2.2 Les compétences requises par le projet

Les compétences dont nous avons besoin sont dictées par ce qu'est Shimera et par la façon dont nous le construisons : une librairie C++ orientée GPU exposant douze effets configurables sur trois backends (OpenGL, SFML, Raylib) sous Windows et Linux, diffusée en open source et construite par une équipe répartie sur plusieurs fuseaux horaires. Le tableau ci-dessous liste chaque compétence requise, pourquoi le contexte technologique et organisationnel du projet l'exige, et si nous la possédions déjà ou l'avons développée en cours de route.

| Compétence requise | Pourquoi le projet en a besoin | Présente ou développée | Principalement portée par |
|---|---|---|---|
| C++ moderne (C++23) et gestion bas niveau des ressources GPU | La librairie manipule directement buffers, textures et shaders GPU ; la sûreté et la correction en dépendent | Présente, approfondie pendant le projet | Tous |
| Programmation OpenGL et shaders GLSL | Les effets et le pipeline de rendu sont écrits directement en OpenGL et GLSL | Présente, approfondie pendant le projet | Léo |
| Architecture multi-backend et conception d'API publique | Une librairie consommée par des tiers sur trois backends exige une abstraction propre et stable | Présente | Tous |
| Intégration SFML et Raylib | Supporter trois backends de fenêtrage fait partie du cahier des charges | Développée pendant le projet | Tous |
| CI/CD et GitHub Actions | Une diffusion open source exige des builds multiplateformes reproductibles, des tests et des releases versionnées | Présente, approfondie pendant le projet | Eddy |
| Exploitation d'un runner GPU self-hosted | Les runners cloud n'ont pas de GPU ; les tests et benchmarks sur vrai GPU exigent une machine que nous installons et maintenons nous-mêmes | Développée pendant le projet | Eddy |
| Benchmarking de performance (FPS, VRAM, mémoire) | Nous devons mesurer et prouver le faible surcoût de la librairie à l'exécution | Développée pendant le projet | Eddy |
| Gestion juridique et de licence | Diffuser sous GPL tout en laissant chaque auteur conserver le droit d'auteur sur sa contribution exige une stratégie de licence délibérée et documentée | Présente, approfondie pendant le projet | Paul |
| Organisation du projet et gestion d'équipe | Coordonner une équipe de trois répartie et à temps partiel exige de la planification, des cycles d'un mois, une repriorisation en début de cycle, l'affectation des tâches sur GitHub Projects et une documentation bilingue à jour pour livrer la bêta dans les temps | Présente, formalisée pendant le projet | Paul |
| Collaboration distribuée et asynchrone | Travailler à travers de gros décalages horaires impose un workflow git et de revue rigoureux | Présente, formalisée pendant le projet | Tous |

Plutôt que d'ajouter une quatrième personne, nous avons comblé chaque manque de ce tableau en **apprenant sur le projet** : les compétences marquées « développée » (exploitation du runner GPU, benchmarking, backends SFML et Raylib) ont été planifiées comme un travail à part entière et prises en charge par la personne dont elles prolongeaient le rôle. C'est aussi ainsi que nous gardons réalistes les contraintes de **temps et d'effort** du cahier des charges : nous ne nous engageons que sur des fonctionnalités dont nous détenons déjà les compétences requises ou que nous pouvons développer dans un cycle, compte tenu de la disponibilité universitaire fluctuante de chacun.

## 3. Ressources matérielles

### 3.1 Le runner GPU de référence

Notre ressource matérielle centrale est une **machine virtuelle hébergée sur un serveur dédié, équipée d'une carte NVIDIA Quadro RTX 5000**. Nous l'utilisons comme **runner GitHub Actions self-hosted** : elle exécute la suite de tests et les benchmarks sur un vrai GPU, ce que les runners cloud gratuits ne permettent pas.

Cette machine est notre **référence de mesure**. Les résultats de benchmark qu'elle produit (images par seconde, VRAM utilisée par effet, sur les backends OpenGL, SFML et Raylib) sont commités automatiquement et font foi pour comparer les performances dans le temps.

Cette machine ne nous est toutefois accessible que **deux semaines par mois**, sur demande auprès d'Epitech. Cette fenêtre est une contrainte forte : nous y concentrons les tests et les benchmarks qui en dépendent, et nous organisons nos cycles de travail autour d'elle.

### 3.2 Nos postes de développement

Nous disposons chacun d'une machine personnelle équipée d'un GPU :

| Poste | GPU |
|---|---|
| Poste 1 | NVIDIA RTX 5060 |
| Poste 2 | NVIDIA RTX 4070 (portable) |
| Poste 3 | NVIDIA RTX 5060 (portable) |

Ces postes servent au développement au quotidien : écriture du code, itération rapide sur les shaders, validation visuelle des effets et mesures locales. Ces mesures locales restent secondaires et sont toujours comparées à celles du runner de référence, qui reste la seule base de comparaison stable entre nos configurations.

### 3.3 Les runners cloud

Pour tout ce qui ne demande pas de GPU dédié, nous nous appuyons sur les **runners hébergés par GitHub** (`ubuntu-latest`, `windows-latest`). Ils prennent en charge la compilation multiplateforme (Linux et Windows, statique et partagé, sur les trois backends) et la production des binaires de release. Cela nous évite de faire tourner ces tâches lourdes et parallélisables sur nos propres machines.

### 3.4 Les outils de collaboration

Étant répartis sur plusieurs fuseaux horaires, notre outillage de coordination est une ressource à part entière :

| Outil | Usage |
|---|---|
| **GitHub** | Hébergement du code, issues, pull requests et revues, automatisation via GitHub Actions. |
| **GitHub Projects** | Backlog et tableau de suivi des tâches : c'est là que nous visualisons la charge, l'avancement et l'affectation de chaque tâche. |
| **Discord** et **Teams** | Communication au quotidien, en asynchrone comme en synchrone lorsque nos créneaux se croisent. |
| **Google Drive** | Documents partagés et stockage des fichiers communs. |

## 4. Affectation des ressources aux tâches

### 4.1 Cycles de travail

Nous organisons le travail en cycles. Nous avons d'abord fonctionné en cycles de deux semaines, mais ce rythme s'est révélé trop court pour livrer un incrément cohérent entre deux points. Nous sommes donc passés à des **cycles d'un mois**.

Au début de chaque cycle, nous tenons une **réunion** pour remettre les priorités à plat et planifier le cycle suivant : nous choisissons les tâches à réaliser, nous les estimons et nous les répartissons. Ce rythme mensuel s'aligne sur la fenêtre de deux semaines durant laquelle le runner GPU est disponible, ce qui nous permet de placer les tâches de tests et de benchmarks au bon moment du cycle.

### 4.2 Affecter les personnes

Nous affectons chaque tâche à la personne dont le rôle et l'expertise correspondent le mieux, tout en tenant compte des priorités et de la charge :

- **Priorités internes** : les priorités fixées lors de la réunion de début de cycle. L'objectif qui structure le cycle courant est la livraison de la **bêta, le 7 juillet 2026**, qui regroupe vingt-cinq fonctionnalités (douze effets de shader configurables) sur les trois backends OpenGL, SFML et Raylib, sous Windows et Linux.
- **Priorités externes** : le calendrier universitaire de chacun. En période d'examens ou de rendus, nous réduisons la charge de la personne concernée et redistribuons les tâches critiques vers celle qui est la plus disponible.
- **Estimation de la charge** : chaque tâche est décrite dans une issue et placée sur le tableau GitHub Projects, ce qui nous donne une vue partagée de la charge estimée et évite de surcharger quelqu'un.

### 4.3 Affecter les machines

Chaque type de tâche est dirigé vers la ressource matérielle la plus adaptée, afin d'utiliser au mieux le runner de référence qui est notre ressource la plus rare :

| Tâche | Ressource affectée | Justification |
|---|---|---|
| Benchmarks et mesures de performance faisant référence | Runner GPU de référence (Quadro RTX 5000) | Seule machine à la configuration stable et connue ; garantit des mesures reproductibles et comparables dans le temps. |
| Tests GPU automatisés en intégration continue | Runner GPU de référence | Nécessite un vrai GPU et un affichage, indisponibles sur les runners cloud. |
| Développement, itération sur les shaders, validation visuelle | Postes de développement (RTX 5060 / 4070 / 5060 portables) | Disponibles en local et immédiatement, sans mettre la référence en attente. |
| Compilation multiplateforme et binaires de release | Runners cloud GitHub (Linux / Windows) | Tâches parallélisables et sans besoin de GPU dédié ; libèrent nos machines. |

Comme le runner de référence n'est disponible que deux semaines par mois, nous regroupons sur cette fenêtre les tests et les benchmarks qui en dépendent. Le reste du mois, le développement et la validation se font sur nos postes locaux, ce qui garantit que cette ressource rare n'est jamais un point de blocage au quotidien.

### 4.4 Respecter les contraintes dans la planification

Notre planification est conçue pour absorber nos contraintes de disponibilité :

- **Découpage asynchrone** : des tâches courtes et indépendantes, une stratégie de branches conventionnelle (`feat/`, `fix/`, `chore/`, etc.) et des pull requests relues, pour que le travail avance sans dépendre d'un créneau commun.
- **Mutualisation du runner de référence** : les exécutions GPU passent par la file d'attente de l'intégration continue, sur la fenêtre de deux semaines où le runner est disponible. Nous ne dépendons pas de cette machine unique pour le développement courant, qui se fait sur nos postes locaux.
- **Repriorisation par cycle** : la réunion de début de cycle est le moment où nous réajustons les priorités selon l'avancement réel et la disponibilité de chacun. Si un retard s'accumule, par exemple à cause d'une période d'examens, les tâches les moins critiques sont repoussées au cycle suivant plutôt que de décaler la livraison prévue.

## Conclusion

Nos ressources se répartissent en trois familles : les personnes (trois rôles complémentaires mais polyvalents), les machines (un runner GPU de référence, nos postes de développement et les runners cloud) et l'outillage de collaboration (GitHub, GitHub Projects, Discord, Teams, Google Drive). Nous les affectons aux tâches par cycles d'un mois, dont les priorités sont fixées en réunion de début de cycle, en fonction du rôle, de l'expertise, des priorités internes et externes et de la charge estimée. L'ensemble est pensé pour respecter nos deux grandes contraintes : la disponibilité humaine limitée et décalée par les fuseaux horaires et l'université, et la disponibilité de notre unique machine de référence, accessible deux semaines par mois, que nous mutualisons sans bloquer le travail quotidien.
