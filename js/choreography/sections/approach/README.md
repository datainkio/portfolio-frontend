# Approach Section

Approach/methodology visualization section controller.

## Purpose

Displays Blockframes SVG with theme-based coloring to illustrate the design approach.

## Key Features

- **Blockframes**: Loads `/assets/svg/blockframes.svg`
- **Theme Colors**: Applies Tailwind theme colors to SVG elements
- **Responsive SVG**: Auto-scales for viewport
- **GSAP**: Scroll-based transitions

## Files

- `Approach.js` - Main section controller

## Dependencies

- **Blockframes**: `/assets/js/displays/blockframes/Blockframes.js`
- **ThemeColors**: `/assets/js/utils/tailwind/ThemeColors.js`
- **GSAP**: Core animation library

## DOM Requirements

- `#main-header` - Container element
- `#main-title` - Title element
- `/assets/svg/blockframes.svg` - SVG asset file

## Usage

```javascript
import Approach from './sections/approach/Approach.js';

const approach = new Approach('main-header');
```

## Status

Status: ⚠️ In development — not yet integrated with BaseSection.
