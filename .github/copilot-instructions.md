<!-- @format -->

# Copilot Instructions for dataink.io Portfolio (11ty + Figma + Sanity)

These instructions make AI coding agents immediately productive in this repo by summarizing architecture, workflows, conventions, and gotchas specific to this project.

## Big Picture

- **11ty static site**: Content entry lives in `ia/` (Eleventy `input`); Nunjucks templates live in `views/` (Eleventy `includes`, configured as `../views` relative to `ia/`) and generate `_site/`. Atomic design components live under `views/` (`atoms/`, `molecules/`, `organisms/`, plus `layouts/`, `pages/`, `templates/`). Each `.njk` template has a sibling Obsidian sidecar `.md` for documentation.
- **Design tokens via Figma**: CSS files in `styles/` are generated from Figma (colors, typography) by `scripts/fetchFigma.js` and services in `figma/services/*` (PaletteService, TypographyService, StyleService, FileService).
- **Content via Sanity**: Data fetched at build time and exposed as 11ty collections. Defaults live in `site.json` under `cms` (or `sanity`) with queries in `data/sanity/queries.js`.
- **Tailwind v4**: Uses `@tailwindcss/cli` via `scripts/buildCSS.js` wrapper. CSS import order in `styles/main.css` is critical for correct token application.
- **Animation system**: GSAP-based choreography under `js/choreography/` with AnimationDirector, ScrollEffectsCoordinator, AnimationBus, section controllers, and specialized managers.
- **Logging**: Unified `@datainkio/lumberjack` logger across Node and browser environments for consistent output.

## Core Workflows

```bash
# Setup
npm install                  # Required on fresh clone

# Development (most common)
npm start                    # Runs dev:css + dev:11ty in parallel (Tailwind watch + 11ty serve)
npm run dev                  # Same as npm start

# Building
npm run build                # Full build: clean → build:design → build:css → build:11ty
npm run fresh                # Same as build (full clean build)
npm run quick                # Fast build: css + 11ty only (skips design sync)

# Design System
npm run build:design         # Sync Figma tokens → CSS (fetchFigma.js → services → CSS files)
npm run design               # build:design + build:css (design tokens + CSS compilation)

# Content Management
# (Sanity data is fetched during 11ty builds; no separate sync step required.)

# CSS Building
npm run build:css            # Production build (minified) via buildCSS.js wrapper
npm run build:css:dev        # Development build (unminified, detailed analysis)
npm run dev:css              # Watch mode (continuous building)

# Testing
npm run test                 # Run logger tests
npm run test:choreography    # Test animation event system
npm run validate             # Full validation: format check + test + preview build

# Maintenance
npm run clean                # Clear _site/ folder
npm run clean:debug          # Clear _site/ with debug logging
npm run format               # Format all files with Prettier
npm run format:check         # Check formatting without changing files
npm run format:njk           # Format only Nunjucks templates

# Scaffolding
npm run scaffold:component   # Generate new atomic design component
npm run scaffold:page        # Generate new page template
npm run scaffold:list        # List available scaffolds

# Utilities
npm run doctor               # Run system health checks
npm run help                 # Show available workflows
npm run ref                  # Quick reference guide
npm run setup                # Validate environment and run system check

# Diagrams
npm run diagrams:export      # Export all Mermaid diagrams to SVG
npm run diagrams:export:onboarding          # Export onboarding diagrams
npm run diagrams:export:choreography        # Export choreography diagrams
```

**Critical Environment Variables:**

- `FIGMA_TOKEN` - Required for design token sync (legacy: `FIGMA_ACCESS_TOKEN`)
- `FIGMA_FILE_ID` - Required Figma file ID
- `SANITY_PROJECT_ID` - Sanity project ID
- `SANITY_DATASET` - Sanity dataset (e.g., production)
- `SANITY_API_TOKEN` - Optional; enables drafts and disables CDN
- `SANITY_API_VERSION` - API version (default `2025-12-26`)
- `SANITY_USE_CDN` - `true` unless a token is provided

**Build Order Dependencies:**

1. `build:design` must run before `build:css` to ensure tokens exist
2. `build:11ty` fetches Sanity data needed for 11ty collections
3. CSS must be built for correct styling in `_site/`

## Key Directories & Files

**Templates & Structure**

