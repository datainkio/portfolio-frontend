---
description: "eleventy.config.js — context sidecar (auto-created; expand with the file's real responsibility)."
status: stable
---

# eleventy.config

Context sidecar for `eleventy.config.js`.

## Dev server behaviour

- `setServerPassthroughCopyBehavior("passthrough")`: under `--serve`, passthrough files are served from source, not copied each rebuild.
- `watchIgnores.add("./js/**")`: a JS save no longer triggers a page build. esbuild (`dev:js`) rewrites `assets/js/choreography/bundle.js`, which is in the server `watch` list so the browser reloads.

## Source

- Path: `eleventy.config.js`
