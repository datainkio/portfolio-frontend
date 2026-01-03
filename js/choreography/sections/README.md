<!-- @format -->

# Section Controllers - Current State

Sections coordinate GSAP timelines with the AnimationBus and respect reduced-motion preferences. Canonical section discovery now lives in the registry so AnimationDirector can stay minimal. **Registered sections:** Hero, Background Video, Bio. Organizations exists but is not wired because it still uses the legacy constructor signature.

## Registry (source of truth)

- Canonical mapping lives in [js/choreography/sections/registry.js](js/choreography/sections/registry.js); Director iterates it to instantiate sections.
- Add a new section by extending `AbstractSection`, then register it with a lowercase key that matches the DOM id.
- Organizations is intentionally commented out until it is migrated to the current constructor signature.

## AbstractSection essentials

- Source: [js/choreography/sections/abstract-section/AbstractSection.js](js/choreography/sections/abstract-section/AbstractSection.js)
- Expects an options object: `{ view, animations, triggers, events, bus, reducedMotionHandler }`.
- Binds GSAP timeline callbacks to AnimationBus events (`introStart`, `introComplete`, `outroComplete`) when a timeline exists.
- Wires ScrollTrigger hooks via the provided `triggers.bind()` implementation when triggers exist.
- Reduced motion: if `reducedMotionHandler.isReducedMotion()` is true, the intro timeline jumps to its end state and callbacks are **not** bound. Provide sensible end states in animations for accessibility.
- Reset/destroy emit `section:${this.id}:reset|destroy`; set `this.id` in subclasses if you rely on those events.

## Registered sections

- Hero: [js/choreography/sections/hero/Hero.js](js/choreography/sections/hero/Hero.js) → view `#hero`, uses `HeroAnimations` + `HeroTriggers`, events `EVENTS.hero`.
- Background Video: [js/choreography/sections/background/BackgroundVideo.js](js/choreography/sections/background/BackgroundVideo.js) → view `#overlay-view`, uses `BackgroundVideoAnimations` + `BackgroundVideoTriggers`, events `EVENTS.video`.
- Bio: [js/choreography/sections/bio/Bio.js](js/choreography/sections/bio/Bio.js) → view `#bio`, uses `BioAnimations` + `BioTriggers`, events `EVENTS.bio`.
- Organizations: [js/choreography/sections/organizations/Organizations.js](js/choreography/sections/organizations/Organizations.js) is not registered and still uses the old constructor signature; migrate before re-enabling.

## Lifecycle (current pattern)

- Director reads `SECTION_REGISTRY`, instantiates each class with `{ bus, reducedMotionHandler }`.
- Constructor configures animations/triggers, binds timeline callbacks, and binds ScrollTrigger hooks when present.
- `playIntro()` and `playOutro()` delegate directly to the animations module (`intro()`/`outro()`), which should emit events through the bound callbacks.
- Reduced-motion path jumps to end state and emits `introComplete` once; no triggers are bound in that path.

## Add a new section (use the options signature)

```javascript
import AbstractSection from '../abstract-section/AbstractSection.js';
import { EVENTS } from '../../constants.js';
import { SELECTORS, ANIMATION_DEFAULTS } from '../../config.js';
import CustomAnimations from './CustomAnimations.js';
import CustomTriggers from './CustomTriggers.js';

export default class Custom extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.custom);
    const animations = new CustomAnimations(view, ANIMATION_DEFAULTS);
    const triggers = new CustomTriggers(view);

    super({ view, animations, triggers, events: EVENTS.custom, bus, reducedMotionHandler });

    if (this.triggers) this.triggers.section = this;
    if (!view) this.logger.trace('element not found; skipping initialization.');
  }
}
```

Then add `custom: Custom` to [js/choreography/sections/registry.js](js/choreography/sections/registry.js) and wire events in `EVENTS`.

## Debugging tips

- Use `window.director.getSections()` to inspect instances after Director boots.
- Enable bus logging with `window.director.enableDebug(true)` to watch event flow.
- Add `markers: true` in trigger classes while tuning ScrollTrigger positions.