- `ia/` - Content entrypoints with frontmatter (routes); Eleventy `input` directory
- `views/` - Templates and components; Eleventy `includes` directory (resolved as `../views` from `ia/`)
  - `atoms/`, `molecules/`, `organisms/` - Atomic design components (each `.njk` paired with a sibling `.md` Obsidian sidecar)
  - `layouts/` - Page shells consumed via `{% extends %}`
  - `pages/` - Page-level templates
  - `templates/partials/` - Shared partials (head, fonts, GTM, choreography script)
  - `_registry.njk` - Central component registry
- `.eleventy.js` - 11ty config (plugins, collections, filters, shortcodes)
- `eleventy/` - Modular 11ty configuration
  - `collections/` - Collection definitions (Sanity-driven)
  - `filters/` - Nunjucks filters
  - `shortcodes/` - Reusable template functions
  - `plugins/` - 11ty plugins
  - `services/` - Build-time services

**Data & CMS**

- `site.json` - Global site config + CMS defaults
- `data/sanity/` - Sanity client, queries, and fetch helpers

**Design System**

- `scripts/fetchFigma.js` - Main Figma sync orchestrator
- `figma/index.js` - Service exports
- `figma/services/` - Design token processors
  - `FileService.js` - Fetch Figma file data
  - `StyleService.js` - Extract style definitions
  - `PaletteService.js` - Generate color CSS custom properties → `styles/colors.css`
  - `TypographyService.js` - Generate font families → `styles/typography/fontFamilies.css`
- `figma/api/` - Figma REST API client
- `figma/models/` - Data models for design tokens
- `figma/utils/` - Color conversion and formatting utilities

**Styles**

- `styles/main.css` - **Critical import order**: fonts → Tailwind → base → theme → components
- `styles/colors.css` - Auto-generated color tokens from Figma
- `styles/typography/` - Font imports and utilities
  - `imports.css` - Font @import statements (must be first in main.css)
  - `fontFamilies.css` - Auto-generated from Figma
- `styles/base.css` - Global resets and base styles
- `styles/animations.css` - GSAP integration styles
- `styles/utilities/` - Custom Tailwind utilities (mask, text, reduced-motion)
- `styles/components/` - Component-specific styles
- `tailwind.config.js` - Tailwind configuration (v4)
- `postcss.config.js` - PostCSS configuration

**JavaScript Runtime**

- `js/main.js` - Browser entry point (imports AnimationDirector)
- `js/choreography/` - Animation system
  - `AnimationDirector.js` - Master coordinator (initializes sections, bus, and runtime gates)
  - `ScrollEffectsCoordinator.js` - Scroll smoothing & background effects coordinator
  - `AnimationBus.js` - Event system for section coordination
  - `sections/` - Section-specific controllers (Hero, BackgroundVideo, Bio, Awards, Organizations, Work)
  - `sequences/` - Animation choreography (LandingSequence)
  - `managers/` - Specialized managers (ReducedMotionHandler, ScrollSmootherManager, GelAnimationManager, LineManager, SessionManager, RulerIntroManager)
  - `config/` - Choreography config barrel + modules (`index.js`, `contracts/events.js`, `contracts/selectors.js`, `ix/*`, `displays/*`)
- `js/utils/lumberjack/` - **Note**: Uses `@datainkio/lumberjack` npm package, not local files

**Content Management**

- `data/sanity/` - Sanity integration (client, fetcher, queries)

**Build System**

- `scripts/buildCSS.js` - Tailwind CLI wrapper with logging
- `scripts/clearCache.js` - Cache management
- `scripts/clearSiteFolder.js` - Clean \_site/ directory
- `scripts/scaffold.js` - Component/page generator
- `package.json` - All npm scripts and dependencies

**Assets**

- `assets/` - Source assets (fonts, images, icons, svg, video)
- `_site/assets/` - Built assets (copied + generated)

## Nunjucks Conventions

- Prefer macros for reusable components with parameters; includes for static content only.
- Avoid `with` in includes; use macro pattern instead.
- Import paths are relative to the Eleventy includes dir, `views/` (e.g. `"atoms/icon.njk"`, `"molecules/card/card.njk"`).
- Keep each template's sibling `.md` sidecar in `views/` in sync when the template's signature, includes, or data dependencies change. Sidecars are documentation only and are not consumed by Eleventy.

Example macro:

```njk
{% macro render(params = {}) %}
  {%- set value = params.key | default('fallback') -%}
  <element>{{ value }}</element>
{% endmacro %}

{% import "atoms/component.njk" as component %}
{{ component.render({ key: "value" }) }}
```

## GSAP Choreography

**Architecture Overview**

