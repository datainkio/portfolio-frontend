---
title: Frontmatter Rules
description: Operational frontmatter requirements for IA and design-system documentation pages.
docType: reference
status: active
owner: frontend
tags:
  -  #docs
  -  #ia
  -  #frontmatter
eleventyComputed:
  title: "{{ title }}"
---

This page captures the frontmatter contract applied to IA and design-system markdown pages.

## Focus

- required metadata fields
- publication and permalink controls
- tagging and ownership conventions

## Permalink Behavior

Do **not** define `permalink` in frontmatter for docs pages. URLs are derived from two sources:

- **Leaf pages** (e.g. `bio-section.md`) — Eleventy uses the filename as the slug automatically.
- **Section indexes** (`README.md`) — A global computed permalink in `.eleventy.js` rewrites `README.md` to the parent directory URL (e.g. `docs/design/README.md` → `/docs/design/`). This preserves README.md as the entry point for GitHub and Obsidian browsing while producing clean directory-index URLs in the built site.

### Decision rationale

Explicit `permalink` fields were removed in favor of this rule because:

1. They duplicated path information already expressed by the file hierarchy and `eleventyNavigation`.
2. Manual permalinks drift from actual paths over time and require two-place edits on every rename or move.
3. The computed rule is zero-config per file — adding a new README.md to any docs directory automatically gets a correct index URL.
