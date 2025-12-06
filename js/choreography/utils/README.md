# Choreography Utilities

Utilities for animation management and gel positioning.

## GelPositioner

CSS positioning and sizing for gel elements.

Methods:

- `apply(el, config)` - Apply positioning to element
- `calculateTarget(refEl, axis)` - Calculate target as viewport fraction
- `getOriginFromElement(refEl, axis)` - Get transform origin from element
- `getOriginFromPosition(axis, position)` - Get transform origin from position

Positioning modes:

1. **Element Matching** - Match another element's position and dimensions
2. **Viewport-relative** - Position relative to viewport with alignment

## GelConfigParser

Parses and normalizes gel configuration.

Methods:

- `parse(config)` - Parse raw config into normalized format
- `validate(parsed, gelId)` - Validate parsed configuration

Supported formats:

```javascript
// Legacy: number only
0.5

// Modern: object with options
{
  target: 0.5,
  axis: 'y',
  targetElement: '#hero',
  position: 'center'
}
```

## Usage Example

```javascript
import GelPositioner from './utils/GelPositioner.js';
import GelConfigParser from './utils/GelConfigParser.js';

// Parse configuration
const parsed = GelConfigParser.parse(config);

// Apply positioning
GelPositioner.apply(element, {
  axis: parsed.axis,
  refEl: parsed.refEl,
  position: parsed.position,
});

// Calculate target
const target = GelPositioner.calculateTarget(refElement, 'y');
```
