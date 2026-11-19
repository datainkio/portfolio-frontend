---
description: "Decorative overlay: an absolutely positioned layer with the pixelated `bg-pixelator` pattern that covers its container and passes pointer events through."
type: template
links:
  - "[sizzle-background](../molecules/background/sizzle-background.md)"
---

# Pixelator

A decorative overlay that pixelates whatever sits behind it. It's an empty `<div>` with `absolute inset-0 bg-pixelator pointer-events-none`, so the container must be positioned, and clicks pass through to the content underneath.

## Template

- Source: [[pixelator.njk]]
- Path: `views/atoms/pixelator.njk`

## Params

| Param | Type | Description                                                                                           |
| ----- | ---- | ----------------------------------------------------------------------------------------------------- |
| —     | —    | None. `render()` takes no params; `classes` is not read, so the overlay can't be restyled per caller. |

## Relationships

- Used by:
  - [[sizzle-background.njk]], over the background video
- Styles: `.bg-pixelator` is defined in `styles/backgrounds/Overlays.css`.

## Accessibility

Purely decorative and empty, so assistive technology ignores it. Its caller, `sizzle-background`, also hides the whole background from assistive technology.
