---
aix:
  id: frontend.views.molecules.card.readme
  role: Documents card molecule components for displaying content types across the portfolio.
  status: stable
  surface: internal
  owner: Template Steward
  tags:
    - molecules
    - card
    - nunjucks
  type: guide
  scope: frontend
  audience: maintainers
  perf:
    readPriority: low
    cacheSafe: true
    critical: false
---

# Card Molecules

Card components for displaying various content types across the portfolio site.

## Available Cards

### `card.njk` - Generic Content Card

**Purpose**: Displays a reusable card with optional image, title, metadata, and optional link.

**Usage Pattern**: Macro (import and call with parameters)

```njk
{% import "molecules/card/card.njk" as card %}

{{ card.render({
  title: project.title,
  eyebrow: project.organization.title,
  description: project.abstract,
  meta: "Status: " ~ project.status,
  featured: project.featured,
  image: project.image,
  url: project.url
}) }}
```

**Parameters**:

- `title` (required): Card heading text
- `eyebrow` (optional): Small context label shown above the title (for example organization)
- `description` (optional): Supporting copy shown below the title
- `meta` (optional): Compact metadata line (for example status/year)
- `featured` (optional): When true, renders a featured badge
- `image` (optional): Image source string or object (`{ src, alt }`, `{ url, alt }`, or `{ asset: { url }, alt }`)
- `url` (optional): Card destination URL for linked image/title
- `classes` (optional): Additional utility classes for the outer card container
- `imageClasses` (optional): Additional utility classes for the image element
- `showTitle` (optional, default: true): Toggle title rendering

### `category.njk` - Project Category Display

**Purpose**: Displays a project category with associated projects, recognition, and outcomes.

**Usage Pattern**: Macro (import and call with parameters)

```njk
{% import "molecules/card/category.njk" as categoryCard %}

{{ categoryCard.render({
  category: categoryObject,
  maxProjects: 3,
  showRecognition: true,
  showOutcomes: true
}) }}
```

**Parameters**:

- `category` (required): Category object with `slug`, `title`, and `projects` array
- `maxProjects` (optional, default: 3): Maximum projects to display
- `showRecognition` (optional, default: true): Show recognition section
- `showOutcomes` (optional, default: true): Show outcomes section

**Example with Custom Options**:

```njk
{% import "molecules/card/category.njk" as categoryCard %}

{# Show only 2 projects, hide outcomes #}
{{ categoryCard.render({
  category: category,
  maxProjects: 2,
  showOutcomes: false
}) }}
```

### `project.njk` - Project Teaser Card

**Purpose**: Displays project previews from the Sanity `project` schema using schema-native fields.

**Usage Pattern**: Macro (import and call with parameters)

```njk
{% import "molecules/card/project.njk" as projectCard %}

{{ projectCard.render({
  project: projectObject
}) }}
```

**Parameters**:

- `project` (required): Project object from the `projects` collection (`title`, `slug`, `abstract`, `featuredImage`, `organization`, `status`, `featured`, `caseStudyUrl`, `externalLink`)
- `project.card` (preferred when present): Canonical card view model normalized in `frontend/eleventy/collections/sanity.js` (`title`, `image`, `url`, `eyebrow`, `description`, `meta`, `featured`)
- `title`, `description`, `organization`, `featured`, `url`, `image`, `eyebrow`, `byline` (optional): Explicit overrides when needed (`organization` is treated as a `byline` alias)
- `classes`, `imageClasses`, `showTitle` (optional): Pass-through presentation controls to `card.njk`

Note: This macro now expects normalized `project.card` data (provided upstream for both `projects` and `projectsByIndustry`) and falls back only to explicit override params plus hard defaults. It no longer derives `eyebrow`/`byline` from `project.organization` fields.

### `organization.njk` - Organization Card

**Purpose**: Displays organizations from the Sanity `organization` schema using normalized card fields.

**Usage Pattern**: Macro (import and call with parameters)

