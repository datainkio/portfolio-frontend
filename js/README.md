<!-- @format -->

# JavaScript Modules - Interactive & Animation Systems

This directory contains all client-side JavaScript for interactive features, animations, and visual effects. The architecture is modular, built on GSAP for performant animations, and uses an event-driven choreography system for coordinating complex page interactions.

## Architecture Overview

**Core Principle**: Event-driven choreography system coordinating animations across page sections.

- **ES6 modules**: All code uses ES6 import/export syntax
- **Runtime path**: Modules served from `/assets/js/` at runtime
- **GSAP-based**: Leverages GSAP for performant animations and scroll effects
- **Accessibility-first**: All animations respect `prefers-reduced-motion`
- **Modular design**: Clear separation of concerns with single-responsibility principle

## The Animation Pipeline

```
User Interaction (scroll, page load)
         ↓
   Animation Bus (event pub/sub)
         ↓
   Director (master coordinator)
         ↓
   ├─ Section Controllers (Hero, Work, Biography)
   ├─ Stage Manager (scroll smoothing, background effects)
   └─ Animation Sequences (landing page choreography)
         ↓
   GSAP Timelines (visual animation)
```

## Directory Structure & Module Organization

### Entry Points

- **`main.js`** - Browser entry point; imports Director to initialize animation system
- **`user-guide.js`** - Interactive user experience guidance system
- **Utility scripts** - `circle-packing.js`, `fibonacci.js`, `gen-grid.js`, `gsap-test.js` (experimental utilities)

### Organization by Function

#### `/effects/` - Visual Effects & Transformations

Scripts that alter how elements are displayed:

- **`TextParty.js`** - Consolidated text animation effects library
  - TextRadar, TextRoll, TextMorph, TextWanderingGel, TextLenticular, etc.
  - Extensible effect system for creative text manipulation
- **`Transitions.js`** - Page and element transition animations
- **`gel/`** - Liquid gel animation system
  - `Gel.js` - Main gel effect controller
  - `GelGeometry.js` - Geometric shape calculations
  - `GelManipulator.js` - Runtime gel manipulation and interaction
  - `GelMask.js` - SVG mask generation for gel rendering
  - `GelVisualState.js` - Visual state management
- **`image/halftone/`** - Modular halftone image effect system
  - Canvas-based dot matrix effects for images
  - Color and grayscale halftone variants
- **`text/`** - Specialized text animation effects library
- **`layout/parallax.js`** - Parallax scrolling effects

#### `/displays/` - Ornamentation & Visual Elements

Decorative elements applied to page content:

- **`PrinterMarks.js`** - Print industry registration marks for design work
- **`Ruler.js`** - Interactive measurement and guide overlay
- **`blockframes/`** - Frame and border display components with canvas rendering
  - `Blockframes.js` - Main class orchestrating frame layout and rendering
  - `Animator.js`, `Architect.js`, `Builder.js`, `Painter.js` - Specialized responsibilities

#### `/choreography/` - Animation Coordination System

Master coordination system for all page animations using event-driven architecture:

- **`Director.js`** - Master coordinator; initializes AnimationBus, StageManager, sections, sequences
- **`AnimationBus.js`** - Publish/subscribe event system enabling loose coupling between sections
- **`StageManager.js`** - Coordinates scroll smoothing, background effects, gel animations via specialized managers
- **`managers/`** - Single-responsibility animation managers:
  - `ReducedMotionHandler.js` - Accessibility-first motion preference detection
  - `BackgroundLayerManager.js` - Fixed background positioning outside ScrollSmoother transforms
  - `ScrollSmootherManager.js` - GSAP smooth scrolling initialization and configuration
  - `GelAnimationManager.js` - Gel background animation system
  - `SessionManager.js` - User interaction history and session state
- **`sections/`** - Section controllers (Hero, BackgroundVideo, Biography, Work, Splash, Approach)
  - Follow AbstractSection pattern with intro/outro/scroll lifecycle
  - Communicate via AnimationBus events
- **`sequences/`** - Multi-section choreography coordinators (e.g., LandingSequence)
- **`config.js`** - Animation configuration constants (timings, easing, etc.)
- **`constants.js`** - Event names and other constants

#### `/utils/` - Utilities & Helpers

Shared utilities used across JavaScript modules:

- **`lumberjack/`** - Unified logging system (imported from npm package `@datainkio/lumberjack`)
  - Consistent output across build scripts and browser runtime
  - Semantic color styling and emoji indicators
  - Environment-controlled verbosity
- **`math.js`** - Mathematical utilities and calculations
- **`color.js`** - Color manipulation functions (conversions, transformations)
- **`diagnostics/`** - Diagnostic utilities for debugging
  - `scroll-blocked.js` - Detects scroll blocking issues
- **`tailwind/`** - Tailwind CSS integration utilities
  - `theme-colors.js`, `theme-tokens.js` - Design token access
  - `ThemeColors.js` - Theme color management class

#### `/gsap/` - GSAP Extensions

Custom GSAP plugins and animation utilities

#### `/layouts/` - Layout Systems

Responsive layout and grid systems

#### `/interstitials/` - Transitional Elements

Loading screens, page transitions, and interim displays

## Usage Patterns

### Import Paths

Use absolute paths from the site root in client-side code:

```javascript
import Halftone from '/assets/js/effects/image/halftone/Halftone.js';
import { trace } from '/assets/js/utils/trace.js';
```

### Initialization Example

```javascript
// Basic effect initialization in main.js
window.onload = function () {
  const ht = new Halftone(gsap.utils.toArray('#page-content')[0], {
    dotSize: 3,
    gridSize: 3,
    color: true,
  });
};
```

### Text Effects Example

```javascript
import { radar, morph } from '/assets/js/effects/TextParty.js';

// Apply radar effect to element
radar(document.querySelector('.text-element'), {
  // configuration options
});
```

## Development Guidelines

- **ES Modules**: All code uses import/export syntax
- **GSAP Integration**: Animations built on GSAP timeline system
- **Modular Design**: Effects are self-contained with clear interfaces
- **Event-Driven**: Components communicate via custom events and callbacks
- **Debug Support**: Use `trace()` utility for development debugging

## Asset Pipeline

JavaScript files are copied from `js/` to `_site/assets/js/` during build via
11ty passthrough copy. Import paths reference the final served location
(`/assets/js/`).
