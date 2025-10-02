<!-- @format -->

# Build Automation & Development Tools

This directory contains the **build orchestration scripts** that automate the
design-to-development workflow. These tools handle Figma syncing, cache
management, environment setup, and build optimization.

## What These Scripts Enable for UX

The scripts system serves as the **automation layer** that:

- **Eliminates manual tasks** - Design token updates, cache clearing,
  environment setup happen automatically
- **Ensures consistency** - Every build follows the same reliable process
- **Provides visibility** - Clear feedback about what's happening during builds
- **Speeds up development** - Smart caching and optimization reduce wait times
- **Prevents errors** - Automated validation catches issues before they reach
  users

## Build Workflow Overview

```
Design Updates (Figma) → Sync Design Tokens → Build Site → Optimize Output → Deploy
```

Each script plays a specific role in this pipeline, working together to
transform design decisions into optimized user experiences.

## Core Build Scripts

### `fetchFigma.js` - Design System Synchronization

**What it does**: Pulls your latest Figma design tokens and writes them to CSS
files **When to use**: After making color or typography changes in Figma **UX
Impact**: Ensures website always reflects your current design decisions

**Workflow:**

1. Connects to Figma API using secure token
2. Retrieves design file metadata and version
3. Extracts color styles and typography definitions
4. Writes CSS files to `styles/` directory
5. Logs changes for transparency

**Run command:**

```bash
npm run build:design
```

**Visual Feedback:**

```
🎨 FIGMA
──────────────────────────────────────────────────
📄 dataink.io (2/12/2025, 1:40:00 PM)
   processing the color palette...
   processing font imports...
   processing font families...
✨ Palette file written successfully
```

**What gets updated:**

- `styles/colors.css` - Complete color palette
- `styles/typography/fontFamilies.css` - Font stack definitions
- `styles/typography/imports.css` - Google Fonts imports
- `styles/typography/fontWeights.css` - Weight variations

### `clearCache.js` - Cache Reset

**What it does**: Removes cached Airtable data and processed images **When to
use**: When content updates aren't showing up, or for fresh builds **UX
Impact**: Ensures latest content appears without stale data

**Run command:**

```bash
node scripts/clearCache.js
```

**Output:**

```
✓ Cache cleared
```

**What gets cleared:**

- `.cache/` folder containing Airtable data
- Image processing cache
- API response cache

**When you need this:**

- Content changed in Airtable but not appearing
- Images updated but showing old versions
- Testing with fresh data
- Troubleshooting build issues

### `clearSiteFolder.js` - Build Output Reset

**What it does**: Removes the entire `_site/` build output folder **When to
use**: For completely fresh builds or when cleaning up old files **UX Impact**:
Removes orphaned files that could cause confusion

**Run command:**

```bash
node scripts/clearSiteFolder.js
```

**Output:**

```
_site folder cleared.
```

**What gets removed:**

- All generated HTML files
- Processed images and assets
- Compiled CSS and JavaScript
- Static file copies

## Development Information Scripts

### `display11tyInfo.js` - Static Site Generator Info

**What it does**: Shows 11ty configuration and version information **When to
use**: Verifying setup or troubleshooting configuration issues **UX Impact**:
Provides transparency about build environment

**Run command:**

```bash
node scripts/display11tyInfo.js
```

**Example Output:**

```
🚀 11ty
──────────────────────────────────────────────────
  Versions
   Eleventy: 3.0.0
   Node: v18.16.0

  Configuration
   Input: njk
   Output: _site
   Includes: _includes
   Data: _data

  Template Engines
   Markdown: njk
   HTML: njk
   Data: njk
```

### `displayEnvironmentInfo.js` - Environment Configuration

**What it does**: Shows environment variables and API connection status **When
to use**: Debugging API connections or verifying configuration **UX Impact**:
Helps diagnose why content or design tokens aren't syncing

### `displayTailwindInfo.js` - CSS Framework Status