```njk
{% import "molecules/card/organization.njk" as organizationCard %}

{{ organizationCard.render({
  organization: organizationObject
}) }}
```

**Parameters**:

- `organization` (required): Organization record from `collections.organizations`
- `organization.card` (preferred when present): Canonical card view model normalized in `frontend/eleventy/collections/sanity.js`
- `title`, `description`, `eyebrow`, `featured`, `url`, `image`, `meta` (optional): Explicit overrides when needed
- `classes`, `imageClasses`, `showTitle` (optional): Pass-through presentation controls to `card.njk`

Note: Legacy field-level fallback chains were removed. Wrappers now expect normalized `*.card` data (or explicit override params).

### `award.njk` - Award Card

**Purpose**: Displays awards from the Sanity `award` schema using normalized card fields.

**Usage Pattern**: Macro (import and call with parameters)

```njk
{% import "molecules/card/award.njk" as awardCard %}

{{ awardCard.render({
  award: awardObject
}) }}
```

**Parameters**:

- `award` (required): Award record from `collections.awards`
- `award.card` (preferred when present): Canonical card view model normalized in `frontend/eleventy/collections/sanity.js`
- `title`, `description`, `eyebrow`, `featured`, `url`, `image`, `meta` (optional): Explicit overrides when needed
- `classes`, `imageClasses`, `showTitle` (optional): Pass-through presentation controls to `card.njk`

Note: Legacy field-level fallback chains were removed. Wrappers now expect normalized `*.card` data (or explicit override params).

**Example with Modal**:

```njk
{% import "molecules/card/project.njk" as projectCard %}

{# First project featured with modal #}
{% for project in collections.projects %}
  {{ projectCard.render({
    project: project,
    featured: loop.index == 1
  }) }}
{% endfor %}
```

### `image.njk` - Image Metadata Card

**Purpose**: Displays image with technical details and metadata.

**Usage Pattern**: Include (uses variables from parent scope)

```njk
{% include "molecules/card/image.njk" %}
{# Expects: image variable in scope #}
```

## Best Practices

### When to Use Macros vs Includes

**Import Convention (Recommended)**:

- ✅ Use root-relative template paths (for example `molecules/card/card.njk`) instead of `../` chains
- ✅ Prefer namespaced imports (`{% import "molecules/card/card.njk" as Card %}`) for clarity and refactor safety

**Use Macros (Recommended)**:

- ✅ Component needs explicit parameters
- ✅ Reusable across different contexts
- ✅ Clear API contract required
- ✅ Prevents variable scope pollution

**Use Includes**:

- Static content without parameters
- Legacy components (consider refactoring)
- Simple, non-parameterized templates

### Migration Pattern

Converting from include to macro:

```njk
{# BEFORE: Include pattern #}
{% for category in collections.ia %}
  {% include "molecules/card/category.njk" %}
{% endfor %}

{# AFTER: Macro pattern #}
{% import "molecules/card/category.njk" as categoryCard %}
{% for category in collections.ia %}
  {{ categoryCard.render({ category: category }) }}
{% endfor %}
```

## Component Dependencies

- **Collections**: Requires `collections.projects`, `collections.images`, `collections.roles` for data lookup
- **Filters**: Uses `findRecord`, `sortByKey`, `getByIndexRange` custom filters
- **Shortcodes**: Uses `picture` shortcode for responsive images
- **Design Tokens**: Uses typography and spacing from Figma-synced CSS

## Future Enhancements

- [x] ~~Migrate `project.njk` to macro pattern~~ ✅ **Completed**
- [x] ~~Migrate `category.njk` to macro pattern~~ ✅ **Completed**
- [ ] Migrate `image.njk` to macro pattern
- [ ] Add loading states for async content
- [ ] Implement card variants (compact, expanded, grid)
- [ ] Add lazy loading support for project images
- [ ] Implement card skeleton/placeholder states
