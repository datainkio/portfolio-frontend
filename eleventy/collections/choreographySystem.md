---
description: "Reader for the living choreography reference: turns every choreography sidecar into a page record, derives built-from and used-by from the JS import graph, and exposes the contract and tuning values from the config modules."
tags:
  - collection
  - choreography
  - choreography
aliases:
  - Choreography system reader
links:
  - "[[eleventy/collections/README|collections]]"
  - "[[index]]"
  - "[[designSystem]]"
  - "[[design-doc]]"
---

# Choreography system reader

`readChoreographyDocs()` is registered by [[index]] as the `choreographyDocs` global and
drives every page under `ia/docs/design/choreography/`. It reads files the site already
runs, so the reference can't drift from them. The result is cached for one
build; `resetChoreographyDocs()` runs on `eleventy.before`.

## What it returns

| Key              | Holds                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------- |
| `modules`        | One record per sidecar under `js/choreography/` (not `_context/`, not layer READMEs)    |
| `layers`         | One record per folder: its README's intro, and its modules in sidebar groups            |
| `overview`       | Sections of `js/choreography/README.md`, and the rules from the accessibility policy    |
| `config`         | Events, selectors, timeline ids, presets, profiles, breakpoints, tokens, as table rows  |
| `coverage`       | Every module that binds a ScrollTrigger or branches on reduced motion, and its docs     |
| `componentHooks` | Component path (as in page frontmatter) to `[{ attribute, modules: [{ title, url }] }]` |

## A module record

- `path`, `url`: the sidecar's path without `.md`, and `/docs/design/choreography/<path>/`.
  A `README.md` below the layer level is the page for its folder.
- `title`: frontmatter `title`, else the first `# heading`, else the file name.
- `description`, `status`: from frontmatter.
- `body`: the sidecar's markdown without its H1, with links rewritten (below).
- `builtFrom`, `usedBy`: from the import graph.
- `specs`: files in `specs/animation/` that name the module's JS file.
- `animates`: `[{ attribute, components: [{ title, url }] }]`, the component
  pages whose templates emit each attribute the module uses (see Hooks).
- `reducedMotion`: `{ usesScrollTrigger, codeBranch, documented }`.
  `documented` is `section` when the sidecar has a `## Reduced motion`
  heading, `mentioned` when its text covers it elsewhere, else `none`. The
  two code flags are text searches of the source.
- `section`, `group`, `order`: sidebar placement. `section` is the nav key the
  page sits under (`choreography/<layer>`, or `choreography/system` for a
  folded layer). Within an own section, modules straight under the layer come
  first, then one group per subfolder holding more than one page. In System,
  one group per layer instead: "Core" (the system layer, with the root-level
  entry points) then each folded layer titled with the layer, in
  `LAYER_ORDER`. The subfolder groups are dropped and the relative order is
  kept; `order` is offset by 1000 per group, leaving room below for the
  authored pages.

## A layer record

`name`, `title`, `url`, `description`, `body`, `groups` (subfolder groups, for
the index page), `count`, plus the sidebar facts: `section`, `sectionOrder`,
and `folded`. `SECTION_LAYERS` names the layers with a section of their own
(atoms, molecules, organisms, pages, system); every other layer, including one
added later, is `folded` into System. A folded layer's index page still builds
but has no sidebar entry. The system layer also carries `foldedLayers`
(title, url, count, description), which `layer.njk` lists on the System page.

## Import graph

Imports are read as text, because atoms and controllers import GSAP by a
browser path and can't be loaded in Node. A specifier is resolved whether it
is relative or starts with `/assets/js/`. An import from a barrel is traced
through to the file that defines each imported name, so "Built from" names
the real module and not `index`. Barrels aren't listed under "Used by".

## Hooks: components and the modules that animate them

Templates emit `data-<name>-el` attributes and modules bind to them, so the
attribute is the join key. Nothing is mapped by hand.

- **Templates:** the attribute names in the text of every `.njk` under
  `views/atoms`, `molecules` and `organisms`.
- **Modules:** the attribute names that appear as literals in a module's JS,
  plus those it reaches by importing from `selectors.js`. The import is traced
  through barrels to the file that defines the name, and the export's value
  (`elementAttribute`, or any string value matching the pattern) is read from
  the selectors module itself. A constant a module defines locally, such as
  `WORK_EL_ATTR = "data-projects-el"` or
  `HERO_EL_ATTR = HERO_SELECTORS.elementAttribute`, is caught either way: by
  the literal, or by the import of `HERO_SELECTORS`.
- **Not users:** `selectors.js` itself, which defines the constants, and
  barrels.
- **Output:** each module's `animates`, and `componentHooks`. Both are sorted
  by attribute, then title. Components without a reference page are left out,
  and so are empty lists.

Limits. The join is per attribute: every module that uses `data-hero-el` links
to every template that emits it, even if it animates one element. A module that
imports a selectors object for another key, but never touches its attribute,
still counts. Modules that select by class, id or tag (`.gel`, `a.sexy-link`,
the `#background` video) have no attribute and don't join. An attribute emitted
by a template and used by no module (or the reverse) produces no link.

## Links in sidecar bodies

- `[[wikilink]]` and relative links to a choreography file point at that
  module's page.
- A wikilink to a `.njk` file points at the component's design-reference
  page, when one exists.
- Anything else keeps its label and loses the link, since the target isn't
  published.

## Config

The config modules are plain data and import in Node, so `config` holds
their real values. Each profile cell is the result of calling
`resolveSectionMotionProfile`, so the Profiles page shows what runs.

## Sidecar conventions this relies on

- `description` in frontmatter: the page's lede and its line in the layer index.
- `## Reduced motion`: the heading the coverage table looks for.
- A layer's `README.md`: first paragraph after the H1 is the layer's
  description; the rest is its index page's intro.
