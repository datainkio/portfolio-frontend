---
description: "Documents the organisms/ layer — complex UI assemblies composed of molecules and atoms."
type: guide
status: stable
---

<!-- @format -->

# Organisms Directory - Complex UI Assemblies

**CRITICAL WARNING**: Organisms combine molecules and atoms into complete interface sections. Changes here directly affect page layouts. Map page-template dependencies before editing.

## Architecture Overview

Organisms represent substantial, page-section-level interface pieces. These components:

- **ORCHESTRATE multiple molecules and atoms** into a cohesive section
- **MAY depend on molecules, atoms, and other organisms** — organism-to-organism composition is the norm here, not an exception (e.g. `footer/global-footer.njk` imports `section/contact.njk`; every header variant imports `navigation/breadcrumbs-nav.njk`)
- **ACCEPT data** via Nunjucks parameters from the page/template that includes them
- **MANAGE section-level interaction state** where relevant (e.g. navigation toggles)

## Directory Structure

Four real subdirectories exist under `views/organisms/`:

### `header/` - Page Header Variants

- **`global-header.njk`** - shared header shell
- **`home/home-landing.njk`** - homepage-specific header
- **`landing/landing-header.njk`** - landing-page header (also used by project/article pages, per its imports)
- **`project/project-header.njk`** - project detail page header (composes `molecules/awards.njk`)
- **`article/article-header.njk`** - article page header

### `footer/` - Site Footer

- **`global-footer.njk`** - shared footer, used across all page types

### `navigation/` - Site-Wide Navigation Systems

- **`primary-nav.njk`** - main site navigation
- **`breadcrumbs-nav.njk`** - breadcrumb trail
- **`page-nav.njk`** - in-page prev/next or section navigation
- **`skip-links-nav.njk`** - accessibility skip-links, included in `layouts/base.njk` on every page

### `section/` - Homepage/Landing Content Sections

- **`hero.njk`**, **`bio.njk`**, **`work.njk`**, **`organizations.njk`**, **`awards.njk`**, **`process.njk`**, **`contact.njk`** - one file per homepage section, each with its own choreography/GSAP integration

**Note**: `organisms/section/awards.njk` and `molecules/awards.njk` both render an award list grouped by organization (`groupByOrg` + `card/award-organization.njk`) but the organism reimplements the list-rendering inline rather than composing the molecule, since the molecule bundles its own `<section>`/heading wrapper. Worth consolidating if this file is touched again.

## Usage

```nunjucks
{% import "organisms/section/hero.njk" as Hero %}
{{ Hero.render({ heading: "Featured Projects", content: projectList }) }}
```

Prefer `{% import ... as X %} + {{ X.render({...}) }}` — `{% include "x.njk" with {...} %}` is **not valid Nunjucks** in this project's Nunjucks version (it silently does nothing); several older doc comments in this codebase demonstrate it incorrectly.

## Data Flow

Organisms receive data from the page template that includes them (via `params`), and pass subsets down to the molecules/atoms they compose. They don't fetch their own data from `collections.*` as a rule — **three navigation organisms are a documented, intentional exception**: `navigation/breadcrumbs-nav.njk` (`params.nav or collections.all`), `navigation/primary-nav.njk`, and `header/landing/landing-header.njk` all read `collections.all` for site-wide navigation structure. This is accepted because it's structural sitewide data, not page-specific content — the same category of data an organism is expected to receive as "high-level context" per this file's own contract, not a case of a component quietly coupling itself to one page's content. Molecules that self-fetched *specific content records* (awards, organization lists, project siblings) were fixed to accept that data as parameters instead — see the Frontend project's "Audit direct collections.* access in molecules/organisms" task for what changed.

## Integration Notes

- **Animation**: Section organisms integrate with the choreography system in `js/choreography/` — CSS classes and `data-*` attributes must stay in sync with what the relevant manager expects.
- **CMS data**: Content organisms expect specific Sanity field shapes; a schema change requires a template update.
