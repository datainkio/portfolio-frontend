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

Pass one of `src`, `picture`, or `video`.

| Param | Type | Description |
| --- | --- | --- |
| `src` | string | Image URL. Used when neither `picture` nor `video` is set. |
| `picture` | string | Pre-rendered `<picture>`/`<img>` HTML. Wins over `src`. |
| `video` | object | `{ src, poster }`. Wins over `picture` and `src`. |
| `alt` | string | Alt text for `src`. First choice for the dialog's `aria-label`. |
| `caption` | string | Shown beside the media at `lg` and up, and below it under `lg`. |
| `width` | number | Intrinsic width of `src`. Set with `height` to reserve the aspect ratio while the image loads. |
| `height` | number | Intrinsic height of `src`. |

## Relationships

- Imported by [[media.njk]] (when `zoom: true`).
- Hand-mirrored by the PortableText image serializer
  (`data/sanity/transforms/portableText.js`). Change both together.

## Notes for Future Maintenance

- Emits the `Lightbox.js` module script. Callers must not add their own.
- `data-lightbox-el="video"` is what `Lightbox.js` plays and pauses.
- Run `npm run quick` after structural changes.
