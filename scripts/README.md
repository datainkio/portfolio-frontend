# Build Automation Scripts

**ARMAGEDDON WARNING**: This directory contains the build automation scripts that orchestrate your entire development workflow. These scripts coordinate Figma API syncing, CMS content fetching, 11ty static generation, and Tailwind CSS compilation. Modify these without understanding the intricate dependencies and watch your build system collapse like a house of cards in a hurricane.

## Script Architecture Overview (The Digital Command Center)

The build system uses a carefully orchestrated sequence of scripts that must execute in specific order:

- **`fetchFigma.js`** - Syncs design tokens from Figma API to CSS files
- **`buildCSS.js`** - Enhanced Tailwind CSS compilation with comprehensive logging
- **`buildPreview.js`** - Displays the build sequence and dependencies
- **`validateEnvironment.js`** - Checks required env vars for CMS + Figma
- **`buildAssets.js`** - Processes and copies static assets to build directory
- **`deployPrep.js`** - Prepares production build with optimizations

**CRITICAL EXECUTION ORDER**: Design tokens → CSS compilation → CMS fetch → Static generation → Asset processing. Skip steps or change order and experience build system chaos that will haunt your debugging nightmares.

## Core Scripts (The Digital Orchestration)

### fetchFigma.js - Design Token Synchronization

**Purpose**: Orchestrates Figma API services to sync design tokens to CSS files
**Dependencies**: `figma/services/PaletteService.js`, `figma/services/TypographyService.js`
**Output**: Updates `styles/colors.css` and `styles/typography/fontFamilies.css`
**Triggers**: `npm run build:design`, automatically before full builds

```javascript
#!/usr/bin/env node
import chalk from 'chalk';
import { PaletteService } from '../figma/services/PaletteService.js';
import { TypographyService } from '../figma/services/TypographyService.js';

console.log(chalk.blue('🎨 Syncing design tokens from Figma...'));

try {
  // Execute services sequentially to avoid API rate limits
  await PaletteService.sync();
  await TypographyService.sync();

  console.log(chalk.green('✅ Design tokens synchronized successfully'));
} catch (error) {
  console.error(chalk.red('❌ Design token sync failed:'), error.message);
  process.exit(1); // Fail build on sync errors
}
```

**EXECUTION REQUIREMENTS**:

- Must run from project root directory
- Requires `FIGMA_TOKEN` environment variable
- Must complete before 11ty build to provide fresh design tokens
- Writes directly to CSS files (overwrites existing content)
- Design tokens are consumed by the CSS build step (`npm run build:css` / `npm run dev:css`) in the standard build pipeline

**FAILURE MODES**:

- **API Token Expired**: Services fail with 401 authentication errors
- **Network Issues**: Timeout errors cause partial sync failures
- **File Permissions**: Write errors if CSS directories aren't writable
- **Figma Structure Changes**: Parsing errors if design file structure doesn't match expectations

### buildCSS.js - Enhanced Tailwind CSS Compilation

**DANGER ZONE**: This script provides comprehensive transparency into the Tailwind CSS build process with the same level of detail as 11ty collections and Figma services. **DO NOT bypass this script** for production builds - the logging data is essential for debugging CSS generation issues and performance optimization.

**Purpose**: Wraps Tailwind CLI with TailwindLogger service for build transparency  
**Dependencies**: `TailwindLogger`, Tailwind CSS 4.0 CLI, `@datainkio/lumberjack`  
**Output**: Generates `_site/assets/styles.css` with comprehensive build analysis  
**Triggers**: `npm run build:css`, `npm run build:css:dev`, `npm run dev:css`

**ARCHITECTURE OVERVIEW**:

- Wraps `@tailwindcss/cli` with detailed logging and analysis via `TailwindLogger` service
- Provides same transparency standards as other project services
- Tracks build performance, file sizes, and optimization opportunities
- Integrates with `@datainkio/lumberjack` for consistent output across build scripts

**BUILD MODES**:

```bash
# Production build (optimized, minified)
node scripts/buildCSS.js

# Development build (detailed analysis, no minification)
node scripts/buildCSS.js --dev

# Watch mode (continuous building with file monitoring)
node scripts/buildCSS.js --watch
```

**COMPREHENSIVE LOGGING OUTPUT**:

