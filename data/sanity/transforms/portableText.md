---
description: Serialize Sanity Portable Text to HTML with safe links.
status: stable
tags:
  - cms
  - transforms
aliases:
  - Portable Text transforms
links:
  - "[[README.transforms]]"
---

# Portable Text transforms

Pure, stateless normalization between raw Sanity results and Eleventy collections — the semantic
work GROQ can't do (URL resolution from slug trees, Portable Text → HTML, inline SVG, safe defaults).

| Export                                | Purpose                       |
| ------------------------------------- | ----------------------------- |
| `normalizeLinkHref(href)`             | normalize/clean a link href   |
| `escapeHtml(value)`                   | escape HTML-unsafe characters |
| `renderAsideResources(resources)`     | render aside resource markup  |
| `serializePortableTextToHtml(blocks)` | Portable Text → HTML string   |

## Source

- Path: `data/sanity/transforms/portableText.js`

## Notes

- `block.normal` skips empty/whitespace-only blocks (blank lines left in Sanity's
  rich-text editor) so consumers never receive a stray `<p></p>` in the output HTML.
- `types.image` wraps each inline image in the same `data-lightbox-el` markup
  contract as `views/molecules/lightbox/lightbox.njk` (hand-built as a string
  since `@portabletext/to-html` serializers aren't Nunjucks), and loads
  `js/lightbox/Lightbox.js` inline to wire it up.
- The figcaption shown under each lightboxed image reads `asset.description` —
  the shared image asset's Description field (`sanity-plugin-media`, stored on
  `sanity.imageAsset`), not a per-block field. One caption per file, reused
  everywhere that asset is used. Callers must project `description` alongside
  `url` when expanding `asset->{...}` in a query/projection, or the caption is
  silently omitted (null-safe, not an error).
- The inline portable-text image type (`backend/schemaTypes/objects/atoms/blockContent.ts`)
  still defines a block-level `alt` field (kept), but no `caption` field — that
  was removed in favor of the asset-level Description above.

Related: [[README.transforms]]
