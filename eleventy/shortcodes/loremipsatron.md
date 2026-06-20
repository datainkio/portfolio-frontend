---
id: frontend.eleventy.shortcodes.loremipsatron
role: "Placeholder-text generators sized by character count or paragraph count (lorem-ipsum)."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Loremipsatron"
tags:
  - "#frontend/eleventy"
  - "#frontend/eleventy/shortcodes"
links:
  - "[[README.shortcodes]]"
  - "[[shortcodes]]"
---

# Loremipsatron

Placeholder copy generators for layout/IxD iteration, backed by `lorem-ipsum`.

| Export | Purpose |
| --- | --- |
| `loremChars(length)` | lorem text trimmed to a character count |
| `loremPars(n)` | `n` paragraphs of lorem text |

Registered as shortcodes by [[shortcodes]].

## Source

- Path: `eleventy/shortcodes/loremipsatron.js`
