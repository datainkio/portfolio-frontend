# Build Automation Scripts

**ARMAGEDDON WARNING**: This directory contains the build automation scripts that orchestrate your entire development workflow. These scripts coordinate Figma API syncing, Airtable content fetching, 11ty static generation, and Tailwind CSS compilation. Modify these without understanding the intricate dependencies and watch your build system collapse like a house of cards in a hurricane.

## Script Architecture Overview (The Digital Command Center)

The build system uses a carefully orchestrated sequence of scripts that must execute in specific order:

- **`fetchFigma.js`** - Syncs design tokens from Figma API to CSS files
- **`fetchAirtable.js`** - Syncs content from Airtable API for 11ty collections
- **`buildAssets.js`** - Processes and copies static assets to build directory
- **`deployPrep.js`** - Prepares production build with optimizations

**CRITICAL EXECUTION ORDER**: Design tokens → Content sync → Static generation → Asset processing. Skip steps or change order and experience build system chaos that will haunt your debugging nightmares.

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

**FAILURE MODES**:

- **API Token Expired**: Services fail with 401 authentication errors
- **Network Issues**: Timeout errors cause partial sync failures
- **File Permissions**: Write errors if CSS directories aren't writable
- **Figma Structure Changes**: Parsing errors if design file structure doesn't match expectations

## Final Warning (The Last Stand)

These build scripts are the nervous system of your entire development workflow. They coordinate multiple external services, handle complex data transformations, and manage the delicate dance between design, content, and code.

The scripts are designed to be robust and fault-tolerant, but they depend on external APIs, network connectivity, and proper configuration. External services can fail, API tokens can expire, and network issues can cause intermittent problems.

The error handling is your friend - scripts are designed to degrade gracefully rather than fail catastrophically. But this also means problems can be masked by fallback behavior. Pay attention to warning messages and monitor your external service dependencies.

Respect the execution order, understand the caching behavior, and always test your changes in a safe environment before deploying to production.

Remember: Build automation is like a Swiss watch - precise, reliable, but requires careful maintenance and respect for its intricate mechanisms.

May your builds always be green, your caches always be smart, and your external APIs never fail during critical deployments.

The digital gods are watching. Build responsibly.
