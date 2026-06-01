<!-- @format -->

# Choreography System - Event-Driven Animation Coordination

Master coordination system for all page animations using GSAP and a publish/subscribe event bus for loose coupling between sections.

```mmd
graph TD
  AD[AnimationDirector] --> BUS[AnimationBus]
  AD --> STAGE[ScrollEffectsCoordinator]
  AD --> REG[SECTION_REGISTRY]
  REG --> HERO[Hero Section Controller]
  AD --> SEQ[LandingSequence]

  STAGE --> GEL[GelAnimationManager]

  HERO -->|emit lifecycle events| BUS
  SEQ -->|listen to events| BUS

  SEQ -. holds reference for optional timing .-> GEL
```

## Quick Overview

The choreography system coordinates animations across page sections without direct dependencies between them. Sections emit lifecycle events; orchestrators listen and trigger the next animation phase.

```
AnimationDirector (initializes everything)
   ↓
AnimationBus (pub/sub event system)
   ↓
├─ ScrollEffectsCoordinator (scroll smoothing, backgrounds, gels, lines, ruler)
├─ Section Controllers (Hero, BackgroundVideo, Bio, Awards, Organizations, Work)
└─ Sequences (LandingSequence orchestrates multi-section flow)
```

## Key Files Reference

```plaintext
js/choreography/
├── AnimationDirector.js          # Master initialization (boots on DOMContentLoaded)
├── AnimationBus.js               # Event pub/sub system
├── NullAnimationBus.js           # No-op bus used when choreography is disabled
├── ScrollEffectsCoordinator.js   # Scroll smoothing + background/decoration effects
├── config/                       # Choreography configuration (barrel export)
│   ├── contracts/
│   │   ├── events.js             # Event name definitions (EVENTS)
│   │   └── selectors.js          # DOM selectors (SELECTORS)
│   ├── ix/                       # Interaction timing / triggers
│   └── displays/                 # Display configuration
├── managers/
│   ├── ReducedMotionHandler.js   # Accessibility (prefers-reduced-motion)
│   ├── ScrollSmootherManager.js  # GSAP ScrollSmoother (optional)
│   ├── GelAnimationManager.js    # Gel background animations
│   ├── LineManager.js            # Decorative/relational lines (LeaderLine)
│   ├── SessionManager.js         # Runtime session state
│   └── RulerIntroManager.js      # Ruler intro display choreography
├── sections/
│   ├── abstract-section/
│   │   └── AbstractSection.js    # Base class for all sections
│   ├── registry.js               # Active section registry
│   ├── hero/Hero.js              # Hero section controller
│   ├── background/BackgroundVideo.js  # Video background
│   ├── bio/Bio.js                # Biography section
│   ├── awards/Awards.js          # Awards section
│   ├── organizations/Organizations.js  # Organizations section
│   └── work/Work.js              # Work section
└── sequences/
    └── landing/LandingSequence.js  # Multi-section orchestration
```

## Core Architecture

### Master Initialization (AnimationDirector.js)

- Boots on `DOMContentLoaded`
- Creates AnimationBus for event coordination
- Initializes ScrollEffectsCoordinator for scroll smoothing + background/decoration effects
- Instantiates section controllers from [system/registry.js](system/registry.js): Hero, BackgroundVideo, Bio, Awards, Organizations, Work
- Starts LandingSequence choreography
- Exposes `window.director` API for debugging and control

**Public API:**

```javascript
window.director.enableDebug(true); // Enable event logging
window.director.getSections(); // Get section instances
window.director.getSequence(); // Get LandingSequence
window.director.getStage(); // Get ScrollEffectsCoordinator
window.director.restart(); // Reset and replay sequence
window.director.destroy(); // Cleanup everything
```

### Event Bus (AnimationBus.js)

Tiny pub/sub system enabling loose coupling between animations:

```javascript
import { AnimationBus } from "./AnimationBus.js";
import { EVENTS } from "./config/contracts/events.js";

const bus = new AnimationBus();

// Listen for events
bus.on(EVENTS.hero.introComplete, () => {
  console.log("Hero intro finished");
});

// Emit events
bus.emit(EVENTS.hero.introComplete);

// Cleanup (returns unsubscribe function)
const unsubscribe = bus.on(event, callback);
unsubscribe(); // Remove listener
```

**Event Naming Convention:**

- `${section}:${phase}:${state}`
- Example: `hero:intro:start`, `hero:intro:complete`
- See [config/contracts/events.js](config/contracts/events.js) for the complete event list

### Scroll Effects Coordinator (ScrollEffectsCoordinator.js)

Coordinates site-wide scroll-driven and background visual effects via specialized manager modules:

```javascript
const coordinator = new ScrollEffectsCoordinator(animationBus);

coordinator.getSmoother(); // Get GSAP ScrollSmoother instance (when enabled)
coordinator.getGels?.(); // Get gel animation controllers (if exposed)
```

**Responsibilities:**

- ✓ Scroll smoothing (via ScrollSmootherManager)
- ✓ Reduced-motion accessibility (via ReducedMotionHandler)
- ✓ Gel animations (via GelAnimationManager)
- ✓ Decorative/relational lines (via LineManager)
- ✓ Ruler intro choreography (via RulerIntroManager)
- ✓ Session state management (via SessionManager)

### Section Controllers

All sections extend `AbstractSection` with standardized lifecycle:

```
section:${id}:intro:start
    ↓
  [intro animations]
    ↓
section:${id}:intro:complete
    ↓
  [on-screen, scroll-triggered]
    ↓
section:${id}:scroll:{enter|exit}
    ↓
  [outro animations when leaving]
    ↓
section:${id}:outro:complete
```

