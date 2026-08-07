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

`AnimationDirector.js` self-boots when imported — there is nothing to call and nothing exported for booting. The module tail schedules itself, deferring construction to idle so first paint stays CSS-only:

```javascript
// Tail of AnimationDirector.js — not something you invoke
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scheduleInit, { once: true });
} else {
  scheduleInit(); // → requestIdleCallback(initDirector, { timeout: 150 })
}
```

`initDirector` is module-local and guards against double-construction via `window.director instanceof AnimationDirector`.

### Initialization Sequence

```
1. DOMContentLoaded → requestIdleCallback (setTimeout fallback)
   ↓
2. AnimationBus created (event coordination)
   ↓
3. ScrollEffectsCoordinator initialized (scroll/visual effects)
   ↓
4. CardManager initialized — MUST precede sections, so throw-variant pin
   spacers exist before the work-header pin measures the footer position
   ↓
5. Section controllers instantiated from SECTION_REGISTRY:
   Hero · BackgroundVideo · Bio · Process · Awards · Organizations · Work
   ↓
6. Global managers: GlobalHeader, HomeHeader, WorkHeader, WorkNav,
   ProjectHeader, BuildInfo, SectionCap
   ↓
7. LandingSequence created (orchestrates section timing)
   ↓
8. window dispatches EVENTS.system.directorReady ("director:ready")
   ↓
9. Preloader exits → "preloader:out" → LandingSequence.start()
```

Boot gating is `director:ready` → `preloader:out` → `LandingSequence` — never bypass it.

### Key Configuration

- **DOM Requirements**: each section resolves its view by `id` through `SELECTORS` — see [config/contracts/selectors/selectors.js](config/contracts/selectors/selectors.js) for the current map. A section whose element is absent sets `isDisabled` and no-ops rather than throwing.
- **AnimationBus**: created first and injected into every section; sections that receive no bus fall back to `NullAnimationBus`.
- **ScrollEffectsCoordinator**: scroll smoothing, gels, reduced motion (optional, gracefully degrades to native scroll).

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

Reduced motion is not a constructor branch — it is resolved per breakpoint through `gsap.matchMedia()`. `_setupResponsiveLifecycle()` registers `BREAKPOINT_MATCH_MEDIA_CONDITIONS`, and each match calls `_applyResponsiveLifecycle(conditions)`, which:

```javascript
// 1. Resolves the motion profile for this section + breakpoint + reduceMotion
const profile = resolveSectionMotionProfile(this.sectionKey, conditions);

// 2. Gates the lifecycle on that profile
this._isLifecycleMotionEnabled = profile.timeline.enabled;

// 3. Rebinds callbacks, skipping ScrollTriggers when the profile disables them
this._bindCallbacks({ includeTriggers: profile.trigger.enabled });

// 4. If motion just turned off, snaps to the post-intro state
if (!profile.timeline.enabled && wasLifecycleMotionEnabled) {
  this._applyPostIntroState(); // intro.progress(1, false) + emit introComplete
}
```

`playLanding()` / `playIntro()` / `playOutro()` all early-return a resolved promise while `_isLifecycleMotionEnabled` is false, so dependent sections still proceed. The section appears immediately in its final state without animation.

---

## Creating a New Section Controller

Follow this pattern to add a new animated section.

### Step 1: Create DOM Structure

In your Nunjucks template (`views/organisms/`):

```nunjucks
<section id="my-section" class="my-section">
  <h2>My Section Title</h2>
  <p>Content here...</p>
</section>
```

### Step 2: Create Section Controller

Sections live in `js/choreography/organisms/<name>/`. `AbstractSection` takes one options object and owns the lifecycle — it resolves events from `EVENTS[sectionKey]`, so the key is the contract:

Create `js/choreography/organisms/my-section/MySection.js`:

```javascript
import AbstractSection from "../../system/AbstractSection.js";
import { SELECTORS } from "../../config/index/index.js";
import MyAnimations from "./MyAnimations.js";
import MyTriggers from "./MyTriggers.js";

export default class MySection extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler, gelManager = null } = {}) {
    const view = document.getElementById(SELECTORS.mySection);

    super({
      view,
      animations: new MyAnimations(view, { gelManager }),
      triggers: new MyTriggers(view),
      sectionKey: "mySection", // must match an EVENTS key
      bus,
      reducedMotionHandler,
    });
  }
}
```

### Step 3: Create Animations Module

