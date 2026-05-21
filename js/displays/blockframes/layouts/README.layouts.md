<!-- @format -->

# 📐 Layouts

**Atomic Design Level**: Foundational grid systems and positioning algorithms.

## Overview

Layouts are NOT traditional page templates - they are **algorithmic positioning systems** that arrange blockframes elements according to mathematical rules. Think of them as layout engines that calculate optimal positions for groups of elements.

## Purpose

Layouts provide:

- **Algorithmic positioning** - Mathematical rules for element placement
- **Grid systems** - Structured column/row arrangements
- **Spatial distribution** - Cloud/scatter positioning algorithms
- **Line arrangements** - Sequential horizontal/vertical flows
- **Dynamic scaling** - Responsive sizing calculations

**CRITICAL DISTINCTION**:

- **Templates** = Content structure (header, sidebar, cards)
- **Layouts** = Positioning algorithms (grid coordinates, clustering, spacing)

## File Structure

Each layout exports positioning functions that calculate element coordinates:

```javascript
export function calculate(elements, bounds, options = {}) {
  const positions = [];

  // Calculate position for each element
  elements.forEach((elem, index) => {
    positions.push({
      x: calculateX(index, bounds, options),
      y: calculateY(index, bounds, options),
      width: calculateWidth(elem, options),
      height: calculateHeight(elem, options),
    });
  });

  return positions;
}

export function apply(elements, positions) {
  elements.forEach((elem, index) => {
    const pos = positions[index];
    elem.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
    elem.setAttribute('width', pos.width);
    elem.setAttribute('height', pos.height);
  });
}
```

## Available Layouts

### **BlockLine.js**

Sequential horizontal or vertical line arrangement.

**Algorithm**: Evenly spaces elements in a single row or column

**Layout Rules**:

- Elements arranged left-to-right or top-to-bottom
- Even spacing between elements
- Optional padding at start/end
- Supports alignment (start, center, end)

**Calculation**:

```javascript
// Horizontal BlockLine
export function calculate(elements, bounds, options = {}) {
  const { orientation = 'horizontal', spacing = 20, padding = 40, alignment = 'start' } = options;

  const availableWidth = bounds.width - padding * 2;
  const totalSpacing = (elements.length - 1) * spacing;
  const elementWidth = (availableWidth - totalSpacing) / elements.length;

  return elements.map((elem, i) => ({
    x: padding + i * (elementWidth + spacing),
    y: bounds.y + padding,
    width: elementWidth,
    height: bounds.height - padding * 2,
  }));
}
```

**SVG Structure**:

```xml
<g class="BlockLine" data-orientation="horizontal" data-spacing="20">
  <rect class="Card" />
  <rect class="Card" />
  <rect class="Card" />
  <rect class="Card" />
</g>
```

**Use Cases**:

- Navigation menus
- Image galleries in a row
- Horizontal card decks
- Timeline entries
- Feature highlights
- Tab controls

**Options**:

```javascript
{
  orientation: 'horizontal' | 'vertical',
  spacing: number,           // Gap between elements
  padding: number,           // Edge padding
  alignment: 'start' | 'center' | 'end',
  distribution: 'even' | 'packed'
}
```

---

### **Cloud.js**

Organic clustering algorithm for scattered element positioning.

**Algorithm**: Force-directed layout with collision detection and clustering

**Layout Rules**:

- Elements cluster around focal points
- No overlapping (collision detection)
- Organic, non-grid positioning
- Size-based importance (larger = more central)
- Optional gravity/attraction forces

**Calculation**:

