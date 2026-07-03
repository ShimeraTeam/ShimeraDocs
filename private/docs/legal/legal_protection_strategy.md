# Shimera Legal Protection Strategy

This document describes how Shimera protects its authors, its code, and its
future licensing options. It complements the [Diffusion Strategy](/deployment/diffusion_strategy),
which covers the open-source distribution model, and relies on the same legal
foundations declared in the Shimera repository: `LICENSE` (`GPL-3.0-only`),
`AUTHORS.md`, and `CONTRIBUTING.md`.

Shimera is developed and distributed openly. Being open source does
**not** mean giving up protection: it means choosing which rights to keep, which
to grant, and how to prove authorship. This strategy makes those choices explicit.

## 1. What we protect and against what

| Asset | Threat | Primary instrument |
|---|---|---|
| **Authorship / paternity** (who wrote it) | Someone claiming the code or the idea as their own | Automatic copyright + provable anteriority (e-Soleau, Git history, Software Heritage) |
| **Anteriority** (we created it first, at a known date) | A later party claiming prior creation, or contesting ours | Dated, sealed proofs: e-Soleau deposit, timestamped public Git history, independent archival |
| **License integrity** (copyleft is respected) | A third party shipping a closed derivative of Shimera | GPL-3.0-only copyleft + enforcement (section 8 termination) |
| **Relicensing capability** (future dual-license / MPL) | Losing control of contributor copyright, blocking any license change | Contribution grant consolidating relicensing rights to the maintainers |
| **The "Shimera" name** | Hostile fork claiming to be the official project, brand confusion | Consistent public use, documented first use, optional trademark registration |

## 2. Layered protection model

No single instrument protects a software project. Shimera stacks five layers,
each covering what the others do not:

1. **Copyright** arises automatically at creation, with no formality.
2. **The GPL-3.0-only license** turns that copyright into an active shield through copyleft.
3. **Contribution governance** consolidates the right to relicense in the maintainers.
4. **Anteriority proofs** (e-Soleau, Git history, independent archival) let us *prove* authorship and date if challenged.
5. **Brand protection** covers what the license does not: the project name.

The rest of this document details each layer.

## 3. Copyright and authorship

- Copyright exists from the moment the code is written, without registration.
  Registration and deposits do not *create* the right, they help **prove** it.
- Shimera's copyright is held collectively by **The Shimera Authors**. As stated
  in `AUTHORS.md`,
  **each author keeps the copyright to their own contributions**, and every source
  file carries the `Copyright (C) 2025-2026 The Shimera Authors` notice with an
  `SPDX-License-Identifier: GPL-3.0-only` header.
- Two roles are separated on purpose: **copyright** is held by all authors, while
  the **right to relicense the whole project** is granted to the **maintainers**
  only (Léo Maurel, Paul Arbez, Eddy Gardes). This separation is what keeps a
  future license change possible without hunting down every past contributor.

## 4. The license as protection (GPL-3.0-only)

The GPL-3.0-only is not only a distribution choice, it is the main legal shield:

- **Copyleft deters proprietary appropriation.** Anyone who distributes a work
  based on Shimera must release the corresponding source under the GPL. A studio
  cannot fold Shimera into a closed product and keep it secret. This directly
  mitigates the "idea/code theft without contribution" risk noted in the
  [Diffusion Strategy](/deployment/diffusion_strategy).
- **`only`, not `or later`, is deliberate.** Pinning the version keeps the
  license trajectory under maintainer control rather than delegating it to future
  FSF versions, and pairs cleanly with the relicensing grant in section 6.
- **Enforcement lever.** Under GPL-3.0 section 8, a violator's rights terminate
  automatically on breach, with a defined cure window (reinstatement if the
  violation stops, and permanently if cured within 30 days of first notice). This
  gives us a concrete, staged path to react to non-compliance (see section 8).
- **Future trajectory.** The project may later move to a dual model
  (GPL-3.0 + a paid commercial license) or to a more permissive open license such
  as MPL-2.0, if closed commercial demand appears. This is only possible because
  the contributor grant (section 6) keeps relicensing rights with the maintainers.

