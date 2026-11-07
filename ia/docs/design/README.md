---
title: Design system
description: "The living reference for the site's design system: tokens from Figma, and every Nunjucks component rendered live with the call that produced it."
type: index
---

This is the design system as the site actually renders it. Every page here is
built from the same files the site uses: token pages read the generated theme
files, and component pages import the real macro, render it with sample
params, and print the call underneath. If a component changes, its page
changes with it.

## What's here

- **[Tokens](tokens/)**: colour, type, spacing, radius, shadow, motion, and
  the project utilities built on them. Figma owns most of these values.
- **[Atoms](atoms/)**, **[Molecules](molecules/)**, and
  **[Organisms](organisms/)**: one page per component under
  `views/atoms/`, `views/molecules/`, and `views/organisms/`, mirroring its
  path.

## Using a component

Every component follows the Component API spec
(`specs/views/component-api.views-spec.md`):

```njk
{% raw %}{% import "molecules/stats/stats.njk" as Stats %}
{{ Stats.render({ stats: rows, classes: { base: "grid", sm: "grid-cols-3" }, styles: { term: "text-slate-400" } }) }}{% endraw %}
```

- One macro, `render(params = {})`, with named params only.
- Import without `with context`. A component reads nothing but `params`, so
  data such as `cms`, `collections.all`, or `page.url` has to be passed in.
- `classes` styles the root element; `styles` styles named inner slots. Pass
  a string, an array, or a variant map (`{ base, sm, md, lg, xl }`); the
  component flattens it with the `classes` filter.
- Your classes are added to the component's own baseline, never substituted.
  To vary colour or type, use the slot the component exposes for it rather
  than stacking a competing utility.
- Some components take content through a call body
  (`{% raw %}{% call Link.render({...}) %}…{% endcall %}{% endraw %}`). Their
  pages show it.

Each component page lists its params from the component's sidecar (the `.md`
next to the `.njk`), which stays the authority.

## Adding to the reference

A component page is a Markdown file at
`ia/docs/design/<path under views/>.md`, with frontmatter naming the
`component` and listing `specimens`. The contract is in
`views/layouts/design-doc.md`. New components should get a page when they're
added.
