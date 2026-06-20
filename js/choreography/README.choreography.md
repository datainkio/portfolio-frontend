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
├── AnimationDirector.js              # Master initialization (idle-deferred on DOMContentLoaded)
├── index.js                          # Package barrel
├── system/                           # Core runtime + base classes
│   ├── AnimationBus.js               # Event pub/sub system
│   ├── NullAnimationBus.js           # No-op bus injected when no bus is provided
│   ├── AbstractSection.js            # Base class for all section controllers
│   ├── AbstractSectionAnimations.js  # Base class for section timelines
│   ├── AbstractSectionTriggers.js    # Base class for section ScrollTriggers
│   ├── PromiseResolverQueue.js       # Lifecycle promise queue
│   ├── registry.js                   # SECTION_REGISTRY (active sections)
│   └── gsap.js                       # Single GSAP import + plugin registration
├── config/                           # Choreography configuration (barrel: config/index/index.js)
│   ├── contracts/
│   │   ├── events/events.js          # Event name definitions (EVENTS)
│   │   ├── selectors/selectors.js    # DOM selectors (SELECTORS)
│   │   ├── labels/labels.js          # Timeline label constants
│   │   ├── paths/paths.js            # MotionPath path data
│   │   └── timelines/timelines.js    # TIMELINE_IDS
│   ├── ix/                           # breakpoints, motion, profiles, scrolltriggers
│   └── displays/                     # ruler / printermarks display config
├── managers/                         # Singleton managers for global behaviors
│   ├── ScrollEffectsCoordinator/     # Scroll smoothing + background/decoration effects
│   ├── ReducedMotionHandler/         # Accessibility (prefers-reduced-motion)
│   ├── ScrollSmootherManager/        # GSAP ScrollSmoother (optional)
│   ├── GelAnimationManager/          # Gel background animations
│   ├── SessionManager/               # Runtime session state
│   ├── RulerIntroManager/            # Ruler intro display choreography
│   ├── GlobalHeaderManager/          # Global header hide/show on scroll
│   ├── HomeHeaderManager/            # Home landing header role state machine
│   ├── WorkHeaderManager/            # Work jumplinks collapse/expand
│   ├── WorkNavManager/               # Work jumplink scrollspy
│   └── ProjectHeaderManager/         # Project page hero parallax
├── organisms/                        # Section controllers (extend AbstractSection)
│   ├── hero/Hero.js                  # Hero section controller
│   ├── background/BackgroundVideo.js # Video background
│   ├── bio/Bio.js                    # Biography section
│   ├── awards/Awards.js              # Awards section
│   ├── organizations/Organizations.js # Organizations section
│   ├── work/Work.js                  # Work section
│   └── card/                         # Card, CardManager, CardTriggers
├── atoms/ · molecules/ · tokens/     # Atomic motion layers (tokens → atoms → molecules)
├── templates/
│   └── landing/LandingSequence.js    # Multi-section orchestration
└── pages/
    └── Project/Project.js            # Project page controller
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
import { AnimationBus } from "./system/AnimationBus.js";
import { EVENTS } from "./config/contracts/events/events.js";

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
- See [config/contracts/events/events.js](config/contracts/events/events.js) for the complete event list

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
import AbstractSection from "./system/AbstractSection.js";
import { EVENTS } from "./config/contracts/events/events.js";

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
3. Coordinates transitions between sections
4. Maintains consistent pacing throughout

## Manager Modules

Each manager has single responsibility and can be used independently. See [[js/choreography/managers/README.managers|managers/README.managers]] for the detailed reference.

- **ReducedMotionHandler** — accessibility-first motion preference detection; all animations check this before playing.
- **ScrollSmootherManager** — initialize and manage GSAP `ScrollSmoother`; gracefully degrades to native scroll when disabled or when the required DOM (`#smooth-wrapper` / `#smooth-content`) is absent.
- **GelAnimationManager** — gel/blob background animations responding to scroll position.
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
- **Fix**: Use `EVENTS` constants from [config/contracts/events/events.js](config/contracts/events/events.js)

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

- [managers/README.managers.md](managers/README.managers.md) — detailed manager documentation
- [system/registry.js](system/registry.js) — `SECTION_REGISTRY` and section controller patterns
- [config/contracts/events/events.js](config/contracts/events/events.js) — event naming conventions (`EVENTS`)
- [config/contracts/selectors/selectors.js](config/contracts/selectors/selectors.js) — DOM selectors (`SELECTORS`)
- [config/index/index.js](config/index/index.js) — barrel export of choreography configuration
