<!-- @format -->

# Choreography System

Event-driven GSAP choreography using a small pub/sub bus for page-level animations.

## Architecture

- **Director.js**: Bootstraps on DOMContentLoaded; exposes `window.director` API.
- **StageManager.js**: ScrollSmoother + background layers + gel effects.
- **AnimationBus.js**: Tiny event bus (`on`, `emit`, `off`).
- **BaseSection.js**: Lifecycle base for section controllers.
- **Sections**: `sections/*` controllers (Hero, Work, Biography).
- **Sequences**: `sequences/*` multi-section coordination (e.g., LandingSequence).

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
    └── LandingSequence.js   # Landing page choreography
```

# Choreography System

GSAP + small event bus coordinating page sections.

## Layout

- `Director.js`, `StageManager.js`, `AnimationBus.js`
- `sections/*` (Hero, Work, Biography), `sequences/*` (LandingSequence)

## Events

`section:${id}:{intro|outro}:{start|complete}`
`section:${id}:scroll:{enter|exit}`

## Notes

- Register GSAP plugins in `StageManager`.
- IDs must match DOM; use existing `this.smoother`.
- Add brief delays if ScrollTrigger races.
- Clean up listeners with `bus.off()`.
  this.createOutro();
