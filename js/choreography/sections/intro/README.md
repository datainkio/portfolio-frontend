# Intro Section

Section controller for the intro/landing section animations.

## Purpose

Manages intro section animations with printer marks decoration and text effects.

## Key Features

- **Printer Marks**: Static decorative elements (trim, registration, bleed)
- **Text Effects**: TextParty integration for dynamic text animations
- **Scroll Triggers**: Viewport-based animation coordination
- **GSAP Timeline**: Intro/outro animation sequences

## Files

- `Intro.js` - Main section controller

## Dependencies

- **GSAP**: Core animation library with ScrollTrigger and SplitText
- **PrinterMarks**: Decorative print industry registration marks
- **TextParty**: Character-level text animation effects

## DOM Requirements

- `#intro` - Container element

## Printer Marks Applied

- **Trim Marks**: 16px offset
- **Registration Bar**: 4px offset
- **Bleed Marks**: 8px offset

## Usage

```javascript
import Intro from './sections/intro/Intro.js';

const intro = new Intro();
```

## Animation Timeline

- `intro` label - Entry animations
- `outro` label - Exit animations
- Scroll range: top bottom → top 25%

## Status

⚠️ **In Development** - Paused timeline, animations commented out
