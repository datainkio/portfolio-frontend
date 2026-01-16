<!-- @format -->

# Displays - Decorative & Demonstration Systems

Visual ornamentation, debugging tools, and interactive demonstrations. All displays can be rendered independently or composed together.

## Quick Overview

```
┌──────────────────────────────────────┐
│       Displays Package               │
├──────────────────────────────────────┤
│ Blockframes   → Animation breakdowns │
│ PrinterMarks  → Print studio marks   │
│ Ruler         → Measurement overlay  │
└──────────────────────────────────────┘
```

## Blockframes - Animation Breakdown System

Interactive visualization of animation sequences with frame-by-frame playback.

**Location**: `js/displays/blockframes/`

### Architecture

The blockframes system uses a **Builder Pattern** to compose complex animation visualizations:

```
Architect (configuration)
    ↓
Builder (construction)
    ↓
Animator (playback)
    ↓
Painter (rendering)
    ↓
BlockframesDisplay (output)
```

### Core Classes

#### Architect

Defines animation structure and timing:

```javascript
import { Architect } from './blockframes/Architect.js';

const architect = new Architect({
  sections: [
    {
      name: 'Hero Intro',
      duration: 1.2,
      elements: [
        { name: 'title', start: 0, duration: 0.6 },
        { name: 'subtitle', start: 0.3, duration: 0.9 },
      ],
    },
  ],
  frameCount: 60,
  fps: 30,
});
```

#### Builder

Constructs animation timeline from architecture:

```javascript
import { Builder } from './blockframes/Builder.js';

const builder = new Builder(architect.getConfig());

// Build timeline
const timeline = builder.buildTimeline();

// Get timeline structure
const structure = builder.getStructure();
// Output:
// {
//   sections: [...],
//   totalFrames: 60,
//   frameRate: 30,
//   elementTimings: [...]
// }
```

#### Animator

Controls frame-by-frame playback:

```javascript
import { Animator } from './blockframes/Animator.js';

const animator = new Animator(timeline, {
  onFrameChange: (currentFrame, totalFrames) => {
    console.log(`Frame: ${currentFrame} / ${totalFrames}`);
  },
  onSectionChange: sectionName => {
    console.log(`Section: ${sectionName}`);
  },
});

// Playback control
animator.play();
animator.pause();
animator.nextFrame();
animator.previousFrame();
animator.jumpToFrame(30);
animator.setPlaybackSpeed(1.5);

// State
animator.getCurrentFrame();
animator.getTotalFrames();
animator.isPlaying();
```

#### Painter

Renders visualization on canvas:

```javascript
import { Painter } from './blockframes/Painter.js';

const painter = new Painter({
  canvas: document.querySelector('canvas'),
  width: 1200,
  height: 600,
  theme: 'dark', // 'light', 'dark'
});

// Paint frame visualization
painter.paintFrame({
  currentFrame: 15,
  structure: timelineStructure,
  activeElements: ['title', 'subtitle'],
  timelineWidth: 1000,
});

// Customization
painter.setColorScheme({
  background: '#1a1a1a',
  section: '#ff00ff',
  element: '#00ffff',
  activeElement: '#ffff00',
});
```

#### BlockframesDisplay

High-level wrapper combining all components:

```javascript
import { BlockframesDisplay } from './blockframes/BlockframesDisplay.js';

const blockframes = new BlockframesDisplay({
  element: document.querySelector('#blockframes'),
  timeline: gsapTimeline,
  architect: {
    sections: [
      {
        name: 'Section 1',
        duration: 1.2,
        elements: [...]
      }
    ],
    frameCount: 60,
    fps: 30
  },
  theme: 'dark'
});

// Render display
blockframes.render();

// Control playback
blockframes.play();
blockframes.pause();

// Cleanup
blockframes.destroy();
```

### Usage Example

```javascript
// Visualize a section's animation
class HeroAnimationDemo {
  constructor() {
    this.timeline = gsap.timeline();

    // Build timeline...
    this.timeline.fromTo('.hero-title', { opacity: 0 }, { opacity: 1 }, 0);
    this.timeline.fromTo('.hero-subtitle', { opacity: 0 }, { opacity: 1 }, 0.3);

    // Create blockframes visualization
    this.blockframes = new BlockframesDisplay({
      element: document.querySelector('#animation-preview'),
      timeline: this.timeline,
      architect: {
        sections: [
          {
            name: 'Hero Intro',
            duration: this.timeline.duration(),
            elements: [
              { name: 'Title', start: 0, duration: 0.6 },
              { name: 'Subtitle', start: 0.3, duration: 0.6 },
            ],
          },
        ],
        frameCount: 120,
        fps: 30,
      },
    });

    this.blockframes.render();
  }
}
```

## PrinterMarks - Studio Print Elements

Print-ready marks and guides for design/production verification.

**Location**: `js/displays/PrinterMarks.js`

### PrinterMarks Class

```javascript
import { PrinterMarks } from './PrinterMarks.js';

const marks = new PrinterMarks({
  element: document.querySelector('.layout'),
  type: 'full', // 'full', 'crop', 'corner', 'center'
  color: '#000',
  opacity: 0.3,
  bleed: 0.125, // Inches
  cropSize: 0.5, // Inches
});

// Render marks
marks.show();

// Hide marks
marks.hide();

// Toggle visibility
marks.toggle();

// Update style
marks.setColor('#ff0000');
marks.setOpacity(0.5);
marks.setBleed(0.25);

// Cleanup
marks.remove();
```

