<!-- @format -->

# 📦 Blockframes

**CRITICAL WARNING**: This is a complex SVG manipulation system that generates animated wireframe layouts using GSAP and SVG.js. Modifications require understanding of SVG DOM manipulation, GSAP timelines, and the atomic design pattern implementation.

## Overview

Blockframes is a sophisticated system for loading, manipulating, and animating SVG-based wireframe layouts. It follows atomic design principles (atoms → molecules → organisms → templates) to build complex UI mockups programmatically with color theming and GSAP animations.

## Architecture

### Core Components

#### **Blockframes.js** - Main Controller Class

The primary class that orchestrates SVG loading, manipulation, and rendering.

**Key Methods:**

- `async load()` - Fetches and parses SVG files from URLs
- `makeGrid(rows, cols, colors)` - Generates CSS grid containers
- `makeResponsive()` - Removes fixed dimensions, adds Tailwind responsive classes
- `insertInto(container, svg)` - Appends SVG to DOM containers
- `get inventory` - Returns array of all block types from SVG
- `getBlock(type)` - Queries specific block by selector
- `paintAll(palette)` - Applies color scheme to entire SVG
- `paintBlock(block, palette)` - Applies colors to individual blocks
- `placeBlock(block, container, clone)` - Inserts block into container
- `animateBlock(block)` - Triggers GSAP animation on block

**Usage Example:**

```javascript
const blockframes = new Blockframes('/path/to/wireframes.svg');
await blockframes.load();
blockframes.makeResponsive();
blockframes.insertInto(document.getElementById('container'), blockframes.svgElement);
```

#### **Builder.js** - Layout Construction

Handles DOM insertion and SVG transformation logic using SVG.js library.

**Key Functions:**

- `insert(block, container, clone)` - Clones and scales SVG blocks to fit containers
  - Uses SVG.js for manipulation
  - Auto-scales to 100x100 viewBox
  - Applies Tailwind responsive classes
- `build(blockline)` - Constructs complex multi-block layouts (grid-based)

**Dependencies:**

- SVG.js via CDN: `https://cdn.skypack.dev/@svgdotjs/svg.js@3.1.1`

#### **Painter.js** - Color Theme Application

Maps template types to color palette functions. Routes blocks to specialized painters.

**Supported Templates:**

- Article, Basic, Blog, Calendar, Cart, Chart
- Contact, Features, Feed, Landing, List, Login
- Main, Map, Project, Text, Video

**Color Palette Structure:**

```javascript
{
  primary: { light: '#xxx', base: '#xxx', dark: '#xxx' },
  secondary: { light: '#xxx', base: '#xxx', dark: '#xxx' },
  neutral: { light: '#xxx', base: '#xxx', dark: '#xxx' },
  accent: { light: '#xxx', base: '#xxx', dark: '#xxx' }
}
```

**Function Signature:**

```javascript
block(blockNode, palette); // Routes to template-specific painter
```

#### **Animator.js** - GSAP Animation System

Provides animation presets for block entrance effects.

**Current Animations:**

- `wipe(block)` - Horizontal slide-in with opacity fade (infinite loop)

**CRITICAL**: Requires GSAP to be loaded globally (`window.gsap`).

#### **Architect.js** - Advanced Layout System

_(Not fully documented in initial scan - appears to handle complex layout generation)_

---

## Atomic Design Structure

### **atoms/** - Primitive UI Elements

Individual SVG components that cannot be broken down further.

**Available Atoms:**

- `Avatar.js` - User profile images/placeholders
- `Bullet.js` - List item markers
- `Button.js` - Interactive button elements
- `Donut.js` - Donut chart segments
- `Image.js` - Image placeholders
- `Operator.js` - Action icons (+, -, ×, etc.)
- `Pie.js` - Pie chart segments
- `Pin.js` - Map location markers
- `Play.js` - Media player controls
- `Star.js` - Rating/favorite indicators
- `Streets.js` - Map street layouts
- `Text.js` - Text blocks/labels
- `Textfield.js` - Input field representations

### **molecules/** - Simple Component Groups

Combinations of atoms forming basic UI patterns.
_(Directory exists but contents not yet documented)_

