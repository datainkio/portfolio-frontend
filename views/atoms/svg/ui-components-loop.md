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

## Hook contract

| Role | `data-process-el` |
| --- | --- |
| SVG root (widened viewBox) | `uicomponents` |
| Moving track (HERO) | `uicomponents-track` |
| Item (7 HERO children) | `uicomponents-item` |
| Invisible dwell/focus marker | `uicomponents-hero-start` |
| Fixed chrome window frame | `uicomponents-chrome` |

## viewBox (coverflow peek)

`viewBox="2171 548 1190 606"` — the CHROME bbox (`2471 548 590 606`) widened
symmetrically about center **2766** (x0 = 2766 − 1190/2 = 2171), height/y
unchanged. The extra ~300 units per side reveal the preceding/following items that
the runtime re-packs to a uniform pitch, so they peek in beyond the chrome edges
(where they fade in/out via the JS position-driven opacity — see the JS sidecar).
`preserveAspectRatio="xMidYMid meet"` keeps the chrome dead-center. Do NOT change
the Tailwind classes — the stage is height-driven (`h-48`, svg `w-auto`), so a
wider viewBox renders as a wider box at the same height and items keep their size.

**Tuning knobs** (motion detail in the JS sidecar):
- Peek amount → viewBox width + x0 (keep center = 2766).
- Neighbor gap from chrome → pitch `P` (`ITEM_PITCH` in the JS; ≥ 555, since HERO
  renders atop CHROME).
- Fade width → `FADE_RANGE` in the JS (distance from focus an item fades 1→0).

## Status

**Draft / placeholder artwork.** The item bodies are placeholder shapes; the
motion (uniform-pitch repack + widened viewport peek) works against whatever real
frames replace them, as long as the `data-process-el` hooks above stay intact.
