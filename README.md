<!-- @format -->

# dataink.io Portfolio

A design-first portfolio website with automated Figma design system integration and Airtable CMS. Built with 11ty, Tailwind CSS 4.0, and modern JavaScript for a streamlined design-to-development workflow.

## 🎯 Architecture Overview

This project prioritizes **design system automation** and **content flexibility**:

- **11ty (Eleventy)** - Static site generator with Nunjucks templates
- **Figma API** - Automated design token synchronization
- **Airtable** - Headless CMS with smart caching
- **Tailwind CSS 4.0** - Utility-first CSS with design tokens
- **Atomic Design** - Component hierarchy (atoms → molecules → organisms → templates)
- **GSAP** - Advanced animations and interactions

## 🚀 Quick Start

```bash
# Install dependencies (REQUIRED - includes npm-run-all)
npm install

# Sync Figma design tokens (colors, typography)
npm run build:design

# Build the site
npm run build:11ty

# Development server (Tailwind watch + 11ty serve)
npm start
```

**⚠️ Important**: Always run `npm install` first on a fresh clone. The build process requires `build:design` to run before `build:11ty` to sync the latest design tokens.

## 📁 Project Structure

```
portfolio/
├── njk/                    # Nunjucks templates (source)
│   ├── _data/             # 11ty data files
│   ├── _includes/         # Reusable components (atomic design)
│   └── _pages/            # Page templates → site URLs
├── figma/                 # Figma API integration
│   ├── api/              # Figma REST API client
│   ├── services/         # Token sync services
│   └── models/           # Data models
├── airtable/             # Airtable CMS integration
│   └── scripts/          # Content sync and processing
├── eleventy/             # 11ty configuration
│   ├── collections/      # Content collections
│   ├── filters/          # Template filters
│   └── plugins/          # 11ty plugins
├── styles/               # CSS (source + generated)
│   ├── colors.css        # Generated from Figma
│   └── typography/       # Generated from Figma
├── js/                   # Client-side JavaScript
│   ├── effects/          # GSAP animations
│   └── displays/         # Interactive components
├── scripts/              # Build automation
└── _site/                # Build output (ignored by git)
```

## 📚 Documentation

Each major directory has detailed documentation:

- **[`js/README.md`](js/README.md)** - Client-side JavaScript architecture and animation system
- **[`eleventy/README.md`](eleventy/README.md)** - Build system, collections, filters, and plugins
- **[`figma/README.md`](figma/README.md)** - Design token automation and Figma integration
- **[`styles/README.md`](styles/README.md)** - CSS architecture and Tailwind configuration
- **[`njk/README.md`](njk/README.md)** - Template structure and atomic design patterns
- **[`airtable/README.md`](airtable/README.md)** - CMS integration and content caching
- **[`scripts/README.md`](scripts/README.md)** - Build automation and CLI tools
- **[`.github/copilot-instructions.md`](.github/copilot-instructions.md)** - AI coding agent guidance

## 🎨 Design System Integration

### Figma → CSS Workflow

The design system is **bidirectional and automated**:

1. **Designer** updates colors/typography in Figma
2. **Build script** runs `npm run build:design`
3. **Figma API** fetches design tokens
4. **Services** write CSS files to `styles/`
5. **Tailwind** compiles with new tokens
6. **11ty** generates site with updated styles

### Token Structure

Design tokens in Figma must follow these naming conventions:

**Colors:**
- `palette/[name]/[shade]` → CSS custom properties

**Typography:**
- Font Family: `display`, `serif`, `sans`
- Font Size: `9xl`, `8xl`, ..., `base`, `sm`, `xs`
- Line Height: `none`, `snug`, `normal`, `relaxed`, `loose`

## 💾 Content Management

### Airtable CMS

Configuration in `njk/_data/site.json`:

```json
{
  "airtables": [
    {
      "tableName": "Projects",
      "tableView": "Published",
      "cache": "1d"
    }
  ]
}
```

Each table becomes an 11ty collection with smart caching to prevent API rate limits.

## 🛠️ Development

### Available Scripts

```bash
npm start              # Parallel: Tailwind watch + 11ty serve
npm run build         # Full production build (design + 11ty)
npm run build:design  # Sync Figma design tokens only
npm run build:11ty    # Build 11ty site only
npm run dev:css       # Watch Tailwind CSS changes
npm run dev:11ty      # 11ty development server
```

### Environment Variables

Required for external integrations:

```env
FIGMA_TOKEN=                    # Personal access token for Figma
AIRTABLE_PERSONAL_ACCESS_TOKEN= # API access for content
AIRTABLE_BASE_TOKEN=            # Specific base identifier
```

## 🎭 Atomic Design Components

Templates follow **Atomic Design** principles:

- **Atoms** (`njk/_includes/atoms/`) - Basic HTML elements (buttons, icons, inputs)
- **Molecules** (`njk/_includes/molecules/`) - Simple component groups
- **Organisms** (`njk/_includes/organisms/`) - Complex UI sections
- **Templates** (`njk/_includes/templates/`) - Page-level layouts
- **Pages** (`njk/_pages/`) - Actual content pages

## 🚨 Common Gotchas

1. **Tailwind CSS v4** - Uses `@tailwindcss/cli` instead of legacy `tailwindcss` command
2. **npm-run-all** - Must be installed before running parallel scripts
3. **Figma Token Structure** - Breaking changes in Figma file organization will break the build
4. **Airtable View Names** - Case-sensitive in `site.json` configuration
5. **Asset Paths** - Use `/assets/` (absolute from site root) in client-side code
6. **CSS Import Order** - Matters for Tailwind compilation in `styles/main.css`
7. **Build Order** - Always run `build:design` before `build:11ty` for fresh builds

## 📦 Key Dependencies

- **@11ty/eleventy** `^3.0.0` - Static site generator
- **@tailwindcss/cli** `^4.0.0-alpha.25` - CSS framework
- **gsap** `^3.12.5` - Animation library
- **@11ty/eleventy-fetch** - API response caching
- **npm-run-all** - Parallel script execution

## 🌐 Deployment

Build output is in `_site/` directory (git-ignored). Deploy this directory to your static host:

```bash
npm run build  # Generates production-ready _site/
```

## 📄 License

© 2025 dataink.io - Russell Lebo

---

**For detailed technical documentation**, see the README files in each directory listed above.