Override the four phase builders. Each returns one GSAP timeline that the base class registers, pauses at 0, and plays by `TIMELINE_IDS`. Do not build a shared `this.timeline` — that pattern no longer exists. Unimplemented phases inherit an empty id-tagged timeline and no-op.

Create `js/choreography/organisms/my-section/MyAnimations.js`:

```javascript
import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { gsap } from "../../system/gsap.js";

export default class MyAnimations extends AbstractSectionAnimations {
  _buildIntro() {
    return gsap.timeline({ id: TIMELINE_IDS.intro }).from(this.view, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  }

  _buildOutro() {
    return gsap.timeline({ id: TIMELINE_IDS.outro }).to(this.view, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
    });
  }

  // _buildLanding() / _buildIdle() inherited as empty no-ops
}
```

### Step 4: Create Triggers Module (Optional)

`AbstractSectionTriggers.bind()` already creates the ScrollTrigger and wires every callback; `AbstractSection` calls it for you. Subclass only to change the trigger config via `_getTriggerDefaults()`:

Create `js/choreography/organisms/my-section/MyTriggers.js`:

```javascript
import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";

export default class MyTriggers extends AbstractSectionTriggers {
  _getTriggerDefaults() {
    return {
      ...super._getTriggerDefaults(),
      start: "top center",
      end: "bottom center",
    };
  }
}
```

Sections that scrub should say so through the config — `AbstractSection` reads `triggers.isScrubbed()` to decide whether the landing beat auto-chains into intro.

### Step 5: Register the Contracts

Three files, all required — the section boots but stays mute if you skip the first:

```javascript
// config/contracts/events/events.js
export const EVENTS = {
  // ...
  mySection: makeSectionEvents("mySection"), // never hand-type the ten keys
};

// config/contracts/selectors/selectors.js
export const SELECTORS = {
  // ...
  mySection: "my-section", // the id your template renders
};

// system/registry.js
import MySection from "../organisms/my-section/MySection.js";

export const SECTION_REGISTRY = {
  // ...
  mySection: MySection,
};
```

Also add a label to `getSectionName()` in the same file.

### Step 6: Nothing to Wire

`AnimationDirector` iterates `SECTION_REGISTRY` and constructs every entry with `{ bus, reducedMotionHandler, gelManager }`. Registering in Step 5 is the whole wiring — do not add a hand-rolled `this.sections.mySection = ...` line.

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

ScrollEffectsCoordinator listens to all section events and coordinates effects:

```javascript
// In ScrollEffectsCoordinator
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

All ten names per section come from `makeSectionEvents(key)` — never hand-typed:

```
${key}:${phase}:${status}     phase = landing | intro | outro
                              status = start | complete

${key}:enter / ${key}:exit                 forward scroll pass
${key}:onEnterBack / ${key}:onLeaveBack    reverse pass (camelCase, historical)

key = hero, video, home, bio, process, awards, organizations, work

Examples:
- hero:intro:start (hero animation started)
- hero:intro:complete (hero animation finished)
- video:enter (video section entered viewport)
- bio:outro:complete (bio animation finished reversing)
```

There is no `section:` prefix and no `scroll:` segment. A section key with no `EVENTS` entry emits nothing — `_emit()` drops undefined names silently.

---

## Debugging

### Access Director API

There is no `enableDebug()` — the inert `AnimationBus.enableDebug()` was removed. Modules log through scoped `lumberjack` loggers; inspect live state instead:

```javascript
// Get section instances
window.director.getSections();
// → { hero, video, bio, process, awards, organizations, work }

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
// Handled for you in _applyResponsiveLifecycle() — re-evaluated on every
// breakpoint/preference change, not once in the constructor.
const profile = resolveSectionMotionProfile(this.sectionKey, conditions);
this._isLifecycleMotionEnabled = profile.timeline.enabled;
```

Per-section, per-breakpoint motion profiles live in [config/ix/profiles.js](config/ix/profiles.js). Prefer declaring a reduced variant there over branching inside a timeline builder.

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

1. **Study Existing Sections**: Review Hero, Bio, Process for reference implementations
2. **Test DOM Requirements**: Verify your section's DOM element exists before initialization
3. **Use Events**: Listen to section events instead of tight coupling
4. **Respect Accessibility**: Declare a reduced variant in [config/ix/profiles.js](config/ix/profiles.js) — the base class handles the snap-to-end via `_applyPostIntroState()`

For more details, see [README.choreography.md](./README.choreography.md)
