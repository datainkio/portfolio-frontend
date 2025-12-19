# Section Controllers - Standardized Animation Lifecycle

All section controllers extend `AbstractSection` and follow a unified lifecycle pattern for intro, scroll, and outro animations.

## Abstract Section Base Class

Every section implements this lifecycle:

```javascript
export class AbstractSection {
  // 1. Intro Phase - plays on page load
  createIntro()

  // 2. Scroll Phase - plays during scrolling
  createScrollTriggers()

  // 3. Outro Phase - plays when leaving section
  createOutro()

  // 4. State Management
  getState()        // Current section state
  reset()          // Reset animations for replay
  destroy()        // Cleanup GSAP timelines
}
```

## Lifecycle Flow

```
Page Load
  ↓
section:${id}:intro:start (event emitted)
  ↓
createIntro() executes
  ↓
[animations play]
  ↓
section:${id}:intro:complete (event emitted)
  ↓
Section becomes visible on page
  ↓
createScrollTriggers() sets up ScrollTrigger instances
  ↓
User scrolls through section
  ↓
section:${id}:scroll:enter / section:${id}:scroll:exit
  ↓
createOutro() animates section out
  ↓
section:${id}:outro:complete
```

## Creating a Custom Section

### 1. Create Controller File

```javascript
// js/choreography/sections/custom/Custom.js
import { AbstractSection } from '../abstract-section/AbstractSection.js';

export class Custom extends AbstractSection {
  constructor({ bus, dom, reducedMotionHandler, smoother, config }) {
    super('custom', bus, reducedMotionHandler, { config });

    this.dom = dom; // DOM elements for this section
    this.smoother = smoother; // GSAP ScrollSmoother instance
    this.config = config; // Animation config from choreography/config.js
  }

  // Required: Intro animation on page load
  createIntro() {
    const timeline = gsap.timeline();

    timeline.fromTo(this.dom.title, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 });

    timeline.on('complete', () => {
      this.bus.emit(`${this.id}:intro:complete`);
    });

    return timeline;
  }

  // Optional: Scroll-triggered animations
  createScrollTriggers() {
    ScrollTrigger.create({
      trigger: this.dom.container,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => this.bus.emit(`${this.id}:scroll:enter`),
      onLeave: () => this.bus.emit(`${this.id}:scroll:exit`),
      markers: window.DEBUG, // Dev helper
    });
  }

  // Optional: Outro animation when leaving
  createOutro() {
    const timeline = gsap.timeline();

    timeline.to(this.dom.title, {
      opacity: 0,
      y: -20,
      duration: 0.6,
    });

    timeline.on('complete', () => {
      this.bus.emit(`${this.id}:outro:complete`);
    });

    return timeline;
  }
}
```

### 2. Register in Director

```javascript
// js/choreography/Director.js
import { Custom } from './sections/custom/Custom.js';

export class Director {
  initialize() {
    // ... existing setup

    // Get DOM elements for custom section
    const customDom = {
      container: document.querySelector('[data-choreography="custom"]'),
      title: document.querySelector('.custom-title'),
      content: document.querySelector('.custom-content'),
    };

    // Create section instance
    const custom = new Custom({
      bus: this.animationBus,
      dom: customDom,
      reducedMotionHandler: this.reducedMotionHandler,
      smoother: this.stageManager.getSmoother(),
      config: CONFIG,
    });

    this.sections.custom = custom;
  }
}
```

### 3. Connect in Sequence

```javascript
// js/choreography/sequences/landing/LandingSequence.js
export class LandingSequence {
  start() {
    // Wait for previous section
    this.bus.on(`${previousSection}:intro:complete`, () => {
      // Play custom section intro
      this.bus.emit(`custom:intro:start`);
    });

    // Custom section listens to this
    this.bus.on(`custom:intro:start`, () => {
      this.sections.custom.createIntro();
    });
  }
}
```

## Event Naming Conventions

All sections use consistent event names:

```javascript
// Lifecycle events
`${sectionId}:intro:start` // Orchestrator signals start
`${sectionId}:intro:complete` // Section finished intro
`${sectionId}:scroll:enter` // User scrolled into section
`${sectionId}:scroll:exit` // User scrolled out of section
`${sectionId}:outro:complete`; // Section finished outro

// Example: hero section
('hero:intro:start'); // Start hero animation
('hero:intro:complete'); // Hero animation finished
('hero:scroll:enter'); // User scrolled into hero
('hero:scroll:exit'); // User scrolled out of hero
('hero:outro:complete'); // Hero outro finished
```

