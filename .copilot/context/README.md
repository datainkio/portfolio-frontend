# Frontend Agent Context (Curated)

This folder is the short, high-signal orientation layer for AI agents.
It is not a source of truth; it points to real sources in the project.

Agents should read this file first when starting work.

## Files

- Architecture map: [.copilot/context/architecture-map.md](architecture-map.md)
- Coding standards: [.copilot/context/coding-standards.md](coding-standards.md)
- Stack & commands: [.copilot/context/stack-and-commands.md](stack-and-commands.md)

## Project brief (portfolio frontend)

- 11ty static site; templates are Nunjucks in `njk/`.
- JavaScript is **progressive enhancement**, not a framework SPA.
- Animation system lives under `js/choreography/` (GSAP + event bus).
- Design tokens are generated (Figma → `styles/`), and content can be synced from Airtable at build time.

Primary goal: keep the site deterministic, readable, and easy to extend while preserving strong AIX signal (clear patterns, low noise, minimal drift).

## Do not touch (noise + generated output)

- Generated site output: `_site/**` (never treat as source of truth).
- Generated design tokens:
	- `styles/colors.css`
	- `styles/typography/fontFamilies.css`
	- (re-generated via design/token sync)

Guideline: prefer deleting noise (generated artifacts, experiments left in canonical paths) before adding new prompts.
