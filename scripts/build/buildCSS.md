---
description: "buildCSS — context sidecar (auto-created; expand with the file's real responsibility)."
status: stable
---

# buildCSS

Context sidecar for `scripts/build/buildCSS.js`.

## Source

- Path: `scripts/build/buildCSS.js`

## Entries

`ENTRIES` lists the stylesheets it builds, each with the Tailwind CLI:

| Input             | Output                    | Linked by                                          |
| ----------------- | ------------------------- | -------------------------------------------------- |
| `styles/main.css` | `_site/assets/styles.css` | every page                                         |
| `styles/docs.css` | `_site/assets/docs.css`   | `/docs/design/` pages, via their `stylesheet` data |

A single build runs them one after the other. `--watch` watches `main.css` only and builds `docs.css` once at launch; set `DOCS_CSS=true` (`npm run start:docs`) to watch `docs.css` too.

The CLI is the local `node_modules/.bin/tailwindcss` from `@tailwindcss/cli`, pinned `^4.3.5` and matched to `tailwindcss`. `main.css` uses `@source not`, which needs 4.1 or later. The path is unquoted because watch mode splits the command on spaces and spawns it without a shell. `npm start` no longer pre-builds CSS; the watcher builds on launch.