**Available Sections** (see [system/registry.js](system/registry.js)):

- `Hero` - Landing hero with introductory animations
- `BackgroundVideo` - Background video playback and synchronization
- `Bio` - Biography section with animations
- `Awards` - Awards showcase
- `Organizations` - Organizations showcase
- `Work` - Work section

**Creating New Sections:**

```javascript
import AbstractSection from "./abstract-section/AbstractSection.js";
import { EVENTS } from "../config/contracts/events.js";

export class CustomSection extends AbstractSection {
  constructor({ bus, reducedMotionHandler }) {
    super("custom-section", bus, reducedMotionHandler);
  }

  createIntro() {
    // Define intro animations
    return this.bus.emit(`${this.id}:intro:complete`);
  }

  createOutro() {
    // Define outro animations
    return this.bus.emit(`${this.id}:outro:complete`);
  }

  createScrollTriggers() {
    // Define scroll-triggered animations
  }
}
```

### Animation Sequences (LandingSequence.js)

Orchestrates multi-section animation flow:

```javascript
import { LandingSequence } from "./templates/landing/LandingSequence.js";

const sequence = new LandingSequence(bus, sections, gelAnimation);
sequence.start(); // Begin choreography
sequence.reset(); // Reset all animations
sequence.destroy(); // Cleanup
```

**How It Works:**

1. Listens for intro:complete from Hero
2. Triggers Work section animation on completion
3. Initializes `LineManager`, which draws lead lines from `SOCKETS` (id-keyed origin/terminus socket pairs) and applies `LINE_STYLES.classes` to each generated LeaderLine SVG for stroke/fill styling
4. Keeps lines hidden by default and reveals them as sections emit `intro:complete` via `LineManager.showLineBySocketPair(originSectionId, terminusSectionId)`
5. Coordinates transitions between sections
6. Maintains consistent pacing throughout

## Manager Modules

Each manager has single responsibility and can be used independently. See [[js/choreography/managers/README.managers|managers/README.managers]] for the detailed reference.

- **ReducedMotionHandler** — accessibility-first motion preference detection; all animations check this before playing.
- **ScrollSmootherManager** — initialize and manage GSAP `ScrollSmoother`; gracefully degrades to native scroll when disabled or when the required DOM (`#smooth-wrapper` / `#smooth-content`) is absent.
- **GelAnimationManager** — gel/blob background animations responding to scroll position.
- **LineManager** — decorative/relational lines drawn between sockets using LeaderLine; hidden by default and revealed as sections emit `intro:complete`.
- **SessionManager** — runtime session state used to gate one-time animations and preferences.
- **RulerIntroManager** — ruler-style intro overlay choreography.

## Event Patterns

### Phase Coordination Pattern

```javascript
// Section A emits intro:complete
bus.emit(`${sectionA}:intro:complete`);

// Orchestrator listens and starts section B
bus.on(`${sectionA}:intro:complete`, () => {
  bus.emit(`${sectionB}:intro:start`);
});

// Section B reacts to start event
bus.on(`${sectionB}:intro:start`, () => {
  this.playIntroAnimation();
});
```

### Scroll Coordination Pattern

```javascript
// On scroll enter/exit
bus.emit(`${section}:scroll:enter`);
bus.emit(`${section}:scroll:exit`);

// Orchestrator reacts
bus.on(`${section}:scroll:enter`, () => {
  // Show scroll-triggered content
});
```

## Performance & Debugging

### Enable Debug Logging

```javascript
window.director.enableDebug(true);
// or
window.director.getSequence().enableDebug(true);
```

### Common Issues & Solutions

**Issue**: Animations not playing in order

- **Check**: Event names match exactly (case-sensitive)
- **Fix**: Use `EVENTS` constants from [config/contracts/events.js](config/contracts/events.js)

**Issue**: ScrollSmoother conflicts with fixed backgrounds

- **Check**: Required DOM exists (`#smooth-wrapper`, `#smooth-content`) and fixed background elements live outside the transformed wrapper
- **Fix**: Move fixed/decorative backgrounds out of `#smooth-content` so transforms do not break `position: fixed`

**Issue**: Animations ignore `prefers-reduced-motion`

- **Check**: Manager is initialized and respects handler
- **Fix**: Use `reducedMotionHandler.isReducedMotion()` checks

**Issue**: Memory leaks from event listeners

- **Check**: All `bus.on()` subscriptions are cleaned up
- **Fix**: Call returned unsubscribe function or use `bus.off()`

## Integration with Templates

Sections require specific DOM structure in Nunjucks templates:

```nunjucks
{# Hero section with animation hooks #}
<section id="hero" class="hero-section">
  {# Hero content #}
</section>

{# Background elements (must be in correct container) #}
<div id="overlay-view">
  {% picture backgroundImage %}
</div>

{# Smooth scroll wrapper (optional) #}
<div id="smooth-wrapper">
  <div id="smooth-content">
    {# Page content #}
  </div>
</div>
```

## References

- [[js/choreography/managers/README.managers|managers/README.managers]] — detailed manager documentation
- [[js/choreography/sections/README.sections|sections/README.sections]] — section controller patterns
- [config/contracts/events.js](config/contracts/events.js) — event naming conventions (`EVENTS`)
- [config/contracts/selectors.js](config/contracts/selectors.js) — DOM selectors (`SELECTORS`)
- [config/index.js](config/index.js) — barrel export of choreography configuration
