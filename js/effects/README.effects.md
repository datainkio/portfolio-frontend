<!-- @format -->

# Effects - Visual & Typographic Transformation Systems

Collection of reusable visual effects for text, transitions, and gel animations. All effects are GSAP-powered and accessibility-aware.

## Quick Overview

```
┌─────────────────────────────────────┐
│         Effects Package             │
├─────────────────────────────────────┤
│ TextParty    → Text choreography    │
│ Transitions  → Gel/page transitions │
│ Gel          → Liquid background    │
│ Halftone     → Dotted/pixelated     │
│ TextEffects  → Stagger, shadow, etc │
│ Parallax     → Depth with scroll    │
└─────────────────────────────────────┘
```

## TextParty - Advanced Text Effects Library

High-level text animation library with multiple effect types and choreography patterns.

**Location**: `js/effects/textparty/`

### Core Classes

#### TextParty

Main orchestrator for text-based animations with built-in stagger support.

```javascript
import { TextParty } from './textparty/TextParty.js';

const textParty = new TextParty({
  element: document.querySelector('.title'),
  staggerType: 'word',  // 'char', 'word', 'line'
  reduceMotionHandler: reducedMotionHandler
});

// Play intro animation
textParty.playIntro({
  duration: 0.8,
  fromProps: { opacity: 0, y: 20 },
  toProps: { opacity: 1, y: 0 },
  staggerAmount: 0.1
});

// Play outro animation
textParty.playOutro({ ... });

// Manual control
textParty.pause();
textParty.resume();
textParty.kill();
```

#### SplitText Wrapper

Wraps GSAP SplitText plugin with type-safe splitting:

```javascript
const split = new SplitText(element, {
  type: 'words,chars,lines', // Splits for multiple targets
});

// Access split elements
split.words; // Array of word spans
split.chars; // Array of character spans
split.lines; // Array of line spans

// Cleanup
split.revert();
```

#### TextEffect Library

Pre-built effect patterns for common text animations:

```javascript
import { textEffects } from './textparty/effects/index.js';

// Fade in effect
const fadeEffect = textEffects.fadeIn(element, {
  duration: 1.2,
  staggerAmount: 0.05,
});

// Type effect (reveal character by character)
const typeEffect = textEffects.typewriter(element, {
  duration: 2,
  cursorElement: document.querySelector('.cursor'),
});

// Bounce effect
const bounceEffect = textEffects.bounce(element, {
  duration: 0.6,
  bounce: 3,
  staggerAmount: 0.1,
});

// Available effects: fadeIn, fadeOut, typewriter, bounce, shake, blur, scale, slide
```

### Usage Example

```javascript
// Full text animation sequence
class TitleAnimation {
  constructor(element, bus, reducedMotionHandler) {
    this.textParty = new TextParty({
      element,
      staggerType: 'word',
      reduceMotionHandler: reducedMotionHandler,
    });
    this.bus = bus;
  }

  playIntro() {
    this.textParty.playIntro({
      duration: 0.8,
      fromProps: { opacity: 0, y: 20 },
      toProps: { opacity: 1, y: 0 },
      staggerAmount: 0.08,
    });

    this.textParty.timeline.on('complete', () => {
      this.bus.emit('title:intro:complete');
    });
  }
}
```

## Transitions - Visual State Changes

Smooth transitions between UI states using gel effects and fades.

**Location**: `js/effects/transitions/`

### TransitionManager

Orchestrates full-screen transition effects:

```javascript
import { TransitionManager } from './transitions/TransitionManager.js';

const transitionMgr = new TransitionManager({
  container: document.querySelector('#transition-container'),
  duration: 0.6,
  easing: 'power2.inOut',
});

// Transition out (fade/gel effect to screen)
await transitionMgr.transitionOut({
  type: 'gel', // or 'fade'
  direction: 'up',
});

// Do something
// ...

// Transition in (fade from effect)
await transitionMgr.transitionIn({
  type: 'gel',
  direction: 'down',
});
```

### Available Transition Types

- **Fade**: Simple opacity transition
- **Gel**: Liquid gel wave effect
- **Slide**: Direction-based reveal
- **Blur**: Blur-based transition

## Gel System - Liquid Background Effects

Advanced liquid morphing effects using canvas/SVG layers.

**Location**: `js/effects/gel/`

### Core Classes

#### GelGeometry

Manages gel shape and vertex positions:

```javascript
import { GelGeometry } from './gel/GelGeometry.js';

const geometry = new GelGeometry({
  width: window.innerWidth,
  height: window.innerHeight,
  vertexCount: 8,
  noiseScale: 0.3,
});

// Get current vertices
const vertices = geometry.getVertices();

// Update with scroll
geometry.update(scrollProgress);

// Respond to mouse
geometry.setMousePosition(x, y);
```

#### GelManipulator

Controls gel animation and morphing:

```javascript
import { GelManipulator } from './gel/GelManipulator.js';

const manipulator = new GelManipulator(geometry, {
  morphDuration: 0.8,
  waveAmplitude: 40,
  waveFrequency: 0.5,
});

// Morph to new shape
manipulator.morph({ type: 'wave', intensity: 1 });

// Respond to scroll
manipulator.updateForScroll(scrollVelocity);

// Animate to position
manipulator.animateTo(targetX, targetY);
```

#### GelMask

Renders gel shape as SVG mask:

```javascript
import { GelMask } from './gel/GelMask.js';

const mask = new GelMask(geometry, {
  svgId: 'gel-mask',
  fillColor: 'rgba(255, 0, 0, 0.1)',
  updateFrequency: 'throttle',
});

// Apply mask to element
mask.applyToElement(document.querySelector('.content'));

// Cleanup
mask.destroy();
```

