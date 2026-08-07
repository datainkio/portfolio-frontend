---
title: "Spec: Home Page Template"
description: "Composition and data-flow spec for the site home page (route /)."
docType: "reference"
status: "draft"
owner: "frontend"
tags:
  - home
  - eleventy
  - nunjucks
  - sanity
  - choreography
  - spec
  - view
permalink: false
aliases:
  - "Home Page Spec"
  - "Home View Spec"
aix:
  intent: "view-spec"
  audience:
    - frontend
    - content
  canonical: true
---

# Spec: Home Page Template

- **Status:** draft
- **Scope:** The single routed home page at `/` (Sanity `home` singleton + featured collections)
- **Template:** [home.njk](../../views/pages/home/home.njk) · **Sidecar:** [home.md](../../views/pages/home/home.md)
- **Routed by:** `ia/index.md` (`layout: pages/home/home.njk`, `permalink: /`)
- **Related:** [card.views-spec.md](./card.views-spec.md), [project-page.views-spec.md](./project-page.views-spec.md)

## Feature

A single Nunjucks template renders the site home page as a **standalone HTML document** — it emits its own `<!DOCTYPE html>`, `<head>`, and `<body>` rather than `extends base.njk`. This is deliberate: the home page owns its critical path for LCP control and preloader/choreography gating, which a shared base layout would obscure.

The routed page is `ia/index.md`. Eleventy's input dir is `ia/` and its includes dir is `../views`; the home page is therefore a thin frontmatter file whose `layout` points at `views/pages/home/home.njk`. Content is not authored in the template — it is projected from the Sanity `home` singleton and mapped into the page via `eleventyComputed`.

### Data flow

```
Sanity ──┐
         │  GROQ (homeQuery, data/sanity/queries/home.js)
         ▼
data/sanity/transforms/home.js  (normalizeLandingRecords)
         │  → valuePropBodyHtml, workBodyHtml, featuredProjects[].url
         ▼
Eleventy Sanity collections  (eleventy/collections/sanity.js)
         │  exposes cms.home[0] + collections.home / collections.awards /
         │  collections.organizations / collections.siteSettings
         ▼
ia/index.md  (eleventyComputed maps cms.home[0] → value / recognition / work / hero / title)
         ▼
views/pages/home/home.njk  (composes section macros in <main>)
```

`cms.home[0]` (used in `ia/index.md` frontmatter) and `collections.home[0]` (used inside the template) are two access paths to the same Sanity `home` singleton.

### Routing

- Source: Sanity `home` singleton (`*[_type == "home"] | order(_updatedAt desc)[0]`)
- Permalink: `/` (set in `ia/index.md`)
- Canonical: `https://dataink.io`
- Pagination: none (singleton page)

## Composition

The template imports section macros and renders them, in order, inside a single `<main id="page-main" aria-busy="true">`. `aria-busy` is set true until choreography boots (`director:ready` → `preloader:out`). Order is authored in `home.njk`, **not** derivable from the stale `skipLinks` frontmatter.

| Order | Region        | Macro / import                                  | `id`            | Key inputs                                              |
| ----- | ------------- | ----------------------------------------------- | --------------- | ------------------------------------------------------ |
| —     | Skip links    | `organisms/navigation/skip-links-nav.njk`       | —               | (no params)                                            |
| —     | Section cap   | `molecules/section-cap.njk`                     | —               | `title: "renderizoring..."` (render-state placeholder) |
| 1     | Landing/hero  | `organisms/header/home/home-landing.njk`        | (landing)       | `svg: logo`                                             |
| 2     | Bio/manifesto | `organisms/section/bio.njk`                     | `manifesto`     | `copy: value`                                           |
| 3     | Process       | `organisms/section/process.njk`                 | `process`       | `uiComponents: true` (ui-components-loop coverflow)     |
| 4     | Work          | `organisms/section/work.njk`                    | `work`          | `copy: work`, `projects: projects`                     |
| 5     | Organizations | `organisms/section/organizations.njk`           | `organizations` | `copy: organizationsCopy`, `organizations`             |
| 6     | Recognition   | `organisms/section/awards.njk`                  | `recognition`   | `copy: recognition`, `awards`                          |
| 7     | Contact       | `organisms/section/contact.njk`                 | `contact`       | `copy: contact`, `contact: contactInfo`                |
| —     | Footer        | `organisms/footer/global-footer.njk`            | —               | `contact: false` (rendered outside `<main>`)           |
| —     | Choreography  | `templates/partials/choreography-script.njk`    | —               | module bundle (gated boot)                              |

Head/body partials included directly: `templates/partials/dev-note.njk`, `head.njk`, `gtm-noscript.njk`.

### Data bindings (template top)

| Local var  | Source                                                          |
| ---------- | -------------------------------------------------------------- |
| `projects` | `collections.home[0].featuredProjects`                         |
| `awards`   | `collections.awards`                                           |
| `organizations` | `collections.organizations`                              |
| `logo`     | `collections.siteSettings[0].brand.logo.asset.url \| inlineSvgFromUrl` |

### Content mapping (from `ia/index.md` `eleventyComputed`)