**What it does**: Shows Tailwind CSS version and configuration **When to use**:
Verifying design system integration **UX Impact**: Ensures utility classes match
design expectations

## Utility Scripts

### `buildDirectoryNav.js` - Navigation Structure Generation

**What it does**: Analyzes directory structure and generates navigation data
**When to use**: Automatically during builds to create site navigation **UX
Impact**: Ensures consistent, hierarchical navigation across the site

**What it generates:**

- Primary navigation menu structure
- Breadcrumb trails
- Sitemap data
- Directory-based routing

### `colorUtils.js` - Color Manipulation Library

**What it does**: Provides color conversion and blending utilities **When to
use**: Called by other scripts for color processing **UX Impact**: Enables
sophisticated color relationships in design system

**Capabilities:**

- Hex to RGB conversion
- RGB to Hex conversion
- Multiply blend mode for color mixing
- Color manipulation for theme generation

### `logDirectoryStructure.js` - Project Structure Documentation

**What it does**: Creates visual representation of project file structure **When
to use**: Documenting project organization or onboarding new team members **UX
Impact**: Helps team understand project architecture

## Initialization Scripts

### `init.js` - Project Setup Orchestrator

**What it does**: Runs all initialization scripts in proper sequence **When to
use**: First time project setup or after cloning repository **UX Impact**:
Ensures development environment is properly configured

### `init11ty.js` - 11ty Environment Setup

**What it does**: Configures 11ty specific settings and dependencies **When to
use**: Initial setup or when 11ty configuration changes

### `initTailwind.js` - Tailwind CSS Setup

**What it does**: Configures Tailwind CSS with design tokens from Figma **When
to use**: Initial setup or when design system structure changes

## Common Workflows for UX Teams

### Starting Fresh Development

```bash
npm install                 # Install dependencies
npm run build:design        # Sync latest Figma tokens
npm start                   # Start development server
```

### After Design Updates in Figma

```bash
npm run build:design        # Pull new design tokens
# Development server auto-reloads with changes
```

### Content Not Updating?

```bash
node scripts/clearCache.js  # Clear cached Airtable data
npm run build:11ty          # Rebuild site with fresh content
```

### Complete Fresh Build

```bash
node scripts/clearCache.js      # Clear all caches
node scripts/clearSiteFolder.js # Remove old build
npm run build                   # Full rebuild from scratch
```

### Troubleshooting Build Issues

```bash
node scripts/display11tyInfo.js        # Check 11ty config
node scripts/displayEnvironmentInfo.js # Verify API connections
node scripts/displayTailwindInfo.js    # Check CSS framework
```

## Build Performance Tips

### Smart Caching

Scripts use intelligent caching to speed up builds:

- **Design tokens**: Cached until Figma file changes
- **Airtable data**: Configurable cache duration per table
- **Images**: Processed once, reused across builds

### When to Clear Cache

- **Always**: After making Airtable content changes you want to see immediately
- **Sometimes**: After Figma updates (if design tokens don't auto-refresh)
- **Rarely**: After changing environment configuration

### Optimizing Build Times

1. **Use longer cache durations** for stable content tables
2. **Keep design tokens cached** unless actively updating design system
3. **Only clear cache when needed** to preserve processing work
4. **Use development server** (`npm start`) for live reloading

## Script Conventions

All scripts follow consistent patterns:

### Visual Feedback

Scripts use colored console output with icons:

- 🎨 Figma operations
- 📦 Content operations
- 🚀 Build operations
- ✓ Success messages
- ✗ Error messages

### Error Handling

Scripts catch errors gracefully and provide actionable messages:

```
✗ Error fetching design file: Invalid Figma token
  → Check FIGMA_TOKEN in .env file
```

### Progress Tracking

Long-running operations show progress:

```
🖼️  Processing Images |████████░░| 80% | 80/100 Images
```

This automation layer ensures your design decisions and content updates flow
smoothly from creation tools into optimized user experiences, while providing
transparency and control over the build process.
