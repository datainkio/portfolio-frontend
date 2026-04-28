<!-- @format -->

# Section Controllers - Standardized Animation Lifecycle

Sections are animation controllers that attach GSAP timelines to DOM elements, emit standardized AnimationBus events from `config/events.js`, and respect reduced-motion preferences. **Active sections:** Hero, BackgroundVideo, Bio, and Organizations.

## AbstractSection (current base class)

`AbstractSection` connects a section element to an animation bundle (animations + triggers) and an `events` map from `EVENTS`.

```javascript
constructor(
  elem,
  animations,
  triggers,
  events,
  bus,
  ({ reducedMotionHandler } = {}),
);

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

Always use `EVENTS` from [../config/events.js](../config/events.js):

```javascript
import { EVENTS } from "../config/events.js";

bus.emit(EVENTS.hero.introComplete);
bus.on(EVENTS.video.introStart, handler);

// Adding a new section (in config/events.js)
EVENTS.custom = {
  introStart: "custom:intro:start",
  introComplete: "custom:intro:complete",
  outroStart: "custom:outro:start",
  outroComplete: "custom:outro:complete",
};
```

## Current Sections

### Active in Director

- **Hero** (`sections/hero/Hero.js`)
  - Uses `AbstractSection` with `HeroAnimations` and `HeroTriggers`
  - `HeroTriggers` adds a dedicated outro pin trigger so hero stays pinned while outro animates on exit
  - Events: `EVENTS.hero.*`
  - DOM: `#hero` (from `SELECTORS.hero`)
- **BackgroundVideo** (`sections/background/BackgroundVideo.js`)
  - Uses `AbstractSection` with `BackgroundVideoAnimations` and `BackgroundVideoTriggers`
  - Events: `EVENTS.video.*`
  - DOM: `#overlay-view` / `SELECTORS.video`
- **Bio** (`sections/bio/Bio.js`)
  - Uses `AbstractSection` with `BioAnimations` and `BioTriggers`
  - Events: `EVENTS.bio.*`
  - DOM: `#bio` / `SELECTORS.bio`
- **Organizations** (`sections/organizations/Organizations.js`)
  - Uses `AbstractSection` with `OrganizationsAnimations` and `OrganizationsTriggers`
  - Events: `EVENTS.organizations.*`
  - DOM: `#organizations` / `SELECTORS.organizations`

To activate additional sections: add event definitions to `config/events.js`, import into `Director.js`, instantiate with `bus` and `reducedMotionHandler`, and hook into animation sequence.

## Creating a Custom Section (current pattern)

```javascript
// js/choreography/sections/custom/Custom.js
import AbstractSection from "../abstract-section/AbstractSection.js";
import { EVENTS } from "../../config/events.js";
import CustomAnimations from "./CustomAnimations.js";
import CustomTriggers from "./CustomTriggers.js";
import { SELECTORS, ANIMATION_DEFAULTS } from "../../config/index.js";

export default class Custom extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const elem = document.getElementById(SELECTORS.custom);
    const anim = new CustomAnimations(elem, ANIMATION_DEFAULTS);
    const triggers = new CustomTriggers(elem);
    const events = EVENTS.custom;

    super(elem, anim, triggers, events, bus, { reducedMotionHandler });

    if (!elem) {
      this.logger.trace("element not found; skipping initialization.");
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

Events come from `EVENTS` in [config/events.js](../config/events.js) and are passed into `AbstractSection` via the `events` argument. Use the constants instead of string interpolation.
import { SELECTORS, ANIMATION_DEFAULTS } from '../../config/index.js';

      export default class Custom extends AbstractSection {
        constructor({ bus = null, reducedMotionHandler } = {}) {
          const elem = document.getElementById(SELECTORS.custom);
          const anim = new CustomAnimations(elem, ANIMATION_DEFAULTS);
          const triggers = new CustomTriggers(elem);
          const events = EVENTS.custom; // add to config/events.js first

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
      import { EVENTS } from '../config/events.js';

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
- **Ownership**: Controller owns deferred video loading/readiness and play/pause lifecycle; `BackgroundVideoAnimations` is timeline-only.
- **Lifecycle**: Auto-plays on page load, syncs with scroll
- **Elements**: Video element, overlay controls
- **Events**: Syncs scroll position to video time
- **Dom Structure**: `<div id="overlay-view" data-choreography="background-video">`

### Bio (`sections/bio/Bio.js`)

- **Purpose**: Biography section with text and image animations
- **Lifecycle**: Standard intro → scroll triggers → outro
- **Elements**: Hook-based targets via `data-bio-el` (`heading`, `subheading`, `body`)
- **Item Reveal Strategy**: Uses Awards-style per-item reveal for nested bio content blocks (`.sub-section` / `data-bio-el="sub-section"`)
- **Line Strategy**: Bio owns LineManager setup for adjacent sub-section connectors and draws each line only after the corresponding sub-section reveal animation completes
- **Sticky Behavior**: Header has explicit `open`/`collapsed` states controlled by a dedicated Bio `ScrollTrigger`. Crossing the sticky threshold transitions `open -> collapsed` as: fade out subheading, then collapse header height. Crossing back reverses the sequence: expand header height, then fade subheading in.
- **Events**: Emits `bio:intro:complete` when ready
- **Dom Structure**: `<section id="bio" data-choreography="bio">` with stable child hooks (`data-bio-el="..."`)
- **Note**: Context marker content (CurrentSectionTitle) should remain outside intro/outro target groups unless explicitly animated.

### Organizations (`sections/organizations/Organizations.js`)

- **Purpose**: Organizations showcase section with animations
- **Lifecycle**: Standard intro → scroll triggers → outro
- **Elements**: Organization logos, descriptions, links
- **Events**: Emits `organizations:intro:complete` when ready, `organizations:enter/exit` on scroll
- **Dom Structure**: `<section id="organizations" data-choreography="organizations">`
- **Animations**: Uses ScrambleTextPlugin and SplitText for text effects

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
  onEnter: () => console.log("entered"),
  onLeave: () => console.log("left"),
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
- [AnimationBus events](../config/events.js)
- [Animation config](../config/index.js)
