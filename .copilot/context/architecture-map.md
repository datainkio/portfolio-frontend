# Architecture map (high-signal)

## Entrypoints (frontend)

- Project README: [README.md](frontend/README.md)
- Docs hub: [docs/README.md](frontend/docs/README.md)
- Architecture doc: [docs/architecture.md](frontend/docs/architecture.md)
- Copilot scope: [.copilot/README.md](frontend/.copilot/README.md)
- Curated context: [.copilot/context/README.md](frontend/.copilot/context/README.md)
- Issue template: [.github/ISSUE_TEMPLATE/bug.md](frontend/.github/ISSUE_TEMPLATE/bug.md)
- Backlog: [TODO.md](frontend/TODO.md) · [docs/TODO.md](frontend/docs/TODO.md) · [js/TODO.md](frontend/js/TODO.md)

## Eleventy + Nunjucks

- Config: [.eleventy.js](frontend/.eleventy.js), [.eleventyignore](frontend/.eleventyignore)
- Content entrypoints: [ia/](frontend/ia/)
- Templates: [njk/](frontend/njk/)
  - Templates README: [njk/README.md](frontend/njk/README.md)
  - Pages (template-only): [njk/pages/](frontend/njk/pages/)
    - About lab: [njk/pages/about/lab/README.md](frontend/njk/pages/about/lab/README.md)
    - Storyboards index: [njk/pages/about/design/storyboards/index.md](frontend/njk/pages/about/design/storyboards/index.md)
    - Storyboards landing: [njk/pages/about/design/storyboards/landing.md](frontend/njk/pages/about/design/storyboards/landing.md)
  - Components: [njk/](frontend/njk/) (atoms/molecules/organisms/templates/layouts)
    - Atoms: [njk/atoms/README.md](frontend/njk/atoms/README.md)
    - Molecules: [njk/molecules/README.md](frontend/njk/molecules/README.md)
      - Background: [njk/molecules/background/README.md](frontend/njk/molecules/background/README.md)
      - Card: [njk/molecules/card/README.md](frontend/njk/molecules/card/README.md)
    - Organisms: [njk/organisms/README.md](frontend/njk/organisms/README.md)
      - Section: [njk/organisms/section/README.md](frontend/njk/organisms/section/README.md)
    - Templates: [njk/templates/README.md](frontend/njk/templates/README.md)
    - Layouts: [njk/layouts/README.md](frontend/njk/layouts/README.md)
- Data: [site.json](frontend/site.json)
- Eleventy helpers: [eleventy/](frontend/eleventy/) (collections, filters, plugins, services, shortcodes)
  - Collections: [eleventy/collections/](frontend/eleventy/collections/)
    - Collections README: [eleventy/collections/README.md](frontend/eleventy/collections/README.md)
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
    - Abstract section: [js/choreography/sections/abstract-section/README.md](frontend/js/choreography/sections/abstract-section/README.md)
  - Managers: [js/choreography/managers/](frontend/js/choreography/managers/)
  - Event contracts: [js/choreography/constants.js](frontend/js/choreography/constants.js) (`EVENTS`).
  - Choreography pages: [js/choreography/pages/README.md](frontend/js/choreography/pages/README.md)
  - Choreography utils: [js/choreography/utils/README.md](frontend/js/choreography/utils/README.md)
- Displays / effects / layouts: [js/displays/](frontend/js/displays/), [js/effects/](frontend/js/effects/), [js/layouts/](frontend/js/layouts/)
  - Displays README: [js/displays/README.md](frontend/js/displays/README.md)
  - Blockframes: [js/displays/blockframes/README.md](frontend/js/displays/blockframes/README.md)
    - Atoms: [js/displays/blockframes/atoms/README.md](frontend/js/displays/blockframes/atoms/README.md)
    - Molecules: [js/displays/blockframes/molecules/README.md](frontend/js/displays/blockframes/molecules/README.md)
    - Organisms: [js/displays/blockframes/organisms/README.md](frontend/js/displays/blockframes/organisms/README.md)
    - Layouts: [js/displays/blockframes/layouts/README.md](frontend/js/displays/blockframes/layouts/README.md)
    - Templates: [js/displays/blockframes/templates/README.md](frontend/js/displays/blockframes/templates/README.md)
  - Layouts README: [js/layouts/README.md](frontend/js/layouts/README.md)
  - Interstitials README: [js/interstitials/README.md](frontend/js/interstitials/README.md)
- Utilities / vendor: [js/utils/](frontend/js/utils/), [js/vendor/](frontend/js/vendor/)
  - Vendor README: [js/vendor/README.md](frontend/js/vendor/README.md)

## Styles

- Source CSS: [styles/](frontend/styles/) (base + components + utilities)
- Generated tokens: [styles/colors.css](frontend/styles/colors.css), [styles/typography/fontFamilies.css](frontend/styles/typography/fontFamilies.css)
- Tailwind build wrapper: [scripts/buildCSS.js](frontend/scripts/buildCSS.js)

Style references:

- Styles README: [styles/README.md](frontend/styles/README.md)
- Typography README: [styles/typography/README.md](frontend/styles/typography/README.md)

## Content + data

- CMS integration: [cms/](frontend/cms/)
- Static assets: [assets/](frontend/assets/)

Assets references:

- Fonts README: [assets/fonts/README.md](frontend/assets/fonts/README.md)

## Tooling + output

- Build/ops scripts: [scripts/](frontend/scripts/) ([scripts/buildChoreography.js](frontend/scripts/buildChoreography.js), [scripts/buildPreview.js](frontend/scripts/buildPreview.js), [scripts/fetchFigma.js](frontend/scripts/fetchFigma.js), [scripts/systemCheck.js](frontend/scripts/systemCheck.js), [scripts/validateEnvironment.js](frontend/scripts/validateEnvironment.js))
- Tooling config: [package.json](frontend/package.json), [postcss.config.js](frontend/postcss.config.js), [tailwind.config.js](frontend/tailwind.config.js)
- Generated output: [\_site/](frontend/_site/) (build artifact)

Figma docs:

- Figma README: [figma/README.md](frontend/figma/README.md)
- API: [figma/api/README.md](frontend/figma/api/README.md)
- Models: [figma/models/README.md](frontend/figma/models/README.md)
- Services: [figma/services/README.md](frontend/figma/services/README.md)
- Views: [figma/views/README.md](frontend/figma/views/README.md)
  - Eleventy views: [figma/views/eleventy/README.md](frontend/figma/views/eleventy/README.md)
  - Tailwind views: [figma/views/tailwind/README.md](frontend/figma/views/tailwind/README.md)
