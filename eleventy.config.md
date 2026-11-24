---
description: "eleventy.config.js — context sidecar (auto-created; expand with the file's real responsibility)."
status: stable
---

# eleventy.config

Context sidecar for `eleventy.config.js`.

## Documentation flag

`DOCS` decides whether the folders under `ia/docs/` (the Design, Choreography, IA and content strategy references) render. It's off by default, so `npm start` and `npm run quick` add them to `ignores` and skip about 240 pages. With docs on, the 11ty step writes 277 pages in about 21s; without them, 40 pages in about 2s (measured 2026-11-18).

| Command                                       | Docs                                                     |
| --------------------------------------------- | -------------------------------------------------------- |
| `npm start`, `npm run quick`, `npm run build` | Off                                                      |
| `npm run start:docs`                          | On, and watches `docs.css` and the choreography sidecars |
| `npm run document`                            | On: a `quick` build with the docs                        |
| Staging and production deploys                | On: both run `npm run document`                          |

With docs off, links into `/docs/` (the site map in the badge, for one) 404 locally. That's expected.

The pages at the top level of `ia/docs/` are not part of the reference and build every time (since 2026-11-24): `index.md` (the Docs landing page) and `backend.md`, `content-models.md`, `design-strategy.md` and `frontend.md`, whose content will come from Sanity. With docs off, the build ignores `ia/docs/*/**` (every folder) and `ia/docs/README.md`, not the whole of `ia/docs/`. A new page placed at the top level of `ia/docs/` therefore joins the main build.

## Dev server behaviour

- `setServerPassthroughCopyBehavior("passthrough")`: under `--serve`, passthrough files are served from source, not copied each rebuild.
- `watchIgnores.add("./js/**/*.js")` (and `*.canvas`): a JS save no longer triggers a page build. When docs render, choreography sidecars are the exception: `addWatchTarget("./js/choreography/**/*.md")` rebuilds pages on a sidecar save, because the sidecars are the source of the motion reference (`ia/docs/design/choreography/`). esbuild (`dev:js`) rewrites `assets/js/choreography/bundle.js`, which is in the server `watch` list so the browser reloads.
- Dev CSS (since 2026-11-20): an `eleventy.after` hook runs one Tailwind build per Eleventy build, outside `build` mode, for the stylesheets in `ENTRIES` from `scripts/build/buildCSS.js`. It builds `docs.css` only when `DOCS` is on. `npm start` used to run a Tailwind `--watch` process (`dev:css`). Because `main.css` scans `_site/**/*.html`, that watcher rebuilt once for every HTML file written, about 50 rebuilds per save. `addWatchTarget("./styles/")` makes a stylesheet save rebuild the pages and then the CSS. The tradeoff is that a JS save doesn't rebuild pages, so a class that only JavaScript adds reaches the CSS on the next template or style save, or a restart. `npm run dev:css` still exists as a standalone watcher.

## Source

- Path: `eleventy.config.js`
