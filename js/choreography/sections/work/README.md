# Work Section

Section controller managing work/project category animations and printer mark overlays.

## Purpose

Orchestrates fade-in intro, scroll-triggered project category entrances, and printer mark decorations.

## Key Features

- **Fade-in Intro**: Section-level fade animation
- **Project Category Reveals**: Individual scroll-based animations
- **Printer Mark Overlays**: Decorative print registration marks on categories
- **Event Coordination**: Emits events for sequence choreography
- **Scroll Integration**: Viewport-relative animation triggers

## Files

- `Work.js` - Main section controller

## Dependencies

- **BaseSection**: Foundation class for lifecycle and events
- **ScrollTrigger**: Scroll-based animation triggers
- **PrinterMarks**: Print industry registration mark overlays
- **AnimationBus**: Event coordination system

## DOM Requirements

- `#work` - Section container
- `.project-category` - Individual project category elements

## Events Emitted

- `section:work:intro:start` - Intro animation begins
- `section:work:intro:complete` - Intro animation finished
- `section:work:scroll:enter` - Section enters viewport

## Usage

```javascript
import Work from './sections/work/Work.js';

const work = new Work(bus, smoother);
await work.playIntro();
```

## Animation Details

- **Intro**: Fade from opacity 0 to 1 (1.2s duration)
- **Project Categories**: Individual ScrollTrigger for each
- **Trigger Range**: top 65% → bottom 35%
- **Printer Marks**: Offset 8px, applied to each category

## CSS Dependencies

- `styles/backgrounds/PrintMarks.css` - Printer mark overlay styles
