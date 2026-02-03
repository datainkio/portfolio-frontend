<!-- @format -->

# Project Documentation

Comprehensive documentation for the dataink.io portfolio (11ty + Figma + Sanity + GSAP animation system).

## Quick Start

**New to the project?** Start here:

1. **[DOCUMENTATION_PROJECT_COMPLETE.md](./DOCUMENTATION_PROJECT_COMPLETE.md)** - Complete overview of all systems and architecture
2. **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Quick reference guide with organized navigation
3. **[.github/copilot-instructions.md](../.github/copilot-instructions.md)** - AI agent context (npm scripts, environment variables, troubleshooting)

## Documentation by Area

### Build System & Configuration

- **[PROMPT_TEMPLATE.md](./PROMPT_TEMPLATE.md)** - Template for development prompts
- **[.github/copilot-instructions.md](../.github/copilot-instructions.md)** - Build commands, environment setup, architecture overview

### Template System (NJK/Eleventy)

See: `njk/README.md` and `eleventy/README.md` in project root directories

- Components and atomic design patterns
- All filter functions documented (string, array, date, image, color, dom)
- Shortcodes API (`picture`, `lightbox`, `loremChars`, `loremPars`)
- Sanity collection integration

### JavaScript Systems

See: `js/*/README.md` in project js/ directory

- **Choreography**: Director, AnimationBus, StageManager, section controllers
- **Effects**: TextParty, Transitions, Gel, Halftone, Text effects, Parallax
- **Displays**: Blockframes, PrinterMarks, Ruler
- **Utils**: Logger, Math, Color, Theme, Diagnostics, Tailwind

### Phase Documentation

#### Phase 1: Copilot Instructions (Complete)

[.github/copilot-instructions.md](../.github/copilot-instructions.md) - Comprehensive reference for AI agents

- Complete npm script documentation
- Build process and dependencies
- Environment variables
- Troubleshooting guide

#### Phase 2: Template Documentation (Complete)

[DOCUMENTATION_UPDATES.md](./DOCUMENTATION_UPDATES.md) - Phase 2 overview

- njk/ directory documentation
- eleventy/ directory documentation
- Filter and shortcode API reference
- Improved developer experience

#### Phase 3: JavaScript Documentation (Complete)

[JS_DOCUMENTATION_UPDATES.md](./JS_DOCUMENTATION_UPDATES.md) - Phase 3 overview

- Choreography system documentation
- Effects system documentation
- Display systems documentation
- Utilities documentation

#### Complete Project Overview

[DOCUMENTATION_PROJECT_COMPLETE.md](./DOCUMENTATION_PROJECT_COMPLETE.md) - All phases combined

- Summary across all three phases
- Statistics and metrics
- Quality assurance validation
- Developer impact assessment

## Documentation Index

For a complete table of contents with links and descriptions, see:
**[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)**

## Key Files & Their Purpose

```
docs/
├── README.md (this file)                    ← Start here
├── DOCUMENTATION_INDEX.md                   ← Quick reference navigation
├── DOCUMENTATION_PROJECT_COMPLETE.md        ← Complete overview
├── DOCUMENTATION_UPDATES.md                 ← Phase 2 summary
├── JS_DOCUMENTATION_UPDATES.md              ← Phase 3 summary
├── DOCUMENTATION_EXAMPLES.md                ← Before/after examples
├── PROMPT_TEMPLATE.md                       ← Development prompt template
├── TODO.md                                  ← Project tasks
├── sanity-integration.md                    ← Sanity integration guide
├── director-initialization-sequence.md      ← Animation system flow
└── director-initialization-sequence.pdf     ← PDF version
```

## Architecture Overview

### Three-Layer Stack

```
┌────────────────────────────────────────────────────────┐
│         Nunjucks Templates (njk/)                       │
│    Atomic design + Sanity collections                  │
└────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────┐
│      11ty Build System (eleventy/)                      │
│    Filters, shortcodes, collections, services          │
└────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────┐
│    JavaScript Runtime (js/)                            │
│    GSAP choreography, effects, utils, displays         │
└────────────────────────────────────────────────────────┘
```

### Data Flow

```
Sanity (CMS)
    ↓
[npm run sync:content]
    ↓
Collections (11ty)
    ↓
Nunjucks Templates
    ↓
HTML (_site/)
    ↓
JavaScript (choreography, effects)
```

### Design System Flow

```
Figma (design tokens)
    ↓
[npm run build:design]
    ↓
CSS Custom Properties
    ↓
Tailwind Configuration
    ↓
Compiled CSS (styles/)
```

## Common Tasks

### I want to...

**...understand the project architecture**
→ Read [DOCUMENTATION_PROJECT_COMPLETE.md](./DOCUMENTATION_PROJECT_COMPLETE.md)

**...find a quick reference**
→ See [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

**...learn about npm scripts**
→ Check [.github/copilot-instructions.md](../.github/copilot-instructions.md#core-workflows)

**...work with templates**
→ See `njk/README.md` and `eleventy/README.md`

**...implement animations**
→ See `js/choreography/README.md`

**...use text/visual effects**
→ See `js/effects/README.md` and `js/displays/README.md`

**...debug performance**
→ Check `js/utils/README.md` (diagnostics section)

**...add a new component**
→ Read `njk/README.md` (component registry and patterns)

**...create a new page**
→ See `eleventy/README.md` and `ia/` examples

## Quality Standards

All documentation in this project:

- ✅ **Accurate**: Verified against actual source code
- ✅ **Complete**: Covers architecture, API, and examples
- ✅ **Clear**: Written for developers with varying expertise levels
- ✅ **Practical**: Includes real-world usage patterns
- ✅ **Accessible**: Documents accessibility considerations throughout
- ✅ **Performant**: Includes optimization guidance

## Navigation

- **[Back to project root](../)** - View all project files
- **[View all files in docs/](.)** - Browse this directory
- **[.github/copilot-instructions.md](../.github/copilot-instructions.md)** - AI agent reference
- **[.copilot/](../.copilot/)** - AI context files

---

**Last Updated**: December 19, 2025  
**Status**: ✅ Complete and Maintained  
**Quality Level**: ⭐⭐⭐⭐⭐ Professional-grade