- `AnimationDirector.js` - Master coordinator that initializes choreography systems
- `AnimationBus.js` - Event-driven coordination between sections (pub/sub pattern)
- `ScrollEffectsCoordinator.js` - Scroll smoothing, background effects, and specialized managers
- `LandingSequence.js` - Choreographs animation flow by listening to events

**Section Controllers** (in `js/choreography/sections/`)

- Each section follows pattern: `<Section>.js`, `<Section>Animations.js`, `<Section>Triggers.js`
- Active sections: `Hero`, `BackgroundVideo`, `Bio`, `Awards`, `Organizations`, `Work`
- All sections extend `AbstractSection` base class
- Sections communicate via AnimationBus events (e.g., `hero:intro:start`, `hero:intro:complete`)

**Specialized Managers** (in `js/choreography/managers/`)

- `ReducedMotionHandler` - Accessibility and motion preferences
- `ScrollSmootherManager` - GSAP smooth scrolling (optional, graceful degradation)
- `GelAnimationManager` - Gel background animations
- `LineManager` - Decorative/relational line rendering support
- `SessionManager` - Runtime session state coordination
- `RulerIntroManager` - Intro ruler display choreography

**GSAP Setup**

- Plugins registered globally: `gsap.registerPlugin(ScrollTrigger, ScrollSmoother)`
- ScrollSmoother requires: `#smooth-wrapper` and `#smooth-content` DOM elements
- Background effects require: `#overlay-view`, `#sizzle-background` elements

**Event Flow Example**

```javascript
// Section emits event when animation completes
this.bus.emit("hero:intro:complete");

// LandingSequence listens and triggers next section
this.bus.on("hero:intro:complete", () => {
  this.bus.emit("work:intro:start");
});
```

## Sanity Data Flow

**Configuration**

- Defaults are configured in `site.json` under `cms` (or `sanity`)
- Environment variables override defaults (`SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN`, `SANITY_API_VERSION`, `SANITY_USE_CDN`)

**11ty Collections**

- Collections are registered from `data/sanity/queries.js`
- Access in templates: `{{ collections.projects }}`, `{{ collections.home }}`, etc.

**Caching**

- Cache duration set globally in `site.json` (`cms.cache`) or per-query in `data/sanity/queries.js`
- Force refresh: set `SANITY_FORCE_REFRESH=true` (or `SANITY_FORCE_REFRESH_QUERY=<id>`)

## Tailwind & Styles

**Critical Import Order** (in `styles/main.css`):

1. `typography/imports.css` - Font @import statements (must be outside layers)
2. `@import 'tailwindcss' layer(base)` - Tailwind base utilities
3. `base.css` - Global resets building on Tailwind preflight
4. `colors.css` - Auto-generated Figma color tokens (theme layer)
5. `typography/fontFamilies.css` - Auto-generated font families (theme layer)
6. Component and utility styles

**Build Process**

- Tailwind v4 uses `@tailwindcss/cli` package (not `tailwindcss` binary)
- Wrapped by `scripts/buildCSS.js` for enhanced logging and analysis
- Never call Tailwind CLI directly - always use npm scripts
- Watch mode: `npm run dev:css` (continuous building)
- Production: `npm run build:css` (minified with optimization analysis)

**CSS Layers**

- Uses `@layer` directive for cascade control: `reset`, `theme`, `base`, `utilities`, `components`
- Provides optimal specificity hierarchy and performance

**Design Token Integration**

- Colors and typography auto-generated from Figma via `build:design`
- Tokens exposed as CSS custom properties (e.g., `--color-primary-500`)
- Must rebuild CSS after Figma sync: `npm run design` does both

## Logging

**Unified Logger System**

- Uses `@datainkio/lumberjack` npm package for Node.js and browser
- Consistent styling and output across all build scripts and runtime
- Import: `import logger from '@datainkio/lumberjack';` (Node) or `import lumberjack from '/assets/js/utils/lumberjack/index.js';` (browser)

**Usage Pattern**

```javascript
logger.trace(title, message, verbosity, style);
// verbosity: 'brief' | 'verbose'
// style: 'standard' | 'success' | 'error' | 'headsup' | LumberjackStyle instance
```

**Features**

- Colored output with emoji indicators
- Grouping for related operations: `logger.group(async () => { ... })`
- Script outlines: `logger.showScriptOutline(title, steps, verbosity)`
- Enable/disable: `logger.enabled = true/false`
- Custom styles: `new LumberjackStyle(color, emoji)`