### **organisms/** - Complex Component Sections

Groups of molecules forming distinct interface sections.
_(Directory exists but contents not yet documented)_

### **templates/** - Complete Layout Patterns

Full-page wireframe templates combining organisms.

**Available Templates:**

- `Article.js` - Blog post/article layout
- `Basic.js` - Generic content page
- `Blog.js` - Blog listing page
- `Calendar.js` - Calendar/schedule view
- `Cart.js` - E-commerce shopping cart
- `Chart.js` - Data visualization dashboard
- `Contact.js` - Contact form page
- `Features.js` - Product features showcase
- `Feed.js` - Social media feed layout
- `Landing.js` - Marketing landing page
- `List.js` - List/table view
- `Login.js` - Authentication form
- `Main.js` - Main application layout
- `Map.js` - Map-based interface
- `Project.js` - Project detail page
- `Text.js` - Text-heavy content
- `Timeline.js` - Chronological timeline
- `Video.js` - Video player layout
- `chrome.js` - Browser chrome/frame elements

---

## SVG Source Requirements

### Expected SVG Structure

```xml
<svg>
  <g class="Blocks">
    <g class="Article"><!-- Article template content --></g>
    <g class="Blog"><!-- Blog template content --></g>
    <g class="Chart"><!-- Chart template content --></g>
    <!-- More templates... -->
  </g>
</svg>
```

**CRITICAL REQUIREMENTS:**

1. Must contain a `.Blocks` group element
2. Each child of `.Blocks` must have a class matching a template name
3. Template class names must match keys in `Painter.js` switch statement
4. SVG must be valid XML (parseable by DOMParser)

---

## Integration Dependencies

### Required External Libraries

1. **GSAP** - Animation engine

   - Must be loaded before Animator.js
   - Expected as global: `window.gsap`
   - Used for: Timeline creation, tweens, transforms

2. **SVG.js** - SVG manipulation library

   - Loaded via CDN in Builder.js
   - Version: 3.1.1 (Skypack CDN)
   - Used for: Scaling, positioning, DOM manipulation

3. **Tailwind CSS** - Utility classes
   - Classes applied: `w-full`, `h-full`
   - Used for: Responsive sizing

---

## Common Usage Patterns

### Loading and Displaying a Wireframe

```javascript
import Blockframes from '/assets/js/displays/blockframes/Blockframes.js';

const blockframes = new Blockframes('/assets/svg/wireframes.svg');
await blockframes.load();
blockframes.makeResponsive();

const container = document.getElementById('wireframe-container');
blockframes.insertInto(container, blockframes.svgElement);
```

### Applying Color Themes

```javascript
const palette = {
  primary: { light: '#e0f2fe', base: '#0ea5e9', dark: '#0c4a6e' },
  secondary: { light: '#fce7f3', base: '#ec4899', dark: '#831843' },
  neutral: { light: '#f5f5f5', base: '#737373', dark: '#171717' },
  accent: { light: '#fef3c7', base: '#f59e0b', dark: '#78350f' },
};

blockframes.paintAll(palette);
```

### Working with Individual Blocks

```javascript
const inventory = blockframes.inventory; // Array of all blocks
const chartBlock = blockframes.getBlock('.Chart');

blockframes.paintBlock(chartBlock, palette);
blockframes.placeBlock(chartBlock, targetContainer, true); // true = clone
blockframes.animateBlock(chartBlock);
```

---

## Performance Considerations

### SVG Loading

- **Async/Await** - All SVG loading is asynchronous
- **Error Handling** - Network errors are caught and logged
- **Parsing** - DOMParser is synchronous but lightweight for typical SVG sizes

### DOM Manipulation

- **Cloning** - `placeBlock` clones by default to prevent original modification
- **Scaling** - SVG.js bbox calculations can be expensive for complex SVGs
- **Responsive** - Removing width/height attributes allows CSS to control sizing

### Animation Performance

- **GSAP** - Hardware-accelerated transforms
- **Infinite Loops** - `wipe()` uses `repeat: -1` (use sparingly)
- **Timeline Cleanup** - No automatic cleanup implemented (potential memory leak)

