---
description: "eleventy.config.js — context sidecar (auto-created; expand with the file's real responsibility)."
status: stable
---

# eleventy.config

Context sidecar for `eleventy.config.js`.

## Documentation flag

`DOCS` decides whether `ia/docs/` (the Design, Choreography, IA and content strategy references) renders. It's off by default, so `npm start` and `npm run quick` add `ia/docs/**` to `ignores` and skip about 240 pages. With docs on, the 11ty step writes 277 pages in about 21s; without them, 40 pages in about 2s (measured 2026-11-18).

| Command                                       | Docs                                                     |
| --------------------------------------------- | -------------------------------------------------------- |
| `npm start`, `npm run quick`, `npm run build` | Off                                                      |
| `npm run start:docs`                          | On, and watches `docs.css` and the choreography sidecars |
| `npm run document`                            | On: a `quick` build with the docs                        |
| Staging and production deploys                | On: both run `npm run document`                          |

With docs off, links into `/docs/` (the site map in the badge, for one) 404 locally. That's expected.

## Dev server behaviour

- `setServerPassthroughCopyBehavior("passthrough")`: under `--serve`, passthrough files are served from source, not copied each rebuild.
- `watchIgnores.add("./js/**/*.js")` (and `*.canvas`): a JS save no longer triggers a page build. When docs render, choreography sidecars are the exception: `addWatchTarget("./js/choreography/**/*.md")` rebuilds pages on a sidecar save, because the sidecars are the source of the motion reference (`ia/docs/design/choreography/`). esbuild (`dev:js`) rewrites `assets/js/choreography/bundle.js`, which is in the server `watch` list so the browser reloads.

## Source

- Path: `eleventy.config.js`
