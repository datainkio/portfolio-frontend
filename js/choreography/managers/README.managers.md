# Animation Manager Modules

Specialized single-responsibility modules that power the StageManager animation system. Each manager handles a specific aspect of the site's animation architecture.

## Architecture Overview

**Design Philosophy**: Single Responsibility Principle

- Each manager has one clear purpose
- Managers are independent and reusable
- StageManager coordinates initialization and dependencies
- Clean separation enables easier testing and maintenance

**Dependency Flow**:

```
StageManager (coordinator)
├── ReducedMotionHandler (accessibility foundation)
├── BackgroundLayerManager (DOM positioning)
├── ScrollSmootherManager (depends on ReducedMotionHandler)
└── GelAnimationManager (depends on ReducedMotionHandler)
```

## Manager Modules

### ReducedMotionHandler

**Purpose**: Accessibility-first motion preference detection

**Responsibilities**:

- Monitors `prefers-reduced-motion` media query
- Provides callback system for real-time preference changes
- Foundation for all animation decisions

**Usage**:

```javascript
const handler = new ReducedMotionHandler();

// Check current state
if (handler.isReducedMotion()) {
  // Use reduced animations
}

// React to changes
const unsubscribe = handler.onChange((enabled) => {
  console.log("Reduced motion:", enabled);
});
```

**Key Features**:

- Auto-detects browser support
- Graceful fallback for older browsers
- Real-time preference monitoring
- Callback cleanup support

---

### BackgroundLayerManager

**Purpose**: Fixed background layer positioning

**Problem Solved**:
ScrollSmoother applies transforms to `#smooth-content`, which breaks `position:fixed` elements inside (they anchor to the transformed element instead of viewport). Background layers must live outside the transformed container.

**Responsibilities**:

- Detects background layers inside ScrollSmoother content
- Moves them to `#smooth-wrapper` or body
- Applies proper fixed positioning styles
- Maintains z-index stacking

**Usage**:

```javascript
const manager = new BackgroundLayerManager([
  "overlay-view",
  "sizzle-background",
]);
manager.fix(); // Call after DOM ready
```

**Key Features**:

- Auto-detects element locations
- Preserves visual stacking order
- Handles multiple background layers
- Works with or without ScrollSmoother

---

### ScrollSmootherManager

**Purpose**: GSAP ScrollSmoother lifecycle management

**Responsibilities**:

- Auto-detects DOM requirements (`#smooth-wrapper` + `#smooth-content`)
- Initializes ScrollSmoother with site-specific config
- Integrates with ReducedMotionHandler
- Provides graceful degradation to native scroll

**Usage**:

```javascript
const manager = new ScrollSmootherManager(reducedMotionHandler);
const smoother = manager.getSmoother(); // null if unavailable

// Force enable/disable
manager.enable();
manager.disable();

// Check status
if (manager.isActive()) {
  // Smoother is running
}
```

**Key Features**:

- Lazy initialization (creates instance on first access)
- Respects reduced motion preferences
- Auto-cleanup on reduced motion change
- Works without ReducedMotionHandler (standalone)

**Configuration**:

```javascript
{
  wrapper: '#smooth-wrapper',
  content: '#smooth-content',
  smooth: 1.2,           // Smoothness factor
  effects: true          // Enable parallax effects
}
```

---

### GelAnimationManager

**Purpose**: Gel background animation coordination

**Responsibilities**:

- Finds and initializes Gel controller instances
- Creates scroll-driven animation with staggered timing
- Manages ScrollTrigger lifecycle
- Coordinates with ReducedMotionHandler

**Usage**:

```javascript
// Default configuration (Tailwind grid-aligned)
const manager = new GelAnimationManager(undefined, reducedMotionHandler);

// Custom configuration
const customConfig = {
  myGel_1: 1 / 4, // 25% width
  myGel_2: 1 / 2, // 50% width
  myGel_3: 3 / 4, // 75% width
};
const manager = new GelAnimationManager(customConfig, reducedMotionHandler);

// Initialize and animate
manager.initialize();
manager.animate("#smooth-wrapper"); // or undefined for window
```