```javascript
export function calculate(elements, bounds, options = {}) {
  const { iterations = 100, centerGravity = 0.1, collisionPadding = 10, seed = null } = options;

  // Initialize random positions
  const positions = elements.map((elem, i) => ({
    x: Math.random() * bounds.width,
    y: Math.random() * bounds.height,
    width: parseFloat(elem.getAttribute('width') || 100),
    height: parseFloat(elem.getAttribute('height') || 100),
    vx: 0,
    vy: 0,
  }));

  // Iterative force simulation
  for (let i = 0; i < iterations; i++) {
    positions.forEach((pos, idx) => {
      // Apply gravity toward center
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;
      const dx = centerX - pos.x;
      const dy = centerY - pos.y;
      pos.vx += dx * centerGravity;
      pos.vy += dy * centerGravity;

      // Check collisions with other elements
      positions.forEach((other, otherIdx) => {
        if (idx === otherIdx) return;

        const distX = other.x - pos.x;
        const distY = other.y - pos.y;
        const dist = Math.sqrt(distX * distX + distY * distY);
        const minDist = (pos.width + other.width) / 2 + collisionPadding;

        if (dist < minDist && dist > 0) {
          // Push apart
          const pushX = (distX / dist) * (minDist - dist) * 0.5;
          const pushY = (distY / dist) * (minDist - dist) * 0.5;
          pos.vx -= pushX;
          pos.vy -= pushY;
        }
      });

      // Apply velocity
      pos.x += pos.vx;
      pos.y += pos.vy;

      // Damping
      pos.vx *= 0.8;
      pos.vy *= 0.8;

      // Bounds checking
      pos.x = Math.max(pos.width / 2, Math.min(bounds.width - pos.width / 2, pos.x));
      pos.y = Math.max(pos.height / 2, Math.min(bounds.height - pos.height / 2, pos.y));
    });
  }

  return positions;
}
```

**SVG Structure**:

```xml
<g class="Cloud" data-iterations="150" data-gravity="0.15">
  <g class="tag" data-size="large">Tag 1</g>
  <g class="tag" data-size="medium">Tag 2</g>
  <g class="tag" data-size="small">Tag 3</g>
  <!-- More tags -->
</g>
```

**Use Cases**:

- Tag clouds
- Word clouds
- Organic photo collages
- Mind maps
- Network diagrams
- Scattered icon layouts

**Options**:

```javascript
{
  iterations: number,        // Simulation steps (more = tighter packing)
  centerGravity: number,     // Pull toward center (0-1)
  collisionPadding: number,  // Min gap between elements
  seed: number | null,       // Random seed for reproducibility
  clusters: number,          // Multiple focal points
  clusterSpread: number      // Distance between clusters
}
```

---

### **Grid.js**

Traditional row/column grid system with responsive breakpoints.

**Algorithm**: CSS Grid-like positioning with calculated coordinates

**Layout Rules**:

- Fixed or flexible column count
- Equal or proportional cell sizes
- Row/column gaps
- Optional spanning
- Responsive column counts

**Calculation**:

```javascript
export function calculate(elements, bounds, options = {}) {
  const { columns = 3, rows = 'auto', gap = 20, padding = 40, aspectRatio = null } = options;

  const availableWidth = bounds.width - padding * 2 - gap * (columns - 1);
  const cellWidth = availableWidth / columns;
  const cellHeight = aspectRatio ? cellWidth / aspectRatio : cellWidth;

  const calculatedRows = rows === 'auto' ? Math.ceil(elements.length / columns) : rows;

  return elements.map((elem, i) => {
    const col = i % columns;
    const row = Math.floor(i / columns);

    return {
      x: padding + col * (cellWidth + gap),
      y: padding + row * (cellHeight + gap),
      width: cellWidth,
      height: cellHeight,
      col,
      row,
    };
  });
}
```

**SVG Structure**:

```xml
<g class="Grid" data-columns="4" data-gap="30" data-aspect-ratio="1.5">
  <rect class="Card" />
  <rect class="Card" data-span="2" /> <!-- Spans 2 columns -->
  <rect class="Card" />
  <rect class="Card" />
  <!-- More cards -->
</g>
```

**Use Cases**:

- Photo galleries
- Product grids
- Card layouts
- Dashboard widgets
- Icon sets
- Masonry-style layouts

**Options**:

```javascript
{
  columns: number | 'auto',
  rows: number | 'auto',
  gap: number,              // Space between cells
  padding: number,          // Edge padding
  aspectRatio: number | null, // Cell width:height ratio
  responsive: [
    { maxWidth: 1200, columns: 3 },
    { maxWidth: 768, columns: 2 },
    { maxWidth: 480, columns: 1 }
  ]
}
```

**Advanced: Column Spanning**

```javascript
// Allow elements to span multiple columns
export function calculateWithSpans(elements, bounds, options) {
  const positions = calculate(elements, bounds, options);

  elements.forEach((elem, i) => {
    const span = parseInt(elem.getAttribute('data-span') || '1');
    if (span > 1) {
      const pos = positions[i];
      pos.width = pos.width * span + options.gap * (span - 1);
    }
  });

  return positions;
}
```

---

## Integration with Builder.js

