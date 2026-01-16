# Project brief (portfolio frontend)

- 11ty static site; templates are Nunjucks in `njk/`.
- JavaScript is **progressive enhancement**, not a framework SPA.
- Animation system lives under `js/choreography/` (GSAP + event bus).
- Design tokens are generated (Figma → `styles/`), and content can be synced from Airtable at build time.

Primary goal: keep the site deterministic, readable, and easy to extend while preserving strong AIX signal (clear patterns, low noise, minimal drift).
