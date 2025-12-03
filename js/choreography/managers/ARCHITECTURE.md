# StageManager Architecture Diagram

## Before Refactoring - Monolithic Design

```
┌─────────────────────────────────────────────────────────────┐
│                        StageManager                         │
│  (280+ lines - All responsibilities in one class)           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Reduced motion detection & handling               │   │
│  │ • Media query listener setup                        │   │
│  │ • Background layer DOM manipulation                 │   │
│  │ • Fixed positioning logic                           │   │
│  │ • ScrollSmoother initialization                     │   │
│  │ • ScrollSmoother lifecycle management               │   │
│  │ • Gel element discovery                             │   │
│  │ • Gel controller creation                           │   │
│  │ • Gel animation ScrollTrigger                       │   │
│  │ • Video element caching                             │   │
│  │ • Cross-concern state management                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Problems:                                                  │
│  ✗ Too many responsibilities                                │
│  ✗ Hard to test                                            │
│  ✗ Difficult to understand                                 │
│  ✗ Changes affect multiple concerns                        │
│  ✗ Tight coupling between features                         │
└─────────────────────────────────────────────────────────────┘
```

## After Refactoring - Modular Design

```
┌─────────────────────────────────────────────────────────────────┐
│                     StageManager (Coordinator)                  │
│                        (~100 lines)                             │
│                                                                 │
│  Responsibilities:                                              │
│  • Initialize managers in correct order                         │
│  • Provide unified public API                                   │
│  • Coordinate lifecycle (destroy)                               │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Manages    │  │   Manages    │  │   Manages    │         │
│  │  ↓           │  │  ↓           │  │  ↓           │         │
└──┴──────────────┴──┴──────────────┴──┴──────────────┴─────────┘
   │                  │                  │
   │                  │                  │
   ▼                  ▼                  ▼

┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ ReducedMotion    │ │ BackgroundLayer  │ │ ScrollSmoother   │
│    Handler       │ │    Manager       │ │    Manager       │
│   (~95 lines)    │ │   (~85 lines)    │ │   (~115 lines)   │
│                  │ │                  │ │                  │
│ • Motion pref    │ │ • Find elements  │ │ • Auto-detect    │
│   detection      │ │ • Detach from    │ │ • Initialize     │
│ • Media query    │ │   scroller       │ │   smoother       │
│   listener       │ │ • Apply fixed    │ │ • Lifecycle      │
│ • Callback       │ │   styles         │ │   management     │
│   system         │ │ • Z-index fix    │ │ • Integration    │
└──────────────────┘ └──────────────────┘ └──────────────────┘
         │                                          │
         │                                          │
         └─────────────┬──────────────┬────────────┘
                       │ Injected     │
                       ▼              ▼

              ┌──────────────────────┐
              │  GelAnimation        │
              │     Manager          │
              │   (~150 lines)       │
              │                      │
              │ • Find gel elements  │
              │ • Create Gel         │
              │   controllers        │
              │ • Configure widths   │
              │ • ScrollTrigger      │
              │ • Staggered timing   │
              └──────────────────────┘
```

## Dependency Flow

```
Initialize Phase:
═══════════════

1. ReducedMotionHandler ──────┐
   (Foundation - no deps)     │
                              │
2. BackgroundLayerManager     │ Injected
   (Independent - no deps)    │    ↓
                              │
3. ScrollSmootherManager ←────┤
   (Depends on #1)            │
                              │
4. GelAnimationManager ←──────┘
   (Depends on #1)


Runtime Phase:
══════════════

User scrolls
     │
     ├──→ ScrollSmootherManager
     │    (smooth scroll effect)
     │
     └──→ GelAnimationManager
          (gel scale animation)

User changes motion pref
     │
     ├──→ ReducedMotionHandler
     │    (detects change)
     │
     ├──→ ScrollSmootherManager
     │    (kills/enables smoother)
     │
     └──→ GelAnimationManager
          (kills/enables animation)
```

## Communication Patterns

