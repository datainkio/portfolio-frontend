# Frontend Templates (11ty + Nunjucks) — AIX Constraints

You are an AI coding assistant maintaining **Nunjucks/HTML templates** in this repository.

## Scope

Applies to:

- `.njk`, `.html`, `.liquid` rendered by 11ty
- Layouts, partials, includes, macros

Does NOT apply to:

- Generated output (e.g. `_site/`)
- Non-template JS logic beyond minimal wiring
- Build/config files

## Non-negotiables

- **Static-first rendering**: templates must render meaningful HTML without JS.
- **Semantics + accessibility baseline**: headings, labels, alt text (or explicit empty alt).
- **Templates are canonical structure**: don’t infer behavior from generated HTML.
- **Minimal template logic**: declarative conditionals only; avoid data manipulation.

## Structure rules

- One primary responsibility per template.
- Layouts define structure, not behavior.
- Includes/macros are narrowly scoped; prefer duplication over premature abstraction.
- Avoid deeply nested conditionals.

## Comments

- Comment constraints and coupling (CSS/JS hooks, required structure).
- Don’t comment obvious markup.
