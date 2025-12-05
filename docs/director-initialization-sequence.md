# Director Initialization Sequence Diagram

This diagram illustrates the complete initialization flow of the Director animation system.

```mermaid
sequenceDiagram
    participant Browser
    participant DOMContentLoaded Event
    participant Director Constructor
    participant AnimationBus
    participant StageManager
    participant Hero Section
    participant Work Section
    participant Biography Section
    participant LandingSequence
    participant Animation System

    Browser->>DOMContentLoaded Event: Page loaded, DOM ready
    DOMContentLoaded Event->>Director Constructor: Trigger event listener
    
    rect rgb(200, 220, 240)
        note over Director Constructor: 1. Create Core Systems
        Director Constructor->>AnimationBus: new AnimationBus()
        AnimationBus-->>Director Constructor: Event bus instance
        Director Constructor->>StageManager: new StageManager()
        StageManager-->>Director Constructor: Stage manager instance
    end

    rect rgb(200, 220, 240)
        note over Director Constructor: 2. Get Smoother Reference
        Director Constructor->>StageManager: getSmoother()
        StageManager-->>Director Constructor: ScrollSmoother instance
    end

    rect rgb(220, 240, 220)
        note over Director Constructor: 3. Initialize Section Controllers
        Director Constructor->>Hero Section: new Hero(bus, smoother)
        Hero Section-->>Director Constructor: Hero controller
        Director Constructor->>Work Section: new Work(bus, smoother)
        Work Section-->>Director Constructor: Work controller
        Director Constructor->>Biography Section: new Biography(bus, smoother)
        Biography Section-->>Director Constructor: Biography controller
    end

    rect rgb(240, 220, 220)
        note over Director Constructor: 4. Create Choreography Sequence
        Director Constructor->>LandingSequence: new LandingSequence(bus, sections)
        LandingSequence-->>Director Constructor: Sequence coordinator
    end

    rect rgb(240, 240, 200)
        note over Director Constructor: 5. Start Animation Flow
        Director Constructor->>LandingSequence: sequence.start()
        LandingSequence->>Animation System: Begin animation choreography
        Animation System-->>Hero Section: Trigger hero intro animations
        Animation System-->>Work Section: Prepare work section timeline
        Animation System-->>Biography Section: Prepare biography section timeline
    end

    rect rgb(200, 240, 240)
        note over Director Constructor: 6. Export & Global Access
        Director Constructor->>Browser: window.director = new Director()
        Director Constructor-->>Browser: Animation system ready
    end

    Browser->>Browser: User scrolls/interacts
    Animation System->>Hero Section: Respond to scroll events
    Animation System->>Work Section: Respond to scroll events
    Animation System->>Biography Section: Respond to scroll events
```

## Key Initialization Phases

### Phase 1: Core Systems (Event Bus & Stage)
- **AnimationBus** - Creates centralized event coordination system
- **StageManager** - Initializes scroll smoothing and visual effects

### Phase 2: Section Controllers
- **Hero** - Homepage hero section animations
- **Work** - Portfolio work section animations  
- **Biography** - Biography section animations

Each section controller receives:
- `bus` - AnimationBus instance for event coordination
- `smoother` - ScrollSmoother reference for scroll-based animations

### Phase 3: Choreography Sequence
- **LandingSequence** - Coordinates animation flow between sections
- Sets up event listeners to orchestrate when each animation plays

### Phase 4: Start Animation
- Sequence begins, ready to respond to user interactions
- Animations trigger based on scroll position and events

### Phase 5: Global Access
- Director instance exposed at `window.director`
- Enables debugging and external control

## Timing

- **DOMContentLoaded** - Triggered when DOM is fully parsed (fast initialization)
- **Asset loading** - Gracefully handles assets still loading
- **First paint** - Animations ready before page fully renders

## Critical Requirements

- DOM elements: `#main-header`, `#work`, `#biography`, `#smooth-wrapper`, `#smooth-content`
- Background video: `/assets/video/sizzle.mp4`
- Overlay view molecule in template: `overlay-view.njk`
- GSAP plugins registered: `ScrollTrigger`, `ScrollSmoother`

## Debug Access

```javascript
// Enable animation event logging
window.director.enableDebug(true);

// Access individual systems
const sections = window.director.getSections();
const sequence = window.director.getSequence();
const stage = window.director.getStage();

// Control animations
window.director.restart();
```
