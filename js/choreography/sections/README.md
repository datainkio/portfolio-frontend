# Section Controllers

**Individual animation controllers for specific page sections.** Each extends `BaseSection` and defines intro/outro/scroll animations.

## Files

- **BaseSection.js**: Foundation class providing standard lifecycle (`createIntro`, `createOutro`, `createScrollTriggers`) and automatic event emission
- **Hero.js**: Landing hero section - fade-in intro, scroll-based rotation outro
- **Work.js**: Work section - fade-in intro, project category scroll reveals, printer marks integration
- **Biography.js**: Biography section - fade-in intro, progressive list item reveals on scroll

## Usage

All section controllers are automatically instantiated by Director and coordinated via LandingSequence. Emit events at animation milestones for sequence choreography.

See parent [Choreography README](../README.md) for complete documentation.
