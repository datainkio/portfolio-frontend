---
title: "User Guide"
template: "[[user-guide.njk]]"
templatePath: "views/pages/user-guide.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "page"
atomicLevel: "page"
status: "active"
tags:
  - eleventy
  - nunjucks
  - template
  - obsidian
  - page
---

# User Guide

Renders the `/user-guide/` singleton page from Sanity content.

## Template

- Source: [[user-guide.njk]]
- Path: `views/pages/user-guide.njk`

## Purpose

Displays the User Guide singleton: a heading, a short abstract, and a Portable Text body explaining how Russell works best with collaborators and clients. A jumplinks sidebar is generated from `<h2>` headings in the body.

## Role in the System

Classified as a **page** at the atomic **page** level based on its location under `views/pages/`.

## Data and Context

Content is sourced from the `userGuide` Sanity singleton. See the canonical contract in [[user-guide|content-model/contracts/pages/user-guide.md]] and document shape in [[userGuide|content-model/documents/singletons/userGuide.md]].

- `title` — Eleventy computed from `cms.userGuide[0].pageTitle`; rendered by the article header in [[base.njk]].
- `abstract` — Eleventy computed from `cms.userGuide[0].pageAbstract`; rendered by the article header in [[base.njk]].
- `body` — Eleventy computed from `cms.userGuide[0].bodyHtml` (Portable Text serialized to HTML by `frontend/data/sanity/transforms/user-guide.js`); injected into the `content` block.
- `sidebar_before` — set to `true` so [[base.njk]] renders the sidebar slot.

Front matter and computed data live in [[user-guide|frontend/ia/user-guide.md]].

## Relationships

- Extends:
  - [[base.njk]]
- Imports:
  - [[jumplinks.njk]]
- Filters used:
  - `extractHeadings` — derives jumplinks from rendered body HTML.
  - `safe` — marks the serialized body HTML as safe.
- Upstream data:
  - GROQ query: `frontend/data/sanity/queries/user-guide.js`
  - Projection: `frontend/data/sanity/projections/userGuide/userGuideProjection.js`
  - Transform: `frontend/data/sanity/transforms/user-guide.js`

## Notes for Future Maintenance

- Treat the content-model docs as the authority on field names (`pageTitle`, `pageAbstract`, `pageBody`). Update projection, transform, and template variables to match if the contract changes.
- Keep this sidecar in sync when the template's blocks, imports, or computed data change.
- Run `npm start` after changes to validate the Eleventy build and Sanity fetch.

## Open Questions

- Should the jumplinks sidebar be suppressed when the body has no `<h2>` headings?
- Is an empty `pageBody` ever expected in practice, or should it become a required field?
