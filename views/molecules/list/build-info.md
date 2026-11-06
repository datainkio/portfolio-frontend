---
description: "Defines Nunjucks macro: render."
type: template
---

# Build Info

Defines Nunjucks macro: `render`.

## Template

- Source: [[build-info.njk]]
- Path: `views/molecules/list/build-info.njk`

## Purpose

Renders build-time system metadata as `<li>` rows: 11ty version, Sanity (`@sanity/client`) version, git commit, Figma design-token file, and build date. Surfaced in the [[global-header.njk]] header.

## Params

| Param           | Type                          | Description                                                                                                                         |
| --------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `buildDate`     | Date                          | Build timestamp. Used for the `datetime` attribute and shown formatted.                                                             |
| `buildVersions` | object                        | `git` (`sha`, `branch`, `dirty`), `eleventy`, `sanity`, and `figma` (`fileId`). Missing git or Figma values leave their cell empty. |
| `classes`       | string, variant map, or array | Applied to the root `<div>` through `classes`, after a `contents flex` baseline.                                                    |

`buildVersions` is built from the installed package manifests, `git` at build time, and the `@figma` header that `build:design` writes into `styles/colors.css`. The Figma value reflects the last token sync, not live Figma state.

## Disclosure controls

- `data-buildinfo-el="toggle"` — the `<button>` wrapping `<time>`; opens the disclosure.
- `data-buildinfo-el="close"` — icon button ([[icon.njk]] `close`); closes the disclosure. Lives inside the drawer (`data-buildinfo-el="list"`) as a flex sibling of the `<dl>`, pinned to the far right via `ml-auto`, so it rides the same GSAP slide as the rest of the drawer — no separate show/hide class of its own.

Click behavior is wired in [[BuildInfoManager.js]] (open = toggle, close = close button). Keep these hooks if the markup is restructured.

## Relationships

- Used by:
  - [[global-header.njk]] (`BuildInfo.render({ classes, buildDate, buildVersions })`)
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
