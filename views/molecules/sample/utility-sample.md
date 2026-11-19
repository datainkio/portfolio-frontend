---
description: One documented utility class for the design reference, with its note, syntax, source file, and a grid of live swatches.
type: template
---

# Utility sample

One utility, shown the way the Decoration pages show every one: a heading, a
note, the syntax and the file that defines it, and a swatch for each example
class list.

## Template

- Source: [[utility-sample.njk]]
- Path: `views/molecules/sample/utility-sample.njk`

## Purpose

Keeps the markup of a utility sample in one place. The Decoration pages call
it once per utility instead of repeating the section.

## Role in the System

Classified as a **component** at the atomic **molecule** level. Docs only:
no site page uses it.

## Params

| Param      | Type   | Description                                                                            |
| ---------- | ------ | -------------------------------------------------------------------------------------- |
| `id`       | string | Suffix for the heading id (`utility-<id>`). Unique on the page.                        |
| `name`     | string | The heading text.                                                                      |
| `level`    | number | Heading level, 2 to 6. Defaults to 2; use 3 when the sample sits under a page section. |
| `note`     | string | One paragraph on what the utility does.                                                |
| `syntax`   | string | The class forms the utility takes.                                                     |
| `file`     | string | The stylesheet that defines it.                                                        |
| `examples` | array  | Class lists, one per swatch. Each is applied to a swatch and printed under it.         |

Fixed design: takes no styling params. It sets its own spacing for the docs
ground, and the swatches draw on `neutral-900`.

## Accessibility

- A `<section>` named by its heading (`<h2>` unless `level` says otherwise) through `aria-labelledby`.
- The swatches are decorative (`aria-hidden`); the class list under each one
  is the text.

## Relationships

- Used by:
  - The pages under `ia/docs/design/decoration/`

## Notes for Future Maintenance

- Keep this sidecar in sync when the signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
