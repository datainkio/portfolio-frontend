<!-- @format -->

# Section Controllers - Standardized Animation Lifecycle

Last updated: 2025-12-19 15:00 EST

Sections are animation controllers that attach GSAP timelines to DOM elements, emit standardized AnimationBus events from `constants.js`, and respect reduced-motion preferences. **Active today:** Hero and BackgroundVideo. Legacy controllers (Work, Biography, Splash, Approach) exist but are not initialized by Director.

## AbstractSection (current base class)

`AbstractSection` connects a section element to an animation bundle (animations + triggers) and an `events` map from `EVENTS`.

```javascript
constructor(elem, animations, triggers, events, bus, ({ reducedMotionHandler } = {}));

setAnimations(bundle); // Register animations and bind callbacks
initialize(); // Apply reduced-motion state, set up scroll triggers
playIntro(); // Run intro timeline; emit events.introStart/introComplete
playOutro(); // Run outro or outroTimeline; emit events.outroStart/outroComplete
reset(); // Reset timelines/state flags; emit section:{id}:reset
destroy(); // Kill timelines and ScrollTriggers; emit section:{id}:destroy
```

### Lifecycle Flow

```
DOMContentLoaded
  ↓
Director constructs section with element + animations + triggers + EVENTS map
  ↓
section.initialize()
  ├─ If prefers-reduced-motion → apply end state, then set up scroll
  └─ Otherwise set up scroll triggers immediately
  ↓
sequence.start() → section.playIntro()
  ├─ Emits events.introStart
  ├─ Runs animations.intro() or animations.timeline
  └─ Emits events.introComplete
  ↓
Scroll triggers fire (enter/exit logic lives in triggers class)
  ↓
Optional playOutro()
  ├─ Emits events.outroStart
  └─ Emits events.outroComplete when outro/reverse finishes
```

## Event Naming (use constants)

Always use `EVENTS` from [../constants.js](../constants.js):

```javascript
import { EVENTS } from '../constants.js';

bus.emit(EVENTS.hero.introComplete);
bus.on(EVENTS.video.introStart, handler);

// Adding a new section (in constants.js)
EVENTS.custom = {
  introStart: 'custom:intro:start',
  introComplete: 'custom:intro:complete',
  outroStart: 'custom:outro:start',
  outroComplete: 'custom:outro:complete',
};
```

## Current Sections

### Active in Director

- **Hero** (`sections/hero/Hero.js`)
  - Uses `AbstractSection` with `HeroAnimations` and `HeroTriggers`
  - Events: `EVENTS.hero.*`
  - DOM: `#hero` (from `SELECTORS.hero`)
- **BackgroundVideo** (`sections/background/BackgroundVideo.js`)
  - Uses `AbstractSection` with `BackgroundVideoAnimations` and `BackgroundVideoTriggers`
  - Events: `EVENTS.video.*`
  - DOM: `#overlay-view` / `SELECTORS.video`

### Present but not initialized

- **Work** (`sections/work/Work.js`) — legacy, references `BaseSection` (file not present); not wired
- **Biography** (`sections/biography/`) — inactive
- **Splash** (`sections/splash/`) — inactive
- **Approach** (`sections/approach/`) — inactive

To activate an inactive section: add to `EVENTS`, import into `Director.js`, instantiate with `bus` and `reducedMotionHandler`, and hook it in `LandingSequence`.

## Creating a Custom Section (current pattern)

```javascript
// js/choreography/sections/custom/Custom.js
import AbstractSection from '../abstract-section/AbstractSection.js';
import { EVENTS } from '../../constants.js';
import CustomAnimations from './CustomAnimations.js';
import CustomTriggers from './CustomTriggers.js';
import { SELECTORS, ANIMATION_DEFAULTS } from '../../config.js';

export default class Custom extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const elem = document.getElementById(SELECTORS.custom);
    const anim = new CustomAnimations(elem, ANIMATION_DEFAULTS);
    const triggers = new CustomTriggers(elem);
    const events = EVENTS.custom;

    super(elem, anim, triggers, events, bus, { reducedMotionHandler });

    if (!elem) {
      this.logger.trace('element not found; skipping initialization.');
    }
  }
}
```

Hook into the sequence:

```javascript
// LandingSequence.js
on(EVENTS.hero.introComplete, () => {
  this.sections?.custom?.playIntro?.();
});
```

## Reduced Motion

`AbstractSection.initialize()` respects `prefers-reduced-motion` by applying the post-intro state and then setting up scroll triggers without playing the intro timeline. Ensure your animations define sensible end states so reduced-motion users still see content.

## State & Reset

- `playIntro()` / `playOutro()` emit events from the provided `events` map.
- `reset()` pauses timelines, clears flags (`isIntroComplete`, `isOutroComplete`, `isScrollActive`), and emits `section:{id}:reset`.
- `destroy()` kills timelines and related ScrollTriggers and emits `section:{id}:destroy`.

## Testing & Debugging

- Access controllers via `window.director.getSections()` once Director initializes.
- Enable bus debugging: `window.director.enableDebug(true)`.
- Add `markers: true` in trigger classes for ScrollTrigger visualization.

## Performance & Cleanup

1. Always call `destroy()` when removing a section to kill timelines and triggers.
2. Use `setAnimations()` to swap animation bundles safely (kills previous timeline).
3. Keep triggers lightweight—only create them when the section element exists.

## StageManager Integration

When needed, pass `reducedMotionHandler` from `StageManager` into the section constructor (as done for Hero and BackgroundVideo) so reduced-motion preferences are honored.

## Event Naming Conventions

Events come from `EVENTS` in [constants.js](../constants.js) and are passed into `AbstractSection` via the `events` argument. Use the constants instead of string interpolation.
import { SELECTORS, ANIMATION_DEFAULTS } from '../../config.js';

      export default class Custom extends AbstractSection {
        constructor({ bus = null, reducedMotionHandler } = {}) {
          const elem = document.getElementById(SELECTORS.custom);
          const anim = new CustomAnimations(elem, ANIMATION_DEFAULTS);
          const triggers = new CustomTriggers(elem);
          const events = EVENTS.custom; // add to constants.js first

          super(elem, anim, triggers, events, bus, { reducedMotionHandler });

          if (!elem) {
            this.logger.trace('element not found; skipping initialization.');
            return;
          }
        }
      }
      ```

      ### 2) Wire in Director

      ```javascript
      // Director.js
      import Custom from './sections/custom/Custom.js';

      this.sections = {
        ...this.sections,
        custom: new Custom({ bus: this.bus, reducedMotionHandler: this.stage?.reducedMotion }),
      };
      ```

      ### 3) Sequence Hook

      ```javascript
      // LandingSequence.js
      import { EVENTS } from '../constants.js';

      on(EVENTS.hero.introComplete, () => {
        this.sections?.custom?.playIntro?.();
      });
      ```

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