See [constants.js](../constants.js) for all defined event names.

## Current Sections

### Hero (`sections/hero/Hero.js`)

- **Purpose**: Landing hero with introductory animations
- **Lifecycle**: Full intro → scroll triggers → outro
- **Elements**: Title, subtitle, call-to-action
- **Events**: Emits `hero:intro:complete` when ready
- **Dom Structure**: `<section id="hero" data-choreography="hero">`

### BackgroundVideo (`sections/background/BackgroundVideo.js`)

- **Purpose**: Manages background video synchronization
- **Lifecycle**: Auto-plays on page load, syncs with scroll
- **Elements**: Video element, overlay controls
- **Events**: Syncs scroll position to video time
- **Dom Structure**: `<div id="overlay-view" data-choreography="background-video">`

### Biography (`sections/biography/Biography.js`) - Inactive

- **Purpose**: Biography section animations
- **Use**: Activate in Director to enable
- **Pattern**: Standard AbstractSection lifecycle

### Work (`sections/work/Work.js`) - Inactive

- **Purpose**: Work/portfolio section with printer marks
- **Use**: Activate in Director to enable
- **Pattern**: Standard AbstractSection lifecycle

## Recommended Structure for Sections

```plaintext
js/choreography/sections/my-section/
├── MySectionController.js      # Main controller (extends AbstractSection)
├── MySectionAnimations.js      # Timeline helpers (optional)
├── MySectionTriggers.js        # ScrollTrigger setup (optional)
└── README.md                   # Section-specific documentation
```

## Important: Respecting Reduced Motion

All animations must check accessibility preferences:

```javascript
createIntro() {
  // Check if user prefers reduced motion
  if (this.reducedMotionHandler.isReducedMotion()) {
    // Instant state change, no animation
    gsap.set(this.dom.element, { opacity: 1, y: 0 });
    this.bus.emit(`${this.id}:intro:complete`);
    return null;
  }

  // Normal animation
  const timeline = gsap.timeline();
  timeline.fromTo(this.dom.element, { opacity: 0, y: 20 }, { opacity: 1, y: 0 });
  timeline.on('complete', () => this.bus.emit(`${this.id}:intro:complete`));
  return timeline;
}
```

## State Management

Sections can track internal state:

```javascript
constructor(params) {
  super('custom', params.bus, params.reducedMotionHandler);
  this.state = {
    introPlayed: false,
    scrollTriggersCreated: false,
    currentPhase: 'idle'  // 'idle', 'intro', 'scroll', 'outro'
  };
}

getState() {
  return { ...this.state };
}

reset() {
  this.state.introPlayed = false;
  gsap.globalTimeline.clear();
}
```

## Testing Sections

### Manual Testing in Console

```javascript
// Get section instance
const hero = window.director.getSections().hero;

// Get current state
hero.getState();

// Replay intro
window.director.getSequence().reset();
window.director.getSequence().start();

// Check events
window.director.enableDebug(true); // Log all events
```

### Debugging ScrollTriggers

```javascript
// In createScrollTriggers()
ScrollTrigger.create({
  trigger: this.dom.container,
  markers: true, // Visual markers in dev
  onEnter: () => console.log('entered'),
  onLeave: () => console.log('left'),
});
```

## Performance Tips

1. **Lazy create**: Only create ScrollTriggers when section intro completes
2. **Cleanup**: Always call `destroy()` to clear GSAP timelines
3. **Grouped animations**: Use timeline batching for multi-element animations
4. **Reduced motion**: Always skip animations for users with preferences
5. **Memory**: Unsubscribe from bus events in destroy() to prevent leaks

## Integration with StageManager

Sections can access shared visual effects:

```javascript
constructor({ stageManager }) {
  super('custom', bus, reducedMotionHandler);

  // Access shared features
  this.smoother = stageManager.getSmoother();      // ScrollSmoother
  this.gels = stageManager.getGels();              // Gel animations
  this.bgManager = stageManager.getBackgroundMgr(); // Background positioning
}
```

## References

- [AbstractSection source code](./abstract-section/AbstractSection.js)
- [Hero section example](./hero/Hero.js)
- [Parent choreography system](../README.md)
- [AnimationBus events](../constants.js)
- [Animation config](../config.js)
