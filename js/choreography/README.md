<!-- @format -->

# Choreography System

Event-driven GSAP animation coordination using pub/sub pattern for page-level animations.

## Architecture

- **Director.js**: Master coordinator, auto-initializes on DOMContentLoaded, exposes `window.director` API
- **StageManager.js**: Scroll smoothing (ScrollSmoother), background video, visual overlays
- **AnimationBus.js**: Pub/sub event system (`on()`, `emit()`, `off()`)
- **BaseSection.js**: Foundation class for section controllers with lifecycle methods
- **Section Controllers** (`sections/`): Hero, Work, Biography - individual section animations
- **Sequence Classes** (`sequences/`): LandingSequence - multi-section choreography coordination

## Key Files

```plaintext
js/choreography/
├── Director.js              # Initializes sections, sequences, exposes global API
├── StageManager.js          # ScrollSmoother, video backgrounds, gel effects
├── AnimationBus.js          # Event coordination
├── sections/
│   ├── BaseSection.js       # Parent class: createIntro/Outro/ScrollTriggers lifecycle
│   ├── Hero.js              # Landing hero section
│   ├── Work.js              # Work section with printer marks
│   └── Biography.js         # Biography section
└── sequences/
    └── LandingSequence.js   # Landing page event choreography
```

## Usage Patterns

**Access global API:**

```javascript
window.director.enableDebug(true); // Verbose event logging
const sections = window.director.getSections(); // Get all section controllers
window.director.restart(); // Restart entire sequence
```

**Create new section:**

```javascript
import { BaseSection } from './BaseSection.js';

export class MySection extends BaseSection {
  constructor(bus, smoother) {
    super('my-section-id', bus, smoother); // Element ID must exist in DOM
    this.createIntro();
    this.createOutro();
    this.createScrollTriggers();
  }

  createIntro() {
    // Required: Define intro timeline (auto-paused until playIntro())
    this.timeline.from('.element', { opacity: 0, duration: 1 });
  }

  createOutro() {
    // Optional: Most use scroll-based animations via createScrollTriggers()
  }

  createScrollTriggers() {
    // Optional: Auto-emits section:${id}:scroll:enter/exit events
    ScrollTrigger.create({
      trigger: this.element,
      onEnter: () => this.bus.emit(`section:${this.id}:scroll:enter`),
    });
  }
}
```

**Coordinate via sequences:**

```javascript
export class LandingSequence {
  setupSequence() {
    // React to section events
    this.bus.on('section:hero:intro:complete', () => {
      this.sections.work.playIntro();
    });

    // Add delays between sections
    this.bus.on('section:hero:intro:complete', () => {
      gsap.delayedCall(0.5, () => this.sections.work.playIntro());
    });
  }
}
```

## Standard Events

Every BaseSection emits:

```plaintext
section:${id}:intro:start       # playIntro() called
section:${id}:intro:complete    # Intro finished
section:${id}:outro:start       # playOutro() called
section:${id}:outro:complete    # Outro finished
section:${id}:scroll:enter      # ScrollTrigger onEnter
section:${id}:scroll:exit       # ScrollTrigger onLeave
```

## Common Patterns

**Page-specific sequences:**

```javascript
// Add data-page-type="project" to <body> in template
const pageType = document.body.dataset.pageType;
const SequenceClass = pageType === 'project' ? ProjectSequence : LandingSequence;
this.sequence = new SequenceClass(this.bus, this.sections);
```

**Cleanup on page transitions:**

```javascript
window.director.destroy(); // Removes all event listeners
```

## Troubleshooting

- **Element ID mismatch**: Section constructor ID must match HTML element ID exactly
- **Missing plugins**: GSAP plugins must be registered in StageManager before use
- **Scroll conflicts**: StageManager manages ScrollSmoother - access via `this.smoother`, don't re-initialize
- **Event timing**: ScrollTrigger may fire before intro completes - add delays in sequences
- **Memory leaks**: Use `bus.off()` or unsubscribe functions to clean up listeners
