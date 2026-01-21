# Architecture map (high-signal)

## Eleventy + Nunjucks

- Config: [.eleventy.js](frontend/.eleventy.js), [.eleventyignore](frontend/.eleventyignore)
- Templates: [njk/](frontend/njk/)
  - Pages: [njk/_pages/](frontend/njk/_pages/)
  - Components: [njk/_includes/](frontend/njk/_includes/) (atoms/molecules/organisms/templates)
  - Data: [njk/_data/](frontend/njk/_data/)
- Eleventy helpers: [eleventy/](frontend/eleventy/) (collections, filters, plugins, services, shortcodes)
  - Collections: [eleventy/collections/](frontend/eleventy/collections/)
  - Filters: [eleventy/filters/](frontend/eleventy/filters/)
  - Plugins: [eleventy/plugins/](frontend/eleventy/plugins/)
  - Services: [eleventy/services/](frontend/eleventy/services/)
  - Shortcodes: [eleventy/shortcodes/](frontend/eleventy/shortcodes/)

## JavaScript (browser)

- Entry points: [js/main.js](frontend/js/main.js), [js/preloader.js](frontend/js/preloader.js), [js/section-playback.js](frontend/js/section-playback.js)
- Experiments / playgrounds: [js/choreography-playground.js](frontend/js/choreography-playground.js), [js/hero-playground.js](frontend/js/hero-playground.js), [js/circle-packing.js](frontend/js/circle-packing.js), [js/fibonacci.js](frontend/js/fibonacci.js), [js/gen-grid.js](frontend/js/gen-grid.js), [js/gsap-test.js](frontend/js/gsap-test.js)
- Choreography system: [js/choreography/](frontend/js/choreography/)
  - [js/choreography/AnimationDirector.js](frontend/js/choreography/AnimationDirector.js) initializes the system and exposes `window.director`.
  - Bus: [js/choreography/AnimationBus.js](frontend/js/choreography/AnimationBus.js)
  - Sections: [js/choreography/sections/](frontend/js/choreography/sections/) (extend `AbstractSection`).
  - Managers: [js/choreography/managers/](frontend/js/choreography/managers/)
  - Event contracts: [js/choreography/constants.js](frontend/js/choreography/constants.js) (`EVENTS`).
- Displays / effects / layouts: [js/displays/](frontend/js/displays/), [js/effects/](frontend/js/effects/), [js/layouts/](frontend/js/layouts/)
- Utilities / vendor: [js/utils/](frontend/js/utils/), [js/vendor/](frontend/js/vendor/)

## Styles

- Source CSS: [styles/](frontend/styles/) (base + components + utilities)
- Generated tokens: [styles/colors.css](frontend/styles/colors.css), [styles/typography/fontFamilies.css](frontend/styles/typography/fontFamilies.css)
- Tailwind build wrapper: [scripts/buildCSS.js](frontend/scripts/buildCSS.js)

## Content + data

- Airtable sync: [airtable/](frontend/airtable/), [scripts/syncContent.js](frontend/scripts/syncContent.js), [scripts/generateAirtableSchema.js](frontend/scripts/generateAirtableSchema.js)
- Sanity integration: [sanity/](frontend/sanity/)
- Static assets: [assets/](frontend/assets/)

## Tooling + output

- Build/ops scripts: [scripts/](frontend/scripts/) ([scripts/buildChoreography.js](frontend/scripts/buildChoreography.js), [scripts/buildPreview.js](frontend/scripts/buildPreview.js), [scripts/fetchFigma.js](frontend/scripts/fetchFigma.js), [scripts/systemCheck.js](frontend/scripts/systemCheck.js), [scripts/validateEnvironment.js](frontend/scripts/validateEnvironment.js))
- Tooling config: [package.json](frontend/package.json), [postcss.config.js](frontend/postcss.config.js), [tailwind.config.js](frontend/tailwind.config.js)
- Generated output: [_site/](frontend/_site/) (build artifact)
