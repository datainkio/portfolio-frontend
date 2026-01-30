# dataink.io Portfolio

**DANGER ZONE**: This is not your typical portfolio site. This is a fully automated design-developer workflow with Figma API integration, CMS content, and 11ty static generation. If you're here to "quickly fix something" without understanding the architecture, you're about to experience the digital equivalent of performing surgery with a sledgehammer.

## Architecture Overview (Read This Or Suffer The Consequences)

This site uses a complex but powerful tech stack designed for automated design-to-code workflows. Each piece depends on the others in very specific ways - break one link and watch the entire chain snap:

- **11ty Static Site Generator**: Templates in `njk/` using Nunjucks (NOT Handlebars, NOT Liquid)
- **Figma API Integration**: Automatically syncs design tokens to CSS files via `figma/services/`
- **CMS Integration (Sanity-backed)**: Build-time content with caching and clear data contracts
- **Tailwind CSS v4**: Utility-first CSS using `@tailwindcss/cli` (NOT the old `tailwindcss` command - ignore this at your peril)
- **Atomic Design Pattern**: Components organized as atoms/molecules/organisms/templates in `njk/_includes/`

**ABSOLUTE CRITICAL RULE**: Never run builds without understanding dependencies. Each system relies on the others in very specific ways. Skip steps and join the debugging nightmare club.

## Quick Start (Follow This Exactly Or Face Digital Chaos)

```bash
# Step 1: ALWAYS run install first - missing npm-run-all will cause cryptic parallel execution failures
npm install

# Step 2: Full build (clean → design → 11ty) - recommended for production
npm run build

# Step 3: Development with parallel Tailwind watching + 11ty serving (requires npm-run-all)
# Step 3: Development with parallel Tailwind watching + 11ty serving (NO JS bundling)
npm run start:nobundle
```

**Repo layout + build truth**

- Frontend and backend live as sibling repos; keep their code separate. CMS integration sits in `cms/` and is isolated from the 11ty build.
- `_site/` is untracked output; every environment (local/CI/deploy) must build from source.
- For structure/placement rules see [docs/architecture.md](docs/architecture.md).

**Entrypoints**

- Docs hub: [docs/README.md](docs/README.md)
- Architecture map (AIX): [.copilot/context/architecture-map.md](.copilot/context/architecture-map.md)
- Copilot scope/authority: [.copilot/README.md](.copilot/README.md)
- Curated agent context: [.copilot/context/README.md](.copilot/context/README.md)
- Issue template: [.github/ISSUE_TEMPLATE/bug.md](.github/ISSUE_TEMPLATE/bug.md)
- Backlog: [TODO.md](dataink.io/frontend/TODO.md) · [docs/TODO.md](docs/TODO.md) · [js/TODO.md](js/TODO.md)

**BUILD PROCESS DETAILS**:

- `npm run build` sequentially runs: `clean` → `build:design` → `build:css` → `build:js` → `build:11ty`
- The clean step removes old files BUT preserves the `content/` directory (cached images/videos)
- Design tokens MUST sync before 11ty build or site will look like a 1990s disaster. Geocities, anyone?

## Available Commands

### Production Build Commands

```bash
# Full production build (clean + design + 11ty)
npm run build

# Clean _site folder (preserves content directory with cached images)
npm run clean

# Sync Figma design tokens to CSS files only
npm run build:design

# Generate static site from njk/ templates only
npm run build:11ty
```

### Development Commands

```bash
# Start development server (recommended: NO JS bundling; uses raw ESM modules)
npm run start:nobundle

# Start development server WITH JS bundling (generates assets/js/choreography/bundle.js)
npm start

# Start dev server without JS bundling (uses raw ESM modules)
npm run start:nobundle

# Run 11ty dev server only (watch and serve)
npm run dev:11ty

# Run Tailwind watch only (CSS compilation)
npm run dev:css

# Build CSS with comprehensive logging (production mode)
npm run build:css

# Build CSS with detailed development logging
npm run build:css:dev

# Skip the choreography bundle and use raw modules during dev
npm run dev:nobundle

# Watch CSS with continuous logging
npm run dev:css
```

### JS Bundling Toggle (DX helper)

