---
description: "buildCSS — context sidecar (auto-created; expand with the file's real responsibility)."
status: stable
---

# buildCSS

Context sidecar for `scripts/buildCSS.js`.

## Source

- Path: `scripts/buildCSS.js`

Runs the local `node_modules/.bin/tailwindcss` (from `@tailwindcss/cli`, pinned `^4.3.5` and matched to `tailwindcss`), not `npx`. `npm start` no longer pre-builds CSS; the `dev:css` watcher builds on launch.
