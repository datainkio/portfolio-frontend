---
title: Frontmatter Specification
description: "The single authority for frontmatter keys, values, and profiles across the frontend repo. Supersedes docs/ia/frontmatter.md and ia/docs/ia/frontmatter.md."
type: spec
tags:
  - frontmatter
  - conventions
aliases:
  - Frontmatter Schema
  - Frontmatter Rules
---

# Frontmatter Specification

**This file is the only authority on frontmatter in this repo.** It supersedes
[`docs/ia/frontmatter.md`](../docs/ia/frontmatter.md) and
[`ia/docs/ia/frontmatter.md`](../ia/docs/ia/frontmatter.md), which are now stubs.

Enforced by `npm run lint:frontmatter`. Rationale and audit evidence:
[`docs/plan-frontmatter-strategy.md`](../docs/plan-frontmatter-strategy.md).

---

## The governing rule

> **Frontmatter carries only what the path, filename, and extension cannot.**

A field that restates location is noise at rest: it costs tokens on every read
and drifts the moment a file moves. `views/atoms/gel.md` does not need
`atomicLevel: atom`, `engine: Nunjucks`, or `templatePath: views/atoms/gel.njk` —
all three are already in the path.

Two corollaries:

1. **One dialect, one location.** Documentary metadata lives in the `.md`
   sidecar. Source files (`.js`, `.njk`, `.css`) carry **no** frontmatter — not in
   YAML, not in a JSDoc comment.
2. **Functional and documentary never mix.** Eleventy-consumed keys appear only
   in files Eleventy renders. Sidecars, specs, and docs never carry `permalink`.

---

## Core schema

Applies to every documentary `.md` — sidecars, specs, docs, READMEs.

```yaml
---
title: "Gel" # optional; only when it adds over the filename
description: "Nunjucks macro for the gel surface treatment used behind award cards."
type: "template" # controlled enum, below
status: "active" # controlled enum, below; omit when `active`
tags:
  - atom # controlled vocabulary, below
aliases:
  - "Gel atom" # optional; Obsidian quick-switcher
links:
  - "[[awards.njk]]" # optional; Obsidian graph edges
---
```

### `description` — required

One sentence. **Specific enough to distinguish this file from its siblings.**

This is the only field that earns its place unconditionally. It is what a
directory listing, a graph query, an Obsidian search, and an agent skimming for
relevance all actually use. A description that restates the filename ("The gel
atom") fails the test; say what it _does_.

### `title` — conditional

Include only when it differs meaningfully from the filename. `title: "Gel"` on
`gel.md` is redundant; `title: "GROQ Projection — Activity"` on
`activityProjection.md` is not.

### `type` — controlled enum

`template · script · spec · guide · reference · index · plan · handoff`

Replaces the former `type`/`docType` split. `docType` is retired.

### `status` — controlled enum

`draft · active · stable · deprecated · historical`

Omit when the value is `active` — that is the default and stating it is noise.
`stable` is retained because 193 files legitimately use it: it means _settled,
unlikely to change_, where `active` means _current and still moving_.

### `tags` — controlled vocabulary

Bare values, **no `#` prefix**. Obsidian adds the `#` itself in the tag pane; a
literal `#` in unquoted YAML starts a comment, which is the very conflict that
made the old `"#tag"` rule necessary. Dropping the prefix removes the hazard
instead of quoting around it.

> **This reverses the `"#[tag-name]"` non-negotiable** in the workspace
> `CLAUDE.md` for **frontmatter only**. Inline body tags still require `#` —
> that is Obsidian syntax, not a convention. Files under `dataink.io/context/`
> keep their existing `"#tag"` form; this spec governs `frontend/`.

Tags must discriminate _within_ this repo. `frontend`, `js`, `dataink` name the
whole repo and so tag nothing — they are banned.

### `aliases` and `links` — optional

Both are load-bearing for Obsidian and both are kept:

- `aliases` feed the quick-switcher and link autocomplete — the main reason a
  sidecar is discoverable at all.
- `links` create real graph edges from frontmatter.

`backlinks` is **retired**: Obsidian derives backlinks natively from links, so a
hand-maintained list is guaranteed to drift out of agreement with the graph.

---

## Profiles

### 1. Sidecar (`.js` / `.njk` → co-located `.md`)

Every `.js` and `.njk` gets one. Its purpose is **discoverability**: it is how a
source file becomes findable, linkable, and graphable in Obsidian.

That purpose sets the bar. A sidecar earns its place through `description`,
`aliases`, and `links` — the fields that make it _findable_. It does not earn it
by restating the path.

```yaml
---
description: "Scroll-driven parallax factory; returns a GSAP timeline bound to data-parallax-el."
type: "script"
tags:
  - choreography
  - motion
---
```

`title` omitted (filename suffices). `status` omitted (defaults to `active`).
Three lines of real signal replace the eleven lines of path-restatement they
superseded.

### 2. Eleventy-rendered markdown

Only files 11ty actually renders. Core schema **plus** the functional keys:

`permalink · layout · eleventyComputed · eleventyNavigation · pagination ·
templateEngineOverride · eleventyExcludeFromCollections · date · metaDescription ·
metaKeywords · canonicalUrl · skipLinks · enableChoreography · viewport`

A `permalink` on a file Eleventy does not render is a defect — it implies a route
that does not exist.

### 3. Spec / doc / README

Core schema. `title` is usually warranted here.

---

## Retired keys

Removed repo-wide. None survive in new files.

| Key                                               | Why                                                 |
| ------------------------------------------------- | --------------------------------------------------- |
| `id`                                              | Derivable from path                                 |
| `scope`, `surface`, `system`, `engine`, `runtime` | Constant or derivable                               |
| `atomicLevel`                                     | Derivable from `views/atoms\|molecules\|organisms/` |
| `template`, `templatePath`, `templateRole`        | Derivable from the sidecar's own path               |
| `module`, `modulePath`, `scriptRole`              | Same, under a second name                           |
| `animation`                                       | Restates the filename                               |
| `aix:`                                            | Namespace retired 2026-08-20                        |
| `backlinks`                                       | Obsidian derives these natively                     |
| `owner`, `audience`                               | Near-constant in a single-team repo                 |
| `perf`                                            | Invented, unread, 2% coverage                       |
| `role`                                            | → migrated into `description`                       |
| `docType`                                         | → migrated into `type`                              |

`role` and `docType` **migrate rather than delete** — `role` held the only
hand-written prose in most generated sidecars, and that content belongs in
`description`.

---

## Validation

```bash
npm run lint:frontmatter        # schema compliance
node scripts/auditFrontmatter.js --label current   # full metrics + diagrams
```

The linter enforces, in order:

1. Every tracked `.md` opens with a `---` block (generated paths exempt).
2. `description` present and non-empty.
3. `status` and `type` within their enums.
4. No retired keys.
5. No functional keys outside Eleventy-rendered files.
6. No banned repo-wide tags; no `#`-prefixed frontmatter tags.

Presence checks for sidecars themselves remain the `frontmatter-lint` skill's job.
