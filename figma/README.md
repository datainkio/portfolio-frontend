<!-- @format -->

# Figma Design System Integration for UX Designers

This directory contains the **design-to-code automation system** that keeps your
Figma design decisions synchronized with the live website. It eliminates the
traditional handoff friction by automatically translating design tokens into
production-ready code.

## What This System Does for UX

The Figma integration serves as a **bidirectional design system bridge**:

- **Preserves design intent** - Your color and typography decisions in Figma
  become the actual website styles
- **Maintains consistency** - No more "it looks different in production"
  problems
- **Enables rapid iteration** - Update colors or fonts in Figma, rebuild, and
  see changes instantly
- **Reduces design debt** - The live site always reflects your latest design
  decisions

## How the Design-to-Code Pipeline Works

```javascript
1. Figma File → 2. Extract Tokens → 3. Generate CSS → 4. Website Updates
```

### 1. Design File Analysis

The system reads your Figma file and identifies:

- **Color styles** - All named color tokens in your palette
- **Text styles** - Typography scales, font families, and weights
- **Design metadata** - File version, last modified date, naming conventions

### 2. Token Extraction

Design tokens are automatically categorized and processed:

- Colors become CSS custom properties with semantic naming
- Typography generates font imports and Tailwind utility classes
- Spacing and sizing tokens (future enhancement)

### 3. CSS Generation

Outputs production-ready stylesheets:

- `styles/colors.css` - Complete color palette with design system naming
- `styles/typography/` - Font imports, families, weights, and sizes
- Full compatibility with Tailwind CSS utility classes

## Directory Structure

### `/services/` - Core Design Processing

**What it does**: Transforms Figma API data into usable design tokens

- **`PaletteService.js`** - Processes color styles into organized CSS custom
  properties
- **`TypographyService.js`** - Handles font families, weights, imports, and
  Google Fonts integration
- **`FileService.js`** - Manages Figma file retrieval and metadata
- **`StyleService.js`** - Extracts detailed style information from design tokens

**UX Impact**: Ensures your design decisions translate accurately into code

### `/models/` - Design System Structure

**What it does**: Represents Figma design data in a structured format for
processing

- **`DesignFile.js`** - Complete design file representation with metadata and
  logging
- **`fills/`** - Color and gradient models
- **`text/`** - Typography style models

**UX Impact**: Maintains the relationship between design intent and technical
implementation

### `/views/` - Output Generation

**What it does**: Creates the actual CSS files that power the website

#### `/tailwind/` - CSS Framework Integration

- **`PaletteFile.js`** - Generates color CSS with design system naming
- **`FontImportsFile.js`** - Creates Google Fonts and custom font imports
- **`FontFamilyFile.js`** - Defines font family utility classes
- **`FontWeightFile.js`** - Sets up font weight variations

#### `/eleventy/` - Template Integration

- Components for integrating design tokens into 11ty templates

**UX Impact**: Ensures design tokens are consistently available across all
website components

### `/api/` - Figma Connection

**What it does**: Handles secure communication with Figma's API

**UX Impact**: Enables real-time design system updates without manual code
changes

## Design System Requirements

For optimal results, organize your Figma file with clear naming conventions:

### Color Organization

```
Colors/
├── Primary/
│   ├── primary-50
│   ├── primary-100
│   └── primary-500
├── Secondary/
└── Neutrals/
```

### Typography Structure

```
Text Styles/
├── Display/
│   ├── display-lg
│   └── display-md
├── Heading/
└── Body/
```

## UX Designer Workflow

### 1. **Design in Figma**

Create and refine your color palette and typography system using Figma's style
management

### 2. **Sync to Code**

Run `npm run build:design` to pull your latest design decisions into the
codebase

### 3. **Preview Changes**

Start development server (`npm start`) to see your design tokens applied across
the entire site

### 4. **Iterate Confidently**

Make adjustments in Figma knowing they'll be reflected accurately in the final
product

## Benefits for Design-Developer Collaboration

- **Single source of truth** - Figma styles become the authoritative design
  system
- **Automatic documentation** - CSS files include metadata about design
  decisions
- **Version tracking** - Changes are logged with timestamps and design file
  versions
- **Reduced communication overhead** - No more "what's the exact hex value?"
  conversations
- **Consistent implementation** - Developers can't accidentally use off-brand
  colors or fonts

This system transforms design handoffs from a potential friction point into a
seamless, automated process that preserves your UX intentions throughout the
development lifecycle.
