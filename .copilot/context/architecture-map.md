# Architecture map (high-signal)

## Templates (11ty)

- Pages: `njk/_pages/**`
- Components: `njk/_includes/**` (atoms/molecules/organisms/templates)

## JavaScript (browser)

- Entry points / experiments: `js/*.js` (some are playgrounds)
- Choreography system: `js/choreography/**`
  - `js/choreography/AnimationDirector.js` initializes the choreography system and exposes `window.director`.
  - Sections: `js/choreography/sections/**` (extend `AbstractSection`).
  - Event contracts: `js/choreography/constants.js` (`EVENTS`).

## Styles

- Source CSS: `styles/**` (includes generated tokens)
- Tailwind build wrapper: `scripts/buildCSS.js`
