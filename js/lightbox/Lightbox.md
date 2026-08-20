---
title: "Lightbox"
module: "[[Lightbox.js]]"
modulePath: "js/lightbox/Lightbox.js"
engine: "Browser ESM"
system: "Eleventy"
type: "script"
scriptRole: "controller"
status: "active"
tags:
  - js
  - module
  - lightbox
links:
  - "[lightbox.njk](../../views/molecules/lightbox/lightbox.md)"
---

# Lightbox

Browser-side controller for the `lightbox.njk` molecule. Progressive
enhancement: without JavaScript the trigger button renders but the dialog
never opens (accepted tradeoff — same pattern as `ContactForm.js`).

## Source

- Module: [[Lightbox.js]]
- Path: `js/lightbox/Lightbox.js`
- Loaded via: `<script type="module">` at the end of
  [`lightbox.njk`](../../views/molecules/lightbox/lightbox.md). Passed through
  to `/assets/js/lightbox/Lightbox.js` by `.eleventy.js`'s `{ js: "assets/js" }`
  passthrough copy.

## Responsibilities

1. Find each `[data-lightbox-el="root"]` and wire its trigger, dialog, and
   close button together.
2. Trigger click → `dialog.showModal()`.
3. Close button click, backdrop click (click target is the `<dialog>` itself,
   not its content), or Escape (native `<dialog>` behavior) → `dialog.close()`.

Focus trapping and Escape-to-close come from the native `<dialog>` element —
no hand-rolled focus management.

## Public Exports

- `Lightbox` — the controller class (one instance per `[data-lightbox-el="root"]`).
- `initLightboxes(root = document)` — wires all lightboxes under `root`.

The module self-initializes on import (on `DOMContentLoaded`, or immediately if
the DOM is already parsed).

## Notes for Future Maintenance

- Keep this sidecar in sync if the `data-lightbox-el` attribute contract in
  `lightbox.njk` changes.
- Not part of the GSAP choreography system (`js/choreography/`) — this is a
  simple click-triggered UI interaction, not scroll- or timeline-driven, so it
  intentionally does not go through `AnimationBus` or `AnimationDirector`.
