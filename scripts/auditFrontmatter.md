---
description: Sidecar for auditFrontmatter.js — scans every frontmatter dialect, classifies keys against the spec, and emits the snapshot plus Mermaid and Gephi sources.
type: script
tags:
  - frontmatter
  - tooling
links:
  - "[[frontmatterSchema]]"
  - "[[README.frontmatter-audit]]"
---

# auditFrontmatter.js

Measures frontmatter structural debt and writes `docs/frontmatter-audit/<label>/`.

The same script produces both the `before` and `after` snapshots, so a delta is
measured rather than narrated. Classification comes from
[[frontmatterSchema]]; this script declares no key lists of its own.

## Usage

```bash
node scripts/auditFrontmatter.js --label before
node scripts/auditFrontmatter.js --label after --compare before
npm run diagrams:export -- --dir docs/frontmatter-audit
```

To regenerate a `before` snapshot after the tree has changed, run it inside a
`git worktree` checked out at the pre-change commit — that keeps both sides
measured by the same generator.

## Output

`snapshot.json`, five Mermaid `.mmd` sources, and two `.gexf` graphs for Gephi.
