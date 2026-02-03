<!-- @format -->

# Getting Started with Choreography

A comprehensive guide to the animation system, including initialization flow, section lifecycle, and how to create new section controllers.

## Table of Contents

1. [Initialization Flow](#initialization-flow)
2. [Section Lifecycle](#section-lifecycle)
3. [Creating a New Section Controller](#creating-a-new-section-controller)
4. [Event Coordination Patterns](#event-coordination-patterns)
5. [Debugging](#debugging)

---

## Initialization Flow

The choreography system initializes in a specific sequence to ensure proper coordination between all components.

### Automatic Initialization

The system boots automatically on page load via `window.addEventListener('DOMContentLoaded')` in `main.js`:

```javascript
// From main.js
import { initDirector } from "./AnimationDirector.js";

window.addEventListener("DOMContentLoaded", () => {
  initDirector(); // Triggers complete choreography initialization
});
```

### Initialization Sequence

When `initDirector()` is called, the following steps occur in order:

```
1. AnimationDirector instance created
   ↓
2. AnimationBus created (event coordination)
   ↓
3. StageManager initialized (scroll/visual effects)
   ↓
4. Section controllers instantiated:
   - Hero section
   - BackgroundVideo section
   - Bio section
   - Organizations section
   ↓
5. LandingSequence created (orchestrates section timing)
   ↓
6. LandingSequence starts (plays intro animations)
   ↓
7. Choreography active (scroll-driven animations begin)
```

### Key Configuration

- **DOM Requirements**: Section controllers require specific DOM elements:
  - `#main-header` - Hero section
  - `#sizzle-background` - Background video
  - `#bio` - Bio section
  - `#organizations` - Organizations section

- **AnimationBus**: Created early and shared across all components for event coordination
- **StageManager**: Handles scroll smoothing and background effects (optional, gracefully degrades)

---

## Section Lifecycle

All sections follow a standardized lifecycle controlled by the section controller.

### States

1. **Initialized** - Constructor called, DOM element found
2. **Disabled** - Constructor called, DOM element NOT found (graceful degradation)
3. **Intro Playing** - playIntro() called, animations running
4. **Intro Complete** - Animation finished, section visible
5. **Outro Playing** - playOutro() called, animations reversing
6. **Outro Complete** - Animation finished, section hidden

### Method Sequence

```javascript
// Create section (constructor)
const hero = new Hero({ bus, reducedMotionHandler });

// Play intro animation
await hero.playIntro();
// → Emits 'hero:intro:start'
// → Timeline plays from 0 to completion
// → Emits 'hero:intro:complete'

// Play outro animation
await hero.playOutro();
// → Emits 'hero:outro:start'
// → Timeline reverses to 0
// → Emits 'hero:outro:complete'

// Reset (for replay or testing)
hero.reset();
// → Timeline paused at 0
// → State flags reset

// Cleanup
hero.destroy();
// → Timeline killed
// → ScrollTriggers removed
// → Cannot be reused
```

### Accessibility: Reduced Motion

When the user prefers reduced motion (`prefers-reduced-motion: reduce`):

```javascript
// Instead of playing animation timeline:
// _applyPostIntroState() is called in constructor

// This:
// 1. Jumps timeline to end (progress = 1)
// 2. Emits 'section:intro:complete' event
// 3. Allows dependent sections to proceed
```

The section appears immediately in its final state without animation.

---

## Creating a New Section Controller

Follow this pattern to add a new animated section.

### Step 1: Create DOM Structure

In your Nunjucks template (`njk/organisms/`):

```nunjucks
<section id="my-section" class="my-section">
  <h2>My Section Title</h2>
  <p>Content here...</p>
</section>
```

### Step 2: Create Section Controller

Create `js/choreography/sections/my-section/MySection.js`:

```javascript
/**
 * MySection - Custom section animation controller
 *
 * Extends AbstractSection with custom animations for the my-section element.
 */

import AbstractSection from "../abstract-section/AbstractSection.js";
import MyAnimations from "./MyAnimations.js";
import MyTriggers from "./MyTriggers.js";
import { EVENTS } from "../../constants.js";

export default class MySection extends AbstractSection {
  /**
   * Initialize section controller
   *
   * @param {Object} options - Configuration object
   * @param {AnimationBus} options.bus - Event bus for coordination
   * @param {ReducedMotionHandler} options.reducedMotionHandler - Motion preference handler
   */
  constructor({ bus, reducedMotionHandler } = {}) {
    // Find DOM element
    const elem = document.getElementById("my-section");

    // Create animation and trigger modules
    const animations = new MyAnimations(elem);
    const triggers = new MyTriggers(elem);

    // Call parent constructor
    super(elem, animations, triggers, EVENTS.mySection, bus, {
      reducedMotionHandler,
    });
  }
}
```

### Step 3: Create Animations Module

Create `js/choreography/sections/my-section/MyAnimations.js`:

```javascript
/**
 * MyAnimations - GSAP timeline definitions
 *
 * Extends AbstractSectionAnimations to define intro and outro timelines.
 */

import AbstractSectionAnimations from "../abstract-section/AbstractSectionAnimations.js";
import { gsap } from "../../vendor/gsap.js";

export default class MyAnimations extends AbstractSectionAnimations {
  /**
   * Define intro animation
   *
   * @returns {gsap.core.Timeline}
   */
  intro() {
    // Build timeline
    const tl = gsap.timeline();

    tl.from(this.view, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    // Add to shared timeline for coordination
    this.timeline.add(tl, 0);

    return this.timeline;
  }

  /**
   * Define outro animation
   *
   * @returns {gsap.core.Timeline}
   */
  outro() {
    // Build reverse animation
    const tl = gsap.timeline();

    tl.to(this.view, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
    });

    // Add to shared timeline
    this.timeline.add(tl, 0);

    return this.timeline;
  }
}
```

### Step 4: Create Triggers Module (Optional)

Create `js/choreography/sections/my-section/MyTriggers.js`:

```javascript
/**
 * MyTriggers - ScrollTrigger definitions
 *
 * Extends AbstractSectionTriggers to define scroll-based triggers.
 */

import AbstractSectionTriggers from "../abstract-section/AbstractSectionTriggers.js";
import { gsap, ScrollTrigger } from "../../vendor/gsap.js";

export default class MyTriggers extends AbstractSectionTriggers {
  /**
   * Create scroll-based animation triggers
   *
   * @param {Object} callbacks - Lifecycle callbacks
   * @param {Function} callbacks.onEnter - Fired when section enters viewport
   * @param {Function} callbacks.onLeave - Fired when section leaves viewport
   */
  bind(callbacks) {
    ScrollTrigger.create({
      trigger: this.view,
      start: "top center",
      end: "bottom center",
      onEnter: callbacks.onEnter,
      onLeave: callbacks.onLeave,
      onEnterBack: callbacks.onEnterBack,
      onLeaveBack: callbacks.onLeaveBack,
      markers: false, // Set to true for debugging
    });
  }
}
```

### Step 5: Register in Constants

Update `js/choreography/constants.js`:

```javascript
export const EVENTS = {
  // ... existing events
  mySection: {
    enter: "mySection:enter",
    exit: "mySection:exit",
    introStart: "mySection:intro:start",
    introComplete: "mySection:intro:complete",
    outroStart: "mySection:outro:start",
    outroComplete: "mySection:outro:complete",
  },
};
```

### Step 6: Wire into AnimationDirector

Update `js/choreography/Director.js`:

```javascript
import MySection from "./sections/my-section/MySection.js";

export default class AnimationDirector {
  constructor() {
    // ... existing code ...

    // Initialize new section
    this.sections.mySection = new MySection({
      bus: this.bus,
      reducedMotionHandler: this.stage?.reducedMotion,
    });
  }
}
```

---

## Event Coordination Patterns

Sections communicate via `AnimationBus` events. This decouples components and enables flexible choreography.

### Pattern 1: Section-to-Sequence

Sequence listens for section completion and triggers next section:

```javascript
// In LandingSequence
this.bus.on(EVENTS.hero.introComplete, () => {
  // Hero animation finished, start next section
  this.sections.bio.playIntro();
});
```

### Pattern 2: Sequence-to-Section

Sequence triggers section animations based on timeline:

```javascript
// In LandingSequence
const timeline = gsap.timeline();
timeline.call(() => {
  this.bus.emit(EVENTS.system.preloaderOut);
});
timeline.to(/*...*/, {
  onComplete: () => {
    this.sections.hero.playIntro();
  },
});
```

### Pattern 3: Broadcast Events

StageManager listens to all section events and coordinates effects:

```javascript
// In StageManager
this.bus.on(EVENTS.hero.introStart, () => {
  // Start background effect
  this.gels.animate();
});

this.bus.on(EVENTS.hero.introComplete, () => {
  // Background effect complete
  this.gels.pause();
});
```

### Event Naming Convention

```
[section]:[phase]:[status]

section = hero, bio, video, organizations, mySection
phase = intro, outro, enter, exit
status = start, complete

Examples:
- hero:intro:start (hero animation started)
- hero:intro:complete (hero animation finished)
- video:enter (video section entered viewport)
- bio:outro:complete (bio animation finished reversing)
```

---

## Debugging

### Enable Debug Mode

```javascript
// In browser console
window.director.enableDebug(true); // Enable AnimationBus logging
window.director.enableDebug(false); // Disable
```

### Access Director API

```javascript
// Get section instances
window.director.getSections();
// → { hero, video, bio, organizations, ... }

// Access specific section
window.director.getSections().hero;

// Manually trigger animations (for testing)
window.director.getSections().hero.playIntro();
window.director.getSections().hero.reset();
```

### ScrollTrigger Debugging

Enable markers in section triggers:

```javascript
// In MyTriggers.bind()
ScrollTrigger.create({
  trigger: this.view,
  markers: true, // Shows colored markers on page
  // ... other config
});
```

### Console Logging

All choreography modules use `lumberjack` logger:

```javascript
// Check logs in console
// Each module has a scoped logger: AnimationDirector, Hero, Bio, etc.
logger.trace("message", data, "verbose");
```

### Performance

Use browser DevTools to analyze:

1. **Timeline**: See GSAP animations running
2. **Performance Panel**: Check if animations cause jank
3. **Memory**: Verify timelines are killed on destroy()

---

## Common Patterns

### Waiting for Section Ready

```javascript
// Wait for intro animation to complete
await hero.playIntro();
// → Promise resolves when animation finishes
```

### Conditional Animation Based on Motion Preference

```javascript
// AbstractSection constructor automatically detects:
if (this._reducedMotionHandler?.isReducedMotion()) {
  // Skip animation, jump to end state
  this._applyPostIntroState();
  return;
}
```

### Adding Custom Logic to Section Lifecycle

```javascript
// In custom section class
_onIntroComplete() {
  super._onIntroComplete(); // Call parent implementation

  // Add custom logic
  this.logger.trace('Custom intro complete handler');
}
```

---

## Next Steps

1. **Study Existing Sections**: Review Hero, Bio, BackgroundVideo for reference implementations
2. **Test DOM Requirements**: Verify your section's DOM element exists before initialization
3. **Use Events**: Listen to section events instead of tight coupling
4. **Respect Accessibility**: Always implement reduced motion support via `_applyPostIntroState()`

For more details, see [README.md](./README.md)