#### GelVisualState

Tracks and transitions between visual states:

```javascript
import { GelVisualState } from './gel/GelVisualState.js';

const state = new GelVisualState({
  currentState: 'idle',
  transitions: {
    'idle -> active': 0.3,
    'active -> hover': 0.2,
  },
});

// Transition states
state.setState('active');

// Listen to state changes
state.on('stateChange', (from, to) => {
  console.log(`Transitioned from ${from} to ${to}`);
});
```

### Gel Integration with StageManager

Gel animations are managed by StageManager when present:

```javascript
// Access via StageManager
const gels = stageManager.getGels();

// Control gel effects
gels.enable();
gels.disable();
gels.setIntensity(0.5); // 0-1 scale
```

## Halftone - Retro Digital Effect

Dotted/pixelated effect for comic or retro styling:

**Location**: `js/effects/halftone/`

### HalftoneFilter

Applies halftone pattern to elements:

```javascript
import { HalftoneFilter } from './halftone/HalftoneFilter.js';

const halftone = new HalftoneFilter({
  element: document.querySelector('img'),
  dotSize: 4,
  spacing: 6,
  angle: 45,
  colors: ['#000', '#ff0000', '#0000ff'],
});

// Apply effect
halftone.apply();

// Animate dot size change
halftone.animateDotSize(8, 0.5);

// Cleanup
halftone.remove();
```

### Use Cases

- Comic book styling on images
- Retro digital effects on text
- Progressive degradation effects
- Print-inspired visuals

## Text Effects - Common Transformations

Collection of text effect utilities beyond TextParty:

**Location**: `js/effects/text-effects/`

### Available Effects

#### Shadow Effect

Dynamic text shadows:

```javascript
import { ShadowEffect } from './text-effects/ShadowEffect.js';

const shadow = new ShadowEffect(element, {
  offsetX: 2,
  offsetY: 2,
  blur: 4,
  color: 'rgba(0,0,0,0.5)',
  followMouse: true,
});
```

#### Stagger Effect

Character/word staggered reveal:

```javascript
import { StaggerEffect } from './text-effects/StaggerEffect.js';

const stagger = new StaggerEffect(element, {
  type: 'char', // 'char', 'word', 'line'
  duration: 0.05,
  onProgress: progress => console.log(progress),
});

stagger.play();
stagger.reverse();
```

#### Blur Effect

Progressive blur/unblur:

```javascript
import { BlurEffect } from './text-effects/BlurEffect.js';

const blur = new BlurEffect(element, {
  maxBlur: 10,
  duration: 0.8,
});

blur.blur(); // Apply effect
blur.unblur(); // Remove effect
```

## Parallax - Depth-Based Movement

Scroll-responsive depth effect:

**Location**: `js/effects/parallax/`

### ParallaxLayer

Individual parallax element:

```javascript
import { ParallaxLayer } from './parallax/ParallaxLayer.js';

const layer = new ParallaxLayer({
  element: document.querySelector('.parallax-element'),
  speed: 0.5, // 0-1 (0 = no movement, 1 = normal scroll)
  offset: 100, // Initial offset in pixels
  axis: 'y', // 'x' or 'y'
});

// Layer automatically updates on scroll
// Can be controlled manually:
layer.setProgress(0.25); // 0-1
```

### ParallaxGroup

Coordinate multiple parallax layers:

```javascript
import { ParallaxGroup } from './parallax/ParallaxGroup.js';

const group = new ParallaxGroup({
  container: document.querySelector('.parallax-section'),
});

// Auto-detect parallax layers by data attribute
group.discoverLayers('[data-parallax-speed]');

// Or add manually
group.addLayer(element, { speed: 0.3, axis: 'y' });

// Cleanup
group.destroy();
```

## Architecture Patterns

### Single Responsibility

Each effect module handles one type of transformation:

- `textparty/` → Text choreography
- `gel/` → Liquid morphing
- `halftone/` → Dot patterns
- `transitions/` → State changes
- `parallax/` → Depth movement

### Accessibility Integration

All effects respect `prefers-reduced-motion`:

```javascript
if (reducedMotionHandler.isReducedMotion()) {
  // Skip animation, apply instant final state
  gsap.set(element, finalProps);
} else {
  // Play full animation
  gsap.to(element, animationProps);
}
```

### GSAP Integration

All effects use GSAP timelines for consistency:

```javascript
// All effects expose GSAP timeline
effect.timeline.pause();
effect.timeline.resume();
effect.timeline.reverse();
effect.timeline.progress(0.5);
```

## Performance Considerations

1. **DOM Heavy Effects**: Gel masks rebuild on every frame - consider throttling updates
2. **TextParty**: SplitText modifies DOM; cache results when possible
3. **Halftone**: Canvas-based; disable when element is off-screen
4. **Parallax**: Use requestAnimationFrame for smooth scroll updates

## Common Patterns

### Text Intro Sequence

```javascript
const text = new TextParty(element, { staggerType: 'word' });
text.playIntro({
  duration: 0.8,
  fromProps: { opacity: 0, y: 20 },
  toProps: { opacity: 1, y: 0 },
  staggerAmount: 0.08,
});
```

### Page Transition

```javascript
const transition = new TransitionManager(container);
await transition.transitionOut({ type: 'gel' });
// Update page
await transition.transitionIn({ type: 'gel' });
```

### Section with Parallax

```javascript
const group = new ParallaxGroup({ container });
group.discoverLayers('[data-parallax]');
// Automatically updates on scroll
```

## References

- [TextParty API](./textparty/README.md)
- [Gel System Architecture](./gel/README.md)
- [GSAP Documentation](https://gsap.com/docs)
- [Accessibility Guidelines](../../styles/utilities/reduced-motion.css)
