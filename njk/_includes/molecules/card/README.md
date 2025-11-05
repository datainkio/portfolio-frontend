# Card Molecules

Card components for displaying various content types across the portfolio site.

## Available Cards

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

**Purpose**: Displays project preview with thumbnail, roles, and call-to-action.

**Usage Pattern**: Macro (import and call with parameters)

```njk
{% import "molecules/card/project.njk" as projectCard %}

{{ projectCard.render({
  project: projectObject,
  modal: false,
  featured: false,
  imageStyle: "auto"
}) }}
```

**Parameters**:

- `project` (required): Project object with `thumbnail`, `roles`, `title`, `teaser`, `url`, `id`
- `modal` (optional, default: false): Enable modal interaction instead of direct link
- `featured` (optional, default: false): Display as featured (larger aspect ratio)
- `imageStyle` (optional, default: "auto"): Custom image container CSS classes

**Example with Modal**:

```njk
{% import "molecules/card/project.njk" as projectCard %}

{# First project featured with modal #}
{% for project in collections.projects %}
  {{ projectCard.render({
    project: project,
    featured: loop.index == 1,
    modal: true
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
