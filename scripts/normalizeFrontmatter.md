---
description: Sidecar for normalizeFrontmatter.js — the idempotent codemod that brings every tracked file onto the frontmatter spec.
type: script
tags:
  - frontmatter
  - tooling
links:
  - "[[frontmatterSchema]]"
  - "[[frontmatter.spec]]"
---

# normalizeFrontmatter.js

Applies [[frontmatter.spec]] mechanically: migrates `role`/`docType`, drops
retired keys, strips functional keys from files Eleventy does not render,
normalizes enums, cleans tags, removes the inline JSDoc dialect, and seeds
frontmatter where there is none.

Idempotent — a second run changes nothing.

## Usage

```bash
npm run fix:frontmatter              # apply
node scripts/normalizeFrontmatter.js --dry   # report only
```

## Caution

It rewrites frontmatter across the whole repo. Run it on a clean tree so the
diff is reviewable and revertible.