**Default Configuration** (aligned to Tailwind's 12-column grid):

```javascript
{
  bgGel_0: 1/6,    // 2 columns (16.67%)
  bgGel_1: 7/12,   // 7 columns (58.33%)
  bgGel_2: 3/4     // 9 columns (75%)
}
```

**Animation Logic**:

- Gels start at full width (`xScale: 1`)
- Scale down to target width on scroll
- Staggered timing creates cascading effect
- Scrubbed to scroll position (0-200vh range)

**Key Features**:

- Configurable gel widths
- Staggered animation timing
- ScrollTrigger integration
- Reduced motion support

---

### LineManager

**Purpose**: Render and manage decorative LeaderLine connectors from config-defined line objects.

**Responsibilities**:

- Builds lines from `SOCKETS` entries keyed by id, each with `origin` and `terminus` sockets
- Applies `LINE_STYLES.classes` to generated LeaderLine SVG elements for stroke/fill styling
- Handles resize/scroll/load reposition updates
- Exposes imperative APIs so sequences can reveal one line from a socket pair and hide all lines when needed
- Resolves `origin.element` and `terminus.element` independently (optional per-socket `scope`), so endpoints can live in different DOM regions

**Usage**:

```javascript
const lineManager = new LineManager();
lineManager.initialize();

// Reveal a line using the origin socket from one key and terminus socket from another
lineManager.showLineBySocketPair("hero", "bio");

// Hide all lines immediately
lineManager.hideAllLines("none");

// Cleanup
lineManager.destroy();
```

---

## StageManager Integration

**Before Refactoring** (monolithic):

- 280+ lines in single file
- Complex methods handling multiple concerns
- Difficult to test individual features
- Hard to understand initialization order

**After Refactoring** (modular):

- ~100 lines in StageManager
- 4 focused manager modules (~100 lines each)
- Clear responsibility boundaries
- Easy to test and extend

**Example Usage in StageManager**:

```javascript
export default class StageManager {
  constructor() {
    // Initialize managers in dependency order
    this.reducedMotion = new ReducedMotionHandler();
    this.backgroundLayers = new BackgroundLayerManager([
      "overlay-view",
      "sizzle-background",
    ]);
    this.scrollSmoother = new ScrollSmootherManager(this.reducedMotion);
    this.gelAnimation = new GelAnimationManager(undefined, this.reducedMotion);

    this.initialize();
  }

  initialize() {
    this.backgroundLayers.fix();
    this.gelAnimation.initialize();

    const scroller = this.scrollSmoother.isActive()
      ? "#smooth-wrapper"
      : undefined;
    this.gelAnimation.animate(scroller);
  }
}
```

## Common Patterns

### Reduced Motion Integration

All animation managers accept `ReducedMotionHandler` instance:

```javascript
const reducedMotion = new ReducedMotionHandler();
const scrollManager = new ScrollSmootherManager(reducedMotion);
const gelManager = new GelAnimationManager(config, reducedMotion);

// Managers automatically respond to preference changes
reducedMotion.onChange((enabled) => {
  // Managers handle cleanup internally
});
```

### Cleanup Pattern

All managers implement `destroy()` for proper cleanup:

```javascript
gelManager.destroy(); // Kills ScrollTrigger, clears gels
scrollManager.destroy(); // Kills smoother, unsubscribes
reducedMotion.destroy(); // Clears callbacks
```

### Graceful Degradation

Managers handle missing dependencies gracefully:

```javascript
// Works without ReducedMotionHandler
const manager = new ScrollSmootherManager(null);

// Works without DOM elements
const gels = new GelAnimationManager(); // Returns empty array

// Works without ScrollSmoother
const scroller = undefined; // Falls back to window
gelManager.animate(scroller);
```

## Testing Strategy

**Unit Testing** (easier with modular design):

```javascript
// Test ReducedMotionHandler in isolation
test("detects prefers-reduced-motion", () => {
  const handler = new ReducedMotionHandler();
  expect(handler.isReducedMotion()).toBe(false);
});

// Test GelAnimationManager without dependencies
test("initializes gels from config", () => {
  const manager = new GelAnimationManager(testConfig);
  manager.initialize();
  expect(manager.getGels()).toHaveLength(3);
});
```

**Integration Testing**:

```javascript
// Test manager coordination
test("StageManager coordinates managers", () => {
  const stage = new StageManager();
  expect(stage.reducedMotion).toBeDefined();
  expect(stage.gelAnimation).toBeDefined();
  expect(stage.scrollSmoother).toBeDefined();
});
```

## Debugging

**Enable ScrollTrigger markers**:

```javascript
import { ScrollTrigger } from "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js";
ScrollTrigger.defaults({ markers: false });
```

**Access managers from console**:

```javascript
// Via global Director instance
const stage = window.director.getStage();
console.log("Smoother:", stage.scrollSmoother.isActive());
console.log("Gels:", stage.gelAnimation.getGels());
console.log("Reduced Motion:", stage.reducedMotion.isReducedMotion());
```

**Common Issues**:

1. **ScrollSmoother not working**: Check DOM structure

   ```javascript
   // Must have both elements
   document.querySelector("#smooth-wrapper");
   document.querySelector("#smooth-content");
   ```

2. **Gels not animating**: Verify element IDs

   ```javascript
   // Check gel elements exist
   ["bgGel_0", "bgGel_1", "bgGel_2"].forEach((id) => {
     console.log(id, document.getElementById(id));
   });
   ```

3. **Fixed backgrounds not working**: Check transform context
   ```javascript
   // Background layers should be outside #smooth-content
   const overlay = document.getElementById("overlay-view");
   console.log("Parent:", overlay.parentElement.id); // Should be smooth-wrapper or body
   ```

## Future Enhancements

**Potential New Managers**:

- `ParallaxManager`: Coordinate parallax effects across sections
- `VideoManager`: Handle background video lifecycle and controls
- `PerformanceMonitor`: Track FPS and adjust quality dynamically
- `TransitionManager`: Page transition coordination

**Extensibility Pattern**:

```javascript
// New managers follow same pattern
export default class CustomManager {
  constructor(reducedMotionHandler) {
    this._reducedMotionHandler = reducedMotionHandler;
    // Setup
  }

  // Public API
  initialize() {}
  destroy() {}
}
```

## Benefits of Modular Design

✅ **Maintainability**: Each file has clear purpose  
✅ **Testability**: Test managers in isolation  
✅ **Reusability**: Use managers in other contexts  
✅ **Debuggability**: Easier to trace issues  
✅ **Extensibility**: Add new managers without touching existing code  
✅ **Readability**: Smaller files with focused responsibilities  
✅ **Collaboration**: Multiple developers can work on different managers

---

**Last Updated**: December 2025  
**Related**: `StageManager.js`, `Director.js`, `choreography/README.md`