- Default builds generate a single choreography bundle at [assets/js/choreography/bundle.js](assets/js/choreography/bundle.js) via [scripts/buildChoreography.js](scripts/buildChoreography.js).
- Set `BUNDLE_JS=false` (or run the shortcuts above) to skip bundling and serve the raw ESM modules from [js/choreography](js/choreography) that Eleventy passthrough-copies into [assets/js/choreography](assets/js/choreography).
- When bundling is disabled the build script deletes any stale [bundle.js](assets/js/choreography/bundle.js) so the site falls back to loading [AnimationDirector.js](js/choreography/AnimationDirector.js) directly; re-enable by removing the env var or passing `--bundle` to the script.
- Use `npm run build:nobundle` if you want a production build that deliberately avoids bundling for debugging or source-mapping in the browser.
- Direct invocation switches: `--no-bundle` / `--skip-bundle` to force raw modules, `--bundle` to override and force bundling even when `BUNDLE_JS` is false.

### Utility Commands

```bash
# Format all files with Prettier
npm run format

# Check formatting without making changes
npm run format:check

# Format only Nunjucks template files
npm run format:njk
```

### Build Execution Order

When you run `npm run build`, the following happens **sequentially**:

1. **Clean** (`npm run clean`)
   - Deletes all files in `_site/` folder
   - **Preserves** `_site/content/` directory (images, videos)
   - Prevents file duplication from previous builds

2. **Design Sync** (`npm run build:design`)
   - Fetches design tokens from Figma API
   - Writes colors to `styles/colors.css`
   - Writes typography to `styles/typography/fontFamilies.css`
   - **Automatically triggers CSS rebuild** with updated design tokens

3. **CSS Build** (`npm run build:css`)
   - Compiles Tailwind CSS with comprehensive logging
   - Analyzes input CSS structure and imports
   - Provides build metrics and optimization suggestions
   - Generates optimized CSS to `_site/assets/styles.css`

4. **11ty Build** (`npm run build:11ty`)
   - Fetches content from the CMS (Sanity-backed)
   - Processes images via `@11ty/eleventy-img`
   - Generates static HTML from Nunjucks templates
   - Outputs to `_site/` folder

**CRITICAL**: Steps run sequentially via `run-s` (npm-run-all). Each step must complete before the next begins.

**DO NOT SKIP STEP 2**: The site will compile without design tokens but will look broken. The `build:design` command fetches colors, typography, and spacing tokens from Figma and writes them to CSS files that 11ty templates depend on.

## Environment Variables (Required For External Integrations Or Everything Breaks)

Create a `.env` file with these tokens or the build will fail silently and leave you wondering why nothing works:

```env
FIGMA_TOKEN=your_figma_personal_access_token
FIGMA_FILE_ID=your_figma_file_id
SANITY_PROJECT_ID=your_sanity_project_id
SANITY_DATASET=production
```

**Get Figma Token**: Figma Account Settings → Personal Access Tokens → Generate New Token (give it Files:read scope)
**Get Figma File ID**: Figma file URL → the segment after `/file/` (e.g. `https://www.figma.com/file/<FIGMA_FILE_ID>/...`)
**Get CMS Project ID**: Sanity project settings → API → Project ID (for `SANITY_PROJECT_ID`)

**SECURITY WARNING**: These tokens provide full access to your design files and content. Treat them like nuclear launch codes.

## Design System Integration (The Most Fragile And Critical Part)

The Figma integration is **bidirectional and automated** via services in `figma/`. This means:

1. **Design tokens flow FROM Figma TO CSS files** via `scripts/fetchFigma.js`
2. **Typography settings are auto-generated** by `figma/services/TypographyService.js`
3. **Color palettes are auto-written** by `figma/services/PaletteService.js` to `styles/colors.css`
4. **Any manual edits to generated files WILL BE OVERWRITTEN** without mercy or warning

### Figma File Structure Requirements (Break This = Break Everything)

Your Figma file MUST follow these exact naming conventions or the sync will fail spectacularly:

```text
Design System Frame
├── Colors (Frame)
│   ├── Primary/Light (Color style)
│   ├── Primary/Dark (Color style)
│   └── Primary (Color style)
└── Typography (Frame)
    ├── Heading/Large (Text style)
    ├── Heading/Medium (Text style)
    └── Body/Regular (Text style)
```

BREAK THIS STRUCTURE = BREAK THE BUILD = ANGER THE DESIGN GODS

The services expect this exact hierarchy. Rename a color from "Primary/Light" to "Primary Light" and watch the system implode.

### Generated Files (ABSOLUTELY DO NOT EDIT MANUALLY)

These files are auto-generated and will be overwritten faster than you can say "git commit":

- `styles/colors.css` - CSS custom properties from Figma color tokens
- `styles/typography/fontFamilies.css` - Font family utilities from Figma text styles
- Any file with "Auto-generated" in the header comment

**Edit these manually and watch your changes vanish** the next time someone runs `npm run build:design`.