---

## Debugging & Troubleshooting

### Common Errors

**"Failed to fetch SVG"**

- Check SVG file path is correct
- Verify server is serving SVG with correct MIME type (`image/svg+xml`)
- Check CORS headers if loading from different domain

**"The fetched content is not a valid SVG element"**

- SVG file contains XML errors
- File is not actually SVG (check Content-Type header)
- DOMParser failed to parse (check browser console for XML errors)

**"Cannot read properties of null (querySelector '.Blocks')"**

- SVG doesn't contain required `.Blocks` group element
- SVG structure doesn't match expected format
- Check SVG source file structure

**"gsap is not defined"**

- GSAP not loaded globally before Animator.js
- Import order issue in consuming code
- GSAP script tag missing from HTML

**Template colors not applying**

- Template class name doesn't match Painter.js switch cases
- Palette object missing required keys (primary, secondary, neutral, accent)
- Template painter function not imported in Painter.js

### Console Debugging

```javascript
// Check loaded SVG structure
console.log(blockframes.svgElement);

// Inspect inventory
console.log(blockframes.inventory);

// Test palette
console.log(palette);

// Check GSAP availability
console.log(typeof gsap); // Should be "object"
```

---

## Extension & Customization

### Adding New Templates

1. Create template file in `templates/` (e.g., `Dashboard.js`)
2. Export painter function with signature: `export function dashboard(block, palette)`
3. Import in `Painter.js`: `import * as Dashboard from "./templates/Dashboard.js"`
4. Add case to switch statement in `Painter.js`
5. Add corresponding `<g class="Dashboard">` in source SVG

### Adding New Atoms

1. Create atom file in `atoms/` (e.g., `Icon.js`)
2. Export painter function: `export function icon(node, palette)`
3. Import in parent component (molecule/organism/template)
4. Call from parent painter: `Icon.icon(iconNode, palette)`

### Custom Animations

```javascript
// In Animator.js
export function fadeIn(block) {
  return gsap.fromTo(block, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' });
}
```

---

## File Dependencies Graph

```
Blockframes.js
├── Builder.js
│   └── SVG.js (external CDN)
├── Painter.js
│   ├── templates/*.js (18 files)
│   └── (templates import from atoms/, molecules/, organisms/)
└── Animator.js
    └── gsap (global window object)
```

---

## Browser Compatibility

- **SVG Support**: IE9+ (DOMParser for SVG)
- **Fetch API**: Chrome 42+, Firefox 39+, Safari 10.1+
- **ES6 Modules**: Chrome 61+, Firefox 60+, Safari 11+
- **GSAP 3.x**: All modern browsers
- **SVG.js 3.x**: All modern browsers

**Polyfills Needed for Legacy Support:**

- Fetch polyfill for IE11
- ES6 module loader for older browsers

---

## Known Limitations

1. **No Timeline Cleanup** - Animations don't automatically stop when blocks are removed
2. **Fixed Animation Set** - Only `wipe()` currently implemented
3. **Synchronous Scaling** - SVG.js bbox calculations block main thread
4. **No TypeScript** - No type definitions available
5. **Global Dependencies** - Requires GSAP on window object
6. **CDN Dependency** - SVG.js loaded from external CDN (potential SPOF)

---

## Future Enhancements

- [ ] Add timeline cleanup methods
- [ ] Implement additional animation presets (fade, slide, zoom)
- [ ] Add TypeScript definitions
- [ ] Bundle SVG.js locally instead of CDN
- [ ] Add lazy loading for template modules
- [ ] Implement caching for loaded SVGs
- [ ] Add accessibility attributes (ARIA labels)
- [ ] Create builder methods for common layout patterns
- [ ] Add unit tests for core methods
- [ ] Document molecule and organism patterns

---

## Related Files

- **Lab Example**: `njk/_pages/lab/blockframes/index.njk` - Interactive demo
- **SVG Sources**: Look for `.svg` files in `assets/` or `media/` directories
- **GSAP Setup**: Check main layout templates for GSAP script tags

---

**Last Updated**: October 2025  
**Maintainer**: Portfolio project  
**License**: Check project root LICENSE file