Layouts are applied through `Builder.js` during SVG construction:

```javascript
// In Builder.js
import * as Grid from './layouts/Grid.js';
import * as Cloud from './layouts/Cloud.js';
import * as BlockLine from './layouts/BlockLine.js';

export function applyLayout(container) {
  const layoutType = container.getAttribute('data-layout');
  const children = Array.from(container.children);
  const bounds = container.getBBox();

  let positions;

  switch (layoutType) {
    case 'grid':
      const gridOptions = {
        columns: parseInt(container.getAttribute('data-columns') || '3'),
        gap: parseInt(container.getAttribute('data-gap') || '20'),
      };
      positions = Grid.calculate(children, bounds, gridOptions);
      Grid.apply(children, positions);
      break;

    case 'cloud':
      const cloudOptions = {
        iterations: parseInt(container.getAttribute('data-iterations') || '100'),
        centerGravity: parseFloat(container.getAttribute('data-gravity') || '0.1'),
      };
      positions = Cloud.calculate(children, bounds, cloudOptions);
      Cloud.apply(children, positions);
      break;

    case 'blockline':
      const lineOptions = {
        orientation: container.getAttribute('data-orientation') || 'horizontal',
        spacing: parseInt(container.getAttribute('data-spacing') || '20'),
      };
      positions = BlockLine.calculate(children, bounds, lineOptions);
      BlockLine.apply(children, positions);
      break;
  }
}
```

## Animation with Layouts

Layouts can be animated by tweening between calculated positions:

```javascript
import * as Grid from './layouts/Grid.js';

// Animate from Cloud to Grid
export function morphLayout(container, fromLayout, toLayout, duration = 1) {
  const children = Array.from(container.children);
  const bounds = container.getBBox();

  // Calculate start positions (current)
  const startPositions = fromLayout.calculate(children, bounds);

  // Calculate end positions (target)
  const endPositions = toLayout.calculate(children, bounds);

  // Animate each element
  children.forEach((elem, i) => {
    const start = startPositions[i];
    const end = endPositions[i];

    gsap.to(elem, {
      duration,
      attr: {
        transform: `translate(${end.x}, ${end.y})`,
        width: end.width,
        height: end.height,
      },
      ease: 'power2.inOut',
    });
  });
}

// Usage
morphLayout(document.querySelector('.Gallery'), Cloud, Grid, 1.5);
```

## Creating New Layouts

### Step-by-Step Process

1. **Define the positioning algorithm**

   - What mathematical rule determines position?
   - Grid? Random? Physics simulation?
   - Fixed or dynamic element sizes?

2. **Create the layout file**

   ```bash
   touch layouts/Spiral.js
   ```

3. **Implement calculate function**

   ```javascript
   export function calculate(elements, bounds, options = {}) {
     const { turns = 3, spacing = 10, startRadius = 50 } = options;

     const angleStep = (turns * 2 * Math.PI) / elements.length;

     return elements.map((elem, i) => {
       const angle = i * angleStep;
       const radius = startRadius + spacing * i;

       return {
         x: bounds.width / 2 + Math.cos(angle) * radius,
         y: bounds.height / 2 + Math.sin(angle) * radius,
         width: parseFloat(elem.getAttribute('width') || 50),
         height: parseFloat(elem.getAttribute('height') || 50),
         rotation: (angle * 180) / Math.PI + 90, // Face outward
       };
     });
   }
   ```

4. **Implement apply function**

   ```javascript
   export function apply(elements, positions) {
     elements.forEach((elem, i) => {
       const pos = positions[i];
       elem.setAttribute('transform', `translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`);
       elem.setAttribute('width', pos.width);
       elem.setAttribute('height', pos.height);
     });
   }
   ```

5. **Add validation**

   ```javascript
   export function validate(elements, bounds, options) {
     if (!elements || elements.length === 0) {
       console.error('Spiral layout requires elements');
       return false;
     }

     if (!bounds || !bounds.width || !bounds.height) {
       console.error('Spiral layout requires valid bounds');
       return false;
     }

     return true;
   }
   ```

6. **Register in Builder.js**

   ```javascript
   import * as Spiral from "./layouts/Spiral.js";

   case 'spiral':
     const spiralOptions = {
       turns: parseInt(container.getAttribute('data-turns') || '3'),
       spacing: parseInt(container.getAttribute('data-spacing') || '10')
     };
     positions = Spiral.calculate(children, bounds, spiralOptions);
     Spiral.apply(children, positions);
     break;
   ```