## Content Management (CMS Integration)

Content is sourced at build time via the CMS integration layer in [cms/](cms/). Configuration lives in `njk/_data/site.json` under `cms` and queries are defined in `cms/queries/`.

### Accessing Content in Templates

CMS queries register collections by id (e.g., `projects`, `awards`):

```html
{% for project in collections.projects %}
<h2>{{ project.title }}</h2>
<p>{{ project.abstract }}</p>
{% endfor %}
```

Reference:
- [cms/README.md](cms/README.md)
- [docs/sanity-integration.md](docs/sanity-integration.md)
This project includes a comprehensive logging system for Tailwind CSS builds that provides the same level of transparency as the 11ty collections and Figma services. **DO NOT bypass this system** - the detailed logging is essential for debugging CSS generation issues and performance optimization.

### TailwindLogger Service

The `eleventy/services/TailwindLogger.js` service provides:

- **Build Metrics**: File sizes, build time analysis, performance recommendations
- **CSS Analysis**: Import structure, layer organization, custom property detection
- **Optimization Insights**: Complex selector detection, performance warnings
- **Error Tracking**: Comprehensive error capture with actionable resolution steps

### Enhanced Build Scripts

The `scripts/buildCSS.js` script wraps the Tailwind CLI with detailed logging:

```bash
# Production build with optimization analysis
npm run build:css

# Development build with detailed debugging
npm run build:css:dev

# Watch mode with continuous file monitoring
npm run dev:css
```

### Build Output Example

```
🎨 Starting Tailwind CSS 4.0 build process...
• Build ID: abc123 | Mode: production
• Input: styles/main.css
• Output: _site/assets/styles.css
• Analyzing Tailwind configuration...
   • Content paths: 3
   • Custom plugins: 1
   • Layer structure: reset, theme, base, utilities, components
• Generated CSS size: 61.39 KB
• Build performance: 1234ms
✅ Tailwind CSS build completed
```

**INTEGRATION POINTS**:

- Automatically triggered by Figma design token sync (`npm run build:design`)
- Integrated with development watch modes for hot reloading
- Provides same logging standards as other project services

## File Organization (Touch The Wrong Thing = Break Everything)

```text
portfolio/
├── njk/                          # 11ty source templates (NOT _src, NOT src)
│   ├── _data/site.json          # Site config + CMS settings (CRITICAL)
│   ├── _includes/               # Atomic design components
│   │   ├── atoms/               # Smallest UI elements (buttons, icons)
│   │   ├── molecules/           # Component combinations (cards, forms)
│   │   ├── organisms/           # Complex UI sections (headers, footers)
│   │   └── templates/           # Page layout templates
│   └── _pages/                  # Page templates → site URLs
├── styles/                      # CSS architecture (import order matters)
│   ├── main.css                # Master CSS file with CRITICAL import order
│   ├── colors.css              # AUTO-GENERATED from Figma (DO NOT EDIT)
│   ├── typography/             # Font files + AUTO-GENERATED styles
│   └── backgrounds/            # Background effect systems
├── js/                         # Client-side JavaScript modules (ES6)
│   ├── effects/                # GSAP animations and effects
│   ├── displays/               # Interactive display components
│   └── utils/                  # Theme and utility functions
├── assets/                     # Static files copied to _site/assets/
├── figma/                      # Figma API integration services
│   └── services/               # PaletteService.js, TypographyService.js
├── scripts/                    # Build automation scripts
│   ├── buildCSS.js            # Enhanced Tailwind CSS build with logging
│   └── fetchFigma.js          # Design token sync (triggers CSS rebuild)
├── eleventy/                   # 11ty configuration and collections
│   ├── filters/               # Nunjucks filters (string, array, date, etc.)
│   ├── shortcodes/            # Reusable template functions
│   ├── collections/           # Content collection definitions
│   └── services/              # Build-time services (NavigationBuilder, etc.)
├── cms/                        # CMS integration (client + queries)
│   ├── client.js              # CMS client + config
│   └── queries/               # Query definitions
└── _site/                      # BUILD OUTPUT - never edit directly
```

**DO NOT REORGANIZE** this structure without updating all the import paths, build scripts, and 11ty configuration.

## Development Workflow (The Safe Path To Avoid Disaster)

### Making Design Changes

1. **Edit in Figma** (colors, typography, spacing) - ONLY source of truth
2. **Run `npm run build:design`** to sync changes via API services
3. **Run `npm run build:11ty`** to regenerate site with new tokens
4. **Never edit generated CSS files directly** - they will be overwritten

### Making Content Changes

