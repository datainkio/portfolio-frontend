---
title: Documentation
layout: templates/documentation.njk
permalink: /docs/
eleventyNavigation:
  key: Docs
  order: 3
---

# Documentation

Welcome to the dataink.io portfolio documentation. This documentation is automatically generated from README files throughout the codebase.

## Available Documentation

Browse documentation by section:

### JavaScript Architecture

- **Choreography System** - Event-driven animation coordination
  - AnimationBus - Central event system
  - Section Controllers - Hero, Work, Biography animations
  - Sequences - Landing page choreography
- **Effects Library** - Text and visual effects
- **Displays** - UI components and overlays
- **Layouts** - Grid and layout utilities

### Design System

- **Figma Integration** - Automated design token sync
- **Typography** - Font and text styling system
- **Colors** - Color palette and theming

### Content Management

- **Airtable CMS** - Headless content management
- **Image Processing** - Automated image optimization

### Build System

- **Eleventy Collections** - Content and navigation
- **Scripts** - Build automation and utilities
- **Styles** - CSS architecture and Tailwind config

## Quick Links

<div class="grid grid-cols-2 gap-4 not-prose my-8">
  <a href="/design/" class="block p-6 bg-white border border-neutral-200 rounded-lg hover:shadow-lg transition-shadow">
    <h3 class="text-lg font-semibold text-neutral-900 mb-2">Design System</h3>
    <p class="text-sm text-neutral-600">Figma integration and design tokens</p>
  </a>
  
  <a href="/lab/" class="block p-6 bg-white border border-neutral-200 rounded-lg hover:shadow-lg transition-shadow">
    <h3 class="text-lg font-semibold text-neutral-900 mb-2">Lab</h3>
    <p class="text-sm text-neutral-600">Experimental features and prototypes</p>
  </a>
  
  <a href="/projects/" class="block p-6 bg-white border border-neutral-200 rounded-lg hover:shadow-lg transition-shadow">
    <h3 class="text-lg font-semibold text-neutral-900 mb-2">Projects</h3>
    <p class="text-sm text-neutral-600">Portfolio work and case studies</p>
  </a>
  
  <a href="/about/" class="block p-6 bg-white border border-neutral-200 rounded-lg hover:shadow-lg transition-shadow">
    <h3 class="text-lg font-semibold text-neutral-900 mb-2">About</h3>
    <p class="text-sm text-neutral-600">Background and experience</p>
  </a>
</div>

## Documentation Structure

Technical documentation is embedded throughout the codebase in README.md files:

- **`js/choreography/README.md`** - Animation system architecture
- **`js/choreography/sections/README.md`** - Section controllers
- **`figma/README.md`** - Design token sync system
- **`airtable/README.md`** - Content management integration
- **`eleventy/README.md`** - Build system and collections
- **`styles/README.md`** - CSS architecture

## Key Documentation Areas

### Animation System (`js/choreography/`)

Event-driven animation coordination using GSAP, with section controllers and centralized event bus.

### Design Integration (`figma/`)

Automated synchronization of Figma design tokens to CSS variables and Tailwind configuration.

### Content Management (`airtable/`)

Airtable-based headless CMS with smart caching and image processing automation.

### Build System (`eleventy/`)

11ty static site generation with custom collections, filters, and Nunjucks templates.

{% if collections.documentation.length > 0 %}

## Available Documentation

{% for doc in collections.documentation | sort(false, false, 'data.section') %}

- [{{ doc.data.title }}]({{ doc.url }})
  {% endfor %}
  {% endif %}

## Documentation Organization

All documentation is sourced from README.md files in the codebase:

```
js/choreography/README.md       → /docs/choreography/
js/choreography/sections/README.md → /docs/choreography/sections/
figma/README.md                 → /docs/figma/
airtable/README.md              → /docs/airtable/
eleventy/README.md              → /docs/eleventy/
```

Documentation is automatically rebuilt when README files are updated during development (`npm start`).
