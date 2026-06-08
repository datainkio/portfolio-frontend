<!-- @format -->

# dataink.io Portfolio

Personal portfolio site for [dataink.io](https://dataink.io) — built with Eleventy (11ty), Tailwind CSS v4, Sanity (content), Figma (design tokens), and a GSAP-based choreography system.

## Quick start

```bash
npm install        # one-time
npm start          # dev server (Tailwind + 11ty in parallel; no JS bundling)
npm run build      # full production build
```

Default dev mode is `start: npm run dev:nobundle` (raw ESM modules; faster reload). Use `npm run start:bundle` for a bundled dev build.

## Common commands

| Goal                              | Command                      |
| --------------------------------- | ---------------------------- |
| Dev (no JS bundle, fastest)       | `npm start`                  |
| Dev (with JS bundle)              | `npm run start:bundle`       |
| Full clean build                  | `npm run build`              |
| Fast build (skip Figma sync)      | `npm run quick`              |
| Sync Figma tokens + rebuild CSS   | `npm run design`             |
| Format / format check             | `npm run format` / `:check`  |
| Tests (logger + choreography)     | `npm test`                   |
| Validation (format check + tests) | `npm run validate`           |
| System health check               | `npm run doctor`             |
| List all workflows                | `npm run help`               |
| Scaffold component / page         | `npm run scaffold:component` |
|                                   | `npm run scaffold:page`      |

Full script reference: [[.github/copilot-instructions]].

## Build order

`npm run build` runs sequentially:

1. `clean` — clear `_site/` (preserves cached media in `_site/content/`)
2. `build:design` — fetch Figma tokens → write `styles/colors.css`, `styles/typography/fontFamilies.css`
3. `build:css` — Tailwind v4 compile via [scripts/buildCSS.js](scripts/buildCSS.js)
4. `build:js` — choreography bundle via [scripts/buildChoreography.js](scripts/buildChoreography.js) (skippable with `BUNDLE_JS=false`)
5. `build:11ty` — 11ty render (also fetches Sanity collections at this step)

Skipping step 2 will compile but produce a site without design tokens.

## Environment variables

Create a `.env` (see [.env.example](.env.example)). Required for full builds:

| Variable             | Purpose                                  |
| -------------------- | ---------------------------------------- |
| `FIGMA_TOKEN`        | Figma personal access token (Files:read) |
| `FIGMA_FILE_ID`      | Source Figma file                        |
| `SANITY_PROJECT_ID`  | Sanity project (defaults in `site.json`) |
| `SANITY_DATASET`     | Sanity dataset (e.g., `production`)      |
| `SANITY_READ_TOKEN`  | Optional; enables drafts, forces no CDN  |
| `SANITY_API_VERSION` | Defaults to `2025-12-26`                 |
| `SANITY_USE_CDN`     | `true` unless a token is provided        |

## Tech stack

- **Eleventy 3** with Nunjucks templates in [views/](views/) (atomic design)
- **Tailwind CSS v4** via `@tailwindcss/cli` (wrapped by [scripts/buildCSS.js](scripts/buildCSS.js))
- **Sanity** content fetched at build time — see [data/sanity/](data/sanity/) and [[docs/sanity-integration]]
- **Figma** design tokens via [scripts/fetchFigma.js](scripts/fetchFigma.js) and [figma/services/](figma/services/)
- **GSAP** choreography in [js/choreography/](js/choreography/) (see [[js/choreography/README.choreography]])
- **Logging** via `@datainkio/lumberjack` (Node + browser)

## Where to start

- **AI agents / Copilot context** → [[.github/copilot-instructions]]
- **AIX-focused project reference** → [[README.frontend]]
- **Architecture overview** → [[docs/architecture]]
- **Documentation index** → [[docs/README.docs]]
- **Sanity integration** → [[docs/sanity-integration]]
- **Choreography system** → [[js/choreography/README.choreography]]

## Project layout (high level)

```
ia/         Content entrypoints (route frontmatter; Eleventy input)
views/      Nunjucks templates (atoms / molecules / organisms / pages / templates / layouts; Eleventy includes)
styles/     CSS (main.css orchestrates import order; colors.css + typography/fontFamilies.css are generated)
js/         Browser runtime (choreography, effects, displays, preloader, utils)
eleventy/   11ty config modules (collections, filters, shortcodes, plugins, services)
data/sanity/ Sanity client, queries, fetchers
figma/      Figma API services (token generation)
scripts/    Build automation (buildCSS, buildChoreography, fetchFigma, scaffold, …)
assets/     Static source assets (copied to _site/assets/)
docs/       Project documentation
_site/      Build output (gitignored, never edited)
```

## Generated files (do not edit)

- `styles/colors.css`
- `styles/typography/fontFamilies.css`
- Anything under `_site/`, `.cache/`, `logs/`

These are overwritten by `build:design` and `build:*` steps.

## Deployment

The build produces a fully static site in `_site/`. Deploy to any static host (Netlify, Vercel, Pages, S3+CloudFront, etc.).

## License

ISC — see [package.json](package.json).