1. **Edit in CMS** (add/modify content) - ONLY content source
2. **Wait for cache expiration** OR delete `.cache` folder to force refresh
3. **Run `npm run build:11ty`** to fetch fresh content via `@11ty/eleventy-fetch`

### Making Template Changes

1. **Edit Nunjucks templates** in `njk/` (NOT Handlebars, NOT Liquid)
2. **Follow atomic design patterns** (atoms → molecules → organisms → templates)
3. **Test with `npm start`** for parallel Tailwind watching + 11ty serving
4. **Use ES modules syntax** for all JavaScript (`import`/`export`)

## Common Failure Points (Learn From Others' Digital Pain)

### "Site looks broken/unstyled"

- **Cause**: Skipped `npm run build:design` step
- **Fix**: Run design build before 11ty build
- **Prevention**: Always run full build sequence

### "Colors/fonts not updating"

- **Cause**: Figma token structure changed or API token expired
- **Fix**: Check Figma file structure, verify token in `.env`
- **Prevention**: Don't rename Figma color/text styles without updating sync logic

### "Content not showing"

- **Cause**: CMS project/dataset not configured in `.env` or `site.json`
- **Fix**: Verify `SANITY_PROJECT_ID` and `SANITY_DATASET`
- **Prevention**: Keep `.env` in sync with `njk/_data/site.json`

### "Build fails with module errors"

- **Cause**: Missing `npm install` or outdated dependencies
- **Fix**: Delete `node_modules`, run fresh `npm install`
- **Prevention**: Always run install on fresh clone

### "CSS not compiling"

- **Cause**: Wrong Tailwind version or import order in `main.css`
- **Fix**: Verify Tailwind CSS v4 installation and import sequence
- **Prevention**: Don't rearrange CSS imports without understanding cascade

## Advanced Configuration

### Adding New CMS Queries

1. Add a query file under `cms/queries/`
2. Export it via `cms/queries.js`
3. Access in templates via `collections.<id>`

### Adding New Background Effects

1. Create CSS file in `styles/backgrounds`
2. Import in `styles/decorations.css` BEFORE `@tailwind utilities`
3. Follow existing patterns for CSS custom properties

### Custom JavaScript Modules

1. Create modules in `js/` with ES6 import/export
2. Import in templates using `/assets/js/` paths (absolute from site root)
3. Follow existing module patterns in `js/effects/` and `js/displays/`

## Deployment

The build generates a static site in `_site/` that can be deployed anywhere:

```bash
# Full production build (clean + design + 11ty)
npm run build
```

**What Gets Deployed**: The entire `_site/` folder contains your static site.

**What's Preserved**: The `content/` directory within `_site/` is preserved during clean operations to avoid re-processing cached media.

**Deployment Targets**: Deploy the `_site/` folder to any static hosting platform:

- Netlify, Vercel, GitHub Pages, Cloudflare Pages
- AWS S3 + CloudFront, Google Cloud Storage
- Any static file server

The site is fully static with no server-side requirements or runtime dependencies.

## Documentation & Resources

Comprehensive documentation is available in the `docs/` and individual README files:

- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - Complete AI agent context (50+ workflows, patterns, gotchas)
- **[docs/DOCUMENTATION_INDEX.md](docs/DOCUMENTATION_INDEX.md)** - Documentation navigation hub
- **[njk/README.md](njk/README.md)** - Nunjucks/11ty templates and atomic design
- **[eleventy/README.md](eleventy/README.md)** - 11ty configuration overview
- **[eleventy/filters/README.md](eleventy/filters/README.md)** - Complete filter reference (23+ filters)
- **[eleventy/shortcodes/README.md](eleventy/shortcodes/README.md)** - Shortcode API
- **[js/choreography/README.md](js/choreography/README.md)** - Animation system architecture
- **[js/choreography/sections/README.md](js/choreography/sections/README.md)** - Section controllers (Hero, BackgroundVideo, Bio, Organizations)
- **[js/effects/README.md](js/effects/README.md)** - GSAP effects library
- **[figma/README.md](figma/README.md)** - Figma API integration
- **[cms/README.md](cms/README.md)** - CMS integration

For quick reference, see:

- **Common mistakes to avoid**: [.github/copilot-instructions.md#dont-do-this](.github/copilot-instructions.md#dont-do-this)
- **Build troubleshooting**: [.github/copilot-instructions.md#troubleshooting](.github/copilot-instructions.md#troubleshooting)
- **All npm scripts explained**: [.github/copilot-instructions.md#core-workflows](.github/copilot-instructions.md#core-workflows)