## Common Code Patterns

**Accessing Sanity Data in Templates:**

```njk
{# Loop through collection #}
{% for project in collections.projects %}
  <h2>{{ project.title }}</h2>
  <p>{{ project.summary }}</p>
{% endfor %}
```

**Creating Section Controllers:**

```javascript
// 1. Add events to config/contracts/events.js
export const EVENTS = {
  custom: {
    introStart: "custom:intro:start",
    introComplete: "custom:intro:complete",
  },
};

// 2. Create section extending AbstractSection
import AbstractSection from "../abstract-section/AbstractSection.js";
import CustomAnimations from "./CustomAnimations.js";
import CustomTriggers from "./CustomTriggers.js";

export default class Custom extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById("custom");
    const animations = new CustomAnimations(view);
    const triggers = new CustomTriggers(view);

    super({
      view,
      animations,
      triggers,
      sectionKey: "custom",
      bus,
      reducedMotionHandler,
    });
  }
}

// 3. Register in system/registry.js and AnimationDirector initialization
this.sections.custom = new Custom({
  bus: this.bus,
  reducedMotionHandler: this.stage?.reducedMotion,
});
```

## Don't Do This

**Common mistakes that will cause errors:**

- ❌ Don't rely on legacy schema helpers; use Sanity collections instead
- ❌ Don't reference Splash or Approach sections unless they are added to `js/choreography/system/registry.js`
- ❌ Don't edit auto-generated files: `styles/colors.css`, `styles/typography/fontFamilies.css` - They're overwritten by `build:design`
- ❌ Don't call Tailwind CLI directly - Always use npm scripts (`npm run build:css` or `npm run dev:css`)
- ❌ Don't name sections "Biography" - The actual implementation is "Bio"
- ❌ Don't skip `build:design` before CSS builds - Tokens must exist first
- ❌ Don't reference `njk/` as the templates folder - templates moved to `views/` (Eleventy `includes`). Older paths under `njk/` no longer exist.

## Common Gotchas

- Run `build:design` before 11ty build; stale tokens break styles.
- GSAP ScrollSmoother enables only if both `#smooth-wrapper` and `#smooth-content` exist.
- Use web-optimized MP4 for background video (Safari issues with MOV).
- Asset paths in templates are `/assets/...` (site root).

## CMS Integration (local)

- Lives under `data/sanity/` (client, fetcher, queries).
- Feeds 11ty collections; treat as build-time data only.

Questions or gaps? If any workflow or directory is unclear, tell me which part and I’ll refine this guide with concrete examples from the codebase.

## Troubleshooting

- Build fails fetching Figma: Ensure `FIGMA_TOKEN` is set; run `npm run build:design`. Check `figma/services/*` logs.
- Missing styles/tokens: Verify `styles/main.css` import order (fonts → Tailwind → base → generated). Re-run `build:design`.
- Sanity data missing: Confirm `SANITY_PROJECT_ID`/`SANITY_DATASET` and check `data/sanity/queries.js`.
- GSAP animations not running: Confirm `gsap.registerPlugin(ScrollTrigger, ScrollSmoother)` and DOM IDs exist (`#smooth-wrapper`, `#smooth-content`, `#overlay-view`).
- Background video not visible: Ensure overlay-view molecule renders before choreography; use MP4 under `/assets/video/`.
- Tailwind classes missing: Use `@tailwindcss/cli` and check `tailwind.config.js`. Restart `npm start` to refresh watch processes.

## Try-It: Add a Molecule

- Create `views/molecules/<name>/<name>.njk` exporting a `render(params)` macro.
- Create a sibling `views/molecules/<name>/<name>.md` Obsidian sidecar describing the template (front matter + purpose + relationships).
- Use in a page: `{% import "molecules/<name>/<name>.njk" as m %} {{ m.render({ ... }) }}`.
- Add styles under `styles/` (respect `styles/main.css` order). If using tokens, run `npm run build:design`.
- If animated, add a section controller under `js/choreography/organisms/<name>/<Name>.js` and wire via `AnimationDirector.js` + `system/registry.js`.
- Verify DOM IDs/classes expected by controllers exist in the template.

## Hero Section Hooks

- The hero controller lives at `js/choreography/sections/hero/Hero.js`.
- Expects hero DOM container and any target elements to be present before `AnimationDirector` initialization.
- Coordinate cross-section timing via `AnimationBus` rather than direct calls.
- Keep GSAP timelines modular and avoid side effects outside the hero container.