## Best Practices

✅ **DO:**

- Keep layout logic pure (input → calculation → output)
- Return position objects, don't mutate DOM directly
- Validate inputs (elements, bounds, options)
- Provide sensible defaults for all options
- Document algorithm and mathematical basis
- Test with various element counts
- Support both fixed and dynamic sizing
- Handle edge cases (0 elements, 1 element, overflow)

❌ **DON'T:**

- Manipulate styles directly (only calculate positions)
- Assume element sizes (read from attributes/bounds)
- Hard-code dimensions (use options)
- Ignore bounds constraints
- Create layouts that only work for specific element types
- Mix layout logic with painting logic

## Common Issues

### Overlapping Elements

**Problem**: Elements overlap despite collision detection

**Solutions**:

- Increase `collisionPadding` in Cloud layout
- Increase `iterations` for tighter packing
- Reduce element sizes or increase bounds
- Check element size calculations

### Performance Issues

**Problem**: Layout calculation is slow for many elements

**Solutions**:

- Optimize collision detection with spatial hashing
- Reduce iteration count for Cloud layouts
- Use requestAnimationFrame for batching
- Debounce recalculation on resize

```javascript
// Spatial hashing for collision detection
function createSpatialHash(positions, cellSize = 100) {
  const hash = new Map();

  positions.forEach((pos, idx) => {
    const cellX = Math.floor(pos.x / cellSize);
    const cellY = Math.floor(pos.y / cellSize);
    const key = `${cellX},${cellY}`;

    if (!hash.has(key)) hash.set(key, []);
    hash.get(key).push({ pos, idx });
  });

  return hash;
}
```

### Responsive Breakpoints

**Problem**: Layout doesn't adapt to different screen sizes

**Solutions**:

- Accept `bounds` parameter instead of hard-coding
- Provide responsive options arrays
- Recalculate on resize events
- Use relative units (percentages)

## Testing Patterns

### Visual Testing

```javascript
// Test all layouts with same data
const testData = [
  { width: 100, height: 100 },
  { width: 150, height: 150 },
  { width: 80, height: 80 },
  // ... more elements
];

const bounds = { x: 0, y: 0, width: 1000, height: 800 };

console.log('Grid:', Grid.calculate(testData, bounds, { columns: 3 }));
console.log('Cloud:', Cloud.calculate(testData, bounds, { iterations: 100 }));
console.log('BlockLine:', BlockLine.calculate(testData, bounds, { orientation: 'horizontal' }));
```

### Algorithm Validation

```javascript
export function testCollisions(positions, padding = 0) {
  const collisions = [];

  positions.forEach((pos1, i) => {
    positions.forEach((pos2, j) => {
      if (i >= j) return;

      const dx = pos2.x - pos1.x;
      const dy = pos2.y - pos1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = (pos1.width + pos2.width) / 2 + padding;

      if (dist < minDist) {
        collisions.push({ i, j, overlap: minDist - dist });
      }
    });
  });

  return collisions;
}
```

## Performance Optimization

### Memoization

```javascript
const layoutCache = new WeakMap();

export function calculate(elements, bounds, options) {
  const cacheKey = JSON.stringify({ bounds, options, count: elements.length });

  if (layoutCache.has(elements) && layoutCache.get(elements).key === cacheKey) {
    return layoutCache.get(elements).positions;
  }

  const positions = calculatePositions(elements, bounds, options);
  layoutCache.set(elements, { key: cacheKey, positions });

  return positions;
}
```

### Web Workers

```javascript
// For computationally expensive layouts (Cloud)
const layoutWorker = new Worker('/js/workers/layout-worker.js');

export function calculateAsync(elements, bounds, options) {
  return new Promise(resolve => {
    layoutWorker.postMessage({ elements, bounds, options });
    layoutWorker.onmessage = e => resolve(e.data);
  });
}
```

## Related Documentation

- **Parent README**: `../README.md` - Blockframes system overview
- **Templates**: `../templates/README.md` - Page layout templates
- **Builder.js**: `../Builder.js` - Layout application system
- **Animator.js**: `../Animator.js` - Layout animation utilities

---

**Atomic Design Level**: Layouts (Foundational layer)  
**Purpose**: Mathematical positioning algorithms, NOT content structure  
**Composition**: Pure calculation → Position application → Animation
