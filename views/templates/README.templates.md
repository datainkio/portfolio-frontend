---
description: "Documents the templates/ directory — page-composition templates and shared <head> partials."
type: guide
status: stable
tags:
  - template
---

<!-- @format -->

# Templates Directory - Page Compositions and Partials

**CRITICAL WARNING**: Templates compose organisms and molecules into full page bodies. Changes here affect every page that extends or includes the template. Check callers before editing.

## Architecture Overview

Templates represent complete page compositions built from organisms and molecules via `{% include %}`/`{% import %}` (as opposed to `layouts/`, which pages extend via `{% extends %}` for the outer HTML/head/body shell — see [`layouts/README.layouts.md`](../layouts/README.layouts.md)).

## Directory Structure

### Content-type templates

- **`article.njk`** - standalone article page (header + sticky jumplink nav + body)
- **`blog/blog.njk`** - blog post layout (title, date, content, prev/next nav)
- **`case-study/case-study.njk`** - project/case-study page layout
- **`landing/landing.njk`** - landing page layout

### `partials/` - Shared `<head>` Fragments

Included from `partials/head.njk`, itself included by `layouts/base.njk`:

- **`head.njk`** - assembles the `<head>`: stylesheet, the partials below, and the choreography bundle preload
- **`social.njk`** - SEO/social meta tags (description, canonical, Open Graph, Twitter card)
- **`manifest.njk`** - web app manifest link and PWA theme-color meta tags
- **`favicon.njk`** - favicon `<link>` tags (renamed from `icon.njk` — it collided with the unrelated `atoms/icon.njk` SVG-icon component)
- **`fonts.njk`** - font loading strategy
- **`gtm-script.njk`** / **`gtm-noscript.njk`** - Google Tag Manager snippets
- **`robots.njk`** - robots meta tag
- **`choreography-script.njk`** - GSAP choreography bundle script tag
- **`dev-note.njk`** - a signature `console.log` Easter egg, unconditionally included on every page (not gated behind a debug flag — see [[fix-dev-channel-defects-(adr-0005)|Fix dev-channel defects (ADR 0005)]] if that's ever addressed)

## Usage

```nunjucks
{% extends "layouts/base.njk" %}

{% block content %}
  {% import "organisms/section/hero.njk" as Hero %}
  {{ Hero.render({ heading: "Featured Projects", content: projectList }) }}
{% endblock %}
```

Prefer `{% import ... as X %} + {{ X.render({...}) }}` for organisms/molecules that take parameters — `{% include "x.njk" with {...} %}` is **not valid Nunjucks** in this project's Nunjucks version (it silently does nothing). Plain `{% include "x.njk" %}` (no `with` clause) is fine and used throughout `partials/` — those templates read global data directly rather than taking explicit params.

## Data Flow

Templates receive page-level data from the page's frontmatter and the 11ty data cascade (`site`, `env`, `colors`, `buildVersions`, and Sanity-sourced collections), and pass subsets down to the organisms/molecules they compose.

## Integration Notes

- **Animation**: templates that use choreography include `partials/choreography-script.njk`, which loads the bundle built by `scripts/buildChoreography.js`; the boot sequence (`director:ready` → `preloader:out` → `LandingSequence`) must not be bypassed.
- **CSS**: `head.njk` controls stylesheet loading order — see `styles/main.css`'s own import order (fonts → Tailwind → base → theme → components) for why this matters.