```
🎨 Starting Tailwind CSS 4.0 build process...
• Build ID: abc123 | Mode: production
• Input: styles/main.css
• Output: _site/assets/styles.css
• Analyzing Tailwind configuration...
   • Content paths: 3
   • Custom plugins: 1
   • Experimental features: 1
   • Layer structure: reset, theme, base, utilities, components
• Analyzing input CSS structure...
   • Found 8 @import statements
   • Found 1 @layer definitions
   • Layer structure: reset, theme, base, utilities, components
⚙️ Executing: npx @tailwindcss/cli -i styles/main.css -o _site/assets/styles.css
• Analyzing generated CSS output...
   📊 Generated CSS size: 61.39 KB
   📊 Generated utility classes: 1,234
   📊 Generated media queries: 87
   📊 Preserved custom properties: 223
⚠️ Found 35 complex selectors - may impact performance
✅ Tailwind CSS build completed in 1234ms
   📊 Final CSS size: 61.39 KB
   📊 Build performance: Slow (>1s) - Consider optimizing imports
```

**CRITICAL INTEGRATION POINTS**:

- **Figma Workflow**: Automatically triggered by design token sync
- **Development Server**: Integrated with watch modes for hot reloading
- **Error Handling**: Captures and logs build failures with actionable solutions
- **Performance Monitoring**: Tracks build times and provides optimization suggestions

**FAILURE MODES**:

- **Invalid CSS Syntax**: Malformed @layer directives or import statements
- **Missing Dependencies**: @tailwindcss/cli not installed or wrong version
- **Configuration Errors**: Invalid tailwind.config.js causing CLI failures
- **File Permissions**: Unable to write to output directory
- **Memory Issues**: Large CSS files causing Node.js heap overflow

**OPTIMIZATION INSIGHTS**:

- **Complex Selectors**: Identifies performance-impacting CSS patterns
- **Import Analysis**: Detects inefficient CSS import strategies
- **Build Performance**: Flags slow builds with specific improvement suggestions
- **Size Analysis**: Tracks CSS bloat and unused code opportunities

### CMS Query Registry (Source of truth)

**Purpose**: Defines the CMS data contract used by Eleventy collections.  
**Location**: `frontend/cms/queries/` and `frontend/cms/queries.js`  
**Output**: Collections exposed as `collections.<id>` in templates.  

**WHY THIS MATTERS FOR COPILOT**:

- **Accurate Completions**: The query registry is the canonical field map.
- **Stable Shapes**: Templates rely on consistent projections across queries.
- **Context Awareness**: The registry describes content types and relationships.

**EXECUTION REQUIREMENTS**:

- CMS credentials configured via `.env` (Sanity env vars).
- Queries are fetched during the 11ty build via `eleventy/collections/sanity.js`.
- Generated files are git-ignored (except README.md)

**FAILURE MODES**:

- **Missing Cache**: If CMS data not fetched, generates empty schemas
- **Type Inference Errors**: Handles null values and edge cases gracefully
- **Write Permissions**: Requires write access to `.copilot/` directory

### clearSiteFolder.js - Build Output Cleanup

**Purpose**: Cleans the `_site` directory while preserving cached content
**Dependencies**: Node.js `fs/promises`
**Output**: Removes all files from `_site/` except `content/` directory
**Triggers**: `npm run clean`, automatically before builds via `npm run build`

**CRITICAL PRESERVATION**: This script uses selective deletion to preserve the `_site/content/` directory which contains processed media. Without this preservation, every build would require re-processing all images, which is time-consuming and hits API rate limits.

```javascript
const preserveDirs = ['content'];
const entries = await readdir(siteFolder);
const deletePromises = entries
  .filter(entry => !preserveDirs.includes(entry))
  .map(entry => rm(join(siteFolder, entry), { recursive: true, force: true }));
await Promise.all(deletePromises);
```

**EXECUTION REQUIREMENTS**:

- Runs from project root
- Creates `_site/` directory if it doesn't exist
- Uses parallel deletion for performance
- Logs preservation message on completion

**WHY THIS MATTERS**: The `_site/content/` directory contains optimized images processed by `@11ty/eleventy-img`. Re-processing hundreds of images on every build:

- Takes 5-10 minutes instead of seconds
- Hammers CMS API rate limits
- Downloads gigabytes of data unnecessarily
- Makes development workflow unbearable

