---
title: "Home"
template: "[[home.njk]]"
templatePath: "views/pages/home/home.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "page"
atomicLevel: "page"
status: "active"
tags:
  - atomic-design
  - eleventy
  - nunjucks
  - Obsidian
  - page
  - template
links:
  - "[home-landing](../../organisms/header/home/home-landing.md)"
  - "[global-header](../../organisms/header/global-header.md)"
  - "[global-footer](../../organisms/footer/global-footer.md)"
  - "[skip-links-nav](organisms/navigation/skip-links-nav.njk)"
  - "[sizzle-background](../../molecules/background/sizzle-background.md)"
  - "[hero](../../organisms/section/hero.md)"
  - "[bio](../../organisms/section/bio.md)"
  - "[awards](../../organisms/section/awards.md)"
  - "[work](../../organisms/section/work.md)"
  - "[organizations](../../organisms/section/organizations.md)"
  - "[contact](../../organisms/section/contact.md)"
  - "[head](../../templates/partials/head.md)"
  - "[gtm-noscript](../../templates/partials/gtm-noscript.md)"
  - "[choreography-script](../../templates/partials/choreography-script.md)"
---

# Home

Renders a top-level Eleventy page.

## Template

- Source: [[home.njk]]
- Path: `views/pages/home.njk`

## Purpose

Generates a routed page in the Eleventy build.

## Role in the System

Classified as a **page** at the atomic **page** level based on its location under `views/`.

## Data and Context

- `Background` — referenced in the template.
- `Footer` — referenced in the template.
- `Header` — referenced in the template.
- `Preloader` — referenced in the template.
- `SkipLinksNav` — referenced in the template.
- `awardsSection` — referenced in the template.
- `bioSection` — referenced in the template.
- `heroSection` — referenced in the template.
- `projectsSection` — referenced in the template.

## Relationships

- Includes:
  - [[head.njk]]
  - [[gtm-noscript.njk]]
  - [[choreography-script.njk]]
- Imports:
  - [[home-landing.njk]]
  - [[global-header.njk]]
  - [[global-footer.njk]]
  - [[skip-links-nav.njk]]
  - [[sizzle-background.njk]]
  - [[hero.njk]]
  - [[bio.njk]]
  - [[awards.njk]]
  - [[work.njk]]
  - [[organizations.njk]]
  - [[contact.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?

---

## Developer-facing comment channel (templating strategy)

This page is the host for the **HTML-comment channel** — the templating half of
the two-channel narrative defined in
[ADR 0005](../../../../aix/docs/decisions/0005-dev-channel-narrative.md). Pairs
with the `console.log` channel in [[dev-note.md]] (IXD/motion). The two
**cross-reference, never duplicate**.

Delivered as shipped `<!-- … -->` comments (not `{# … #}`, which compile away),
anchored at the element each one explains. Audience: a developer reading View
Source, deciding *"could I maintain this — and will it make me a hero?"*

### Content outline

1. **Orientation block** (top of `<html>`) — stack one-liner (11ty + Nunjucks +
   Tailwind v4 + GSAP + Sanity); "open the console for the motion story"; "this
   is intentional, not generated."
2. **Atomic composition** (at `<main>`) — the `views/` ladder
   (atoms→molecules→organisms→templates→pages); macros as the unit of reuse;
   `import … with context` vs without, and why context is scoped deliberately;
   one concrete trace (`home.njk → BioSection.render() → molecule → atom`).
3. **Layout contract** (at `<main class="…">`) — responsive class-map objects
   (`{base, sm, md, lg}`) piped through the `| classes` filter (config-as-data,
   not inline soup); the standalone-document vs `extends base.njk` fork, and why
   home is standalone (LCP control + preloader gating).
4. **Content / CMS seam** (near first Sanity-fed section) — collections wired
   once at page top; Sanity → 11ty → Nunjucks data flow at build time, zero
   client cost.
5. **Semantic & a11y posture** (at landmarks) — landmark/sectioning over `<div>`;
   skip-links; `aria-busy` during render; accessible even with utilities stripped.
6. **Choreography decoupling** (at a `data-*` element) — JS finds elements via
   `data-<section>-el`, never classes, so structure and motion edit independently.
7. **Performance decisions, in situ** — extend the existing render-blocking-font
   comments in `head.njk`; modulepreload gating; single emitted utility layer.

> Defects found while drafting this (dead `sizzle-background` import; stale links
> below to `hero`/`Preloader`/`Background`/`sizzle-background` that `home.njk` no
> longer uses; `metaDescription` placeholder) are tracked in Frontend task
> `fix-dev-channel-defects` per ADR 0005, not fixed here.
