---
description: "Defines Nunjucks macro: render — the site-wide <footer> (contentinfo landmark): optional CMS footer navigation plus copyright. Rendered as a sibling of <main>, never inside it; on home.njk it sits outside the #page-main ScrollSmoother wrapper entirely."
type: template
links:
  - "[main-pages](../../molecules/list/main-pages.md)"
  - "[home](../../pages/home/home.md)"
---

# Global Footer

Defines Nunjucks macro: `render`.

## Template

- Source: [[global-footer.njk]]
- Path: `views/organisms/footer/global-footer.njk`

## Purpose

Renders the site-wide `<footer>`: an optional footer navigation (from the CMS
navigation record) and the copyright line. Nothing else — the site-global
contact form that used to render here was removed; `params.contact` is still
accepted by callers (`home.njk` passes `contact: false`) but the macro no
longer reads it.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its
location under `views/`. As a direct child of the page (not of `<main>`), the
`<footer>` is the page's `contentinfo` landmark.

## Data and Context

- `main_pages` — [main-pages](../../molecules/list/main-pages.md) list molecule,
  used for the footer navigation.
- `cms.navigation[0].footerItems` — CMS navigation record (see
  `data/sanity/transforms/navigation.js`); the macro is imported
  `with context` so it can resolve `cms` and `site`.
- `site.year` — from `site.json`; copyright year fallback.
- `params`:
  - `classes` — replaces the default footer class string
    (`global-footer col-span-full py-8 px-4 text-center text-sm text-primary-200 bg-transparent`).
  - `items` — overrides the CMS `footerItems`.
  - `year` — overrides `site.year`.

The `<nav aria-label="Footer navigation">` renders only when there are footer
items. The list is a `grid grid-cols-12` so `main-pages` has a parent grid.

## Placement — outside `<main>`, outside the ScrollSmoother wrapper

**Decision (2026-09-18):** the global footer renders as a **sibling of `<main>`,
never inside it.** `<main>` is the landmark for the page's unique content;
`<footer>` at that level is the `contentinfo` landmark for site-wide
information. Keeping them separate lets screen readers and other assistive
technology announce and navigate them as distinct regions instead of folding
the static site-wide block into the page content.

On `home.njk` the ScrollSmoother `content` element **is** `<main>` itself
(`<main id="page-main-content">`), wrapped directly by the `#page-main`
`wrapper` — there is no intermediate `<div>`. The footer is a sibling of the
wrapper, after it:

```html
<body class="relative …">
  <div id="page-main">                 <!-- ScrollSmoother wrapper (fixed) -->
    <main id="page-main-content" class="… pb-48">…</main>   <!-- content (translated) -->
  </div>
  <footer class="… absolute inset-x-0 bottom-0">…</footer>
</body>
```

ScrollSmoother makes the wrapper `position: fixed` and translates `<main>`, so
a sibling in normal flow contributes nothing to the document height and lands
at the top of `<body>`. The footer is therefore taken out of flow with
`absolute inset-x-0 bottom-0` (positioning context: `relative` on `<body>`),
which pins it to the bottom of `<body>` — ScrollSmoother sets `<body>`'s
height to the content height, so that bottom edge is the end of `<main>`.
`<main>` reserves the footer's space with `pb-48`; that padding must stay
**≥ the footer's rendered height** (~172px at desktop with the two-item nav)
or the footer overlaps the last section.

**Positioning is the caller's job (2026-10-02).** The macro's default classes
carry no positioning, and `params.classes` is *appended* to them (Component API
spec), not substituted. Pinned callers pass `"absolute inset-x-0 bottom-0"`;
in-flow callers pass nothing.

Do not "fix" the footer's position by moving it into `<main>`, and do not
reintroduce a non-landmark `<div>` as the `content` element.

**Current state per caller:**

- [`home.njk`](../../pages/home/home.njk) — follows the shape above.
- [`base.njk`](../../layouts/base.njk) — two shapes, chosen by `footerInFlow`
  (`not (smoothScroll or pinFooter)`):
  - **In flow (default):** `<body>` is `flex flex-col min-h-dvh` and `<main>`
    is `w-full flex-1`. The footer sits directly under the content at any
    footer height, or at the viewport bottom on short pages. No spacer. Used
    by project pages, `/about`, and `/user-guide`.
  - **Pinned:** `smoothScroll` pages (`landing.njk`: `/work`, `/contact`) and
    grid-`<body>` layouts (`cols-2-before`/`cols-2-after` set `pinFooter`; docs
    pages) keep the shape above: footer `absolute inset-x-0 bottom-0`, and
    `<main>` reserves its height with an `after:h-48` spacer.
  (Before 2026-09-28 the footer sat inside the fixed `#page-main`. Before
  2026-10-02 every `base.njk` page used the pinned shape.)

## Relationships

- Imports:
  - [[main-pages.njk]]
- Used by:
  - [`base.njk`](../../layouts/base.njk) (most pages)
  - [`home.njk`](../../pages/home/home.njk)

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.
