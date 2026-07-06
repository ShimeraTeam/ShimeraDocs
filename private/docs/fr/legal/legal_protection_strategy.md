# Stratégie de protection juridique de Shimera

Ce document décrit comment Shimera protège ses auteurs, son code et ses options
de licence futures. Il complète la [Stratégie de diffusion](/fr/deployment/diffusion_strategy),
qui couvre le modèle de distribution open source, et s'appuie sur les mêmes
fondations juridiques déclarées dans le dépôt Shimera : `LICENSE` (`GPL-3.0-only`),
`AUTHORS.md` et `CONTRIBUTING.md`.

Shimera est développé et distribué ouvertement. Être open source ne
signifie **pas** renoncer à la protection : cela signifie choisir quels droits
conserver, lesquels concéder, et comment prouver la paternité. Cette stratégie
rend ces choix explicites.

## 1. Ce que nous protégeons, et contre quoi

| Actif | Menace | Instrument principal |
|---|---|---|
| **Paternité** (qui a écrit le code) | Un tiers revendiquant le code ou l'idée comme siens | Droit d'auteur automatique + antériorité prouvable (e-Soleau, historique Git, Software Heritage) |
| **Antériorité** (nous avons créé en premier, à une date connue) | Un tiers prétendant à une création antérieure, ou contestant la nôtre | Preuves datées et scellées : dépôt e-Soleau, historique Git public horodaté, archivage indépendant |
| **Intégrité de la licence** (le copyleft est respecté) | Un tiers distribuant un dérivé fermé de Shimera | Copyleft GPL-3.0-only + mise en application (résiliation, section 8) |
| **Capacité de relicenciement** (futur dual-license / MPL) | Perdre le contrôle du droit d'auteur des contributeurs, bloquant tout changement de licence | Cession de droits par les contributions consolidant le relicenciement chez les mainteneurs |
| **Le nom « Shimera »** | Fork hostile se présentant comme le projet officiel, confusion de marque | Usage public constant, première utilisation documentée, dépôt de marque optionnel |

## 2. Modèle de protection en couches

Aucun instrument unique ne protège un projet logiciel. Shimera empile cinq
couches, chacune couvrant ce que les autres ne couvrent pas :

1. **Le droit d'auteur** naît automatiquement à la création, sans formalité.
2. **La licence GPL-3.0-only** transforme ce droit en bouclier actif via le copyleft.
3. **La gouvernance des contributions** consolide le droit de relicencier chez les mainteneurs.
4. **Les preuves d'antériorité** (e-Soleau, historique Git, archivage indépendant) permettent de *prouver* la paternité et la date en cas de contestation.
5. **La protection de la marque** couvre ce que la licence ne couvre pas : le nom du projet.

La suite du document détaille chaque couche.

## 3. Droit d'auteur et paternité

- Le droit d'auteur existe dès l'écriture du code, sans enregistrement.
  Les dépôts et enregistrements ne *créent* pas le droit, ils aident à le **prouver**.
- Le droit d'auteur de Shimera est détenu collectivement par **The Shimera
  Authors**. Comme l'indique `AUTHORS.md`,
  **chaque auteur conserve le droit d'auteur sur ses propres contributions**, et
  chaque fichier source porte la mention `Copyright (C) 2025-2026 The Shimera
  Authors` avec un en-tête `SPDX-License-Identifier: GPL-3.0-only`.
- Deux rôles sont séparés volontairement : le **droit d'auteur** est détenu par
  tous les auteurs, tandis que le **droit de relicencier l'ensemble du projet**
  est concédé aux **mainteneurs** uniquement (Léo Maurel, Paul Arbez, Eddy Gardes).
  Cette séparation est ce qui rend un futur changement de licence possible sans
  devoir retrouver chaque ancien contributeur.

## 4. La licence comme protection (GPL-3.0-only)

La GPL-3.0-only n'est pas qu'un choix de distribution, c'est le principal
bouclier juridique :

