---
title: "Spec: Lightbox"
description: "Contract for the click-to-enlarge media viewer: markup, behavior, sources, and accessibility for images and video."
type: spec
tags:
  - lightbox
  - spec
  - view
aliases:
  - Lightbox Spec
links:
  - "[lightbox-dialog.njk](../../views/molecules/lightbox/lightbox-dialog.md)"
  - "[media.njk](../../views/molecules/figure/media.md)"
  - "[Lightbox.js](../../js/lightbox/Lightbox.md)"
---

# Spec: Lightbox

- **Scope:** Every click-to-enlarge media view on the site, images and video
- **Related:** [project-page.views-spec.md](./project-page.views-spec.md)

## Feature

Clicking a media element opens a full-screen modal with a larger view of the
same media, plus information about it that the page layout doesn't show.
Closing returns the visitor to where they were.

### User stories

As a person looking through the site's visual content, I want:

- to view larger versions of media, so I can see detail that smaller
  renditions hide, and
- the information available about the media (caption today; title, alt text,
  and description are candidates) that the page layout doesn't show, so I
  understand the material better.

## Architecture

The lightbox has two halves. The **trigger** sits in the page and is rendered
by [`media.njk`](../../views/molecules/figure/media.md) with `zoom: true`,
styled by the caller through `styles`. The **dialog** is shared and has a
single source. `media.njk` is the only Nunjucks entry point; it replaced
`molecules/lightbox/lightbox.njk` on 2026-10-02.

| Piece | File | Owns |
| --- | --- | --- |
| Dialog | [`molecules/lightbox/lightbox-dialog.njk`](../../views/molecules/lightbox/lightbox-dialog.md) | `<dialog>`, close button, enlarged media, dialog caption, module script |
| Media | [`molecules/figure/media.njk`](../../views/molecules/figure/media.md) | Root, trigger and in-page caption for an `image`, `picture`, or `video` source, behind `zoom: true` |
| PortableText image | `data/sanity/transforms/portableText.js` (`types.image`) | Hand-built HTML copy of root, trigger, and dialog |
| Controller | [`js/lightbox/Lightbox.js`](../../js/lightbox/Lightbox.md) | Open, close, video play/pause |

Molecules importing molecules is normal in this codebase
([README.molecules.md](../../views/molecules/README.molecules.md)), so
`media.njk` imports the dialog directly. The PortableText serializer
returns raw HTML strings and can't call Nunjucks, so **it has to be kept in
sync with `lightbox-dialog.njk` by hand**. It is the only remaining copy.

## Markup contract

`Lightbox.js` binds to `data-lightbox-el`, never to classes.

| `data-lightbox-el` | Element | Required | Notes |
| --- | --- | --- | --- |
| `root` | `<figure>` | yes | One controller per root. |
| `trigger` | `<button type="button">` | yes | `aria-haspopup="dialog"`; wraps the thumbnail. |
| `dialog` | `<dialog>` | yes | Opened with `showModal()`. |
| `close` | `<button type="button">` | yes | First focusable element in the dialog. |
| `video` | `<video>` | video only | Played on open, paused on close. |
| `caption` | `<figcaption>` | no | In-page caption under the thumbnail (`media.njk` with `zoom`, PortableText). |
| `dialog-caption` | `<figcaption>` | no | Caption inside the dialog. |

## Media sources

Precedence in `media.njk` is `video` › `picture` › `image` (the dialog
receives `image.asset.url` as `src`).

- **`image`**: Sanity image object. The only source whose page `<img>` gets
  intrinsic `width`/`height`. The dialog `<img>` is `loading="lazy"`, so it
  isn't fetched until the dialog opens.
- **`picture`**: pre-rendered `<picture>`/`<img>` HTML. Keeps responsive
  `srcset`/`sizes`, and carries its own alt and dimensions. Callers reach the
  inner `<img>` with `[&_img]:` utilities in `styles.image`.
- **`video`**: `{ src, poster, mimeType }`. The trigger shows the poster
  frame (`preload="none"`, or `"metadata"` when there's no poster, so the
  first frame can serve as the thumbnail). The trigger video never plays.

