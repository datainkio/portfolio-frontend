---
title: IA Frontmatter Schema (superseded)
description: Redirect stub — the frontmatter schema now lives in specs/frontmatter.spec.md.
type: reference
status: historical
---

# IA Frontmatter Schema — superseded

This file is no longer authoritative. It described a schema for IA and
design-system markdown only, while the repo needed one contract covering
sidecars, specs, docs, and Eleventy-rendered pages alike — and it had drifted
from practice on every required field it declared.

**The authority is now [`specs/frontmatter.spec.md`](../../specs/frontmatter.spec.md).**

What changed, for anyone following an old reference here:

- `docType` is retired; use `type`.
- `status` accepts `stable`, which this file's enum forbade while 193 files used it.
- Frontmatter `tags` take **no** `#` prefix.
- The `aix.*` fields this file recommended are retired along with the namespace.
- `description` is the one unconditionally required field.

Enforced by `npm run lint:frontmatter`.
