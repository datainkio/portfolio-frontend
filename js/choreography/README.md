<!-- @format -->

# Choreography System - Event-Driven Animation Coordination

Master coordination system for all page animations using GSAP and a publish/subscribe event bus for loose coupling between sections.

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

## Core Architecture

### Master Initialization (Director.js)

- Boots on `DOMContentLoaded`
- Creates AnimationBus for event coordination
- Initializes StageManager for visual effects
- Instantiates section controllers (Hero, BackgroundVideo)
- Starts LandingSequence choreography
- Exposes `window.director` API for debugging and control

**Initialization Flow Diagram:**

See [director-initialization-sequence.md](../../docs/director-initialization-sequence.md) for a detailed sequence diagram showing exactly how Director, AnimationBus, managers, and sections initialize in order.

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
import { AnimationBus } from './AnimationBus.js';
import { EVENTS } from './constants.js';

const bus = new AnimationBus();

// Listen for events
bus.on(EVENTS.hero.introComplete, () => {
  console.log('Hero intro finished');
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
- See `constants.js` for complete event list

### ScrollEffectsCoordinator (ScrollEffectsCoordinator.js)

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
import { AbstractSection } from './abstract-section/AbstractSection.js';
import { EVENTS } from '../constants.js';

export class CustomSection extends AbstractSection {
  constructor({ bus, reducedMotionHandler }) {
    super('custom-section', bus, reducedMotionHandler);
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
import { LandingSequence } from './sequences/landing/LandingSequence.js';

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

### Creating Sequences (Listening to Events)

Sequences listen to section events and orchestrate multi-step animation flows. Use the AnimationBus to subscribe to section lifecycle events:

```javascript
import { AnimationBus } from '../AnimationBus.js';
import { EVENTS } from '../constants.js';

export class CustomSequence {
  constructor({ bus, sections = {} } = {}) {
    this.bus = bus;
    this.sections = sections;
    this._listeners = []; // Track subscriptions for cleanup
  }

  start() {
    // Listen for hero intro to complete, then start next section
    const heroIntroListener = this.bus.on(EVENTS.hero.introComplete, () => {
      console.log('Hero intro done, starting work section...');
      this.bus.emit(EVENTS.work.introStart);
    });
    this._listeners.push(heroIntroListener);

    // Listen for work intro to complete
    const workIntroListener = this.bus.on(EVENTS.work.introComplete, () => {
      console.log('Work intro done, revealing bio...');
      this.bus.emit(EVENTS.bio.introStart);
    });
    this._listeners.push(workIntroListener);

    // Start the chain
    this.bus.emit(EVENTS.hero.introStart);
  }

  destroy() {
    // Clean up all listeners to prevent memory leaks
    this._listeners.forEach(unsubscribe => unsubscribe());
    this._listeners = [];
  }
}
```

**Event Listening Best Practices:**

1. **Store unsubscribe functions**: Each `bus.on()` returns a cleanup function
2. **Clean up on destroy**: Always call stored unsubscribe functions in `destroy()`
3. **Use event constants**: Import from `constants.js` to avoid string typos
4. **Chain events logically**: Listen for one event, emit the next event
5. **Handle edge cases**: Check `reducedMotionHandler` before long sequences

**Common Event Flow:**

```javascript
// Event names follow: section:phase:state pattern

// Intro sequence
EVENTS.hero.introStart; // → hero section begins intro
EVENTS.hero.introComplete; // → hero intro finished, safe to start next

// Scroll sequence
EVENTS.hero.scrollEnter; // → hero enters viewport
EVENTS.hero.scrollExit; // → hero leaves viewport
EVENTS.hero.outroStart; // → outro begins
EVENTS.hero.outroComplete; // → outro finished

// Custom events
EVENTS.system.preloaderOut; // → preloader animation done
EVENTS.system.pageReady; // → page fully initialized
```

See [constants.js](./constants.js) for the complete list of available events for all sections.

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
- **Fix**: Use `EVENTS` constants from `constants.js`

**Issue**: ScrollSmoother conflicts with fixed backgrounds

- **Check**: BackgroundLayerManager configuration
- **Fix**: Ensure background elements are in correct containers

**Issue**: Animations ignore `prefers-reduced-motion`

- **Check**: Manager is initialized and respects handler
- **Fix**: Use `reducedMotionHandler.isReducedMotion()` checks

**Issue**: Memory leaks from event listeners

- **Check**: All `bus.on()` subscriptions are cleaned up
- **Fix**: Call returned unsubscribe function or use `bus.off()`

## Section Structure Patterns

### The Three-File Pattern (Recommended)

All sections follow a consistent 3-file structure for maximum extensibility and consistency:

```
sections/
└── my-section/
    ├── MySection.js          # Controller: initializes animations, triggers, events
    ├── MyAnimations.js       # Animation definitions extending AbstractSectionAnimations
    └── MyTriggers.js         # Scroll triggers extending AbstractSectionTriggers
```

**MySection.js (Controller):**

```javascript
import AbstractSection from '../abstract-section/AbstractSection.js';
import { EVENTS } from '../../constants.js';
import { SELECTORS, ANIMATION_DEFAULTS } from '../../config.js';
import MyAnimations from './MyAnimations.js';
import MyTriggers from './MyTriggers.js';

export default class MySection extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.mySection);
    const animations = new MyAnimations(view, ANIMATION_DEFAULTS);
    const triggers = new MyTriggers(view);
    const events = EVENTS.mySection;

    super({ view, animations, triggers, events, bus, reducedMotionHandler });

    if (this.triggers) {
      this.triggers.section = this;
    }
  }
}
```

**MyAnimations.js (Animation Logic):**

```javascript
import AbstractSectionAnimations from '../abstract-section/AbstractSectionAnimations.js';

export default class MyAnimations extends AbstractSectionAnimations {
  constructor(view, options = {}) {
    super(view);
    this.options = options;
    // Build GSAP timelines with intro/outro labels
    this._buildIntroAnimation();
    this._buildOutroAnimation();
  }

  intro() {
    return this.timeline.play('intro');
  }

  outro() {
    return this.timeline.play('outro');
  }
}
```

**MyTriggers.js (Scroll Triggers):**

```javascript
import AbstractSectionTriggers from '../abstract-section/AbstractSectionTriggers.js';

export default class MyTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    // Custom scroll triggers for this section
  }

  destroy() {
    this.kill();
    this.section = null;
  }
}
```

### Pattern Benefits

✓ **Separation of Concerns**: Controller, animation, triggers are distinct responsibilities  
✓ **Easy to Extend**: Adding animations doesn't require architectural changes  
✓ **Discoverable**: Clear file names make code easy to navigate  
✓ **Testable**: Each class can be tested independently  
✓ **Consistent**: All sections follow the same pattern (Hero, Bio, BackgroundVideo, etc.)

### When a Section is Minimal (Like Bio Currently)

When a section has no animations yet (like Bio), the pattern still holds:

- **BioAnimations.js** is a thin wrapper—this is intentional and correct
- **BioTriggers.js** extends base triggers—no custom scroll logic yet
- **Bio.js** remains the controller—no changes needed

**Do not consolidate minimal sections.** The 3-file structure means future animation additions require **zero refactoring**—just fill in the BioAnimations methods and you're done.

### Real-World Example: Hero Section

Hero demonstrates the full pattern with actual implementation:

- **HeroAnimations.js (149 lines)**: Contains word-by-word reveal, scramble text, throw animation
- **HeroTriggers.js (37 lines)**: Custom scroll triggers for outro on scroll-away
- **Hero.js (40 lines)**: Initializes it all with options object pattern

The pattern scales seamlessly from minimal (Bio) to complex (Hero).

## Key Files Reference

```plaintext
js/choreography/
├── Director.js                    # Master initialization
├── AnimationBus.js               # Event pub/sub system
├── ScrollEffectsCoordinator.js   # Visual effects coordinator
├── constants.js                  # Event name definitions
├── config.js                     # Animation settings (timings, easing)
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
- See [constants.js](./constants.js) for event naming conventions
- See [config.js](./config.js) for animation timing and easing