| Template var  | Sanity source (`cms.home[0]`)                              |
| ------------- | ---------------------------------------------------------- |
| `title`       | `pageTitle`                                                |
| `hero`        | `{ tagline, videoSrc, videoPoster }`                       |
| `value`       | `{ heading: valuePropHeading, subheading: valuePropSubHeading, body: valuePropBodyHtml }` |
| `recognition` | `{ heading: recognitionHeading, body: recognitionBody }`   |
| `work`        | `{ heading: workHeading, body: workBodyHtml }`             |

## Developer contract

- **Template never queries Sanity.** Data arrives via Sanity-backed Eleventy collections and is mapped in `ia/index.md` `eleventyComputed`.
- **Standalone document, not `extends base.njk`.** The fork is intentional (LCP control + preloader/choreography gating). Do not convert to a shared base layout without revisiting the boot path.
- **Layout is a class-map, piped through `| classes`.** `main` is a `{ base, lg }` object → config-as-data, not inline class soup.
- **Choreography binds to `data-<section>-el` attributes, never CSS classes.** Structure and motion edit independently. Never bypass boot gating (`director:ready` → `preloader:out` → `LandingSequence`).
- **Sidecar (`home.md`) owns metadata.** Template inputs/relationships are documented there and in this spec, not inline in the `.njk`.
- **Semantic/landmark structure.** `<main>` landmark, sectioning per section macro, skip-links present, `aria-busy` during render.
- **Dev-channel comments (ADR 0005).** `home.njk` hosts the shipped `<!-- … -->` templating narrative; its console counterpart lives in `dev-note.njk`. The two cross-reference, never duplicate.

## UX

The home page is the portfolio's front door. Its job is to let recruiters, hiring managers, prospective clients, and peer practitioners quickly answer *"Is this someone I can work with?"* through a curated scroll: identity (landing) → point of view (manifesto) → how the work gets made (process) → proof (featured work) → credibility (organizations, recognition) → conversion (contact).

- **Audiences:** recruiters, hiring managers, prospective clients, peer practitioners.
- **CTA:** the contact section closes the page; the global footer renders with `contact: false` (contact is a first-class section, not a footer form, on home).
- **Motion:** GSAP choreography drives the landing sequence and per-section behavior; every ScrollTrigger animation must have a reduced-motion branch. ScrollSmoother is intentionally disabled (footer-outside-`main` conflict).
- **Responsive:** intentional at Tailwind breakpoints base, sm, md, lg, xl. A known mobile horizontal-scroll issue is flagged in-template.

## Local dev

- `cd frontend && npm start` — Tailwind watch + Eleventy serve (live reload; JS watch is on — no manual `build:js`).
- Build order for a full build: `build:design` → `build:css` → `build:11ty` (`npm run build`); `npm run quick` skips Figma sync.
- Verify rendered output at `_site/index.html` (read the artifact to confirm output; never infer source behavior from `_site/`).

## Assumptions

- The Sanity `home` document type is the authoritative content source for this page; no new document type is introduced.
- Featured project card URLs are resolved in `transforms/home.js` (`resolveProjectCardUrl`), matching the standalone `projects` queries.
- Canonical Sanity data paths are `frontend/data/sanity/{queries,transforms,projections}/…`.

## Known drift & risks

- **Unsupplied section copy.** `organizationsCopy`, `contact`, and `contactInfo` are passed to the Organizations and Contact macros but are **not** defined in `ia/index.md` frontmatter, `site.json`, or any global — those sections receive `undefined` copy. The `home` query does expose `organizationsHeading`/`organizationsBody`, which are not yet mapped. Reconcile: map them in `eleventyComputed`, or document the intended source.
- **Stale `skipLinks`.** `ia/index.md` declares `skipLinks: [hero, bio, awards, projects]`, but the live section ids are `manifesto, process, work, organizations, recognition, contact`. Skip-link targets are out of sync with the real structure — do not treat `skipLinks` as a source of truth for composition.
- **`metaDescription` placeholder.** `ia/index.md` sets `metaDescription: "no metaDescription defined"` — a shipping placeholder.
- **Dead import + stale sidecar links.** `home.njk` retains a commented-out `sizzle-background` import; `home.md` still links `hero` / `Preloader` / `Background` / `sizzle-background`, which the template no longer uses. Tracked as Frontend task `fix-dev-channel-defects` (ADR 0005), not fixed here.
- **Process visual is uncommitted.** The live Process section renders the `ui-components-loop` coverflow (`uiComponents: true`) that replaced `blockframes` on all breakpoints; that work is uncommitted on the frontend `motion` branch as of 2026-07-13.

## Open questions

- **Organizations/Contact copy source:** map `organizationsHeading`/`organizationsBody` (and a contact content source) into `eleventyComputed`, or is copy authored inside the macros?
- **Skip-link reconciliation:** update `skipLinks` to real ids (`manifesto`, `process`, `work`, `organizations`, `recognition`, `contact`) and confirm the landing target.
- **LCP element:** confirm the true above-the-fold LCP element in the landing organism (do not infer from `hero:` computed data) before any perf work.