### Mark Types

- **Full**: Complete print marks (crop + fold + center)
- **Crop**: Corner crop marks only
- **Corner**: Corner registration marks
- **Center**: Center crosshairs

### Use Cases

- Print production verification
- Design handoff documentation
- Bleed/safe zone visualization
- Registration accuracy checking

### Integration with Other Displays

```javascript
// Combine with blockframes for comprehensive design preview
const display = new DisplayComposer({
  blockframes: blockframesInstance,
  printerMarks: marks,
  ruler: rulerInstance,
});

display.renderAll();
display.exportAsImage();
```

## Ruler - Measurement Overlay

Interactive measurement guide for precision layout verification.

**Location**: `js/displays/Ruler.js`

### Ruler Class

```javascript
import { Ruler } from './Ruler.js';

const ruler = new Ruler({
  container: document.querySelector('#viewport'),
  orientation: 'both', // 'horizontal', 'vertical', 'both'
  unit: 'px', // 'px', 'cm', 'in', 'mm'
  scale: 1, // Zoom level
  color: '#999',
  fontSize: 12,
  major: 50, // Pixels between major marks
  minor: 10, // Pixels between minor marks
});

// Show/hide ruler
ruler.show();
ruler.hide();
ruler.toggle();

// Configuration
ruler.setUnit('cm');
ruler.setScale(2); // 2x zoom
ruler.setMajorInterval(100);
ruler.setMinorInterval(20);

// Get measurements
const elementBox = ruler.measureElement(element);
// Output: { x: 100, y: 200, width: 300, height: 400 }

// Cleanup
ruler.destroy();
```

### Ruler Features

- **Multi-unit support**: px, cm, in, mm
- **Zoom-aware**: Adjusts marks and text for any scale
- **Precision measurement**: Sub-pixel accuracy
- **Accessibility**: Keyboard controls for users without mouse
- **Performance**: Efficient redrawn at scroll/resize

### Integration with Layout Dev

```javascript
// Enable ruler during development
if (window.DEBUG) {
  const ruler = new Ruler({
    container: document.body,
    unit: 'cm',
    scale: window.devicePixelRatio,
  });
  ruler.show();
  window.ruler = ruler; // Accessible from console
}
```

## CompositeDisplay - Combine Multiple Displays

Manage multiple displays together:

```javascript
import { CompositeDisplay } from './CompositeDisplay.js';

const composite = new CompositeDisplay({
  container: document.querySelector('#displays'),
  displays: [
    { type: 'blockframes', config: blockframesConfig },
    { type: 'ruler', config: rulerConfig },
    { type: 'printer-marks', config: marksConfig },
  ],
});

// Render all
composite.renderAll();

// Control individual displays
composite.getDisplay('blockframes').play();
composite.getDisplay('ruler').setUnit('cm');

// Toggle all visibility
composite.toggleAll();

// Cleanup all
composite.destroyAll();
```

## Display Lifecycle

```javascript
// 1. Create
const display = new Display(config);

// 2. Initialize
display.initialize();

// 3. Render
display.render();

// 4. Interact (optional)
display.show();
display.hide();
display.toggle();

// 5. Cleanup
display.destroy();
```

## Styling Displays

All displays respect the design system and can be customized:

```javascript
// Theme integration
const display = new Display({
  theme: 'dark',  // Uses CSS custom properties
  colorScheme: {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    text: 'var(--color-text)'
  }
});

// CSS custom properties
:root {
  --display-bg: #1a1a1a;
  --display-text: #ffffff;
  --display-accent: #ff00ff;
}
```

## Performance & Optimization

### Canvas Rendering (Blockframes)

- Uses requestAnimationFrame for smooth 60fps playback
- Debounces resize/scroll updates
- Cleans up canvas context on destroy

### DOM-Based Displays (Ruler, PrinterMarks)

- Uses position:fixed with CSS transforms for performance
- Efficient event delegation for interactions
- Minimal reflow/repaint with CSS-only updates

### Memory Management

```javascript
// Always cleanup when done
display.destroy();

// Or use lifecycle hooks
class Display {
  destroy() {
    this.timeline?.kill();
    this.canvas?.remove();
    this.listeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });
  }
}
```

## Debugging & Development

### Enable All Displays

```javascript
// In console or dev script
import { DisplayManager } from './DisplayManager.js';

const displays = new DisplayManager(document.body);
displays.enableAll({
  blockframes: true,
  ruler: true,
  printerMarks: true,
});
```

### Visual Debugging

```javascript
// Highlight elements during blockframes playback
blockframes.on('frameChange', frame => {
  console.log(`Frame ${frame}: animating title`);
  document.querySelector('.title').classList.add('highlight');
});
```

## References

- [Blockframes Architecture](./blockframes/README.md)
- [GSAP Timeline Documentation](https://gsap.com/docs/v3/GSAP/Timeline)
- [Canvas Rendering (Painter.js)](./blockframes/Painter.js)
- [Developer Tools Integration](../README.md#debugging)
