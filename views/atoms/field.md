---
description: Debug renderer for a single Sanity schema field's key/value/type.
type: template
tags:
  - debug
---

# Field (debug)

**Not a form-field atom** despite the name — renders one Sanity document
field's key, inferred datatype, and value for the `/dev/` schema debug views.
For a real form field (label + input/textarea + help + error), see
[`molecules/form/field.njk`](../molecules/form/field.md).

## Template

- Source: [[field.njk]]
- Path: `views/atoms/field.njk`

## Purpose

Given `field`/`value`, prints the field name, its `datatype` (via the
`datatype` filter), and a rendered preview of the value: truncated string,
`key: value` list for an array of objects, joined-and-truncated for a plain
array, or the raw value otherwise.

## Role in the System

Classified as a **component** at the atomic **atom** level based on location
under `views/`. Not used by any content-facing template.

## Data and Context

- `field` — the field name to display.
- `value` — the field's value; branches on `value | datatype`.

## Relationships

- Likely used by: Unknown — no current caller found in `views/` (may be
  dev-only tooling not yet wired up, or dead code).

## Notes for Future Maintenance

- Keep this sidecar in sync if the datatype branches change.
- Debug-only — do not reach for this when building a real form; use
  [`molecules/form/field.njk`](../molecules/form/field.md) instead.
