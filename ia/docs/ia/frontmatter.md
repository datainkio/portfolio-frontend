---
title: Frontmatter Rules
description: Published summary of the frontmatter contract; the authority is specs/frontmatter.spec.md.
type: reference
eleventyComputed:
  title: "{{ title }}"
---

This page summarises the frontmatter contract for markdown in this repo. It is a
**summary, not the authority** — the specification is
`specs/frontmatter.spec.md`, and `npm run lint:frontmatter` enforces it.

## The governing rule

Frontmatter carries only what the path, filename, and extension cannot. A field
that restates location costs tokens on every read and drifts the moment a file
moves.

## Required

- `description` — one sentence, specific enough to tell this file from its
  siblings. The only unconditionally required field.

## Conditional

- `title` — only when it adds something over the filename.
- `type` — `template · script · spec · guide · reference · index · plan · handoff`
- `status` — `draft · active · stable · deprecated · historical`. Omit when `active`.
- `tags` — controlled vocabulary, **no `#` prefix**. Tags naming the whole repo
  (`frontend`, `js`) discriminate nothing and are rejected.
- `aliases`, `links` — optional, and both feed Obsidian's quick-switcher and graph.

## Eleventy-rendered pages only

Files under `ia/` may additionally carry `permalink`, `layout`,
`eleventyComputed`, `eleventyNavigation`, `pagination`, and the meta fields. A
`permalink` anywhere else implies a route that does not exist.

## Retired

`id`, `scope`, `surface`, `system`, `engine`, `runtime`, `atomicLevel`,
`template*`, `module*`, `scriptRole`, `animation`, `backlinks`, `owner`,
`audience`, `perf`, and the whole `aix:` namespace. `role` migrated into
`description`; `docType` migrated into `type`.
