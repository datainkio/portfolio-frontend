# Build Automation Scripts

Node.js scripts that coordinate Figma design token sync, JS bundling, Tailwind CSS compilation, 11ty static generation, and various development utilities.

## Build Execution Order

The full production build runs: `clean → build:design → build:css → build:js → build:11ty`

```
npm run build
# Expands to: run-s clean build:design build:css build:js build:11ty
```

**Why this order matters:**

- `clean` removes stale artifacts from `_site/` (preserves `_site/content/`)
- `build:design` generates `styles/colors.css` and `styles/typography/fontFamilies.css` from Figma — must exist before CSS compilation
- `build:css` compiles Tailwind using the generated design tokens
- `build:js` bundles `js/choreography/AnimationDirector.js` via esbuild into `assets/js/choreography/bundle.js`
- `build:11ty` runs Eleventy last, using all prepared assets and fetching Sanity data at build time

**Parallel vs sequential:**

- Build steps run sequentially via `run-s`
- Dev servers (`dev:css`, `dev:11ty`, `dev:js`) run in parallel via `run-p`
- Dev workflows pre-build CSS before launching parallel watchers to prevent a double 11ty build on startup

## Core Build Scripts

### `fetchFigma.js`

**Triggered by**: `npm run build:design`

Calls `figma/services/PaletteService` and `figma/services/TypographyService` to fetch design tokens from the Figma API and write them to:

- `styles/colors.css` — CSS custom properties for colors
- `styles/typography/fontFamilies.css` — font-family declarations

Requires `FIGMA_TOKEN` and `FIGMA_FILE_ID` environment variables. Both output files are auto-generated and must not be edited manually.

---

### `buildCSS.js`

**Triggered by**: `npm run build:css` (minified), `npm run build:css:dev` (unminified, one-shot), `npm run dev:css` (watch)

Wraps `@tailwindcss/cli` with logging via `@datainkio/lumberjack`. Reads `styles/main.css`, outputs to `_site/assets/styles.css`.

```bash
node scripts/buildCSS.js           # development build
node scripts/buildCSS.js --minify  # production build (minified)
node scripts/buildCSS.js --watch   # watch mode
```

Do not call Tailwind CLI directly — always use this wrapper via npm scripts.

On macOS, if FSEvents drops watch events under heavy file churn, the script auto-restarts the Tailwind watcher (up to 8 times).

---

### `buildChoreography.js`

**Triggered by**: `npm run build:js` (one-off), `npm run dev:js` (watch)

Bundles `js/choreography/AnimationDirector.js` and its dependencies into a single ESM file at `assets/js/choreography/bundle.js` using esbuild.

```bash
node scripts/buildChoreography.js           # bundle once
node scripts/buildChoreography.js --watch   # watch mode
node scripts/buildChoreography.js --no-bundle  # skip bundling (use raw ESM passthrough)
```

Setting `BUNDLE_JS=false` or passing `--no-bundle` skips bundling — Eleventy serves the raw source files instead. The bundle is a build artifact and is git-ignored.

---

### `clearSiteFolder.js`

**Triggered by**: `npm run clean`, `npm run clean:debug`

Deletes the contents of `_site/` while preserving the `_site/content/` directory. That directory holds optimized images produced by `@11ty/eleventy-img`; deleting it forces a full re-download and re-processing on the next build.

---

### `syncContent.js`

**Triggered by**: `npm run sync:content`

Syncs `.buffer` files from `.cache/` (11ty-fetch cache) into `_site/content/` with proper file extensions, using magic-byte detection to identify file types. Only copies files newer than the destination (incremental sync).

Note: `syncContent.js` is no longer wired into the default `build` or `start` commands. Run it manually if content cache state needs to be reconciled.

---

### `buildPreview.js`

**Triggered by**: `npm run build:preview`, `npm run build:preview:dev`, `npm run build:preview:verbose`

Displays a structured outline of the build process steps using `logger.showScriptOutline()`. Does not execute any build steps — informational only.

---

## Utility Scripts

### `scaffold.js`

**Triggered by**: `npm run scaffold:component`, `npm run scaffold:page`, `npm run scaffold:list`

Generates component and page templates following atomic design conventions. Outputs to `njk/` with proper frontmatter and integration hooks.

---

### `exportDiagrams.js`

**Triggered by**: `npm run diagrams:export`, `npm run diagrams:export:onboarding`, `npm run diagrams:export:choreography`

Finds `.mmd` files in the project and renders them to SVG using the `mmdc` CLI. Target directory can be scoped with `--dir`.

---

### `diagrams/exportStoryboards.js`

**Triggered by**: `npm run diagrams:export:storyboards`, `npm run diagrams:watch:storyboards`

Extracts fenced Mermaid code blocks from Markdown files in `njk/_pages/storyboards/` and renders each block to an SVG in `assets/storyboards/`.

---

### `clearCache.js`

Deletes the `.cache/` directory. Not wired to an npm script by default — run directly when a full cache bust is needed:

```bash
node scripts/clearCache.js
```

---

### `colorUtils.js`

Shared color math utilities (hex/RGB conversion, multiply blend) used by Figma services. Not a runnable script.

---

### `logDirectoryStructure.js`

Recursively scans a directory and writes a JSON representation of its structure to `logs/structure.json`. Used ad-hoc for debugging directory layout.

---

## Initialization & Display Scripts

These scripts display diagnostic information and are composed by `init.js`. They are not part of the core build pipeline.

| Script                      | Purpose                                                                                 |
| --------------------------- | --------------------------------------------------------------------------------------- |
| `init.js`                   | Orchestrates startup display: environment → Tailwind info → 11ty info                   |
| `init11ty.js`               | Prints 11ty initialization status to console                                            |
| `initTailwind.js`           | Legacy Tailwind initialization display (references old path; not used in current build) |
| `display11tyInfo.js`        | Prints 11ty version details                                                             |
| `displayTailwindInfo.js`    | Prints Tailwind version details                                                         |
| `displayEnvironmentInfo.js` | Validates and displays environment variable configuration                               |

---

## Validation & Health Scripts

| Script                    | npm script             | Purpose                                                                                          |
| ------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------ |
| `validateEnvironment.js`  | `npm run validate:env` | Checks required env vars (`FIGMA_TOKEN`, `FIGMA_FILE_ID`, `SANITY_PROJECT_ID`, `SANITY_DATASET`) |
| `validateProjectSetup.js` | —                      | Stub; not yet implemented                                                                        |
| `systemCheck.js`          | `npm run doctor`       | Full system health check: env vars, file system, network, tool versions, cache state             |

---

## Developer Convenience Scripts

| Script                      | npm script              | Purpose                                                       |
| --------------------------- | ----------------------- | ------------------------------------------------------------- |
| `showAvailableWorkflows.js` | `npm run help`          | Lists all npm scripts grouped by category                     |
| `quickRef.js`               | `npm run ref`           | Prints a short cheatsheet of the most common commands         |
| `install-git-hooks.mjs`     | `npm run hooks:install` | Sets `core.hooksPath` to `.githooks/` in the local git config |

---

## Deprecated / Stale Scripts

| Script                      | Status     | Notes                                                                                  |
| --------------------------- | ---------- | -------------------------------------------------------------------------------------- |
| `generateAirtableSchema.js` | Deprecated | Prints a deprecation message. CMS contracts live in `data/sanity/queries.js`           |
| `buildDirectoryNav.js`      | Stale      | References `src/content` and `dist/collection.json` which do not exist in this project |