- **Le copyleft dissuade l'appropriation propriétaire.** Quiconque distribue une
  œuvre fondée sur Shimera doit publier le code source correspondant sous GPL. Un
  studio ne peut pas intégrer Shimera dans un produit fermé en gardant le secret.
  Cela atténue directement le risque de « vol d'idée/de code sans contribution »
  relevé dans la [Stratégie de diffusion](/fr/deployment/diffusion_strategy).
- **`only`, et non `or later`, est délibéré.** Figer la version garde la
  trajectoire de licence sous contrôle des mainteneurs plutôt que de la déléguer
  aux futures versions de la FSF, et s'articule proprement avec la cession de
  droits de la section 6.
- **Levier de mise en application.** Selon la section 8 de la GPL-3.0, les droits
  d'un contrevenant s'éteignent automatiquement en cas de violation, avec une
  fenêtre de régularisation définie (rétablissement si la violation cesse, et
  définitif si régularisé dans les 30 jours suivant la première notification).
  Cela nous donne une voie concrète et graduée pour réagir (voir section 8).
- **Trajectoire future.** Le projet pourra évoluer vers un modèle dual
  (GPL-3.0 + licence commerciale payante) ou vers une licence plus permissive
  comme la MPL-2.0, si une demande commerciale fermée apparaît. Ce n'est possible
  que parce que la cession de droits par les contributions (section 6) conserve le
  relicenciement chez les mainteneurs.

## 5. Preuve d'antériorité et de paternité

Le droit d'auteur est automatique, mais en cas de litige la charge nous incombe
de **prouver** que nous avons écrit ce que nous avons écrit, et *quand*. Shimera
s'appuie sur trois preuves complémentaires, afin qu'aucune faiblesse isolée
(juridiction, falsifiabilité, longévité) ne fasse tomber le dossier.

### 5.1 Dépôt e-Soleau (INPI)

Nous avons déposé une **enveloppe e-Soleau** auprès de l'INPI (Institut national
de la propriété industrielle).

- **Ce que c'est :** le successeur numérique de l'« enveloppe Soleau » papier.
  Elle scelle et horodate le contenu déposé et lui confère une *date certaine*,
  attestant que nous détenions ce contenu exact à cette date.
- **Ce que ce n'est pas :** c'est un **moyen de preuve, pas un titre de propriété
  intellectuelle**. Elle ne confère aucun monopole et ne crée aucun droit par
  elle-même : le droit d'auteur existe déjà. Elle rend simplement la paternité et
  l'antériorité bien plus faciles à établir devant un tribunal.
- **Portée géographique :** son cadre et sa force probante la plus élevée sont
  **en France** (INPI, juridictions françaises). À l'étranger, elle n'est qu'un
  élément daté parmi d'autres, ce qui est précisément pourquoi l'historique Git et
  l'archivage indépendant ci-dessous fournissent le complément visible à l'international.
