---
title: Content Schemas
description: Field-level schema definitions for documentation and IA content types.
docType: reference
status: active
owner: frontend
tags:
  -  #docs
  -  #ia
  -  #content-strategy
  -  #schemas
eleventyComputed:
  title: "{{ title }}"
---

This page documents the Sanity CMS schema types powering the portfolio backend, their field structures, and cross-type relationships.

## Schema Architecture

Types are organized into four layers: **documents** (top-level CMS records), **objects** (embedded sub-schemas), **taxonomies** (reference vocabularies), and **config** (singleton site settings).

---

## Document Relationships

```mermaid
erDiagram
    PROJECT {
        string slug
        imageMeta featuredImage
        page page
        block[] body
        projectMeta meta
    }
    POST {
        page page
        datetime publishDate
        string postType
        reference author
    }
    AWARD {
        string title
        string slug
        string level
        string description
    }
    NUGGET {
        string title
        string id
        string description
        number weight
        image file
    }
    INSIGHT {
        string title
        date publishDate
        imageMeta image
    }
    ORGANIZATION {
        page page
        string description
        image logo
    }
    IMAGE_ASSET {
        string title
        string slug
        imageMeta image
        string[] tags
        boolean published
    }
    PERSON {
        string name
    }
    LANDING {
        string pageTitle
        string tagline
        file backgroundVideo
        image backgroundPoster
    }

    PROJECT }o--o{ ORGANIZATION : "meta.organization[]"
    PROJECT }o--o{ ROLE : "meta.roles"
    PROJECT }o--o{ ACTIVITY : "meta.activities"
    PROJECT }o--o{ OUTCOME : "meta.outcomes"
    PROJECT }o--o{ AWARD : "meta.awards"
    PROJECT }o--o{ IMAGE_ASSET : "meta.images"
    AWARD ||--o| ORGANIZATION : "organization"
    AWARD ||--o| PROJECT : "project"
    POST ||--|| PERSON : "author"
    POST }o--o{ NUGGET : "nuggets"
    INSIGHT ||--|| PERSON : "author"
    INSIGHT }o--o{ PROJECT : "projects"
    INSIGHT }o--o{ ACTIVITY : "activities"
    INSIGHT }o--o{ ROLE : "roles"
    INSIGHT }o--o{ INDUSTRY : "industries"
    NUGGET ||--o| POST : "project (post ref)"
    NUGGET }o--o{ IMAGE_ASSET : "images"
    PERSON }o--o{ POST : "posts"
    ORGANIZATION }o--o| INDUSTRY : "industry"
```

---

## Taxonomy Types

Simple reference documents used for classification and filtering. All taxonomies have `title` and `slug` fields.

```mermaid
classDiagram
    class Activity {
        +string title
        +slug slug
        +text description
        +string icon
    }
    class Role {
        +string title
        +slug slug
        +text description
        +string category
    }
    class Industry {
        +string title
        +slug slug
        +text description
        +string icon
    }
    class Outcome {
        +string title
        +slug slug
        +text description
        +string category
    }
```

---

## Object Types (Embedded)

Objects are not standalone documents — they are embedded within document types.

```mermaid
classDiagram
    class Page {
        +string title
        +slug slug
        +text abstract
        +heroBlock hero
        +section[] sections
        +seoMeta seo
    }
    class ProjectMeta {
        +metric[] metrics
        +ref organization
        +ref[] roles
        +ref[] activities
        +ref[] outcomes
        +ref[] awards
        +object[] team
    }
    class ImageMeta {
        +image asset
        +string alt
        +string caption
    }
    class SeoMeta {
        +string title
        +text description
        +image image
    }

    Page --> SeoMeta : seo
    ProjectMeta --> ImageMeta : via project.featuredImage
```

---

## Config &amp; Site Settings

Singleton documents controlling global site behavior.

| Type           | Purpose                                 |
| -------------- | --------------------------------------- |
| `siteSettings` | Global site title, URL, and default SEO |
| `navigation`   | Primary nav structure                   |
| `uiLabels`     | Editable UI copy and labels             |

---

## Notes

- `project.body` is Portable Text with an optional `project_aside` block for inline commentary.
- `page` is a shared object embedded in `project`, `post`, and `organization` — not a standalone document.
- `nugget` references `post` (not `project`) despite its `project` field name; this is a legacy schema mapping.
- Activity slugs must stay in sync with `PrinterMarks.js` category identifiers for the overlay animation system.