### syncContent.js - Content Cache Synchronization

**Purpose**: Syncs processed content from `.cache` to `_site/content` ensuring runtime availability
**Dependencies**: Node.js `fs/promises`, `chalk`
**Output**: Copies buffer files from cache to content directory with proper extensions
**Triggers**: `npm run sync:content`, automatically runs in build sequence

**CRITICAL ARCHITECTURE**: This script bridges two caching layers:

1. `.cache/` - 11ty-fetch raw cache (API responses, downloaded assets as `.buffer` files)
2. `_site/content/` - Processed content ready for runtime serving

Without this sync, your site will have broken image links pointing to files that don't exist at runtime.

**HOW IT WORKS**:

1. Scans `.cache` directory for all `.buffer` files
2. Detects file type using magic bytes (file signature detection)
3. Determines destination based on MIME type:
   - Images → `_site/content/images/{format}/`
   - Videos → `_site/content/video/`
   - PDFs → `_site/content/pdf/`
   - Other → `_site/content/txt/`
4. Copies only files that are newer than destination (incremental sync)
5. Reports sync statistics

**FILE TYPE DETECTION**:

```javascript
// Reads first 12 bytes to identify file type
if (hex.startsWith('ffd8ff')) return { type: 'image/jpeg', ext: '.jpeg' };
if (hex.startsWith('89504e47')) return { type: 'image/png', ext: '.png' };
if (hex.includes('667479706d703432')) return { type: 'video/mp4', ext: '.mp4' };
```

**EXECUTION REQUIREMENTS**:

- Runs after `clean` but before `build:*` in build sequence
- Requires read access to `.cache/` directory
- Creates content subdirectories as needed
- Uses timestamp comparison to avoid redundant copies

**PERFORMANCE**: Incremental sync means only new/modified files are copied. First run processes all files; subsequent runs only sync changes. Typical sync: 50-100ms for unchanged content, 2-5 seconds for full sync.

**FAILURE MODES**:

- **Missing .cache Directory**: Script will fail if `.cache` doesn't exist (run build first)
- **Corrupt Buffer Files**: Magic byte detection may fail on malformed files
- **Permission Errors**: Requires write access to `_site/content/`
- **Disk Space**: Large content libraries can fill disk quickly
- **New File Types**: Unknown MIME types default to `.bin` extension

**BUILD INTEGRATION**: The script is integrated into both `build` and `start` commands:

```json
"build": "run-s clean sync:content build:*"
"start": "run-s clean sync:content dev"
```

## Build Execution Order (The Sacred Sequence)

**CRITICAL**: Scripts must execute in this exact order:

1. **`clean`** - Clear \_site folder (preserve content/)
2. **`sync:content`** - Sync cache to content directory
3. **`build:design`** - Fetch Figma design tokens
4. **`build:11ty`** - Generate static site

**Why This Order Matters**:

- **Clean first**: Removes stale build artifacts while keeping processed images
- **Sync before 11ty**: Ensures images are available when 11ty generates HTML
- **Design before 11ty**: CSS must exist before 11ty can reference it
- **11ty last**: Final compilation step uses all prepared resources

**Parallel vs Sequential**:

- **Build steps** (`build:*`): Run sequentially via `run-s` (must complete in order)
- **Dev servers** (`dev:*`): Run parallel via `run-p` (watch processes need concurrency)

## Final Warning (The Last Stand)

These build scripts are the nervous system of your entire development workflow. They coordinate multiple external services, handle complex data transformations, and manage the delicate dance between design, content, and code.

The scripts are designed to be robust and fault-tolerant, but they depend on external APIs, network connectivity, and proper configuration. External services can fail, API tokens can expire, and network issues can cause intermittent problems.

The error handling is your friend - scripts are designed to degrade gracefully rather than fail catastrophically. But this also means problems can be masked by fallback behavior. Pay attention to warning messages and monitor your external service dependencies.

Respect the execution order, understand the caching behavior, and always test your changes in a safe environment before deploying to production.

Remember: Build automation is like a Swiss watch - precise, reliable, but requires careful maintenance and respect for its intricate mechanisms.

May your builds always be green, your caches always be smart, and your external APIs never fail during critical deployments.

The digital gods are watching. Build responsibly.