- **Limites pratiques :** le dépôt est limité en taille et conservé par l'INPI
  pour une durée déterminée (5 ans), **renouvelable**. S'il n'est pas renouvelé,
  la preuve scellée expire. Un rappel de renouvellement doit être suivi (voir le
  plan d'action).

> **Notre dépôt**
> - Date de dépôt : `19/06/2026`
> - Renouvellement dû le : `19/06/2031`
> - Contenu déposé : `Une archive ZIP contenant l'intégralité du code source de Shimera et un PDF expliquant le projet.`

### 5.2 Historique Git / GitHub public

Le dépôt public est un enregistrement continu et horodaté de qui a écrit quoi, et
quand.

- Chaque commit est horodaté et attribué ; les releases et tags marquent les jalons.
- Le dépôt public a de nombreux témoins tiers (clones, forks, stars), ce qui rend
  difficile de faire passer un historique alternatif fabriqué.
- **Faiblesse :** l'historique Git peut être réécrit localement, et les dates de
  commit sont contrôlées par l'auteur. L'historique brut seul est une preuve plus
  faible qu'un horodatage indépendant.
- **Mitigations :** activer les **commits et tags signés (GPG/SSH)** pour les
  mainteneurs, publier des **releases signées et versionnées**, et s'appuyer sur
  l'archivage indépendant ci-dessous pour ancrer les dates hors de notre contrôle.

### 5.3 Archivage indépendant (prévu)

Pour donner à l'historique Git un ancrage que **personne dans l'équipe ne
contrôle** :

- **Software Heritage** archive les dépôts publics et délivre un identifiant
  permanent et citable (SWHID) avec un horodatage indépendant. C'est une preuve
  d'antériorité forte et reconnue à l'international, que nous prévoyons de mettre
  en place pour le dépôt.
- **OpenTimestamps** (ou équivalent) peut horodater cryptographiquement un hash de
  la base de code sur une blockchain publique, donnant une date gratuite et
  vérifiable à l'international pour le contenu exact, en complément de l'e-Soleau
  centré sur la France.

### Chaîne d'antériorité combinée

| Preuve | Ce qu'elle établit | Force | Géographie | Entretien |
|---|---|---|---|---|
| e-Soleau (INPI) | Contenu + date certaine, scellés par une autorité publique | Élevée devant les juridictions françaises | Centrée France | Renouveler tous les 5 ans |
| Historique Git public | Enregistrement continu de la paternité, jalons | Moyenne aujourd'hui, plus forte une fois les commits signés | International | Signer commits/tags (prévu), publier des releases |
| Software Heritage / OpenTimestamps | Horodatage indépendant et résistant à la falsification | Élevée, tierce | International | Mise en place unique, ré-archiver aux jalons |

Ensemble, ces preuves couvrent les trois modes de défaillance : l'e-Soleau couvre
la France avec la force formelle la plus élevée, l'historique Git public fournit le
récit continu (renforcé une fois les commits signés), et l'archivage indépendant
apporte l'ancrage international résistant à la falsification.

## 6. Gouvernance des contributions (droits entrants)

La capacité de relicencier plus tard dépend entièrement de la sécurisation des
droits entrants auprès de chaque contributeur.

- **CONTRIBUTING.md agit déjà comme un CLA léger.** En soumettant une
  contribution, un contributeur certifie qu'il a le droit de la soumettre, la
  fournit sous GPL-3.0, et concède aux mainteneurs une licence perpétuelle,
  mondiale, non exclusive, gratuite et irrévocable **incluant le droit de
  relicencier** l'ensemble du projet sous toute licence future, ouverte ou propriétaire.
- **La cession est non exclusive :** les contributeurs conservent l'intégralité du
  droit d'auteur sur leur propre travail. C'est délibérément plus accueillant
  qu'une cession de droits d'auteur à la FSF, tout en préservant la liberté des
  mainteneurs de dual-licencier.
- **Renforcements que nous prévoyons de mettre en place :**
  - Exiger une ligne `Signed-off-by` (Developer Certificate of Origin) sur les
    commits, afin que l'acceptation des termes soit enregistrée par contribution.
  - Conserver l'historique des PR/merges comme preuve durable que chaque
    contributeur a accepté les termes de CONTRIBUTING.md en vigueur au moment du merge.
  - Si une contribution est substantielle ou provient d'un auteur salarié/affilié,
    envisager un CLA écrit explicite ou une renonciation de droits de l'employeur
    avant le merge, pour lever toute ambiguïté.

## 7. Protection de la marque et du nom

La GPL couvre le **code**, pas le **nom**. « Shimera » est un actif distinct :

- Un fork hostile est juridiquement libre de réutiliser le code (c'est le copyleft
  qui fonctionne comme prévu), mais ne devrait pas être libre de se présenter
  comme *le Shimera officiel*.
- **Base défensive (maintenant) :** utiliser le nom de façon constante dans le
  dépôt, la doc et les releases, garder l'organisation GitHub `ShimeraTeam` comme
  foyer canonique, et documenter la date de première utilisation publique.
- **Envisagé (si la traction augmente) :** déposer « Shimera » (marque verbale,
  et logo le cas échéant) comme marque auprès de l'INPI, ce qui donnerait un droit
  opposable contre la confusion de marque que la GPL ne peut pas fournir. Cela
  reprend la mitigation déjà signalée dans la [Stratégie de diffusion](/fr/deployment/diffusion_strategy).

## 8. Mise en application et réponse aux incidents

| Scénario | Réponse |
|---|---|
| **Violation de la GPL** (dérivé fermé, sources manquantes) | Documenter la violation avec des preuves datées, contacter la partie, exiger la conformité. Selon la section 8 de la GPL-3.0, ses droits sont déjà éteints ; proposer la fenêtre de régularisation définie avant d'escalader. |
| **Plagiat / copie sans crédit** | Faire valoir le droit d'auteur et l'antériorité via la chaîne de preuves combinée (e-Soleau + historique Git public + Software Heritage). Le dépôt daté est décisif ici. |
| **Fork hostile se prétendant officiel** | S'appuyer sur la constance de la marque et, si déposée, sur le droit de marque ; garder Shimera comme implémentation de référence active (releases régulières). |
| **Faille de sécurité divulguée publiquement** | Suivre le processus de divulgation responsable référencé dans la [Stratégie de diffusion](/fr/deployment/diffusion_strategy) ; un bug divulgué est un point de maintenance, pas une exposition juridique. |

## 9. Risques spécifiquement juridiques

| Risque | Description | Mitigation |
|---|---|---|
| **Paternité non prouvable en litige** | Le droit d'auteur est automatique mais doit être prouvé ; une preuve faible perd le procès. | La chaîne de preuves à trois couches de la section 5 ; la tenir à jour. |
| **Expiration de l'e-Soleau** | Le dépôt n'est conservé que pour une durée déterminée et renouvelable. | Suivre la date de renouvellement dans le plan d'action ; l'archivage indépendant est un filet permanent. |
| **Droit d'auteur fragmenté bloquant le relicenciement** | Un seul contributeur n'ayant pas cédé les droits de relicenciement peut bloquer un futur dual-license. | Appliquer la cession de CONTRIBUTING.md + le DCO à chaque merge ; enregistrer l'accord par contribution. |
| **Détournement de marque** | Le nom n'est pas couvert par la licence. | Usage défensif maintenant, dépôt de marque INPI optionnel plus tard. |
| **Reconnaissance internationale limitée de l'e-Soleau** | Sa force est la plus élevée en France. | Software Heritage / OpenTimestamps fournissent l'ancrage vérifiable à l'international. |

## 10. Plan d'action

- [ ] Activer les commits et tags signés (GPG/SSH) pour tous les mainteneurs.
- [ ] Archiver le dépôt sur **Software Heritage** et noter le SWHID.
- [ ] Optionnellement, horodater un hash du dépôt avec **OpenTimestamps** à chaque release.
- [ ] Maintenir `AUTHORS.md` à jour à mesure que des contributeurs sont ajoutés.
- [ ] Ajouter une exigence `Signed-off-by` (DCO) au flux de contribution.
- [ ] Décider s'il faut déposer « Shimera » comme marque auprès de l'INPI.

## Conclusion

La protection juridique de Shimera ne vient pas d'un acte unique mais d'un
**empilement** : le droit d'auteur automatique, activé par le copyleft
GPL-3.0-only, soutenu par une gouvernance des contributions qui préserve la
liberté des mainteneurs de relicencier, et rendu opposable par une preuve
d'antériorité en trois volets. Le dépôt **e-Soleau** donne la preuve formelle la
plus forte en France ; l'**historique Git public** fournit l'enregistrement
continu de la paternité (à renforcer en signant les commits) ; et l'**archivage
indépendant** (Software Heritage,
OpenTimestamps) apporte l'ancrage international résistant à la falsification.
Maintenus ensemble, et renouvelés, ces éléments permettent à Shimera de rester
pleinement ouvert aujourd'hui tout en protégeant ses auteurs et en gardant chaque
option de licence future ouverte.
