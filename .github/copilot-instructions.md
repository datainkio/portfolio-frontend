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

**Code Documentation**: Use concise, clear commenting that focuses on the "why" rather than the "how":

- **File/Module Headers**: Brief purpose, key responsibilities, dependencies (10-15 lines max)
- **Function Comments**: JSDoc with params/returns, brief description of purpose
- **Inline Comments**: Only for complex logic or non-obvious implementation details
- **Section Comments**: Group related functionality with 1-2 line headers
- **Warnings**: Use "CRITICAL:", "WARNING:", "NOTE:" sparingly for actual gotchas

**README Structure**: Each major directory has focused README with:

- Quick overview and purpose
- Key files and their roles
- Usage examples
- Common patterns and conventions
- Troubleshooting guide (actual issues, not hypotheticals)

## Animation Choreography System

**Architecture**: GSAP-based animation system with scroll integration:

- **Director.js**: Master coordinator - initializes section controllers on DOMContentLoaded
- **StageManager.js**: Scroll smoothing (ScrollSmoother), background video, overlay effects
- **Section Controllers**: Hero.js, Work.js, Biography.js - individual section animations
- **AnimationBus**: Event-driven pub/sub for cross-section coordination
- **LandingSequence**: Defines animation flow via event listeners
- **BaseSection**: Foundation class for section controllers with lifecycle methods

**Key Dependencies**:

- GSAP plugins MUST be registered: `gsap.registerPlugin(ScrollTrigger, ScrollSmoother)`
- Required DOM elements: `#main-header`, `#work`, `#biography`, `#smooth-wrapper`, `#smooth-content`
- Video file: `/assets/video/sizzle.mp4` (web-optimized MP4)
- CSS classes: `.bg-video`, `.bg-gel-*`, `.bg-pixelator`

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

- **GSAP Plugin Registration**: Must call `gsap.registerPlugin()` before using ScrollTrigger/ScrollSmoother
- **ScrollSmoother Auto-Detection**: Only enables if BOTH `#smooth-wrapper` and `#smooth-content` exist
- **Video Format**: Use web-optimized MP4 (not MOV) - Safari compatibility issues with Motion exports
- **Background Video**: Applied to `#overlay-view` with `.bg-video` class for grid pattern overlay
- **Pin Spacing**: ScrollTrigger pinning affects layout - test on mobile devices
- **Animation Timing**: Section controllers coordinate via AnimationBus events (not direct calls)
