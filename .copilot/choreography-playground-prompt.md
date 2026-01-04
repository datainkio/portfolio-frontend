
# Choreography Playground Prompt (11ty + Section Lifecycle Focus)

## Purpose

This prompt is intended for use with a coding model to generate a **section-focused choreography playground** inside an **11ty (Eleventy) + Nunjucks** site.

The playground enables a **UX designer/developer** to:
- Test each choreography *section* independently
- Trigger intro and outro behavior directly
- Observe event-driven side effects in real time
- Rapidly iterate on design, timing, and configuration

This is a **design and debugging harness**, not production UI.

---

## Ground Truth: Architecture

You are working with a choreography system where:

- Sections extend a common abstract base (e.g. `AbstractSection`)
- Each section exposes explicit lifecycle methods, including:
  - a method that **initiates the intro sequence**
  - a method that **initiates the outro sequence**
- Internally, sections may emit lifecycle events via an `AnimationBus`
- A `Director` may exist to orchestrate sequences across sections, but **this playground bypasses sequencing logic** in favor of direct section control

The event system still exists and should be respected internally, but **the playground UI does NOT emit events directly**.

---

## Goal

Create an **11ty playground page** that:

1. Presents each section/component in isolation
2. Allows directly invoking:
   - the section’s *intro-starting method*
   - the section’s *outro-starting method*
3. Makes event flow *observable* (log events, but do not emit them from UI)
4. Supports **Director mode** and **Manual mode**
5. Enables safe, repeated init → test → destroy cycles

Success is the ability to *tune section behavior like an instrument* without running full page choreography.

---

## Required Artifacts

### 1. `choreography-playground.njk`

An Eleventy template that renders:

#### A) Control Panel (sticky)

- **Mode toggle**
  - Director mode (initialize `Director`, but allow section-level triggering)
  - Manual mode (instantiate a single section directly)
- **Section selector**
  - Dropdown listing all available section classes
- **Lifecycle Controls**
  - `Start Intro` button
    - Calls the method on the selected section that initiates its intro sequence
  - `Start Outro` button
    - Calls the method on the selected section that initiates its outro sequence
- **System controls**
  - Init
  - Destroy
  - Restart section (destroy + re-init)
  - Clear log

⚠️ The UI must **not** emit events directly.  
All choreography must originate from section methods.

---

#### B) Stage / Preview Area

- Neutral container where section DOM is mounted
- May contain placeholder markup if real markup is unavailable
- Must survive repeated init/destroy cycles without leaks

---

#### C) Event Log

- Reverse chronological
- Timestamped
- Shows:
  - emitted events
  - received events
- Read-only (observational)
- Auto-scroll toggle

Use semantic HTML. Minimal wrapper divs.

---

### 2. `choreography-playground.js`

Client-side ES module loaded **only** on the playground page.

---

#### Import paths (editable at top)

```js
import { EVENTS } from '../js/choreography/constants.js'
import { AnimationBus } from '../js/choreography/AnimationBus.js'
import { Director } from '../js/choreography/Director.js'
// import section classes as available
```

Fail gracefully if Director or a section class is unavailable.

---

## Section Invocation Contract (important)

Because section method names may vary, the playground must:

- Define a **clear adapter layer** that maps:
  - `startIntro()` → calls the section’s intro-entry method
  - `startOutro()` → calls the section’s outro-entry method
- This mapping should be:
  - centralized
  - easy to adjust
  - explicit (no reflection magic)

Example:

```js
const SECTION_API = {
  hero: {
    intro: section => section.startIntro(),
    outro: section => section.startOutro()
  }
}
```

If a section does not support one of these actions, the UI must:
- disable the button
- display a clear status message

---

## Event Observability (still required)

Even though the UI does not emit events:

- Subscribe to all known events from `EVENTS`
- Log:
  - event name
  - timestamp
- Store unsubscribe callbacks
- Clean up all listeners on destroy

Events are **observed**, not commanded.

---

## Modes

### Manual Mode (primary)

- Instantiate:
  - `AnimationBus`
  - selected section only
- Mount section DOM into the stage
- Buttons directly invoke section intro/outro methods
- No sequencing, no scroll simulation

This is the default UX design mode.

---

### Director Mode (secondary)

- Instantiate `Director`
- Allow triggering intro/outro on the selected section only
- Director may respond to emitted events naturally
- Call `enableDebug(true)` if available

Director mode exists to validate *integration*, not design iteration.

---

## Cleanup Discipline (non-negotiable)

The playground will be used for long, iterative sessions.

You MUST:

- Track:
  - section instances
  - Director instance
  - bus subscriptions
- On destroy:
  - unsubscribe all listeners
  - call `section.destroy()` if present
  - call `director.destroy()` if present
  - remove DOM artifacts
  - reset all references

Memory leaks are unacceptable.

---

## UX Expectations

This tool is for **rapid section-level iteration**:

- Two primary buttons only:
  - Intro
  - Outro
- Immediate feedback
- No scrolling required
- Clear visibility into:
  - active section
  - last lifecycle action
  - recent events
  - current mode

Buttons should feel like *play / reverse* controls for choreography.

---

## Output Format

Return:

1. `choreography-playground.njk`
2. `choreography-playground.js`
3. A short **11ty wiring note**:
   - front matter
   - JS inclusion strategy
   - recommended URL (e.g. `/playground/choreography/`)

---

## Non-Goals

- No UI for emitting arbitrary events
- No full sequence simulation
- No production styling
- No GSAP authoring

---

## Rationale

Events are the **internal protocol**.  
Sections are the **design surface**.

This playground prioritizes *authorial control* over orchestration.
