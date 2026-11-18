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

| Key        | Holds                                                                                  |
| ---------- | -------------------------------------------------------------------------------------- |
| `modules`  | One record per sidecar under `js/choreography/` (not `_context/`, not layer READMEs)   |
| `layers`   | One record per folder: its README's intro, and its modules in sidebar groups           |
| `overview` | Sections of `js/choreography/README.md`, and the rules from the accessibility policy   |
| `config`   | Events, selectors, timeline ids, presets, profiles, breakpoints, tokens, as table rows |
| `coverage` | Every module that binds a ScrollTrigger or branches on reduced motion, and its docs    |

## A module record

- `path`, `url`: the sidecar's path without `.md`, and `/docs/design/choreography/<path>/`.
  A `README.md` below the layer level is the page for its folder.
- `title`: frontmatter `title`, else the first `# heading`, else the file name.
- `description`, `status`: from frontmatter.
- `body`: the sidecar's markdown without its H1, with links rewritten (below).
- `builtFrom`, `usedBy`: from the import graph.
- `specs`: files in `specs/animation/` that name the module's JS file.
- `reducedMotion`: `{ usesScrollTrigger, codeBranch, documented }`.
  `documented` is `section` when the sidecar has a `## Reduced motion`
  heading, `mentioned` when its text covers it elsewhere, else `none`. The
  two code flags are text searches of the source.
- `group`, `order`: sidebar placement. Modules straight under the layer come
  first, then one group per subfolder holding more than one page.

## Import graph

Imports are read as text, because atoms and controllers import GSAP by a
browser path and can't be loaded in Node. A specifier is resolved whether it
is relative or starts with `/assets/js/`. An import from a barrel is traced
through to the file that defines each imported name, so "Built from" names
the real module and not `index`. Barrels aren't listed under "Used by".

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
