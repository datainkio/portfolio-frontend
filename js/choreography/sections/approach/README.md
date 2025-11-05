# Approach Section

Section controller for the approach/methodology visualization.

## Purpose

Displays Blockframes SVG visualization with theme-based coloring to illustrate the design approach.

## Key Features

- **Blockframes Integration**: Loads and renders `/assets/svg/blockframes.svg`
- **Theme Colors**: Applies Tailwind theme colors to SVG elements
- **Responsive SVG**: Auto-scales SVG for different viewport sizes
- **GSAP Animations**: Scroll-based animations for section transitions

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

⚠️ **In Development** - Not yet integrated with BaseSection architecture
