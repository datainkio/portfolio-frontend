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

A single build runs them one after the other; `--watch` runs a watcher for each.

The CLI runs through `npx @tailwindcss/cli`, which isn't pinned in
`package.json`, so the CLI version can be newer than the `tailwindcss` package.
`main.css` uses `@source not`, which needs the CLI at 4.1 or later.
