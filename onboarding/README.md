# Onboarding Documentation

Visual documentation and diagrams for understanding the portfolio project architecture.

## 📋 Directory Contents

### Sequence Diagrams (`sequences/`)

**Purpose**: Visualize process flows and initialization sequences

- **`npm-workflow-sequence.mmd`** - NPM script workflows (development, build, design sync, fresh build)
- **`eleventy-build-sequence.mmd`** - 11ty initialization flow (passthrough copy, plugin registration, Airtable collections, template processing)
- **`landing-page-animation.mmd`** - Landing page animation choreography (Director initialization through first animations)

### Class Diagrams (`classes/`)

**Purpose**: Show object-oriented architecture and relationships

- **`director.mmd`** - Director animation system architecture (composition, inheritance, event coordination)

### Flow Diagrams (`flows/`)

**Purpose**: Decision trees and conditional logic flows

_Currently empty - add flowcharts for conditional workflows here_

### SVG Exports

Generated visual exports from Mermaid diagrams:

- `director_animation_system.svg`
- `landing_page_animation.svg`
- `site_build_workflow.svg`

## 📖 How to Use These Diagrams

### Viewing Mermaid Files

Mermaid diagrams (`.mmd` files) can be:

1. **Previewed in VS Code**: Use the Mermaid preview extension
2. **Rendered online**: Copy/paste into [Mermaid Live Editor](https://mermaid.live/)
3. **Exported to images**: Use Mermaid CLI or VS Code export features

### Understanding the Architecture

**Start here for different learning paths:**

1. **Understanding builds**: `sequences/npm-workflow-sequence.mmd` → `sequences/eleventy-build-sequence.mmd`
2. **Understanding animations**: `classes/director.mmd` → `sequences/landing-page-animation.mmd`
3. **Understanding object relationships**: `classes/director.mmd`

## 🎯 Quick Reference

### Key Technologies

- **11ty (Eleventy) v3.0.0** - Static site generator
- **Tailwind CSS 4.0** - Utility-first CSS
- **GSAP** - Animation library (ScrollTrigger, ScrollSmoother, SplitText)
- **Figma API** - Design token sync
- **Airtable** - Headless CMS

### Essential Commands

```bash
npm start          # Development mode (parallel watch)
npm run build      # Production build
npm run design     # Sync Figma design tokens
npm run fresh      # Clean rebuild
npm run doctor     # System health check
```

See root `package.json` for complete command list.

## �️ Project Structure Overview

```
portfolio/
├── onboarding/           # This directory - visual documentation
│   ├── sequences/        # Process flow diagrams
│   ├── classes/          # Architecture class diagrams
│   └── flows/            # Conditional logic flowcharts
├── js/choreography/      # GSAP animation system
│   ├── Director.js       # Master coordinator
│   ├── StageManager.js   # Scroll/visual effects
│   ├── AnimationBus.js   # Event pub/sub
│   ├── sections/         # Hero, Work, Biography controllers
│   └── sequences/        # LandingSequence choreography
├── njk/                  # Nunjucks templates
│   ├── _data/            # 11ty data files
│   ├── _includes/        # Components (atoms/molecules/organisms)
│   └── _pages/           # Site pages
├── styles/               # CSS source and generated files
├── figma/                # Design token integration
├── airtable/             # CMS integration
├── eleventy/             # 11ty configuration
└── _site/                # Build output (generated)
```

## � Related Documentation

- **Root README.md** - Project setup and environment configuration
- **js/choreography/README.md** - Animation system architecture
- **figma/README.md** - Design token sync details
- **airtable/README.md** - CMS integration guide
- **eleventy/README.md** - 11ty configuration details

## � Contributing Diagrams

### Adding New Diagrams

1. **Sequence diagrams**: Add to `sequences/` for process flows
2. **Class diagrams**: Add to `classes/` for architecture
3. **Flowcharts**: Add to `flows/` for decision logic
4. **Update this README**: Add entry to relevant section

### Naming Conventions

- Use kebab-case: `my-diagram-name.mmd`
- Be descriptive: `director-constructor-sequence.mmd` not `sequence1.mmd`
- Match diagram content: class diagrams → `classes/`, sequences → `sequences/`

### Mermaid Best Practices

- Use `---title: Your Title---` frontmatter
- Add comments with `%%` for clarity
- Use `autonumber` for sequence diagrams
- Add `note` annotations for key concepts
- Use color-coding (`rect rgb()`) for visual hierarchy
- Export to SVG for permanent visual reference

---

**Documentation Philosophy**: Visual diagrams complement code comments. Diagrams show architecture and flow, code comments explain implementation details.
