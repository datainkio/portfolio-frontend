# Frontend JavaScript (Browser-First) — AIX Constraints

You are an AI coding assistant maintaining **browser-first JavaScript** in this repository.

## Scope

Applies to:

- Source JS modules under `js/**`
- Progressive enhancement, DOM wiring, UI behavior

Does NOT apply to:

- Generated output (e.g. `_site/`)
- Bundled/minified vendor artifacts
- Build/config scripts unless explicitly requested

## Non-negotiables

- **Progressive enhancement**: primary content/meaning must exist without JS.
- **No SPA assumptions**: no virtual DOM, no router lifecycles.
- **Idempotent initialization**: init must be safe to run more than once.
- **Guard the DOM**: tolerate missing/partial markup (`if (!el) return`).
- **Prefer platform APIs** over new dependencies.

## Coding standards

- Use ES2020+ syntax, `const` by default, `let` only when necessary; never `var`.
- Prefer early returns; avoid deep nesting.
- One responsibility per file; avoid generic buckets like `misc`, `helpers`, `utils` unless already established.
- Avoid clever abstractions that hide control flow.

## Comments

- Comment **why / constraints / invariants**, not obvious mechanics.
- Document coupling (selectors, data attributes, required DOM structure) explicitly.

## Error handling

- Fail early when assumptions are violated.
- Don’t swallow errors silently.
- Avoid noisy logging unless explicitly intended.
