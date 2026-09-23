---
description: "Builds Sanity image CDN URLs to the content-model delivery contract, and appends auto=format to every image URL in a query result."
status: stable
tags:
  - "#transforms"
  - "#images"
  - "#performance"
aliases:
  - Image URL transform
links:
  - "[[README.transforms]]"
  - "[[sanityService]]"
  - "[[image-asset]]"
---

# Image URL transform

GROQ projections dereference image assets as `asset->{url, ...}`, which returns the **bare
original** — no transformation parameters at all. Editors upload at full resolution, so an
untouched URL ships the largest possible file in its source format.

| Export                         | Purpose                                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| `imageUrl(url, options?)`      | Build one CDN URL from any documented param; adds `auto=format` by default                |
| `normalizeImageUrls(value)`    | Recursively apply `imageUrl` (defaults only) across a query result                        |

The parameter contract is [image-asset § Delivery rules](../../../../content-model/documents/system/image-asset.md).
This file implements it; it does not restate it.

## `imageUrl`

```js
imageUrl(url);                                    // ?auto=format
imageUrl(url, { w: 800, h: 450, fit: "crop" });   // fixed box
imageUrl(url, { w: 1200, fit: "max", dpr: 2 });   // retina, never upscales
imageUrl(url, { w: 1200, h: 630, fm: "jpg" });    // social preview — fm replaces auto
imageUrl(url, { dl: "Project hero.jpg" });        // named download
imageUrl(url, { w, h, blur: isPlaceholder && 50 }); // falsy values are omitted
```

- **Options are camelCase**: `fpX`, `fpY`, `minW`, `maxW`, `minH`, `maxH` map to `fp-x`, `min-w`, etc.
  All other keys match the CDN: `w h dpr fit crop rect pad bg auto fm q blur sharp sat invert dl`.
- **`vanity`** appends a readable path segment — the suggested filename on save, without forcing a
  download.
- **`auto: false`** opts out of `auto=format`. `fm`, here or already on the URL, also suppresses it.
- **Px values are rounded** to integers; `rect` takes `[l, t, w, h]`; `bg` accepts a leading `#`.
- Params already on the URL survive unless overridden.

### It throws at build time for

- Unknown keys and out-of-range or wrong-type values (`q: 101`, `fit: "cover"`).
- Combinations the CDN accepts but silently ignores: `fit: "crop"` without both `w` and `h`;
  `crop` without `fit: "crop"`; `fpX`/`fpY` without `crop: "focalpoint"`; `minW`/`maxW`/`minH`/`maxH`
  without `fit: "crop"`.

A failing build beats a shipped URL whose params do nothing.

### It returns the input unchanged for

- **Non-image assets.** Video and PDF live under `cdn.sanity.io/files/`, not `/images/`.
- **SVGs.** The CDN serves them as uploaded; params are inert.
- **Non-Sanity URLs**, and any value that is not a string.

## Not covered: stored crop and hot-spot

Those live on the image field (`crop`, `hotspot`), not on `asset->url`, and need the source
dimensions to collapse into a `rect`. This module never sees them. Surfaces that depend on an
editor's hot-spot must project `crop`, `hotspot` and `asset->metadata.dimensions` and compute
`rect` themselves — or pass it in via `rect`.

## `normalizeImageUrls`

Called once in [sanityService.js](../services/sanityService.js), inside `fetchAllQueries`,
immediately after `fetchSanityData` and **before** the per-query domain transforms — so those
transforms, and anything downstream, see final URLs. It never throws: it passes no options.

Applying it after the fetch rather than in the GROQ projections is deliberate: it is one call
instead of ~25 edits spread across 13 query and projection files, it cannot be forgotten when a
new projection is added, and it can distinguish image assets from file assets, which a string
concatenation inside GROQ cannot.

## Source

- Path: `data/sanity/transforms/imageUrls.js`
