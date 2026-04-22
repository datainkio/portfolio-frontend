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
Director (initializes everything)
   ↓
AnimationBus (pub/sub event system)
   ↓
├─ StageManager (scroll smoothing, backgrounds, gels)
├─ Section Controllers (Hero, Work, Biography, BackgroundVideo)
└─ Sequences (LandingSequence orchestrates multi-section flow)
```

## Key Files Reference

```plaintext
js/choreography/
├── AnimationDirector.js          # Master initialization
├── AnimationBus.js               # Event pub/sub system
├── ScrollEffectsCoordinator.js   # Visual effects coordinator
├── config/
│   ├── events.js                 # Event name definitions
│   ├── runtime.js                # Animation settings (timings, selectors, triggers)
│   ├── motion.js                 # Motion tokens/helpers
│   └── arrangements.js           # Section-to-gel arrangement maps
├── managers/
│   ├── ReducedMotionHandler.js   # Accessibility
│   ├── BackgroundLayerManager.js # Fixed positioning
│   ├── ScrollSmootherManager.js  # Smooth scrolling
│   ├── GelAnimationManager.js    # Gel effects
│   └── SessionManager.js         # Session state
├── sections/
│   ├── abstract-section/
│   │   └── AbstractSection.js    # Base class for all sections
│   ├── hero/Hero.js              # Hero section controller
│   ├── background/BackgroundVideo.js  # Video background
│   └── [other sections...]
└── sequences/
    └── landing/LandingSequence.js # Multi-section orchestration
```

## Core Architecture

### Master Initialization (Director.js)

- Boots on `DOMContentLoaded`
- Creates AnimationBus for event coordination
- Initializes StageManager for visual effects
- Instantiates section controllers (Hero, BackgroundVideo)
- Starts LandingSequence choreography
- Exposes `window.director` API for debugging and control

**Public API:**

```javascript
window.director.enableDebug(true); // Enable event logging
window.director.getSections(); // Get section instances
window.director.getSequence(); // Get LandingSequence
window.director.getStage(); // Get StageManager
window.director.restart(); // Reset and replay sequence
window.director.destroy(); // Cleanup everything
```

### Event Bus (AnimationBus.js)

Tiny pub/sub system enabling loose coupling between animations:

```javascript
import { AnimationBus } from "./AnimationBus.js";
import { EVENTS } from "./config/events.js";

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
- See `config/events.js` for complete event list

### Stage Manager (StageManager.js)

Coordinates site-wide visual effects via specialized manager modules:

```javascript
const stageManager = new StageManager(animationBus);

stageManager.getSmoother(); // Get GSAP ScrollSmoother instance
stageManager.getGels(); // Get gel animation controllers
```

**Responsibilities:**

- ✓ Scroll smoothing (via ScrollSmootherManager)
- ✓ Background layer positioning (via BackgroundLayerManager)
- ✓ Gel animations (via GelAnimationManager)
- ✓ Accessibility handling (via ReducedMotionHandler)
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

**Available Sections:**

- `Hero` - Landing hero with introductory animations
- `BackgroundVideo` - Background video playback and synchronization
- `Bio` - Biography section with animations
- `Organizations` - Organizations showcase section

**Creating New Sections:**

```javascript
import { AbstractSection } from "./abstract-section/AbstractSection.js";
import { EVENTS } from "../config/events.js";

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
import { LandingSequence } from "./sequences/landing/LandingSequence.js";

const sequence = new LandingSequence(bus, sections, gelAnimation);
sequence.start(); // Begin choreography
sequence.reset(); // Reset all animations
sequence.destroy(); // Cleanup
```

**How It Works:**

1. Listens for intro:complete from Hero
2. Triggers Work section animation on completion
3. Initializes `LineManager`, which draws lead lines from `SECTION_LEAD_LINE_POINTS` (point pairs with `section`, `element`, and x/y anchors) and resolves connector colors from Tailwind theme tokens
4. Keeps lines hidden by default and reveals them as sections emit `intro:complete` via `LineManager.showLineBySection()`
5. Coordinates transitions between sections
6. Maintains consistent pacing throughout

## Manager Modules

Each manager has single responsibility and can be used independently:

### ReducedMotionHandler

- **Purpose**: Accessibility-first motion preference detection
- **Use**: All animations check this before playing

### BackgroundLayerManager

- **Purpose**: Fix ScrollSmoother positioning issues with fixed elements
- **Problem**: ScrollSmoother transforms break `position:fixed`
- **Solution**: Move fixed backgrounds outside transformed container

### ScrollSmootherManager

- **Purpose**: Initialize and manage GSAP ScrollSmoother
- **Optional**: Gracefully degrades to native scroll if disabled

### GelAnimationManager

- **Purpose**: Manage gel background animations
- **Use**: Liquid gel effects responding to scroll position

### SessionManager

- **Purpose**: Persist user interaction state
- **Use**: Track which animations have played, user preferences

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
- **Fix**: Use `EVENTS` constants from `config/events.js`

**Issue**: ScrollSmoother conflicts with fixed backgrounds

- **Check**: BackgroundLayerManager configuration
- **Fix**: Ensure background elements are in correct containers

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

- See [managers/README.md](./managers/README.md) for detailed manager documentation
- See [sections/README.md](./sections/README.md) for section controller patterns
- See [config/events.js](./config/events.js) for event naming conventions
- See [config/index.js](./config/index.js) for animation timing and easing
