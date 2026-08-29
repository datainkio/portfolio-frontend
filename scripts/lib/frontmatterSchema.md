---
description: Sidecar for frontmatterSchema.js — the single shared key classification behind the frontmatter audit, codemod, and linter.
type: script
tags:
  - frontmatter
  - tooling
links:
  - "[[frontmatter.spec]]"
---

# frontmatterSchema.js

The one place a frontmatter key list exists in code. The audit, the codemod, and
the linter all import from here, so they cannot drift apart — changing policy
means changing this file and [[frontmatter.spec]] together, and nothing else.

## Exports

- `KEEP_CORE`, `KEEP_FUNCTIONAL`, `KEEP_DOMAIN` — keys that stay
- `DROP_DERIVABLE`, `DROP_REDUNDANT` — keys that go, and why they go
- `MIGRATE` — superseded keys and their destination
- `STATUS_ENUM`, `TYPE_ENUM`, and their legacy-spelling alias maps
- `NULL_TAGS` — tags naming the whole repo, so discriminating nothing in it
- `KEY_ORDER` — canonical serialization order
- `isExempt`, `isRendered`, `verdictFor` — scope and classification predicates
- `splitFrontmatter`, `parseBlocks`, `blockItems`, `yamlScalar` — line-based
  parsing helpers, chosen over a YAML dependency so formatting round-trips

## Adding a key

Add to `KEEP_DOMAIN` only when a key carries real meaning the core schema cannot
express — never to grandfather in drift.