## 5. Proof of anteriority and authorship

Copyright is automatic, but in a dispute the burden is on us to **prove** we
wrote what we wrote, and *when*. Shimera relies on three complementary proofs, so
that no single weakness (jurisdiction, tamperability, longevity) sinks the case.

### 5.1 e-Soleau deposit (INPI)

We have filed an **e-Soleau envelope** with the INPI (Institut national de la
propriété industrielle).

- **What it is:** the digital successor of the paper "enveloppe Soleau". It seals
  and timestamps the deposited content and gives it a *date certaine* (a legally
  reliable date), attesting that we held that exact content on that date.
- **What it is not:** it is a **means of proof, not a title of intellectual
  property**. It grants no monopoly and creates no right by itself: copyright
  already exists. It simply makes authorship and anteriority far easier to
  establish before a court.
- **Geographic scope:** its framework and strongest evidentiary weight are **in
  France** (INPI, French courts). Abroad it is one dated piece of evidence among
  others, which is exactly why the Git history and independent archival below
  provide the internationally visible complement.
- **Practical limits:** the deposit is size-limited and stored by INPI for a
  fixed term (5 years), **renewable**. If it is not renewed, the sealed proof
  lapses. A renewal reminder must be tracked (see the action plan).

> **Our deposit**
> - Deposit date: `19/06/2026`
> - Renewal due: `19/06/2031`
> - Deposited content: `A ZIP archive containing the full Shimera source code and a PDF explaining the project.`

### 5.2 Public Git / GitHub history

The public repository is a continuous, timestamped record of who wrote what and
when.

- Every commit is timestamped and attributed; releases and tags mark milestones.
- The public repository has many third-party witnesses (clones, forks, stars),
  which makes a fabricated alternate history hard to pass off.
- **Weakness:** Git history can be rewritten locally, and commit dates are
  author-controlled. Raw history alone is weaker evidence than an independent
  timestamp.
- **Mitigations:** enable **GPG/SSH-signed commits and signed tags** for the
  maintainers, cut **signed, versioned releases**, and rely on the independent
  archival below to anchor dates outside our own control.

### 5.3 Independent archival (planned)

To give the Git history an anchor **no one on the team controls**:

- **Software Heritage** archives public repositories and issues a permanent,
  citable identifier (SWHID) with an independent timestamp. This is a strong,
  internationally recognized anteriority proof that we plan to set up for the repo.
- **OpenTimestamps** (or an equivalent) can cryptographically timestamp a hash of
  the codebase against a public blockchain, giving a free, internationally
  verifiable date for the exact content, complementary to the France-centric
  e-Soleau.

### Combined anteriority chain

| Proof | What it establishes | Strength | Geography | Upkeep |
|---|---|---|---|---|
| e-Soleau (INPI) | Content + certain date, sealed by a public authority | High before French courts | France-centric | Renew every 5 years |
| Public Git history | Continuous authorship record, milestones | Medium now, stronger once commits are signed | International | Sign commits/tags (planned), cut releases |
| Software Heritage / OpenTimestamps | Independent, tamper-resistant timestamp of the content | High, third-party | International | One-time setup, re-archive on milestones |

Together these cover the three failure modes: e-Soleau covers France with the
strongest formal weight, the public Git history gives the continuous narrative
(stronger once commits are signed), and independent archival provides the
tamper-resistant, international anchor.

## 6. Contribution governance (inbound rights)

The ability to relicense later depends entirely on securing the right inbound
rights from every contributor.

- **CONTRIBUTING.md already acts as a lightweight CLA.** By submitting a
  contribution, a contributor certifies they have the right to submit it, provides
  it under the GPL-3.0, and grants the maintainers a perpetual, worldwide,
  non-exclusive, royalty-free, irrevocable license **including the right to
  relicense** the whole project under any future license, open or proprietary.
- **The grant is non-exclusive:** contributors keep full copyright to their own
  work. This is deliberately friendlier than an FSF-style copyright assignment,
  while still preserving the maintainers' freedom to dual-license.
