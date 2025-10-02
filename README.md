# dataink.io Portfolio

**DANGER ZONE**: This is not your typical portfolio site. This is a fully automated design-developer workflow with Figma API integration, Airtable CMS, and 11ty static generation. If you're here to "quickly fix something" without understanding the architecture, you're about to experience the digital equivalent of performing surgery with a sledgehammer.

## Architecture Overview (Read This Or Suffer The Consequences)

This site uses a complex but powerful tech stack designed for automated design-to-code workflows. Each piece depends on the others in very specific ways - break one link and watch the entire chain snap:

- **11ty Static Site Generator**: Templates in `njk/` using Nunjucks (NOT Handlebars, NOT Liquid)
- **Figma API Integration**: Automatically syncs design tokens to CSS files via `figma/services/`
- **Airtable Headless CMS**: Content management with smart caching and API rate limiting
- **Tailwind CSS v4**: Utility-first CSS using `@tailwindcss/cli` (NOT the old `tailwindcss` command - ignore this at your peril)
- **Atomic Design Pattern**: Components organized as atoms/molecules/organisms/templates in `njk/_includes/`

**ABSOLUTE CRITICAL RULE**: Never run builds without understanding dependencies. Each system relies on the others in very specific ways. Skip steps and join the debugging nightmare club.

## Quick Start (Follow This Exactly Or Face Digital Chaos)

```bash
# Step 1: ALWAYS run install first - missing npm-run-all will cause cryptic parallel execution failures
npm install

# Step 2: Sync Figma design tokens to CSS files - MUST happen before 11ty build or site will look broken
npm run build:design

# Step 3: Generate static site from njk/ templates to _site/
npm run build:11ty

# Step 4: Development with parallel Tailwind watching + 11ty serving (requires npm-run-all)
npm start
```

**DO NOT SKIP STEP 2**: The site will compile without design tokens but will look like a 1990s website built by someone who hates design. The `build:design` command fetches colors, typography, and spacing tokens from Figma and writes them to CSS files that 11ty templates depend on.

## Environment Variables (Required For External Integrations Or Everything Breaks)

Create a `.env` file with these tokens or the build will fail silently and leave you wondering why nothing works:

```env
FIGMA_TOKEN=your_figma_personal_access_token
AIRTABLE_PERSONAL_ACCESS_TOKEN=your_airtable_token
AIRTABLE_BASE_TOKEN=your_specific_base_id
```

**Get Figma Token**: Figma Account Settings → Personal Access Tokens → Generate New Token (give it Files:read scope)
**Get Airtable Tokens**: Airtable Account → Developer Hub → Personal Access Tokens → Create token with base access

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

**BREAK THIS STRUCTURE = BREAK THE BUILD = ANGER THE DESIGN GODS**

The services expect this exact hierarchy. Rename a color from "Primary/Light" to "Primary Light" and watch the system implode.

### Generated Files (ABSOLUTELY DO NOT EDIT MANUALLY)

These files are auto-generated and will be overwritten faster than you can say "git commit":

- `styles/colors.css` - CSS custom properties from Figma color tokens
- `styles/typography/fontFamilies.css` - Font family utilities from Figma text styles
- Any file with "Auto-generated" in the header comment

**Edit these manually and watch your changes vanish** the next time someone runs `npm run build:design`.

## Content Management (Airtable CMS Integration)

Content is managed through Airtable and synced via API with smart caching. Configuration lives in `njk/_data/site.json` and follows strict rules:

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

**Table Configuration Rules (Violate These At Your Own Risk)**:

- `tableName` MUST match your Airtable base exactly (case-sensitive, spaces matter)
- `tableView` MUST be a valid view name in that table (also case-sensitive)
- `cache` duration prevents API rate limiting (`1d`, `12h`, `30m`, etc.) - set too low and hit rate limits
- Each table becomes an 11ty collection accessible in templates with lowercase name

### Accessing Content in Templates

Tables become collections with lowercase names via `eleventy/collections/content.js`:

```html
<!-- Airtable table "Projects" becomes collection "projects" -->
{% for project in collections.projects %}
<h2>{{ project.data.Name }}</h2>
<p>{{ project.data.Description }}</p>
{% endfor %}
```

**CRITICAL**: Collection names are always lowercase regardless of Airtable table casing. "MyTable" becomes "mytable".

## File Organization (Touch The Wrong Thing = Break Everything)

```text
portfolio/
├── njk/                          # 11ty source templates (NOT _src, NOT src)
│   ├── _data/site.json          # Site config + Airtable settings (CRITICAL)
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
├── airtable/                   # Airtable API services
├── eleventy/                   # 11ty configuration and collections
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

1. **Edit in Airtable** (add/modify content) - ONLY content source
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

- **Cause**: Airtable table/view names don't match `site.json` config
- **Fix**: Verify exact spelling and case in Airtable vs config
- **Prevention**: Copy/paste table names instead of typing

### "Build fails with module errors"

- **Cause**: Missing `npm install` or outdated dependencies
- **Fix**: Delete `node_modules`, run fresh `npm install`
- **Prevention**: Always run install on fresh clone

### "CSS not compiling"

- **Cause**: Wrong Tailwind version or import order in `main.css`
- **Fix**: Verify Tailwind CSS v4 installation and import sequence
- **Prevention**: Don't rearrange CSS imports without understanding cascade

## Advanced Configuration

### Adding New Airtable Tables

1. Add table config to `njk/_data/site.json`
2. Collection will auto-generate with lowercase table name
3. Access in templates via `collections.yourtablename`

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
npm run build        # Full production build (design + 11ty)
```

Deploy the `_site/` folder to your hosting platform. The site is fully static with no server-side requirements.

## Getting Help

If something breaks:

1. **Check the build logs** for specific error messages
2. **Verify environment variables** are set correctly
3. **Confirm Figma/Airtable structure** hasn't changed
4. **Run clean install**: `rm -rf node_modules/ .cache/ && npm install`
5. **Check this README** again - you probably missed a step

Remember: This system is powerful but unforgiving. Each piece depends on the others working exactly as designed. Respect the architecture and it will serve you well. Ignore it and prepare for debugging hell.