## Behavior

| Action | Result |
| --- | --- |
| Click the trigger | `dialog.showModal()`; focus moves into the dialog |
| Click Close, click the backdrop, or press Escape | Dialog closes; focus returns to the trigger (native) |
| Open with video | Video plays **muted**, unless `prefers-reduced-motion: reduce` |
| Any close path with video | Video pauses (driven by the dialog's `close` event, which Escape also fires) |

The dialog video has `controls`, so the visitor can unmute, scrub, or start
playback under reduced motion. Rejected `play()` promises are swallowed, so
the dialog still works as a viewer.

Cursor is the only visual affordance: `zoom-in` on the trigger, `zoom-out` on
the backdrop, `auto` over the content.

## Layout

- **No caption:** the media fills the dialog, capped at `90vw` × `75vh`.
- **With caption, below `lg` (md and smaller):** caption sits below the media.
- **With caption, `lg` and up:** a 3-column grid; the media spans two columns
  and the caption takes the right third. The dialog is fixed at `lg:w-[90vw]`
  so the grid has a definite width to divide.

## Accessibility

- **Trigger name:** `Enlarge image: {alt}` / `Enlarge video: {alt}`, or just
  `Enlarge image` / `Enlarge video` when there's no alt. The `aria-label`
  replaces the inner image's alt as the button's name, so the label states
  both the action and the subject.
- **Dialog name:** `alt`, then `caption`, then `Image viewer` / `Video viewer`.
  Empty strings fall through (`or`, not Nunjucks `default`, which keeps `""`).
- **No `aria-describedby` on the dialog (decided 2026-10-02).** Opening announces only the dialog name and Close; the caption follows the media in reading order. The caption is already read in the page figure beside the trigger the user just pressed, and captions run long (60+ words), so announcing it on every open is noise. Tried in `3992326f`, reverted.
- **Trigger video** is `aria-hidden` and `tabindex="-1"`; the button carries
  the name. It has no `controls`, so the button contains no interactive content.
- **Trigger and Close** render through [`atoms/button.njk`](../../views/atoms/button.md), which supplies `type="button"`, the `focus-visible` ring, and disabled styling. The PortableText trigger mirrors those classes by hand.
- **Focus trap and Escape** come from native `<dialog>`; there's no
  hand-rolled focus management.
- **Reduced motion:** no autoplay, and any future open/close transition is
  covered by `styles/utilities/reduced-motion.css`.

## Performance

- The dialog media is never fetched before the dialog opens: images are lazy,
  videos are `preload="none"`.
- Each instance emits one `<script type="module">` tag. Browsers dedupe module
  imports, so `Lightbox.js` loads once per page.
- The dialog `<img>` gets the Sanity asset's intrinsic `width`/`height` from
  `media.njk`, so the open dialog reserves the image's aspect ratio while it
  loads. `w-auto h-auto` lets `max-w-full` / `max-h-[75vh]` scale it without
  distortion. `picture` sources carry their own dimensions.

## Callers

| Caller | Source | Notes |
| --- | --- | --- |
| [`card/design-decision.njk`](../../views/molecules/card/design-decision.md) | `Media` with `zoom: true` | Page caption is `sr-only`; the dialog shows it visibly |
| PortableText `image` blocks (hero, case-study body) | Serializer | Caption from the asset's Description field |
| [`card/image.njk`](../../views/molecules/card/image.md) | `Media` with `picture`, `zoom: true` | No callers; dev/admin media card |

**No live surface uses the `video` source yet.** Project `featuredVideo`
renders only on cards, which link to the project page rather than open a
lightbox. Wire a video in by passing `video` (with `zoom: true`) to `media.njk`.

## Out of scope / open questions

- Showing alt text and description in the dialog (user story 2) beyond the caption.
- Gallery navigation between lightboxes (prev/next).
- Open/close transitions.
- Content: several PortableText images use filenames as alt text (e.g.
  `robert-lougheed_3`), which leaks into the trigger name. This needs fixing
  in Sanity, not here.
