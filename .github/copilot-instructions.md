<!-- @format -->

# Copilot Instructions for dataink.io Portfolio

This is an 11ty static site with automated Figma design system integration and
Airtable CMS. The architecture prioritizes design-developer workflow automation
and content management flexibility.

## Architecture Overview

- **11ty**: Static site generator with source in `njk/` (Nunjucks templates)
- **Figma API**: Automatically syncs design tokens (colors, typography) to CSS
  files
- **Airtable**: Headless CMS providing content via API with smart caching
- **Tailwind CSS 4.0**: Utility-first CSS with design tokens from Figma
- **Atomic Design**: Component structure in `njk/_includes/`
  (atoms/molecules/organisms/templates)

## Quick Start

```bash
npm install          # REQUIRED: Install dependencies (including npm-run-all)
npm run build:design # Fetches Figma design tokens → CSS files
npm run build:11ty   # Generates static site from njk/ → _site/
npm start           # Parallel: Tailwind watch + 11ty serve
```

**Critical**: Always run `npm install` first on fresh clone. The build MUST run
`build:design` first to sync latest design tokens before 11ty compilation.

## Design System Integration

**Critical**: Figma integration is bidirectional and automated via `figma/`
services:

- `scripts/fetchFigma.js` orchestrates the sync process
- `figma/services/PaletteService.js` writes colors to `styles/colors.css`
- `figma/services/TypographyService.js` updates `styles/typography/` files
- Design tokens structure in Figma must follow naming conventions (see
  README.md)

CSS imports order matters: font imports → Tailwind → base styles → generated
design files.

## Data Architecture

**Airtable CMS**: Configuration in `njk/_data/site.json` defines:

- Tables to sync (`airtables` array with `tableName`, `tableView`, `cache`
  duration)
- Each table becomes an 11ty collection accessible in templates
- Smart caching via `@11ty/eleventy-fetch` prevents API rate limits

Collections are auto-generated in `eleventy/collections/content.js` - table
names become collection names (lowercase).

## File Organization Patterns

- **Templates**: `njk/_pages/` → site URLs, `njk/_includes/` → reusable
  components
- **Assets**: `assets/` copied to `_site/assets/`, `js/` copied to
  `_site/assets/js/`
- **Generated**: `_site/` is build output, `styles/` contains both source and
  Figma-generated CSS
- **Scripts**: Build automation in `scripts/`, API services in `figma/` and
  `airtable/`

## Development Conventions

- **ES Modules**: All JavaScript uses import/export syntax (`type: "module"` in
  package.json)
- **Async Operations**: Figma/Airtable fetches use async/await with error
  handling
- **Logging**: Consistent chalk-colored console output for build steps
- **Caching**: Aggressive caching for external APIs with configurable durations

## Interactive Features

JavaScript modules in `js/` handle client-side interactions:

- GSAP animations and effects in `js/effects/`
- Modular display components in `js/displays/`
- Theme and utility functions in `js/utils/`

Import paths use `/assets/js/` (absolute from site root) in client-side code.

## Environment Setup

Required environment variables for external integrations:

- `FIGMA_TOKEN`: Personal access token for design sync
- `AIRTABLE_PERSONAL_ACCESS_TOKEN`: API access for content
- `AIRTABLE_BASE_TOKEN`: Specific base identifier

## Common Gotchas

- **Tailwind CSS v4**: Uses `@tailwindcss/cli` instead of `tailwindcss` command
- **Missing Icon Templates**: Create missing atomic components in
  `njk/_includes/atoms/icon/` as needed
- Figma token structure changes break build - check design file organization
- Airtable view names are case-sensitive in `site.json` configuration
- 11ty collections are lowercase regardless of Airtable table casing
- CSS import order in `styles/main.css` affects Tailwind compilation
- Asset paths differ between development (`/assets/`) and source structure
