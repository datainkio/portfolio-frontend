# Section Controllers

Individual page section animation controllers. Each extends BaseSection and defines intro/outro/scroll animations.

## Key Files

- **BaseSection.js**: Foundation class with lifecycle methods (createIntro/Outro/ScrollTriggers), auto-emits standard events
- **Hero.js**: Landing hero - TextParty.roll intro, reversed roll on scroll exit
- **Work.js**: Work section - fade intro, printer marks integration, scroll-triggered category reveals
- **Biography.js**: Biography section - fade intro, progressive list reveals on scroll

## Usage

Director auto-instantiates all sections. LandingSequence coordinates via event listeners.

```javascript
// Sections emit standard events
this.bus.emit('section:hero:intro:complete');
this.bus.emit('section:work:scroll:enter');

// Sequences react
this.bus.on('section:hero:intro:complete', () => {
  this.sections.work.playIntro();
});
```

See parent [README](../README.md) for complete architecture.
