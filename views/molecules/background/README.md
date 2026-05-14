---
aix:
  id: frontend.views.molecules.background.readme
  role: Documents the background molecule — overlay container for StageManager scroll animations.
  status: stable
  surface: internal
  owner: Template Steward
  tags:
    - molecules
    - background
    - gsap
    - scroll
  type: guide
  scope: frontend
  audience: maintainers
  perf:
    readPriority: low
    cacheSafe: true
    critical: false
---

# Overlay View Molecule

Background visual effects container for StageManager's scroll-based animations.

## Purpose

Provides the DOM structure for:

- Background video display
- Grid pattern overlay (via `.bg-video` class applied by StageManager)
- Scroll-pinned background during biography section

## Usage

```njk
{# Default usage #}
{% include "molecules/overlay-view/overlay-view.njk" %}

{# Custom ID #}
{% include "molecules/overlay-view/overlay-view.njk" with { id: "custom-overlay" } %}
```

## Parameters

| Param | Type   | Default          | Description                         |
| ----- | ------ | ---------------- | ----------------------------------- |
| `id`  | string | `'overlay-view'` | Element ID for JavaScript targeting |

## JavaScript Integration

**StageManager.js** expects this template to be rendered inside `#smooth-content`:

1. Finds the element by ID
2. Stores reference as `this._view`
3. Dynamically adds video element via `addVideo()`
4. Creates ScrollTrigger to pin during scroll

**Required Parent**: Must be inside `#smooth-content` element.

## CSS Dependencies

- Utility classes: `absolute`, `inset-0`, `w-full`, `h-dvh`, `-z-10`
- Dynamic class: `.bg-video` (applied by StageManager for grid pattern)

## Atomic Design Classification

**Molecule** because it:

- Contains a single container (atom-level simplicity)
- Serves as structural foundation for dynamic effects
- Combines positioning utilities with JavaScript-driven content
- Not complex enough for organism (no nested molecules)
- Too specific for atom (has defined purpose beyond basic element)
