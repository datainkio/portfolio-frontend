---
description: "Defines Nunjucks macro: render. The build-date button and drawer of build versions shown in the badge's site-map bar."
type: template
tags:
  - organism
  - status
  - build-info
  - choreography
aliases:
  - "Build view"
links:
  - "[[build-view.njk]]"
  - "[[build-info.njk]]"
  - "[[icon.njk]]"
  - "[[button.njk]]"
  - "[[badge.njk]]"
  - "[[BuildInfoManager.js]]"
---

# Build View

Defines Nunjucks macro: `render`.

## Template

- Source: [[build-view.njk]]
- Path: `views/organisms/status/build-view/build-view.njk`

## Purpose

Renders the build-date button and the drawer of build versions. The button
shows the build date as a `<time>`. The drawer holds the version list from
[[build-info.njk]] and a close button. It is shown in the badge's site-map bar
through [[badge.njk]].

## Params

| Param           | Type                          | Description                                                                                  |
| --------------- | ----------------------------- | -------------------------------------------------------------------------------------------- |
| `buildDate`     | Date                          | Build timestamp. Shown formatted on the toggle button and used for the `datetime` attribute. |
| `buildVersions` | object                        | Passed through to [[build-info.njk]]. Defaults to an empty object when missing.              |
| `classes`       | string, variant map, or array | Applied to the root `<div>` through `classes`, after a `contents flex` baseline.             |

## Relationships

- Imports:
  - [[icon.njk]] (`atoms/icon.njk`) as `Icon`, for the close button
  - [[button.njk]] (`atoms/button.njk`) as `Button`, for the toggle and close buttons
  - [[build-info.njk]] (`molecules/list/build-info.njk`) as `BuildView`, for the version rows
- Used by: [[badge.njk]] (`organisms/header/badge.njk`), rendered inside the badge dialog's header bar, beside the close button.

## Hooks

- `data-buildinfo-el="root"` — the wrapper `<div>`. Owns the delegated click listener.
- `data-buildinfo-el="toggle"` — the `<button>` around the `<time>`. Carries `aria-expanded="false"` and `aria-controls="build-info-list"`.
- `data-buildinfo-el="list"` — the drawer `<div id="build-info-list">`. Carries `aria-hidden="true"`.
- `data-buildinfo-el="close"` — the icon button in the drawer. Carries `aria-controls="build-info-list"`.

[[BuildInfoManager.js]] binds to these values. The fixed id `build-info-list` is what `aria-controls` points at, so it must not change.

## Notes for Future Maintenance

- The root and the drawer are `<div>` elements. This is flagged per the workspace `<div>` rule. Neither has a landmark role in the markup.
- The drawer starts with `aria-hidden="true"` and stays that way until the script opens it.
- Keep this sidecar in sync with [[build-info.njk]] and [[BuildInfoManager.js]] when the hooks or the `buildVersions` shape change.
