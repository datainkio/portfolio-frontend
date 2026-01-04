
# Hero Section IxD Playground Prompt (11ty)

## Purpose

This prompt is intended for use with a coding model to generate a **highly focused interaction-design playground** for a **single choreography section: the Hero**.

The goal is to support **IxD tuning** — allowing a UX designer/developer to repeatedly trigger the Hero’s intro and outro animations in isolation to determine the animation settings, timing, and feel that produce the best interaction design.

This is a **design instrument**, not an orchestration tool.

---

## Scope (Intentional Simplification)

This iteration intentionally assumes:

- Only **one section exists**: `Hero`
- No need to manage, select, or compare multiple sections
- No need to emit arbitrary events from the UI
- No sequencing, no scroll simulation, no cross-section coordination

Everything is optimized for **rapid, repeatable Hero animation testing**.

---

## Ground Truth: Architecture

You are working with a choreography system where:

- `Hero` extends a shared abstract base (e.g. `AbstractSection`)
- `Hero` exposes explicit lifecycle methods, including:
  - a method that **initiates the intro animation**
  - a method that **initiates the outro animation**
- Internally, `Hero` may emit lifecycle events via an `AnimationBus`
- A `Director` *may* exist in the broader system, but is **not required** for this playground

The playground UI **does not emit events directly**.  
All choreography is initiated by calling methods on the `Hero` instance.

---

## Goal

Create an **11ty playground page** that:

1. Instantiates the `Hero` section in isolation
2. Mounts its DOM into a controlled stage area
3. Provides **two primary controls only**:
   - `Start Intro`
   - `Start Outro`
4. Allows repeated play / reverse cycles without reloads
5. Makes event flow observable for debugging and insight
6. Supports fast iteration on animation parameters

Success is the ability to answer:

> “Which animation settings produce the best Hero interaction?”

---

## Required Artifacts

### 1. `hero-playground.njk`

An Eleventy template that renders:

#### A) Control Panel (minimal, sticky)

- **Lifecycle Controls**
  - `Start Intro` button
    - Calls the Hero method that initiates its intro animation
  - `Start Outro` button
    - Calls the Hero method that initiates its outro animation
- **System Controls**
  - Init Hero
  - Destroy Hero
  - Restart (destroy + re-init)
  - Clear log

There is **no section selector** and **no mode toggle**.

---

#### B) Stage / Preview Area

- Neutral container where the Hero DOM is mounted
- Sized to resemble its real context (full-width / viewport-height if appropriate)
- Must survive repeated init/destroy cycles without memory leaks

---

#### C) Event Log (observational)

- Reverse chronological
- Timestamped
- Logs events emitted by Hero via the `AnimationBus`
- Read-only
- Auto-scroll toggle

Events are visible, but not controlled.

---

### 2. `hero-playground.js`

Client-side ES module loaded **only** on the Hero playground page.

---

## Imports (editable at top)

```js
import { EVENTS } from '../js/choreography/constants.js'
import { AnimationBus } from '../js/choreography/AnimationBus.js'
import { Hero } from '../js/choreography/sections/Hero.js'
```

Fail gracefully if Hero cannot be instantiated.

---

## Hero Invocation Contract (explicit)

The playground must define **exactly how** it interacts with the Hero section.

Example:

```js
const heroAPI = {
  startIntro: hero => hero.startIntro(),
  startOutro: hero => hero.startOutro()
}
```

If method names differ, this adapter layer is the **only place** that should change.

Buttons in the UI call only these adapter functions.

---

## Event Observability

Even though the UI does not emit events:

- Subscribe to relevant events from `EVENTS.hero.*`
- Log:
  - event name
  - timestamp
- Store unsubscribe callbacks
- Clean up all listeners on destroy

Events exist to help evaluate timing and flow, not to drive the UI.

---

## Lifecycle Discipline (non-negotiable)

This playground is intended for **long IxD tuning sessions**.

You MUST:

- Track:
  - Hero instance
  - AnimationBus instance
  - event subscriptions
- On destroy:
  - unsubscribe all listeners
  - call `hero.destroy()` if present
  - remove Hero DOM
  - reset references

Memory leaks are unacceptable.

---

## UX Expectations

This tool should feel like an **IxD test rig**:

- Two primary buttons only:
  - Intro
  - Outro
- Immediate visual response
- No scrolling required
- Clear visibility into:
  - current Hero state
  - last lifecycle action
  - recent events

Buttons should feel like **play / reverse** controls for motion design.

---

## Output Format

Return:

1. `hero-playground.njk`
2. `hero-playground.js`
3. A short **11ty wiring note**:
   - front matter
   - how JS is scoped to this page
   - recommended URL (e.g. `/playground/hero/`)

---

## Non-Goals

- No multi-section management
- No Director orchestration
- No arbitrary event emission
- No production styling
- No GSAP authoring

---

## Rationale

This playground treats the Hero animation as a **design surface**, not a system component.

The purpose is not correctness —  
the purpose is **feel**.
