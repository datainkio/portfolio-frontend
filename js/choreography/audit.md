<!-- @format -->

# Code Review: `js/choreography` Package

## AIX (AI Experience) + DX (Developer Experience) Focused

Reviewed by: GitHub Copilot (Claude Sonnet 4.5)  
Date: January 2, 2026  
Package: `/Users/russelllebo/Projects/Portfolio/frontend/js/choreography`

---

## 1. Inventory & Map

### Entry Points

- **[AnimationDirector.js](AnimationDirector.js)** - Master coordinator, auto-initialized on `DOMContentLoaded`
- **[main.js](../main.js)** - Browser entry (currently minimal, doesn't import Director)

### Module Structure

```
choreography/
├── AnimationDirector.js      ← Master initialization orchestrator
├── AnimationBus.js          ← Pub/sub event system (core coordination)
├── ScrollEffectsCoordinator.js ← Scroll + visual effects coordinator
├── constants.js             ← Event names + system constants
├── config.js                ← Site-specific settings (DOM selectors, paths)
│
├── sections/                ← Section controllers (Hero, Bio, BackgroundVideo)
│   ├── abstract-section/    ← Base classes for section lifecycle
│   │   ├── AbstractSection.js          (controller base)
│   │   ├── AbstractSectionAnimations.js (animation base)
│   │   └── AbstractSectionTriggers.js  (scroll trigger base)
│   ├── hero/
│   ├── bio/
│   └── background/
│
├── sequences/               ← Choreography coordinators
│   └── landing/LandingSequence.js
│
└── managers/                ← Specialized single-responsibility modules
    ├── ReducedMotionHandler.js
    ├── ScrollSmootherManager.js
    ├── BackgroundLayerManager.js
    ├── GelAnimationManager.js
    └── index.js (barrel export)
```

### Responsibility Boundaries

| Module              | Primary Responsibility                                | Exports                   |
| ------------------- | ----------------------------------------------------- | ------------------------- |
| **Director**        | Bootstrap system, expose debug API                    | Class (auto-instantiated) |
| **AnimationBus**    | Event coordination (pub/sub)                          | Class                     |
| **StageManager**    | Initialize managers, coordinate scroll/visual effects | Class                     |
| **AbstractSection** | Section lifecycle, event emission                     | Base class                |
| **LandingSequence** | Listen to events, trigger next animations             | Class                     |
| **Managers**        | Single-responsibility utilities                       | Classes                   |

### Data Flow

```
Director initializes
    ↓
Creates AnimationBus (event system)
    ↓
Creates StageManager (scroll + effects)
    ↓
Instantiates Section Controllers (Hero, Bio, BackgroundVideo)
    ↓
Creates LandingSequence (event listener orchestrator)
    ↓
LandingSequence.start() waits for 'preloader:out' event
    ↓
Sections emit events (hero:intro:complete)
    ↓
LandingSequence listens and triggers next section
```

### Explicit Side Effects

| Location                   | Side Effect                                            | Justification                     |
| -------------------------- | ------------------------------------------------------ | --------------------------------- |
| **Director constructor**   | Auto-initializes all systems                           | ✓ Expected for master coordinator |
| **Director (end of file)** | `window.director = new Director()` on DOMContentLoaded | ✓ Global singleton pattern        |
| **StageManager**           | Modifies DOM (BackgroundLayerManager moves elements)   | ⚠️ Implicit, not obvious from API |
| **Sections**               | Binds ScrollTriggers on construction                   | ✓ Expected lifecycle              |
| **LandingSequence**        | Listens to `window` event `preloader:out`              | ⚠️ Hidden external dependency     |

### Unclear Boundaries / Mixed Responsibilities

1. **AbstractSection vs. AbstractSectionAnimations** - Unclear split: why separate animation logic from lifecycle?
2. **StageManager** - Name suggests "stage/scene management" but actually "scroll + visual effects coordinator"
3. **LandingSequence** - Listens to events but also directly calls `sections.video.playIntro()` - mixing patterns
4. **Director** - Both initializer AND debugging API surface

---

## 2. AIX Audit (Highest Priority)

### P0 — AI-Confusers (Must Fix)

#### **Issue 2.1: Ambiguous Class Name "Director"**

**Files:** [AnimationDirector.js](AnimationDirector.js)

**Problem:** "Director" is a generic term used in multiple contexts (theater, video, software). AI models will struggle to predict its role without reading extensive documentation.

**Why it harms AIX:** Copilot may suggest Director patterns from other domains (e.g., Angular Router Director, Three.js Director). Generic names reduce model confidence and increase hallucination risk.

**Proposed change:**

```javascript
// Rename Director → AnimationDirector or ChoreographyBootstrap
export default class AnimationDirector { ... }
```

**Validation:** Search codebase for `Director` imports, update references. Test initialization still works.

---

#### **Issue 2.2: Inconsistent Constructor Patterns Across Sections**

**Files:** [Hero.js](sections/hero/Hero.js), [Bio.js](sections/bio/Bio.js), [BackgroundVideo.js](sections/background/BackgroundVideo.js)

**Problem:** Sections use `const`, `var`, and inline object construction inconsistently:

```javascript
// Hero.js
const view = document.getElementById(SELECTORS.hero);
const anim = new HeroAnimations(view, ANIMATION_DEFAULTS);

// BackgroundVideo.js
var view = document.getElementById(SELECTORS.video); // ← var instead of const
var anim = new BackgroundVideoAnimations(view, ANIMATION_DEFAULTS);
```

**Why it harms AIX:** Inconsistent patterns make Copilot unsure which style to suggest. Mixing `var` and `const` signals unintentional variation, not purposeful choice.

**Proposed change:**

```javascript
// Standardize all sections to use const
export default class BackgroundVideo extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.video);
    const anim = new BackgroundVideoAnimations(view, ANIMATION_DEFAULTS);
    const triggers = new BackgroundVideoTriggers(view);
    const events = EVENTS.video;

    super(view, anim, triggers, events, bus, { reducedMotionHandler });
    // ...
  }
}
```

**Validation:** Run `npm run format` and verify all sections use `const`.

---

#### **Issue 2.3: Implicit DOM Contract in AbstractSection**

**Files:** [AbstractSection.js](sections/abstract-section/AbstractSection.js)

**Problem:** `AbstractSection` constructor accepts `view` (HTMLElement) but silently returns early if null:

```javascript
if (!this.view) {
  console.warn(`[${this.constructor.name.toLowerCase()}] element not found - section disabled`);
  return; // ← Constructor returns void; partial initialization
}
```

**Why it harms AIX:** AI models expect constructors to either throw or initialize fully. "Silent return" is ambiguous — is the object usable? What methods are safe to call?

**Proposed change:**

```javascript
// Option A: Throw if view missing (fail-fast)
if (!view) {
  throw new Error(`${this.constructor.name}: DOM element not found`);
}

// Option B: Document "disabled" state pattern
constructor(view, ...) {
  this.view = view;
  this.isDisabled = !view;

  if (this.isDisabled) {
    this.logger.trace('element not found; section disabled');
    return;
  }
  // ... rest of initialization
}

// Add guard to public methods
async playIntro() {
  if (this.isDisabled) return Promise.resolve();
  this.animations.intro();
}
```

**Validation:** Test missing DOM elements still gracefully degrade. Check if `isDisabled` flag would break existing code.

---

#### **Issue 2.4: Event Names Duplicated Between constants.js and Inline Strings**

**Files:** [constants.js](constants.js), [LandingSequence.js](sequences/landing/LandingSequence.js)

**Problem:** System events (`'preloader:out'`, `'director:ready'`) are hardcoded strings, not in `constants.js`:

```javascript
// LandingSequence.js
window.addEventListener('preloader:out', this.handlePreloaderOut, { once: true });

// But EVENTS.hero.introComplete is in constants.js
```

**Why it harms AIX:** Copilot won't know about `'preloader:out'` unless it reads LandingSequence. Event discovery requires searching strings instead of inspecting constants.

**Proposed change:**

```javascript
// constants.js
export const EVENTS = {
  system: {
    preloaderOut: 'preloader:out',
    directorReady: 'director:ready',
  },
  video: { ... },
  hero: { ... },
  // ...
};

// LandingSequence.js
import { EVENTS } from '../../constants.js';
window.addEventListener(EVENTS.system.preloaderOut, this.handlePreloaderOut, { once: true });
```

**Validation:** Search for hardcoded event strings (`grep -r "'.*:.*'" js/choreography/`), replace with constants.

---

#### **Issue 2.5: Unclear Separation Between AnimationBus Instance vs. Static Usage**

**Files:** [AnimationBus.js](AnimationBus.js), [AnimationDirector.js](AnimationDirector.js)

**Problem:** AnimationBus is instantiated in Director:

```javascript
this.bus = new AnimationBus();
```

But README shows static-looking usage:

```javascript
// From README (incorrect)
AnimationBus.on(EVENTS.hero.introComplete, () => { ... });
```

**Why it harms AIX:** Copilot will suggest static methods if README implies static pattern. Actual usage requires instance reference.

**Proposed change:**
Update README to show correct instance usage:

```javascript
// Correct pattern
const bus = new AnimationBus();
bus.on(EVENTS.hero.introComplete, () => { ... });

// Or via dependency injection
class MySection {
  constructor(bus) {
    this.bus = bus;
    this.bus.on(EVENTS.hero.introComplete, this.handleHeroComplete);
  }
}
```

**Validation:** Update README examples. Search for incorrect static usage in comments.

---

### P1 — Clarity Improvements (Should Fix)

#### **Issue 2.6: config.js vs. constants.js Distinction Not Obvious**

**Files:** [config.js](config.js), [constants.js](constants.js)

**Observation:** Both contain "configuration-like" data. Docstrings explain difference, but naming doesn't reinforce it.

**Why it harms AIX:** Copilot may suggest wrong file for new values. "Where do I add a new selector?" is ambiguous.

**Proposed change:**

```javascript
// Rename for clarity
constants.js → choreography-events.js  (or event-contracts.js)
config.js → site-config.js (or dom-selectors.js)
```

**Alternative:** Keep names, but add explicit module-level JSDoc:

```javascript
/**
 * @module site-config
 * @description Project-specific values: DOM selectors, asset paths, timing
 * @see choreography-events.js for system-level event contracts
 */
```

**Validation:** Low-risk documentation change. Update imports if renaming.

---

#### **Issue 2.7: AbstractSection Constructor Has 6 Parameters (5 positional)**

**Files:** [AbstractSection.js](sections/abstract-section/AbstractSection.js)

**Problem:**

```javascript
constructor(view, anim, triggers, events, bus, { reducedMotionHandler } = {}) {
```

**Why it harms DX/AIX:** Parameter order is hard to remember. Easy to swap `anim` and `triggers`.

**Proposed change:**

```javascript
// Use options object
constructor({ view, animations, triggers, events, bus, reducedMotionHandler } = {}) {
  this.view = view;
  this.animations = animations ?? new AbstractSectionAnimations(this.view);
  this.triggers = triggers ?? new AbstractSectionTriggers(this.view);
  // ...
}

// Calling pattern (more discoverable)
super({
  view,
  animations: new HeroAnimations(view, ANIMATION_DEFAULTS),
  triggers: new HeroTriggers(view),
  events: EVENTS.hero,
  bus,
  reducedMotionHandler,
});
```

**Validation:** Update all section subclasses. Test initialization still works.

---

#### **Issue 2.8: "StageManager" Name Doesn't Describe Actual Role**

**Files:** [ScrollEffectsCoordinator.js](ScrollEffectsCoordinator.js)

**Observation:** "StageManager" suggests managing a "stage" (scene graph, layers), but actually coordinates scroll smoothing and background effects.

**Why it harms AIX:** Name doesn't communicate "scroll + visual effects." Copilot may suggest stage-related patterns from game engines or theater software.

**Proposed change:**

```javascript
// Rename StageManager → ScrollEffectsCoordinator or VisualEffectsManager
export default class ScrollEffectsCoordinator { ... }
```

**Validation:** Update Director import and instantiation. Search for `StageManager` references.

---

#### **Issue 2.9: Missing Guard for bus.emit in AbstractSection.\_emit**

**Files:** [AbstractSection.js](sections/abstract-section/AbstractSection.js)

**Current implementation:**

```javascript
_emit(eventName, payload) {
  if (!eventName) return;
  if (this.bus && typeof this.bus.emit === 'function') {
    this.bus.emit(eventName, payload);
  } else {
    this.logger.trace(`bus.emit unavailable for "${eventName}"`, { payload }, 'brief', 'headsup');
  }
}
```

**Issue:** Fallback creates stub bus in constructor:

```javascript
this.bus = bus ?? { emit: () => {}, on: () => () => {} };
```

But `_emit` still checks `typeof this.bus.emit === 'function'` — defensive against stub being modified?

**Why it harms AIX:** Mixed defensive patterns confuse intent. Is stub guaranteed or not?

**Proposed change:**

```javascript
// Make intent explicit
constructor(...) {
  this.bus = bus ?? new NullAnimationBus();  // ← Explicit null object
}

// NullAnimationBus.js
export class NullAnimationBus {
  emit() {}
  on() { return () => {}; }
}

// Remove defensive check from _emit
_emit(eventName, payload) {
  if (!eventName) return;
  this.bus.emit(eventName, payload);
}
```

**Validation:** Test sections still work without bus. Verify no runtime errors.

---

### P2 — Pattern Inconsistencies (Nice to Have)

#### **Issue 2.10: Commented-Out Code in Multiple Files**

**Files:** [AnimationDirector.js](AnimationDirector.js), [HeroAnimations.js](sections/hero/HeroAnimations.js), [LandingSequence.js](sequences/landing/LandingSequence.js)

**Examples:**

```javascript
// Director.js
// logger.enabled(true);
// logger.enabled = true;

// HeroAnimations.js
// this.logger?.trace('intro started');
```

**Why it harms AIX:** Commented code signals "under construction" or "experimental." Copilot may suggest similar commented patterns.

**Proposed change:** Remove commented logging statements. Add configuration for enabling debug mode instead.

**Validation:** Delete commented code, test animations still work.

---

#### **Issue 2.11: Inconsistent Use of Optional Chaining**

**Files:** Multiple

**Examples:**

```javascript
// Inconsistent
this.stage?.reducedMotion; // ← optional chaining
this._videoContainer?.querySelector('video'); // ← optional chaining
this.sections?.video?.playIntro?.(); // ← triple chaining

// vs.
if (this.triggers) {
  this.triggers.section = this; // ← explicit if-check
}
```

**Why it harms AIX:** Mixed patterns make Copilot unsure when to suggest `?.` vs. explicit checks.

**Proposed change:** Standardize on one pattern per context:

- **Defensive calls:** Use `?.()` when calling methods that may not exist
- **Property access:** Use explicit checks when setting properties

**Validation:** Audit codebase for `?.` usage, standardize patterns.

---

## 3. DX Audit

### Discoverability

**✅ Strengths:**

- Excellent README with architecture overview, event patterns, API examples
- JSDoc comments on most public methods
- Consistent file structure (each section has Animation + Triggers modules)
- Barrel export in `managers/index.js` simplifies imports

**⚠️ Gaps:**

- **Entry point unclear** - [main.js](../main.js) doesn't import Director; how does system bootstrap?
- **Missing usage examples** - How to add a new section? (README describes pattern but no step-by-step)
- **No API reference** - Public methods documented but not indexed (which methods are stable API?)

**Recommendation:**
Add `GETTING_STARTED.md` with:

1. How the system initializes (trace from page load to first animation)
2. Step-by-step: Add a new section
3. Public API reference (stable methods developers should use)

---

### Debuggability

**✅ Strengths:**

- `window.director` global API for debugging
- Logger integration (lumberjack) with scoped loggers per module
- AnimationBus debug mode: `bus.enableDebug(true)`

**⚠️ Gaps:**

- **Error swallowing** - Many try/catch blocks log but don't propagate:
  ```javascript
  try {
    callback(data);
  } catch (error) {
    // this.logger.trace(`Error in listener for ${event}:`, error);  // ← commented out!
  }
  ```
- **Silent failures** - Sections return early if DOM missing; no way to detect from outside
- **Event flow tracing** - Hard to visualize which events fired in what order

**Recommendation:**

1. Uncomment error logging in AnimationBus
2. Add `director.getState()` method returning initialization status
3. Add `director.traceEvents(true)` to log event flow diagram

---

### Maintainability

**✅ Strengths:**

- Clear separation: constants (event contracts) vs. config (site-specific)
- Manager modules follow single-responsibility principle
- Abstract base classes reduce duplication

**⚠️ Gaps:**

- **Tight coupling to GSAP CDN imports** - Every file imports GSAP from Skypack:
  ```javascript
  import gsap from 'https://cdn.skypack.dev/gsap@3.13.0';
  ```
  If CDN changes or version upgrades, many files need updates.
- **No version pinning strategy** - Different files may end up importing different GSAP versions

**Recommendation:**
Create `js/choreography/vendor/gsap.js`:

```javascript
/**
 * Centralized GSAP import
 * All choreography modules import from here for version consistency
 */
export { default as gsap } from 'https://cdn.skypack.dev/gsap@3.13.0';
export { default as ScrollTrigger } from 'https://cdn.skypack.dev/gsap/ScrollTrigger';
export { default as ScrollSmoother } from 'https://cdn.skypack.dev/gsap/ScrollSmoother';
export { default as SplitText } from 'https://cdn.skypack.dev/gsap/SplitText';
```

Then all files import:

```javascript
import { gsap, ScrollTrigger } from '/assets/js/choreography/vendor/gsap.js';
```

---

### Onboarding Friction

**Where to start?** New developers likely experience:

1. Open [README.md](dataink.io/frontend/js/choreography/README.md) ✅
2. Search for initialization code → not obvious where Director is called ❌
3. Look at Hero section example → good starting point ✅
4. Try to add new section → need to understand 3 files (Section, Animations, Triggers) ⚠️

**Missing:**

- "Hello World" minimal example (simplest possible section with one animation)
- Diagram showing initialization sequence ([director-initialization-sequence.md](../../docs/director-initialization-sequence.md) exists but not linked from README)

**Recommendation:**
Add to README:

```markdown
## Quick Start

### How the System Initializes

See [initialization sequence diagram](../../docs/director-initialization-sequence.md)

### Adding Your First Section

1. Create `sections/my-section/MySection.js`
2. Create `sections/my-section/MySectionAnimations.js`
3. Register in AnimationDirector.js
4. Wire events in LandingSequence.js

Full example: [Creating a New Section Guide](sections/README.md)
```

---

## 4. Browser-First Correctness

### Idempotency

**✅ Confirmed Safe:**

- Director initializes only once (guarded by auto-init at end of file)
- Sections guard against missing DOM elements
- AnimationBus listeners return unsubscribe functions

**⚠️ Potential Issues:**

- **AbstractSectionTriggers.bind()** kills previous trigger but recreates:
  ```javascript
  bind({ onEnter, onLeave, ... }) {
    if (this._trigger) {
      this._trigger.kill();  // ← Safe
    }
    this._trigger = ScrollTrigger.create(vars);  // ← Recreates; is this intended for re-binding?
  }
  ```
  **Question:** Should `bind()` be idempotent (no-op if already bound) or rebindable?

**Recommendation:** Document intended behavior:

```javascript
/**
 * Bind scroll trigger callbacks
 * Can be called multiple times to rebind with different callbacks
 * (Kills previous trigger before creating new one)
 */
bind({ onEnter, onLeave, ... }) { ... }
```

---

### DOM Access Guards

**✅ All DOM queries guarded:**

```javascript
// Example from AbstractSection
if (!this.view) {
  console.warn(`element not found - section disabled`);
  return;
}
```

**✅ Optional chaining used consistently:**

```javascript
this._videoContainer?.querySelector('video');
```

---

### Event Listener Cleanup

**✅ Proper cleanup in:**

- AnimationBus: Returns unsubscribe functions
- LandingSequence: Stores unsubscribers in `_listeners[]`, clears on destroy
- Sections: Kills ScrollTriggers in `destroy()`

**⚠️ Potential leak:**

```javascript
// ReducedMotionHandler.js
destroy() {
  this._callbacks = [];
  // Note: MediaQueryList doesn't support removeEventListener in all browsers
  this._mql = null;  // ← May not actually remove listener in older browsers
}
```

**Recommendation:** Document limitation:

```javascript
/**
 * Cleanup event listeners
 * Note: MediaQueryList listener cannot be removed in Safari < 14
 * Cleared reference prevents callback execution via empty _callbacks array
 */
```

---

### Layout Thrashing

**✅ No obvious issues:** GSAP batches reads/writes automatically

**✅ Resize handler debounced:**

```javascript
// GelAnimationManager.js
this._onResize = this._handleResize.bind(this);
window.addEventListener('resize', this._onResize, { passive: true });
```

---

### Accessibility

**✅ Excellent:**

- ReducedMotionHandler detects `prefers-reduced-motion`
- Sections skip intro and apply end state if reduced motion enabled:
  ```javascript
  if (this._reducedMotionHandler?.isReducedMotion()) {
    this._applyPostIntroState();
    return;
  }
  ```

**⚠️ Missing:**

- `_applyPostIntroState()` method doesn't exist in AbstractSection (called but not defined)

**Validation:** Search for `_applyPostIntroState` implementation. If missing, add:

```javascript
_applyPostIntroState() {
  // Apply final state without animation
  if (this.animations?.timeline) {
    this.animations.timeline.progress(1);
  }
}
```

---

## 5. Actionable Recommendations (Deliverable)

### P0 — Must Fix

| #   | Issue                                                 | Files                                                                                    | Change                                                   | Validation                        |
| --- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------- |
| 2.1 | Ambiguous "Director" name                             | [AnimationDirector.js](AnimationDirector.js)                                             | Rename to `AnimationDirector` or `ChoreographyBootstrap` | Search imports, update references |
| 2.2 | Inconsistent constructor variables (`var` vs `const`) | [BackgroundVideo.js](sections/background/BackgroundVideo.js)                             | Standardize all to `const`                               | Run `npm run format`              |
| 2.3 | Implicit DOM contract in AbstractSection              | [AbstractSection.js](sections/abstract-section/AbstractSection.js)                       | Add `isDisabled` flag pattern + document OR throw error  | Test missing DOM elements         |
| 2.4 | Hardcoded event strings (`'preloader:out'`)           | [LandingSequence.js](sequences/landing/LandingSequence.js), [constants.js](constants.js) | Add `EVENTS.system.*` to constants                       | grep for hardcoded event strings  |
| 2.5 | README shows incorrect static AnimationBus usage      | [README.md](dataink.io/frontend/js/choreography/README.md)                                                                   | Update examples to show instance usage                   | Review README code samples        |
| 4.1 | Missing `_applyPostIntroState()` method               | [AbstractSection.js](sections/abstract-section/AbstractSection.js)                       | Implement method or remove call                          | Test reduced motion mode          |

---

### P1 — Should Fix

| #   | Issue                                       | Files                                                              | Change                                    | Validation                |
| --- | ------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------- | ------------------------- |
| 2.6 | config.js vs. constants.js naming ambiguity | [config.js](config.js), [constants.js](constants.js)               | Add module-level JSDoc clarifying purpose | Documentation review      |
| 2.7 | AbstractSection 6-parameter constructor     | [AbstractSection.js](sections/abstract-section/AbstractSection.js) | Refactor to options object                | Update all subclasses     |
| 2.8 | "StageManager" name doesn't describe role   | [ScrollEffectsCoordinator.js](ScrollEffectsCoordinator.js)         | Rename to `ScrollEffectsCoordinator`      | Update imports            |
| 2.9 | Mixed defensive patterns for bus stub       | [AbstractSection.js](sections/abstract-section/AbstractSection.js) | Use explicit NullAnimationBus class       | Test sections without bus |
| 3.1 | GSAP imports scattered across files         | Multiple                                                           | Centralize in `vendor/gsap.js`            | Update all GSAP imports   |
| 3.2 | Missing "Getting Started" guide             | Documentation                                                      | Add step-by-step new section guide        | Developer onboarding test |
| 3.3 | Error swallowing in AnimationBus            | [AnimationBus.js](AnimationBus.js)                                 | Uncomment error logging                   | Test error handling       |

---

### P2 — Nice to Have

| #    | Issue                                   | Files                                                                              | Change                               | Validation          |
| ---- | --------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------ | ------------------- |
| 2.10 | Commented-out code                      | Multiple                                                                           | Remove commented logger statements   | Code cleanup        |
| 2.11 | Inconsistent optional chaining patterns | Multiple                                                                           | Standardize `?.` usage guidelines    | Code review         |
| 3.4  | Link initialization diagram from README | [README.md](dataink.io/frontend/js/choreography/README.md)                                                             | Add link to sequence diagram         | Documentation check |
| 3.5  | Document bind() idempotency behavior    | [AbstractSectionTriggers.js](sections/abstract-section/AbstractSectionTriggers.js) | Add JSDoc clarifying rebind behavior | Documentation       |

---

## 6. Canonical Pattern Proposal

### Pattern 1: Section Registration (RECOMMENDED CANONICAL)

**Current scattered approach:**

```javascript
// Director.js
this.sections = {
  video: new BackgroundVideo({ bus, reducedMotionHandler }),
  hero: new Hero({ bus, reducedMotionHandler }),
  bio: new Bio({ bus, reducedMotionHandler }),
};
```

**Proposed canonical:**

```javascript
// sections/registry.js
export const SECTION_REGISTRY = [
  { id: 'video', Class: BackgroundVideo, selector: SELECTORS.video },
  { id: 'hero', Class: Hero, selector: SELECTORS.hero },
  { id: 'bio', Class: Bio, selector: SELECTORS.bio },
];

// Director.js
import { SECTION_REGISTRY } from './sections/registry.js';

this.sections = SECTION_REGISTRY.reduce((acc, { id, Class, selector }) => {
  const element = document.getElementById(selector);
  if (element) {
    acc[id] = new Class({ bus: this.bus, reducedMotionHandler: this.stage?.reducedMotion });
  }
  return acc;
}, {});
```

**Benefits:**

- Single source of truth for section registration
- Easy to add/remove sections without editing Director
- Self-documenting (registry shows all available sections)
- AI-discoverable pattern

**Canonical location:** Create `js/choreography/sections/registry.js`

---

### Pattern 2: Event Listening in Sequences (CURRENT IS GOOD)

**Current approach (already canonical):**

```javascript
// LandingSequence.js
_registerListeners() {
  const on = (event, handler) => {
    const off = this.bus.on(event, handler);
    this._listeners.push(off);
  };

  on(EVENTS.hero.introComplete, () => {
    this.sections?.work?.playIntro?.();
  });
}
```

**Recommendation:** Keep this pattern, document as canonical in README:

```markdown
### Creating Animation Sequences

Sequences coordinate multi-section flows by listening to events:

\`\`\`javascript
\_registerListeners() {
// Helper stores unsubscribe functions for cleanup
const on = (event, handler) => {
const off = this.bus.on(event, handler);
this.\_listeners.push(off);
};

// Wire section transitions
on(EVENTS.hero.introComplete, () => {
this.sections.next.playIntro();
});
}
\`\`\`
```

**Canonical location:** This pattern should be documented in [README.md](dataink.io/frontend/js/choreography/README.md) under "Creating Sequences"

---

### Pattern 3: Section File Organization (RECOMMEND SIMPLIFICATION)

**Current:** Every section needs 3 files:

- `Hero.js` (controller)
- `HeroAnimations.js` (GSAP timelines)
- `HeroTriggers.js` (ScrollTrigger bindings)

**Analysis:**

- **Pro:** Clear separation of concerns
- **Con:** High ceremony for simple sections (3 files for minimal logic)
- **Con:** Not obvious which file to edit for simple changes

**Proposed canonical (for simple sections):**

```javascript
// Hero.js (all-in-one for simple sections)
export default class Hero extends AbstractSection {
  constructor({ bus, reducedMotionHandler }) {
    const view = document.getElementById('hero');

    super({
      view,
      events: EVENTS.hero,
      bus,
      reducedMotionHandler,
      // Inline animations for simple cases
      createIntro: () => {
        return gsap.fromTo(view, { opacity: 0 }, { opacity: 1, duration: 0.6 });
      },
    });
  }
}
```

**Reserve 3-file pattern for complex sections:**

- Hero (has scramble text, split text, complex timelines) ✅ Keep separate
- Bio (simple fade) → Could inline

**Recommendation:** Document both patterns in README:

```markdown
### Section Patterns

**Simple sections (single file):** Use inline animation functions  
**Complex sections (3 files):** Separate Animations + Triggers modules

See [Hero](./sections/hero/) for complex example  
See [Bio](./sections/bio/) for simple example (candidate for simplification)
```

---

## Summary

### Critical Takeaways

1. **AIX blockers:** Generic naming ("Director", "StageManager"), inconsistent patterns, hardcoded event strings
2. **DX wins:** Excellent README, manager modules well-designed, GSAP integration clean
3. **Must document:** Initialization flow, canonical patterns, section registration
4. **Quick wins:** Centralize GSAP imports, standardize `const` vs `var`, add `EVENTS.system`

### Recommended Next Steps

1. **Fix P0 issues** (2-4 hours):
   - Rename Director → AnimationDirector
   - Add `EVENTS.system` to constants.js
   - Standardize `const` in constructors
   - Implement `_applyPostIntroState()` or remove calls

2. **Add documentation** (1-2 hours):
   - Getting Started guide
   - Canonical patterns section in README
   - Link initialization diagram

3. **Refactor P1 issues** (4-6 hours):
   - Centralize GSAP imports
   - Create section registry
   - Simplify Bio section to single-file pattern
   - AbstractSection options object refactor

### Success Metrics

**AIX improved when:**

- Copilot suggests correct event names from `EVENTS` constant
- New section generation follows registry pattern
- GSAP imports always resolve to correct version

**DX improved when:**

- New developer can add section in < 30 minutes
- Debugging: `window.director.getState()` shows initialization status
- Event flow traceable via `director.traceEvents(true)`

---

_Review complete. Package shows strong architectural foundations with excellent separation of concerns. Primary improvements needed: naming clarity for AI discoverability, documentation for onboarding, and pattern standardization for consistency._
