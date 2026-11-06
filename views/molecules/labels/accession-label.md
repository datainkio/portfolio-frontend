---
description: Accession label: a small DOC row with a description and a scope cell.
type: template
---

# Accession Label

Renders a `<dl>` with an optional "DOC {index} / {title}" row and a row of description and scope cells.

## Params

| Param         | Type                          | Description                                                  |
| ------------- | ----------------------------- | ------------------------------------------------------------ |
| `index`       | string                        | Number after "DOC". Defaults to `00`.                        |
| `title`       | string                        | Shown in the "DOC" row. The row is omitted when empty.       |
| `description` | string                        | Text in the left cell.                                       |
| `scope`       | string                        | Text in the right cell.                                      |
| `attrs`       | string                        | Raw attributes on the `<dl>`, output with `safe`.            |
| `classes`     | string, variant map, or array | Applied to the `<dl>` through `classes`, after the baseline. |
