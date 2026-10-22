<img src=".github/readme/banner.svg" width="1280" alt="Title block in the style of dataink.io: Doc 00, section README, stack Eleventy, Tailwind, Sanity, Figma and GSAP. The source for data:ink:io.">

# dataink.io

[![Node version from package.json](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdatainkio/portfolio-frontend%2Fmain%2Fpackage.json&query=%24.engines.node&label=node&logo=nodedotjs&style=flat-square&labelColor=020617&color=eb5e28&logoColor=e2e8f0)](package.json)
[![Eleventy version from package.json](https://img.shields.io/github/package-json/dependency-version/datainkio/portfolio-frontend/@11ty/eleventy?label=eleventy&logo=eleventy&style=flat-square&labelColor=020617&color=eb5e28&logoColor=e2e8f0)](package.json)
[![Tailwind CSS version from package.json](https://img.shields.io/github/package-json/dependency-version/datainkio/portfolio-frontend/tailwindcss?label=tailwind&logo=tailwindcss&style=flat-square&labelColor=020617&color=eb5e28&logoColor=e2e8f0)](package.json)
[![Design tokens generated from Figma](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdatainkio%2Fportfolio-frontend%2Fmain%2F.github%2Freadme%2Ffigma-badge.json&logo=figma&style=flat-square&labelColor=020617&color=eb5e28&logoColor=e2e8f0)](styles/colors.css)
[![GSAP version from package.json](https://img.shields.io/github/package-json/dependency-version/datainkio/portfolio-frontend/gsap?label=gsap&logo=greensock&style=flat-square&labelColor=020617&color=eb5e28&logoColor=e2e8f0)](package.json)
[![Sanity client version from package.json](https://img.shields.io/github/package-json/dependency-version/datainkio/portfolio-frontend/@sanity/client?label=sanity&logo=sanity&style=flat-square&labelColor=020617&color=eb5e28&logoColor=e2e8f0)](package.json)
[![License: MIT](https://img.shields.io/badge/license-MIT-eb5e28?style=flat-square&labelColor=020617)](LICENSE)

This is the Eleventy site I always wanted to build. I will tell you why.
It started from a blank slate, so I'm confident I know what's up. With plugins that becomes more difficult.

## Practices

- atomic design & modularity
- sidecars, READMEs, and embedded documentation
- findability, discoverability, maintainability
- AIX: graphify, skills
- low barrier to entry

## Structure

At root:

- eleventy.config
- site.json
- tailwind.config
- postcss.config
- breakpoints.config

```mermaid
flowchart LR
  bp[breakpoints.config.js]
  site[site.json]
  eleventy[eleventy.config.js]
  tw[tailwind.config.js]

  choreo[js/choreography/config/ix/breakpoints.js]
  collections[eleventy/collections/index.js]
  buildcss[scripts/buildCSS.js]
  out[(_site/)]

  bp -- "SCREENS" --> tw
  bp -- "SCREENS" --> choreo
  eleventy -- "passthrough copy to assets/" --> bp
  eleventy -- "imports" --> collections
  collections -- "reads, exposes as global site" --> site
  eleventy -- "builds" --> out
  buildcss -. "config analysis only" .-> tw

  classDef idle stroke-dasharray: 4 4
  class tw,postcss idle
```

Solid lines are imports or reads that affect the build. Dashed boxes mark the two files that don't drive the build right now. The Tailwind v4 CLI builds `styles/main.css`, which has no `@config` directive, so `tailwind.config.js` reaches only the build logger. `postcss.config.js` names `@tailwindcss/postcss`, but nothing in the build uses PostCSS and that package isn't installed.

### Assets

- fonts
- icons
- images
- js
- storyboards
- svg
- tiles

### Data/Sanity

- client
- projections
- queries
- services
- transforms
- queries.js

### Eleventy

- collections
- filters
- plugins
- services
- shortcodes

### Figma

- api
- models
- services
- utils
- views

### IA

MD files for pages and navigation

### JS

- choreography
- displays
- effects
- interstitials
- layouts
- lightbox
- preloader
- utils
- vendor

### Scripts

### Specs

### Styles

- backgrounds
- components
- typography
- utilities
- base.css
- colors.css
- decorations.css
- sizes.css
- main.css

### Test

### Views

- atoms
- layouts
- molecules
- organisms
- pages
- templates

## License

[MIT](LICENSE)

---

<!-- readme-index:start -->

## Index

- [assets/](assets/README.md)
- [data/](data/)
- [docs/](docs/README.md)
- [eleventy/](eleventy/README.md)
- [figma/](figma/README.md)
- [graphify-out/](graphify-out/)
- [ia/](ia/)
- [js/](js/README.md)
- [responsive-testing/](responsive-testing/README.md)
- [scripts/](scripts/README.md)
- [specs/](specs/)
- [styles/](styles/README.md)
- [test/](test/README.md)
- [views/](views/README.md)
- [breakpoints.config.js](breakpoints.config.js)
- [breakpoints.config.md](breakpoints.config.md)
- [CLAUDE.md](CLAUDE.md)
- [eleventy.config.js](eleventy.config.js)
- [eleventy.config.md](eleventy.config.md)
- [frontend.code-workspace](frontend.code-workspace)
- [IA.canvas](IA.canvas)
- [package-lock.json](package-lock.json)
- [package.json](package.json)
- [postcss.config.js](postcss.config.js)
- [README.canvas](README.canvas)
- [site.json](site.json)
- [tailwind.config.js](tailwind.config.js)
<!-- readme-index:end -->
