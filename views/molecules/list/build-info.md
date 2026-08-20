---
title: "Build Info"
template: "[[build-info.njk]]"
templatePath: "views/molecules/list/build-info.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "molecule"
status: "active"
tags:
---
# Build Info

Defines Nunjucks macro: `render`.

## Template

- Source: [[build-info.njk]]
- Path: `views/molecules/list/build-info.njk`

## Purpose

Renders build-time system metadata as `<li>` rows: 11ty version, Sanity (`@sanity/client`) version, git commit, Figma design-token file, and build date. Surfaced inside the [[section-cap.njk]] cap row.

## Parameters

- `standalone` (boolean, default `true`) — when `true`, wraps the rows in a `<ul>`. Set `false` when embedding inside an existing list (as `section-cap` does).

## Data and Context

Reads from the global data object `buildVersions` and `buildDate`, registered in `eleventy/collections/index.js`:

- `buildVersions.eleventy` — `@11ty/eleventy` version (from installed manifest)
- `buildVersions.sanity` — `@sanity/client` version (from installed manifest)
- `buildVersions.git` — `{ sha, branch, dirty }` via `git` at build time (empty/skipped if no git)
- `buildVersions.figma` — `{ fileId, modified }` parsed from the `@figma` header that `build:design` stamps into the generated `styles/colors.css` (no Figma API/token needed; empty if that file is missing). Reflects the last token sync, not live Figma state.
- `buildDate` — build timestamp

**Context requirement:** this macro reads globals directly, so every `import` in the chain must use `with context` (home-landing → section-cap → build-info). Without it the fields render blank.

## Disclosure controls

- `data-buildinfo-el="toggle"` — the `<button>` wrapping `<time>`; opens the disclosure.
- `data-buildinfo-el="close"` — icon button ([[icon.njk]] `close`) after the list; closes it. Hidden in the closed state (`hidden group-data-[open]/cap:block`), shown only when the cap carries `data-open`.

Click behavior is wired in [[BuildInfoManager.js]] (open = toggle, close = close button). Keep these hooks if the markup is restructured.

## Relationships

- Used by:
  - [[section-cap.njk]] (`BuildInfo.render({standalone: false})`)
- Depends on:
  - [[icon.njk]] (`close` icon for the close button)
  - `eleventy/collections/index.js` global data (`buildVersions`, `buildDate`)

## Notes for Future Maintenance

- Keep this sidecar in sync when the macro signature or `buildVersions` shape changes.
- Sanity version reflects the frontend's `@sanity/client`, not the backend Studio `sanity` package.
- Figma metadata depends on the header format emitted by `build:design`; if that header changes, update the regexes in `eleventy/collections/index.js`.
- Run `npm run quick` after changes and verify the rendered `data-current-*-build` spans in `_site/index.html`.

## Open Questions

- Should the git commit show tag/`describe` output instead of `branch@sha` for tagged release builds?
