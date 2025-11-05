# Biography Section

Section controller managing biography list item reveal animations.

## Purpose

Orchestrates fade-in intro and scroll-triggered list item reveals for the biography section.

## Key Features

- **Fade-in Intro**: Section-level fade animation
- **Staggered Reveals**: Individual list items fade in on scroll
- **Progressive Disclosure**: Items invisible until scrolled into viewport
- **Event Coordination**: Emits events for sequence choreography

## Files

- `Biography.js` - Main section controller

## Dependencies

- **BaseSection**: Foundation class for lifecycle and events
- **ScrollTrigger**: Scroll-based animation triggers
- **AnimationBus**: Event coordination system

## DOM Requirements

- `#biography` - Section container
- `#biography ul > li` - List items for staggered reveal

## Events Emitted

- `section:biography:intro:start` - Intro animation begins
- `section:biography:intro:complete` - Intro animation finished
- `section:biography:scroll:enter` - Section enters viewport

## Usage

```javascript
import Biography from './sections/biography/Biography.js';

const bio = new Biography(bus, smoother);
await bio.playIntro();
```

## Animation Details

- **Intro**: Fade from opacity 0 to 1 (1.2s duration)
- **List Items**: Individual ScrollTrigger for each item
- **Trigger Point**: center center (mid-viewport)
