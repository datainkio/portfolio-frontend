
# Choreography Playground Prompt (11ty + Event System)

## Purpose

This prompt is intended for use with a coding model to generate an **event‑driven choreography playground** inside an **11ty (Eleventy) + Nunjucks** site.

The playground enables a **UX designer/developer** to:
- Test each choreography component independently
- Emit lifecycle events manually
- Observe event‑driven behavior in real time
- Iterate rapidly on design, timing, and configuration

This is a **design and debugging harness**, not production UI.

---

## Ground Truth: Event System

You MUST use the real event constants from `constants.js` as the single source of truth.

- Import `EVENTS` from `js/choreography/constants.js`
- Do NOT hardcode event strings
- Build UI controls dynamically from the `EVENTS` object shape

The event system is pub/sub based via an `AnimationBus`:

- `bus.on(eventName, callback)` → returns `unsubscribe()`
- `bus.emit(eventName, payload?)`

Sections extend a common abstract base and react to lifecycle events (intro / scroll / outro / etc.).  
Sequences and the Director chain events together.

---

## Goal

Create an **11ty playground page** that:

1. Enumerates **all available events from `EVENTS`**
2. Groups them logically in the UI (system / section / sequence / misc)
3. Allows emitting *any event* via buttons
4. Shows which sections are currently wired/listening
5. Logs all emitted and received events in real time
6. Supports **Director mode** and **Manual mode**

---

## Required Artifacts

### 1. `choreography-playground.njk`

An Eleventy template that renders:

#### A) Control Panel (sticky)
- Mode toggle:
  - Director mode (initialize `Director`)
  - Manual mode (instantiate `AnimationBus` only)
- Section selector:
  - Dropdown populated from section IDs inferred from `EVENTS`
- Event Controls:
  - Buttons generated automatically from `EVENTS`
  - Grouped by namespace
- System controls:
  - Init
  - Destroy
  - Restart
  - Clear log

#### B) Stage / Preview Area
- Neutral container where section DOM can live
- Survives repeated init/destroy cycles

#### C) Event Log
- Reverse chronological
- Timestamped
- Color‑coded (emitted / received / system)
- Auto‑scroll toggle

Use semantic HTML. Minimal wrapper divs.

---

### 2. `choreography-playground.js`

Client‑side ES module loaded **only** on the playground page.

#### Import paths (editable at top)

```js
import { EVENTS } from '../js/choreography/constants.js'
import { AnimationBus } from '../js/choreography/AnimationBus.js'
import { Director } from '../js/choreography/Director.js'
```

Fail gracefully if Director or sections are unavailable.

---

#### Event introspection (important)

You MUST:

- Traverse `EVENTS` recursively
- Produce a flat list of `{ name, path }`
- Example:
  - `system.pageReady`
  - `hero.intro.start`
  - `hero.scroll.enter`
  - `sequence.landing.start`

Use this derived list to:
- Build UI buttons
- Subscribe to events for logging
- Infer available sections

---

#### UI generation

- Buttons generated programmatically
- Clicking a button calls:

```js
bus.emit(eventName)
```

Do NOT call section methods directly.

---

#### Logging

- Subscribe to *all known events*
- Log:
  - event name
  - timestamp
  - source (emitted / received / system)
- Store unsubscribe callbacks
- Clean up everything on destroy

---

#### Modes

##### Director Mode
- Instantiate `Director`
- Call `enableDebug(true)` if available
- Let Director wire sections + sequences normally
- Event buttons still emit through the bus

##### Manual Mode
- Create `AnimationBus` only
- Optionally instantiate a single selected section
- No sequencing — purely event‑reaction testing

---

#### Cleanup discipline (non‑negotiable)

- Track all:
  - bus subscriptions
  - Director instance
  - section instances
- `destroy()` must:
  - unsubscribe all listeners
  - call `director.destroy()` if present
  - remove DOM artifacts
  - reset internal state

Memory leaks are unacceptable.

---

## Event Grouping Logic (UI)

Group events using their path in `EVENTS`, for example:

- `EVENTS.system.*` → System
- `EVENTS.sequence.*` → Sequences
- `EVENTS.hero.*`, `EVENTS.bio.*`, etc. → Sections
  - subgroup by phase (`intro`, `scroll`, `outro`)

UI must adapt automatically to new events.

---

## UX Expectations

This tool is for **design iteration**:

- Fast feedback
- No rebuilds
- No real scrolling required
- Buttons feel like a MIDI controller for choreography
- Always show:
  - active mode
  - selected section
  - last event
  - director status

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

## Non‑Goals

- No CSS polish beyond clarity
- No GSAP authoring
- No production logic
- No mocks unless required to prevent crashes

---

## Rationale

This playground exists so choreography can be **designed**, not debugged after the fact.

Treat events as the product.
