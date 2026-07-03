---
id: frontend.cms.transforms.portableText
role: "Serialize Sanity Portable Text to HTML with safe links."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Portable Text transforms"
tags:
  - cms
  - transforms
links:
  - "[[README.transforms]]"
---

# Portable Text transforms

Pure, stateless normalization between raw Sanity results and Eleventy collections — the semantic
work GROQ can't do (URL resolution from slug trees, Portable Text → HTML, inline SVG, safe defaults).

| Export | Purpose |
| --- | --- |
| `normalizeLinkHref(href)` | normalize/clean a link href |
| `escapeHtml(value)` | escape HTML-unsafe characters |
| `renderAsideResources(resources)` | render aside resource markup |
| `serializePortableTextToHtml(blocks)` | Portable Text → HTML string |

## Source

- Path: `data/sanity/transforms/portableText.js`

## Notes

- `block.normal` skips empty/whitespace-only blocks (blank lines left in Sanity's
  rich-text editor) so consumers never receive a stray `<p></p>` in the output HTML.

Related: [[README.transforms]]
