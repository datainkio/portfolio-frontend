---
description: "Renders a single industry heading and its list of organizations."
type: template
---

# Industry

Renders a single industry heading and its list of organizations. Plain markup, no macro wrapper.

## Template

- Source: [[industry.njk]]
- Path: `views/molecules/list/industry.njk`

## Purpose

Displays one industry group: an `<h3>` label followed by a `<ul>` of organization names.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

- `industry` — industry label, rendered in the heading.
- `orgs` — array of organization objects, each rendered via `org.name`.

## Relationships

- Likely used by:
  - Unknown — distinct from [[industry-links.njk|molecules/list/industry-links.njk]] and [[industry-section.njk|molecules/section/industry-section.njk]], which cover related but not identical presentation.

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Unlike sibling files in `list/`, this template is not wrapped in a `{% macro render() %}` — confirm this is intentional before refactoring.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
