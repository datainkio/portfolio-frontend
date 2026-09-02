---
description: "Documents the molecules/ layer — composite UI groups composed of atoms."
type: guide
status: stable
---

<!-- @format -->

# Molecules Directory - Composite UI Components

**CRITICAL WARNING**: Molecules compose atoms (and, commonly, other molecules) into functional groups. Breaking changes here affect organisms and page templates. Check callers before modifying a molecule's parameter shape.

## Architecture Overview

Molecules combine atoms into small, functional UI patterns. These components:

- **COMPOSE atoms**, and routinely compose **other molecules** too — molecule-to-molecule imports are the norm in this codebase, not an exception (at least 13 instances, e.g. `awards.njk` → `card/award-organization.njk`, `card/card.njk` → `stats/stats.njk`, `list/project-cards.njk` → `card/project.njk`, `section/industry-section.njk` → `list/project-cards.njk`). A prior version of this doc stated molecules "CANNOT depend on other molecules" — that rule never matched reality and has been dropped.
- **SHOULD encapsulate** one interaction or content pattern
- **SHOULD accept data** through Nunjucks parameters, not by reaching into `collections.*` directly — see the Frontend project's "Audit direct collections.* access in molecules/organisms" task for known exceptions and cleanup status

## Directory Structure

### `card/` - Content Cards

`award.njk`, `award-organization.njk`, `card.njk` (base card), `category.njk`, `image.njk`, `organization.njk`, `project.njk`

### `list/` - Content Lists

`activities.njk`, `build-info.njk`, `child-pages.njk`, `design-pages.njk`, `industry.njk`, `industry-links.njk`, `main-pages.njk`, `organizations.njk`, `project-cards.njk`, `project-details.njk`, `project-orgs.njk`, `roles.njk`

### `input/` - Navigation/Form Input Patterns

`nav-item.njk`, `prevnext.njk`, `project-nav.njk`

### `navigation/` - Navigation-Scoped Patterns

`article-nav-links.njk` - on-page jumplink nav with a mobile toggle

### `section/`, `background/`, `figure/`, `lightbox/`, `project-metadata/`, `stats/`

One molecule per directory (`section/industry-section.njk`, `background/sizzle-background.njk`, `figure/featured-image.njk`, `lightbox/lightbox.njk`, `project-metadata/project-metadata.njk`, `stats/stats.njk`) — see [`README.atoms.md`](../atoms/README.atoms.md)'s "Flat vs. Nested" convention, which applies here too: a directory exists once a component needs its own sub-parts or is expected to grow variants.

### Flat files

`awards.njk`, `callout.njk`, `form.njk`, `printmarks.njk`, `section-cap.njk`, `section-playback.njk` (dev-only choreography debug tool, no live callers)

## Usage

```nunjucks
{% import "molecules/card/project.njk" as ProjectCard %}
{{ ProjectCard.render({ project: project, modal: true }) }}
```

Prefer `{% import ... as X %} + {{ X.render({...}) }}` — `{% include "x.njk" with {...} %}` is **not valid Nunjucks** in this project's Nunjucks version (it silently does nothing); don't reach for it even though older doc comments in this codebase demonstrate it.

## Integration Notes

- **Animation**: Interactive molecules integrate with the choreography system in `js/choreography/`; CSS classes and `data-*` attributes must stay in sync with what the relevant manager expects.
- **CMS data**: Molecules that receive Sanity-sourced content expect specific field shapes — a schema change requires a template update.
- **Naming**: Before adding a new molecule, grep for its intended name first — `views/molecules/awards.njk` and a now-removed `views/molecules/list/awards.njk` duplicate once existed side by side with drifted, incompatible implementations.
