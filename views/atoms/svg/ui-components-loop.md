---
title: "UI Components Loop"
template: "[[ui-components-loop.njk]]"
templatePath: "views/atoms/svg/ui-components-loop.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "atom"
status: "draft"
tags:
  - "#[atom]"
  - "#[atomic-design]"
  - "#[component]"
  - "#[eleventy]"
  - "#[nunjucks]"
  - "#[Obsidian]"
  - "#[svg]"
  - "#[template]"
  - "#[ui-components]"
---

# UI Components Loop

Defines Nunjucks macro: `render`.

## Template

- Source: [[ui-components-loop.njk]]
- Path: `views/atoms/svg/ui-components-loop.njk`

## Purpose

Decorative, `aria-hidden` SVG scaffold for the Process section's looping
**index-and-dwell** UI-components sequence. Provides the `data-process-el` hook
structure the choreography scene animates. Motion lives in
[../../../js/choreography/molecules/process-motion/ui-components-loop.js](../../../js/choreography/molecules/process-motion/ui-components-loop.js);
contract in
[../../../specs/animation/ui-components.animation-spec.md](../../../specs/animation/ui-components.animation-spec.md).

## Params

| Param | Default | Notes |
| --- | --- | --- |
| `classes` | `""` | Extra classes (e.g. `text-neutral-100`). |
| `items` | `4` | Number of equal-width slot items to render. |

## Hook contract

| Role | `data-process-el` |
| --- | --- |
| SVG root | `uicomponents` |
| Clipped viewport | `uicomponents-viewport` |
| Moving track (`data-slot-width`) | `uicomponents-track` |
| Repeated item (`translate(i * slotWidth, 0)`) | `uicomponents-item` |
| Fixed highlight | `uicomponents-highlight` |
| Fixed chrome | `uicomponents-chrome` |

## Status

**Draft / placeholder artwork.** The item bodies are placeholder shapes. Replace
them with the real frames from `assets/svg/ui-components-anim.svg`, keeping
equal-width slots and item vertical placement on the viewport offset wrapper so
the runtime seamless-wrap clones position correctly.
