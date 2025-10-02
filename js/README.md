<!-- @format -->

# JavaScript Modules

This directory contains the client-side JavaScript modules for interactive
features and animations. The architecture is modular and built on GSAP for
performant animations.

## Architecture Overview

All modules use ES6 import/export syntax and are served from `/assets/js/` at
runtime. The codebase follows a component-based approach with clear separation
of concerns.

## Directory Structure

### Core Modules

- **`main.js`** - Entry point that initializes primary effects like Halftone
- **`user-guide.js`** - Interactive user experience guidance
- **Individual utilities** - `circle-packing.js`, `fibonacci.js`, `gen-grid.js`,
  `gsap-test.js`

### Package Structure

#### `/effects/` - Visual Effects

Contains scripts that alter how elements are displayed:

- **`TextParty.js`** - Consolidated text animation effects (radar, roll, morph,
  etc.)
- **`Transitions.js`** - Page and element transition animations
- **`image/halftone/`** - Modular halftone image effect system
  - `Halftone.js` - Main class with canvas-based dot matrix effects
  - `CanvasManager.js`, `HalftoneEffect.js`, `AnimationManager.js` - Supporting
    modules
- **`text/`** - Specialized text animation effects
- **`layout/`** - Layout-based visual effects

#### `/displays/` - Ornamentation

Scripts that apply decorative elements:

- **`PrinterMarks.js`** - Print industry registration marks
- **`blockframes/`** - Frame and border display components

#### `/choreography/` - Animation Coordination

Coordinates timing and interaction of design elements:

- **`Director.js`** - Central animation controller
- **`StageManager.js`** - Scene and state management
- **`pages/`** - Page-specific choreography
- **`sections/`** - Section-level animation sequences

#### `/utils/` - Utilities

- **`trace.js`** - Debug output system with collapsible panel interface
- **`math.js`** - Mathematical utilities
- **`color.js`** - Color manipulation functions
- **`airtable/`** - Data processing utilities for Airtable integration
- **`tailwind/`** - Theme and design token utilities

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
import Halftone from "/assets/js/effects/image/halftone/Halftone.js";
import { trace } from "/assets/js/utils/trace.js";
```

### Initialization Example

```javascript
// Basic effect initialization in main.js
window.onload = function () {
  const ht = new Halftone(gsap.utils.toArray("#page-content")[0], {
    dotSize: 3,
    gridSize: 3,
    color: true,
  });
};
```

### Text Effects Example

```javascript
import { radar, morph } from "/assets/js/effects/TextParty.js";

// Apply radar effect to element
radar(document.querySelector(".text-element"), {
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
