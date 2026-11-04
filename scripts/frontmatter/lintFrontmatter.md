---
description: Sidecar for lintFrontmatter.js — report-only schema check wired into npm run validate.
type: script
tags:
  - frontmatter
  - tooling
links:
  - "[[frontmatterSchema]]"
  - "[[frontmatter.spec]]"
---

# lintFrontmatter.js

Enforces [[frontmatter.spec]]. Report-only; exits non-zero on findings so
`npm run validate` fails on drift.

Checks description presence and substance, enum membership for `status` and
`type`, retired and superseded keys, functional keys outside `ia/`, and tag
hygiene.

## Boundary with the `frontmatter-lint` skill

The skill checks **presence** — does a file have frontmatter, does a `.js`/`.njk`
have a sidecar. This checks **schema**. They do not overlap; run both.

## Usage

```bash
npm run lint:frontmatter
npm run lint:frontmatter -- --quiet
```
