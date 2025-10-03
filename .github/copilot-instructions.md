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

## Documentation Standards

**CRITICAL**: All code follows defensive "sociopathic developer" documentation style:

- **Extensive Warnings**: "CRITICAL WARNING", "BUG", "DO NOT REMOVE" callouts
- **Integration Dependencies**: Detailed explanations of what breaks if modified
- **Architecture Notes**: Complete technical context for safe modifications
- **Debugging Guides**: Console error checking and troubleshooting steps
- **Usage Instructions**: Step-by-step setup and customization guidelines

**README Structure**: Each major directory has comprehensive README with:

- Paranoid warnings about breaking changes
- Complete dependency chains and integration points
- Performance considerations and browser compatibility notes
- Enhancement opportunities and technical debt documentation

## Animation Choreography System

**CRITICAL**: Site uses complex GSAP-based animation system with ScrollSmoother integration:

- **Director.js**: Master animation coordinator - initializes all section controllers
- **StageManager.js**: Scroll coordination, visual effects (video, gels, pixelator)
- **Section Controllers**: Hero.js, Work.js, Biography.js handle individual section animations
- **ScrollSmoother**: Site-wide smooth scrolling affects ALL scroll behavior
- **PrinterMarks**: Dynamic overlay system for project categories

**Animation Dependencies**:

- ScrollTrigger + ScrollSmoother plugins MUST be registered before use
- DOM elements (main-header, work, biography) MUST exist for controllers
- Video files and CSS classes required for visual effects system

## Interactive Features

JavaScript modules in `js/` handle client-side interactions:

- **Choreography**: `js/choreography/` - GSAP animation coordination system
- **Effects**: `js/effects/` - Animation utilities and text effects
- **Displays**: `js/displays/` - Visual components (PrinterMarks, etc.)
- **Utils**: `js/utils/` - Theme and utility functions

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

## Animation System Gotchas

- **ScrollSmoother Conflicts**: Can interfere with other scroll libraries
- **GSAP Plugin Registration**: ScrollTrigger + ScrollSmoother MUST be registered before use
- **DOM Dependencies**: Section controllers expect specific element IDs (main-header, work, biography)
- **Video Requirements**: Background video (sizzle.mov) must exist and be web-optimized
- **Transform Origins**: Animation pivots must be precise or elements jump unexpectedly
- **Pin Spacing**: ScrollTrigger pinning affects document flow and can cause layout shifts
- **Timeline Coordination**: Animation IDs used for debugging - don't change without updating references
