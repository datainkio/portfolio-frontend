<!-- @format -->

# Choreography Package

**Event-driven animation coordination system** for complex, sequenced page animations using GSAP and ScrollTrigger.

## Architecture

The choreography system uses an **Event Bus pattern** to decouple animation sequences from section implementations:

- **AnimationBus**: Central event coordinator - sections emit events, sequences react
- **BaseSection**: Foundation class providing standard intro/outro/scroll lifecycle
- **Section Controllers**: Hero, Work, Biography - define specific animations
- **Sequence Classes**: LandingSequence - choreograph multi-section flows
- **Director**: Master coordinator - initializes system and exposes global API

## Quick Start

```javascript
// Enable debug mode to see event flow
window.director.enableDebug(true);

// Access section controllers
const { hero, work, biography } = window.director.getSections();

// Manually trigger animations
hero.playIntro();
work.playOutro();

// Restart entire sequence
window.director.restart();
```

## Creating New Sections

**CRITICAL**: All sections MUST extend `BaseSection` and implement three lifecycle methods:

```javascript
// js/choreography/sections/MySection.js
import { BaseSection } from './BaseSection.js';

export class MySection extends BaseSection {
  constructor(bus, smoother) {
    super('my-section-id', bus, smoother); // Element ID in HTML
    this.createIntro();
    this.createOutro();
    this.createScrollTriggers();
  }

  /**
   * REQUIRED: Define intro animation timeline
   * Timeline is paused by default - playIntro() triggers it
   */
  createIntro() {
    this.timeline
      .from('.my-element', { opacity: 0, y: 100, duration: 1 })
      .from('.another-element', { opacity: 0, duration: 0.5 }, '-=0.3');
  }

  /**
   * OPTIONAL: Define outro animation
   * Can reverse intro timeline or create separate animation
   */
  createOutro() {
    // Most sections use scroll-based outros via createScrollTriggers()
  }

  /**
   * OPTIONAL: Define scroll-based animations
   * Automatically emits scroll:enter and scroll:exit events
   */
  createScrollTriggers() {
    ScrollTrigger.create({
      trigger: this.element,
      start: 'top center',
      onEnter: () => this.bus.emit(`section:${this.id}:scroll:enter`),
      onLeave: () => this.bus.emit(`section:${this.id}:scroll:exit`),
    });
  }
}
```

**DOM Requirements**: Section ID (`my-section-id`) MUST exist in HTML before controller initializes.

## Modifying Animation Sequences

**All choreography logic lives in sequence classes** - never modify section controllers to change timing:

```javascript
// js/choreography/sequences/LandingSequence.js
export class LandingSequence {
  setupSequence() {
    // Hero completes → trigger Work
    this.bus.on('section:hero:intro:complete', () => {
      this.sections.work.playIntro();
    });

    // Add delay between sections
    this.bus.on('section:hero:intro:complete', () => {
      gsap.delayedCall(0.5, () => {
        this.sections.work.playIntro();
      });
    });

    // Scroll-triggered sequences
    this.bus.on('section:hero:scroll:exit', () => {
      this.sections.biography.playIntro();
    });

    // Chain multiple reactions
    this.bus.on('section:work:intro:complete', () => {
      this.bus.emit('printermarks:show');
      gsap.to('#overlay', { opacity: 0.3, duration: 1 });
    });
  }
}
```

## Standard Animation Events

Every section automatically emits these events:

```javascript
`section:${sectionId}:intro:start` // playIntro() called
`section:${sectionId}:intro:complete` // Intro animation finished
`section:${sectionId}:outro:start` // playOutro() called
`section:${sectionId}:outro:complete` // Outro animation finished
`section:${sectionId}:scroll:enter` // ScrollTrigger onEnter
`section:${sectionId}:scroll:exit`; // ScrollTrigger onLeave
```

**Usage**: Listen for these in sequence classes to coordinate multi-section animations.

## Adding New Page Sequences

```javascript
// 1. Create new sequence class
// js/choreography/sequences/ProjectSequence.js
export class ProjectSequence {
  constructor(bus, sections) {
    this.bus = bus;
    this.sections = sections;
    this.setupSequence();
  }

  setupSequence() {
    // Define project page choreography
  }

  start() {
    this.sections.projectHero.playIntro();
  }
}

// 2. Update Director to use page-specific sequences
// js/choreography/Director.js
import { ProjectSequence } from './sequences/ProjectSequence.js';

const pageType = document.body.dataset.pageType;
const SequenceClass = pageType === 'project' ? ProjectSequence : LandingSequence;
this.sequence = new SequenceClass(this.bus, this.sections);
```

**Template Requirement**: Add `data-page-type="project"` to body element in page templates.

## Debug Mode

```javascript
// Enable verbose event logging
window.director.enableDebug(true);

// Console output shows:
// [AnimationBus] section:hero:intro:start {}
// [AnimationBus] section:hero:intro:complete {}
// [AnimationBus] section:work:intro:start {}
```

**Critical for development**: Always enable debug when creating new sequences to verify event flow.

## Performance Considerations

- **Event Listeners**: Use `bus.off()` or returned unsubscribe function to prevent memory leaks
- **ScrollTrigger**: Set `scrub: true` for smooth scroll-linked animations
- **Timeline Reuse**: Don't recreate timelines - pause/play existing ones
- **Hardware Acceleration**: Use transforms (x, y, scale, rotate) instead of top/left/width

## Common Gotchas

- **Element ID Mismatch**: Section constructor ID must match HTML element ID exactly
- **Event Typos**: Event names are case-sensitive strings - use constants for safety
- **Timing Races**: ScrollTrigger animations may trigger before intro completes - add delays
- **Multiple Listeners**: Same event can have multiple listeners - all will execute
- **Bus Scope**: AnimationBus instance is shared - avoid event name collisions across sequences
- **Cleanup**: Call `window.director.destroy()` before page transitions to prevent zombie listeners

## File Structure

```plaintext
js/choreography/
├── Director.js              # Master coordinator (auto-initializes)
├── StageManager.js          # Scroll/effects coordination
├── AnimationBus.js          # Event publish-subscribe system
├── sections/
│   ├── BaseSection.js       # Required parent class
│   ├── Hero.js              # Landing hero animations
│   ├── Work.js              # Work section animations
│   └── Biography.js         # Biography section animations
└── sequences/
    └── LandingSequence.js   # Landing page choreography
```

**Add new sections to `sections/`** - extend BaseSection, implement lifecycle methods.
**Add new sequences to `sequences/`** - coordinate section events without modifying sections.

## Integration with StageManager

**WARNING**: StageManager handles scroll smoothing and visual effects - don't duplicate:

- **ScrollSmoother**: Managed by StageManager - access via `this.smoother` in sections
- **Video/Gel Effects**: Controlled by StageManager - emit events to trigger
- **PrinterMarks**: Independent display - coordinate via AnimationBus events

**Never** initialize ScrollTrigger plugins in section controllers - they're already registered in StageManager.
