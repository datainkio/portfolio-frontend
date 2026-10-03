---
title: "Spec: Component API"
description: "Contract for how Nunjucks components are declared, imported, given data, and styled by their callers."
type: spec
tags:
  - spec
  - view
  - atomic-design
aliases:
  - Component API Spec
  - Component styling contract
links:
  - "[README.atoms.md](../../views/atoms/README.atoms.md)"
  - "[button.njk](../../views/atoms/button.md)"
  - "[classes filter](../../eleventy/filters/string.js)"
---

# Spec: Component API

- **Scope:** Every macro component under `views/atoms/`, `views/molecules/`, and `views/organisms/`
- **Related:** [project-page.views-spec.md](./project-page.views-spec.md), [lightbox.views-spec.md](./lightbox.views-spec.md)
- **Origin:** Project-page debt audit, 2026-10-02 (`goals/Frontend/_tasks/audit-project-page-component-tree-for-debt.md`)

## Problem

A caller can't style or feed a child component without opening the child to
learn its API. The project page alone used five styling contracts
(`params.classes` as a pre-flattened string, a `params.styles` slot map,
`params.class`, `props.class`, and none at all). It also used three
signatures: positional arguments, `params` with a default, and `params`
without one. One page-level call rendered correctly only because an undefined
`params.project` fell through to the page's `project` variable via
`with context`.

## Rules

### 1. Signature

```njk
{% macro render(params = {}) %} … {% endmacro %}
```

- The macro is named `render` and takes exactly one argument, `params`, with a
  default of `{}`.
- No positional arguments. Loop data goes in by name, e.g.
  `Card.render({ item: item, index: loop.index })`.

### 2. Import and scope

```njk
{% import "molecules/stats/stats.njk" as Stats %}
```

- Import **without** `with context`.
- Inside the macro, read data only from `params`. Don't read page variables,
  collections, or other ambient scope.
- **Why:** with `with context`, an undefined value set from `params` falls
  through to any same-named page variable. Wrong input then renders
  plausible output instead of nothing, so the bug stays hidden.
- **Exception:** a component that has to read global data (e.g.
  `collections` for breadcrumbs) takes it as a param when practical. If it
  can't, the exception is stated in its sidecar.

### 3. Styling

| Param     | Targets                     | Accepts                                   |
| --------- | --------------------------- | ----------------------------------------- |
| `classes` | The component's root element | string, variant map, or array             |
| `styles`  | Named inner elements (slots) | object of `{ slotName: string \| variant map }` |

- **Fixed-design components** may take no styling params at all. Their
  sidecar says so (e.g. `lightbox-dialog.njk`). A component that accepts
  any styling takes it through `classes`/`styles` as above, and nothing else.
- **The component applies `| classes` itself.** Callers pass raw variant maps
  (`{"base": …, "md": …}`) and never pre-flatten them. Pre-flattened strings
  still work, because the filter passes a string through unchanged.
- **Caller classes are appended, never substituted.** The component composes
  `[baseline, params.classes] | classes`, so a caller can add to its
  baseline (a11y, layout) but can't remove it. `atoms/button.njk` is the
  reference implementation.
- **Don't bake in what callers will change.** Appending can't override a
  property the baseline already sets: when two utilities set the same
  property (e.g. `text-neutral-300` and `text-slate-400`), the one that
  wins is decided by its position in the generated CSS, not by its order
  in `class`. Keep colour and typography that callers are expected to vary
  out of the baseline, and expose them through a `classes`/`styles` slot.
  Each caller sets them, including the old default.
- **The root is always `classes`.** `styles` keys name inner elements only.
  A slot called `figure`, `section`, or `root` for the outer element is
  non-conforming.
- **Slots are declared.** Every `styles` key a component reads is listed,
  with the element it targets, in the component's sidecar.
- **Pass-through:** a component that wraps another passes `classes`/`styles`
  through as raw values, not flattened strings.
- **Variant maps that nest:** build inner maps as variables before the outer
  literal. A nested literal ending in `}}` closes the Nunjucks tag early.

### 4. Sidecar

Each component's `.md` sidecar has a params table that names every `params.*`
key the macro reads, including every `styles` slot.

## Example

```njk
{#- stats.njk -#}
{% macro render(params = {}) %}
  {%- set styles = params.styles or {} -%}
  <dl class="{{ params.classes | classes }}">
    {% for item in params.stats %}
      <div class="{{ ['break-inside-avoid-column flex flex-col gap-1 p-2', styles.item] | classes }}">…</div>
    {% endfor %}
  </dl>
{% endmacro %}

{#- caller -#}
{% import "molecules/stats/stats.njk" as Stats %}
{%- set metaStyles = {"base": "text-neutral-400", "sm": "columns-2xs"} -%}
{{ Stats.render({ stats: rows, classes: metaStyles }) }}
```

## Conformance

The project-page tree was brought into conformance on 2026-10-02:

| Component | Status |
| --- | --- |
| `organisms/header/project/project-header.njk` | ✅ |
| `molecules/project-metadata/project-metadata.njk` | ✅ |
| `molecules/stats/stats.njk` | ✅ (`styles`: `item`, `term`, `value`) |
| `molecules/list/project-orgs.njk` | ✅ |
| `molecules/star-summary/star-summary.njk` | ✅ |
| `molecules/section/section-frame.njk` | ✅ (`styles`: `heading`; content via `{% call %}`) |
| `molecules/design-decisions.njk` | ✅ |
| `molecules/card/design-decision.njk` | ✅ (`item`, `index`) |
| `molecules/awards.njk` | ✅ |
| `molecules/card/award-organization.njk` | ✅ (`group`) |
| `molecules/figure/media.njk` | ✅ (`styles`: `image`, `caption`) |
| `molecules/lightbox/lightbox-dialog.njk` | ✅ (fixed design, no styling params) |
| `atoms/button.njk` | ✅ (reference) |
| `atoms/svg/inline.njk` | ✅ (`classes`, `svgClasses`) |
| `atoms/award.njk` | ✅ (no root element) |
| `atoms/link/link.njk` | ✅ (`rel` merges with external `noopener noreferrer`; content via `{% call %}`) |
| `molecules/navigation/pager.njk` | ✅ (`styles`: `link`) |
| `organisms/footer/global-footer.njk` | ✅ (`classes` appended; positioning is the caller's) |
| `atoms/icon.njk` | partial: accepts `classes`, but keeps legacy `className`/`class` and render-on-include |

Known non-conforming components outside the project page (not yet migrated):

- `atoms/heading.njk`: `render(props)` and `props.class`
- `organisms/navigation/breadcrumbs-nav.njk`: reads `collections.all` from ambient scope when no `nav` param is given
- Convention-B molecules listed in `goals/Frontend/_tasks/migrate-remaining-molecules-to-macro-invoc.md`

## Verification

- `npm run quick` builds clean.
- For a changed component, its rendered `class` attributes in
  `_site/` match the pre-change output, apart from intended changes.
