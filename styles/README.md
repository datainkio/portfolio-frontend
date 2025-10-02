<!-- @format -->

# CSS Architecture & Design System Implementation

This directory contains the **design system implementation layer** where your
Figma design tokens become live, interactive styles. The architecture
prioritizes maintainability, performance, and design-developer workflow
automation.

## What This CSS Architecture Enables for UX

The styles system serves as the **design-to-browser translation layer**:

- **Design token consistency** - Your Figma colors and typography automatically
  become CSS custom properties
- **Component-based styling** - Reusable patterns that ensure consistent user
  experiences
- **Performance optimization** - Organized imports and Tailwind CSS 4.0
  integration for fast loading
- **Scalable design systems** - Structured approach that grows with your design
  requirements

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
--font-serif: Cormorant Garamond,
  serif /* Your Figma heading font */ --font-sans: Poppins,
  sans-serif /* Your Figma body font */;
```

### `/backgrounds/` - Pattern & Texture System

**What it does**: Specialized CSS for decorative backgrounds and visual effects

- **`Graphpapers.css`** - Grid and measurement aesthetics for technical content
- **`PrintMarks.css`** - Professional print industry visual elements
- **`Geometric.css`** - Abstract shapes and patterns for visual interest
- **`Overlays.css`** - Modal and interaction state styling
- **`Gel.css`** - Organic, fluid visual effects
- **`Media.css`** - Image and video presentation enhancements

**UX Impact**: Provides rich visual vocabulary for content hierarchy and brand
expression

### `/components/` - Reusable UI Patterns

**What it does**: Component-specific styling for consistent interaction patterns
**UX Impact**: Ensures UI elements behave predictably across different contexts

### `/plugins/` - Custom Functionality

**What it does**: Extends Tailwind with project-specific utilities

- **`mask.css`** - Advanced masking and clipping effects

**UX Impact**: Enables sophisticated visual effects while maintaining
performance

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