```
One-Way Dependency Injection:
═════════════════════════════

StageManager
    │
    ├─> creates ──> ReducedMotionHandler
    │
    ├─> creates ──> BackgroundLayerManager
    │
    ├─> creates ──> ScrollSmootherManager
    │   (receives)     (ReducedMotionHandler)
    │
    └─> creates ──> GelAnimationManager
        (receives)     (ReducedMotionHandler)


Event-Driven Updates:
════════════════════

ReducedMotionHandler
    │
    │ (broadcasts via onChange callbacks)
    │
    ├──→ ScrollSmootherManager (subscribed)
    │    • Disables on reduced motion
    │    • Enables when preference changes
    │
    └──→ GelAnimationManager (subscribed)
         • Destroys triggers on reduced motion
         • Recreates when preference changes
```

## Module Interactions

```
Typical Initialization Flow:
════════════════════════════

StageManager constructor
    │
    ├─ new ReducedMotionHandler()
    │   └─ Sets up media query listener
    │
    ├─ new BackgroundLayerManager(['overlay-view', 'sizzle-background'])
    │   └─ Stores element IDs
    │
    ├─ new ScrollSmootherManager(reducedMotion)
    │   └─ Subscribes to motion changes
    │
    ├─ new GelAnimationManager(config, reducedMotion)
    │   └─ Subscribes to motion changes
    │
    └─ initialize()
        │
        ├─ backgroundLayers.fix()
        │   ├─ Finds elements by ID
        │   ├─ Moves outside scroller if needed
        │   └─ Applies fixed positioning
        │
        ├─ gelAnimation.initialize()
        │   ├─ Finds gel elements
        │   ├─ Creates Gel controllers
        │   └─ Sets initial state
        │
        └─ gelAnimation.animate(scroller)
            ├─ Checks reduced motion
            ├─ Creates ScrollTrigger
            └─ Sets up staggered animation
```

## Benefits Visualization

```
Testability:
═══════════

Before:
┌─────────────────────────────────┐
│   Must mock entire world        │
│   to test one feature           │
│   (window, DOM, GSAP, etc.)     │
└─────────────────────────────────┘

After:
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Test reduced │ │ Test scroll  │ │ Test gel     │
│ motion in    │ │ smoother in  │ │ animation in │
│ isolation    │ │ isolation    │ │ isolation    │
└──────────────┘ └──────────────┘ └──────────────┘


Maintainability:
═══════════════

Before: Change one thing → risk breaking everything
┌───────────────────────────────────────────┐
│ ███████████████ 280 lines ████████████████│
│ All concerns intermingled                 │
│ Hard to understand what affects what      │
└───────────────────────────────────────────┘

After: Change one thing → only affects that thing
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ 95 lines │ │ 85 lines │ │ 115 lines│ │ 150 lines│
│ One      │ │ One      │ │ One      │ │ One      │
│ concern  │ │ concern  │ │ concern  │ │ concern  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘


Reusability:
═══════════

Before: Can't reuse anything without entire StageManager

After: Use managers anywhere
┌─────────────────────────────────────────┐
│ import ReducedMotionHandler from ...    │
│ const handler = new ReducedMotion...    │
│ // Use in any component!                │
└─────────────────────────────────────────┘
```

## File Size Comparison

```
Before:
═══════

StageManager.js: ████████████████████████████ 280 lines
                 (everything in one file)

After:
══════

StageManager.js:           ████████ 100 lines (coordinator)
ReducedMotionHandler.js:   ████████ 95 lines
BackgroundLayerManager.js: ███████ 85 lines
ScrollSmootherManager.js:  ██████████ 115 lines
GelAnimationManager.js:    ████████████ 150 lines
README.md:                 ██████████████████ 400 lines
                           ─────────────────────────────
Total:                     945 lines (well-documented)

More lines? Yes. Better? Absolutely!
• Each file has single responsibility
• Comprehensive documentation
• Clear usage examples
• Easy to find and fix issues
```

---

**Summary**: Transformed complex monolith into clean, modular architecture with clear responsibilities and explicit dependencies.
