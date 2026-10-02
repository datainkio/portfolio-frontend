---
description: "Shared lightbox <dialog>: close button, enlarged image or video, caption, and the Lightbox.js module script."
type: template
tags:
  - lightbox
aliases:
  - Lightbox Dialog
links:
  - "[Lightbox spec](../../../specs/views/lightbox.views-spec.md)"
  - "[Lightbox.js](../../../js/lightbox/Lightbox.md)"
  - "[lightbox-dialog.canvas](lightbox-dialog.canvas)"
---

# Lightbox Dialog

The shared half of the lightbox: one source for the `<dialog>` that every
Nunjucks lightbox opens. Callers own the root (`data-lightbox-el="root"`) and
the trigger button; this macro renders everything inside the modal.

Contract and behavior: [lightbox.views-spec.md](../../../specs/views/lightbox.views-spec.md).

## Template

- Source: [[lightbox-dialog.njk]]
- Path: `views/molecules/lightbox/lightbox-dialog.njk`

## Params

| Param | Required | Description |
| --- | --- | --- |
| `src` | one source | Image URL. |
| `picture` | one source | Pre-rendered `<picture>`/`<img>` HTML; wins over `src`. |
| `video` | one source | `{ src, poster, mimeType }`; wins over `picture` and `src`. |
| `alt` | no | Alt for `src`; first choice for the dialog's `aria-label`. |
| `caption` | no | Rendered in the dialog. Beside the media at `lg`+, below it under `lg`. |

## Relationships

- Imported by [[media.njk]] (when `zoom: true`).
- Hand-mirrored by the PortableText image serializer
  (`data/sanity/transforms/portableText.js`). Change both together.

## Notes for Future Maintenance

- Emits the `Lightbox.js` module script. Callers must not add their own.
- `data-lightbox-el="video"` is what `Lightbox.js` plays and pauses.
- Run `npm run quick` after structural changes.
