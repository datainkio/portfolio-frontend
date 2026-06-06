# AnimationDirector Initialization Sequence

How the browser-side choreography system bootstraps after `DOMContentLoaded`.

```mermaid
sequenceDiagram
    participant Browser
    participant DOM as DOMContentLoaded
    participant AD as AnimationDirector
    participant Bus as AnimationBus
    participant SEC as ScrollEffectsCoordinator
    participant Sections as Section Controllers
    participant LS as LandingSequence

    Browser->>DOM: Parse complete
    DOM->>AD: Construct AnimationDirector

    rect rgb(200, 220, 240)
        note over AD: 1. Core systems
        AD->>Bus: new AnimationBus()
        AD->>SEC: new ScrollEffectsCoordinator(bus)
        SEC-->>AD: Smoother + effect managers ready
    end

    rect rgb(220, 240, 220)
        note over AD: 2. Section controllers (from system/registry.js)
        AD->>Sections: new Hero / BackgroundVideo / Bio / Awards / Organizations / Work
        Sections-->>AD: Controllers (with bus + reducedMotionHandler)
    end

    rect rgb(240, 220, 220)
        note over AD: 3. Sequence wiring
        AD->>LS: new LandingSequence(bus, sections, …)
        LS->>Bus: subscribe to section lifecycle events
    end

    rect rgb(240, 240, 200)
        note over AD: 4. Start
        AD->>LS: sequence.start()
        LS->>Bus: emit EVENTS.video.introStart
        Bus->>Sections: dispatch to BackgroundVideo
    end

    rect rgb(200, 240, 240)
        note over AD: 5. Global access
        AD->>Browser: window.director = director
    end
```

## Phases

1. **Core systems** — `AnimationDirector` constructs `AnimationBus` (pub/sub) and `ScrollEffectsCoordinator` (scroll smoothing + background/decoration managers).
2. **Section controllers** — instantiated from `system/registry.js`. Each extends [AbstractSection](../js/choreography/system/AbstractSection.js) and receives `{ bus, reducedMotionHandler }`. Active sections: Hero, BackgroundVideo, Bio, Awards, Organizations, Work.
3. **Sequence wiring** — `LandingSequence` subscribes to section lifecycle events (`section:phase:state`) and orchestrates the landing flow.
4. **Start** — sequence emits the first event; sections respond via `AnimationBus`.
5. **Global access** — `window.director` is exposed for debugging.

## DOM contract

The full landing experience expects these IDs to exist. Missing IDs degrade gracefully (the affected section is skipped):

- `#smooth-wrapper`, `#smooth-content` — required for `ScrollSmoother`
- `#hero`, `#overlay-view`, `#bio`, `#awards`, `#organizations`, `#work`

GSAP plugins registered globally: `ScrollTrigger`, `ScrollSmoother`.

## Debug access

```javascript
// Enable verbose event logging on the bus
window.director.enableDebug?.(true);

// Inspect runtime
window.director.getSections?.();
window.director.getSequence?.();
window.director.getStage?.(); // ScrollEffectsCoordinator

// Re-run the landing sequence (for debugging)
window.director.restart?.();
```

## References

- [AnimationDirector.js](../js/choreography/AnimationDirector.js)
- [AnimationBus.js](../js/choreography/system/AnimationBus.js)
- [ScrollEffectsCoordinator.js](../js/choreography/managers/ScrollEffectsCoordinator/ScrollEffectsCoordinator.js)
- [system/registry.js](../js/choreography/system/registry.js)
- [templates/landing/LandingSequence.js](../js/choreography/templates/landing/LandingSequence.js)
- [config/contracts/events.js](../js/choreography/config/contracts/events.js)
