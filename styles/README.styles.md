# CSS Architecture & Tailwind Configuration

This directory holds the Tailwind CSS v4 configuration, Figma design-token
integration, and the visual-effects pipeline. The import order in `main.css`
matters — design tokens must be available before utilities are generated.

## Architecture Overview

This CSS system combines:

- **Tailwind CSS v4**: utilities emitted by `@import "tailwindcss"` in `main.css`
- **Build System**: compiled via `scripts/buildCSS.js` (`@tailwindcss/cli`) with logging
- **Figma Integration**: auto-generated design tokens (`colors.css`, `typography/fontFamilies.css`)
- **Custom Components**: hand-crafted visual effects and background systems
- **Import Cascade**: ordered so tokens load before the utilities/components that consume them

**Important**: keep the `main.css` import order intact. Do not add a
`@tailwind utilities` directive in any partial — v4 emits utilities once from
`@import "tailwindcss"`; re-emitting bloats the output.

## Enhanced CSS Build System

The CSS compilation process includes comprehensive logging and analysis via the `TailwindLogger` service:

### Build Transparency Features

- **Performance Metrics**: Build timing, file size analysis, and optimization recommendations
- **Configuration Analysis**: Tailwind setup validation and plugin detection
- **CSS Structure Analysis**: Import parsing, layer detection, and custom property inventory
- **Output Analysis**: Generated utility count, media query analysis, and performance warnings
- **Error Handling**: Detailed failure logging with actionable resolution steps

### Build Commands

```bash
# Production build with optimization analysis
npm run build:css

# Development build with detailed debugging
npm run build:css:dev

# Watch mode with continuous monitoring
npm run watch:css
```

### Integration Points

- **Figma Sync**: Automatically triggers CSS rebuild after design token updates
- **Development Server**: Integrated with hot reloading for instant preview
- **Performance Monitoring**: Tracks build performance and suggests optimizations

## CSS Import Architecture

**Critical**: Import order matters for proper cascade and performance:

```css
1. Typography imports    → Google Fonts & custom fonts
2. Tailwind CSS         → Utility framework foundation
3. Base styles          → HTML element defaults
4. Generated tokens     → Figma-synced colors & fonts
5. Decorative systems   → Background patterns & effects
6. Custom plugins       → Specialized functionality
```

This order ensures design tokens are available when utility classes are
generated and prevents cascade conflicts.

## File Structure & UX Impact

### Core System Files

#### `main.css` - Master Stylesheet

**What it does**: Orchestrates the complete style system through strategic
imports **UX Impact**: Single entry point ensures consistent styling across all
pages and components

#### `base.css` - HTML Foundation

**What it does**: Sets semantic HTML defaults and Tailwind v4 compatibility **UX
Impact**: Provides accessible, semantic styling that works even without utility
classes

- Typography hierarchy (h1-h6) with proper contrast and spacing
- Form element accessibility and usability standards
- Cross-browser consistency for core interactive elements

#### `colors.css` - Design System Palette

**What it does**: Figma-generated color tokens in CSS custom property format
**UX Impact**: Ensures brand consistency and enables theme flexibility

```css
--color-primary-500: #0caaeb /* Your exact Figma color */
  --color-accent-400: #ffe01f /* Automatically synchronized */;
```

#### `decorations.css` - Visual Enhancement System

**What it does**: Imports specialized background patterns and visual effects
**UX Impact**: Provides rich visual language for brand expression and user
delight

### `/typography/` - Text System Implementation

#### `imports.css` - Font Loading

**What it does**: Optimized Google Fonts imports with display:swap for
performance **UX Impact**: Fast font loading prevents layout shift and improves
perceived performance

#### `fontFamilies.css` - Typography Hierarchy

**What it does**: Maps Figma text styles to Tailwind utility classes **UX
Impact**: Enables consistent typography application across all content

```css
--font-serif:
  Cormorant Garamond, serif /* Your Figma heading font */ --font-sans: Poppins,
  sans-serif /* Your Figma body font */;
```

### `/backgrounds/` - Pattern & Texture System

**What it does**: Specialized CSS for decorative backgrounds and visual effects

- **`Graphpapers.css`** - Grid and measurement aesthetics for technical content
- **`Geometric.css`** - Abstract shapes and patterns for visual interest
- **`Overlays.css`** - Modal and interaction state styling
- **`Gel.css`** - Organic, fluid visual effects
- **`Media.css`** - Image and video presentation enhancements

**UX Impact**: Provides rich visual vocabulary for content hierarchy and brand
expression

### `/components/` - Reusable UI Patterns

**What it does**: Component-specific styling for consistent interaction patterns
**UX Impact**: Ensures UI elements behave predictably across different contexts

### `/utilities/` - Custom Functionality

**What it does**: Extends Tailwind with project-specific utilities

- **`mask.css`** - Advanced masking and clipping effects (`@utility` + `@theme`)
- **`text.css`** - Text decoration helpers (arrow affixes, word-per-line)
- **`reduced-motion.css`** - Global `prefers-reduced-motion` fallback

**UX Impact**: Enables sophisticated visual effects while maintaining
performance and honoring motion preferences

## Design System Workflow

### 1. **Figma Design Updates**

Make changes to colors, typography, or spacing in your Figma design system

### 2. **Token Synchronization**

Run `npm run build:design` to pull latest design tokens into CSS files

### 3. **Automatic Integration**

Updated tokens are immediately available as Tailwind utilities:

- `text-primary-500` uses your latest Figma primary color
- `font-serif` applies your chosen Figma heading typeface

### 4. **Live Preview**

Development server (`npm start`) shows changes instantly across all components

## Performance Benefits

- **CSS Custom Properties**: Native browser support for efficient theme
  switching
- **Optimized Font Loading**: `display:swap` prevents layout shift during font
  loading
- **Tailwind CSS 4.0**: Latest performance improvements and smaller bundle sizes
- **Strategic Imports**: Organized loading prevents render-blocking cascades

## Accessibility Features

- **Semantic HTML Defaults**: Base styles ensure accessibility even without
  utility classes
- **Color Contrast**: Design token system maintains WCAG compliance when
  properly configured in Figma
- **Typography Scale**: Readable font sizes and line heights for all content
  types
- **Focus States**: Consistent keyboard navigation styling across interactive
  elements

## Maintainability Benefits

- **Single Source of Truth**: Figma remains the authoritative design system
- **Automatic Documentation**: Generated files include metadata about design
  decisions
- **Version Tracking**: CSS files show when and from which Figma version they
  were generated
- **Separation of Concerns**: System styles, component styles, and decorative
  elements are clearly organized

This architecture ensures your design decisions translate into consistent,
accessible, performant user experiences while maintaining the flexibility to
evolve your design system over time.