- **Hardening measures we plan to add:**
  - Require a `Signed-off-by` line (Developer Certificate of Origin) on commits,
    so acceptance of the terms is recorded per contribution.
  - Keep the PR/merge history as the durable evidence that each contributor agreed
    to the CONTRIBUTING.md terms in force at merge time.
  - If a contribution is substantial or comes from an employed/affiliated author,
    consider requesting an explicit written CLA or employer copyright disclaimer
    to remove any ambiguity before merging.

## 7. Brand and name protection

The GPL covers the **code**, not the **name**. "Shimera" is a distinct asset:

- A hostile fork is legally free to reuse the code (that is copyleft working as
  intended), but should not be free to present itself as *the official Shimera*.
- **Defensive baseline (now):** use the name consistently across the repo, docs,
  and releases, keep the `ShimeraTeam` GitHub organisation as the canonical home,
  and document the date of first public use.
- **Envisaged (if traction grows):** register "Shimera" (word mark, and logo) as a trademark with the INPI, which would give an enforceable right against
  brand confusion that the GPL cannot provide. This mirrors the mitigation already
  flagged in the [Diffusion Strategy](/deployment/diffusion_strategy).

## 8. Enforcement and incident response

| Scenario | Response |
|---|---|
| **GPL violation** (closed derivative, missing source) | Document the violation with dated evidence, contact the party, request compliance. Under GPL-3.0 section 8 their rights are already terminated; offer the defined cure window before escalating. |
| **Plagiarism / uncredited copying** | Assert copyright and anteriority using the combined proof chain (e-Soleau + public Git history + Software Heritage). The dated deposit is decisive here. |
| **Hostile fork claiming to be official** | Rely on brand consistency and, if registered, the trademark; keep Shimera the active reference implementation (regular releases). |
| **Security flaw disclosed publicly** | Follow the responsible-disclosure process referenced in the [Diffusion Strategy](/deployment/diffusion_strategy); a disclosed bug is a maintenance item, not a legal exposure. |

## 9. Legal-specific risks

| Risk | Description | Mitigation |
|---|---|---|
| **Unprovable authorship in a dispute** | Copyright is automatic but must be proven; weak evidence loses cases. | The three-layer proof chain in section 5; keep it current. |
| **e-Soleau lapses** | The deposit is only kept for a fixed, renewable term. | Track the renewal date in the action plan; the independent archival is a permanent backstop. |
| **Fragmented copyright blocks relicensing** | A single contributor who did not grant relicensing rights can block a future dual-license. | Enforce the CONTRIBUTING.md grant + DCO on every merge; record agreement per contribution. |
| **Brand hijack** | The name is not covered by the license. | Defensive use now, optional INPI trademark later. |
| **International recognition gap for e-Soleau** | Its weight is strongest in France. | Software Heritage / OpenTimestamps provide the internationally verifiable anchor. |

## 10. Action plan

- [ ] Enable signed commits and tags (GPG/SSH) for all maintainers.
- [ ] Archive the repository on **Software Heritage** and note the SWHID.
- [ ] Optionally timestamp a repository hash with **OpenTimestamps** on each release.
- [ ] Keep `AUTHORS.md` current as contributors are added.
- [ ] Add a `Signed-off-by` (DCO) requirement to the contribution flow.
- [ ] Decide whether to register "Shimera" as a trademark with the INPI.

## Conclusion

Shimera's legal protection does not come from a single act but from a **stack**:
automatic copyright, activated by the GPL-3.0-only copyleft, backed by contribution
governance that preserves the maintainers' freedom to relicense, and made
enforceable by a three-part proof of anteriority. The **e-Soleau** deposit gives
the strongest formal proof in France; the **public Git history** provides the
continuous authorship record (to be reinforced by signing commits); and
**independent archival** (Software Heritage,
OpenTimestamps) supplies the tamper-resistant, international anchor. Maintained
together, and kept renewed, this lets Shimera stay fully open today while
protecting its authors and keeping every future licensing option on the table.
