<!-- @format -->

# Eleventy Filters - Template Data Processing

Central registry and documentation for all 11ty filters used in Nunjucks templates. Filters transform data for display without modifying the source - perfect for formatting dates, manipulating arrays, and processing strings.

## Architecture Overview

**Entry Point**: `filters.js` - Imports and registers all filter modules
**Pattern**: Each module exports a default function that registers its filters
**Loading**: Imported by `.eleventy.js` configuration

```javascript
// In .eleventy.js
import filters from "./eleventy/filters/filters.js";
export default async function (eleventyConfig) {
  filters(eleventyConfig);
}
```

## Filter Categories

### String Filters ([string.js](./string.js))

Transform and format text content.

| Filter        | Purpose                      | Example                                          |
| ------------- | ---------------------------- | ------------------------------------------------ |
| `uppercase`   | Convert text to uppercase    | `{{ "hello" \| uppercase }}` → `"HELLO"`         |
| `truncate`    | Shorten text with ellipsis   | `{{ text \| truncate(50) }}` → First 50 chars... |
| `markdownify` | Convert Markdown to HTML     | `{{ description \| markdownify }}`               |
| `prettify`    | Markdown with custom classes | `{{ body \| prettify("prose") }}`                |

**Common Use Cases:**

- Preview text for cards: `{{ post.body | truncate(150) }}`
- Rich text content: `{{ project.description | markdownify }}`
- Styled markdown: `{{ content | prettify("prose prose-lg") }}`

### Array Filters ([array.js](./array.js))

Manipulate, query, and transform collections.

| Filter            | Purpose                 | Example                                   |
| ----------------- | ----------------------- | ----------------------------------------- |
| `groupBy`         | Group items by property | `{{ projects \| groupBy("category") }}`   |
| `unique`          | Remove duplicates       | `{{ tags \| unique("name") }}`            |
| `sortByKey`       | Sort by property        | `{{ items \| sortByKey("date") }}`        |
| `getByIndex`      | Get single item         | `{{ items \| getByIndex(0) }}`            |
| `getByIndexRange` | Get subset              | `{{ items \| getByIndexRange(0, 5) }}`    |
| `findIndexOf`     | Find item index         | `{{ items \| findIndexOf("id", "123") }}` |
| `sum`             | Total numeric values    | `{{ numbers \| sum }}`                    |

**Common Use Cases:**

- Group projects by category: `{{ collections.projects | groupBy("fields.category") }}`
- Sort by date: `{{ collections.activities | sortByKey("fields.date") }}`
- Get recent items: `{{ posts | sortByKey("date") | getByIndexRange(0, 3) }}`

### Date Filters ([date.js](./date.js))

Format dates for human readability using Luxon.

| Filter     | Purpose            | Example                                    |
| ---------- | ------------------ | ------------------------------------------ |
| `postDate` | Medium date format | `{{ date \| postDate }}` → `"Jan 1, 2024"` |

**Common Use Cases:**

- Display publish dates: `{{ post.published | postDate }}`
- Format CMS dates: `{{ activity.date | postDate }}`

### Image Filters ([image.js](./image.js))

Process image data from CMS assets.

| Filter      | Purpose         | Example                              |
| ----------- | --------------- | ------------------------------------ |
| `findImage` | Get image by ID | `{{ images \| findImage(imageId) }}` |

**Common Use Cases:**

- Display project images: `{% picture (project.fields.images | findImage(id)) %}`

### File Filters ([file.js](./file.js))

Process file metadata and assets.

| Filter            | Purpose               | Example                                |
| ----------------- | --------------------- | -------------------------------------- |
| `filesize`        | Format file size      | `{{ bytes \| filesize }}` → `"1.5 MB"` |
| `uniqueTypes`     | Get unique file types | `{{ files \| uniqueTypes }}`           |
| `countByType`     | Count files by type   | `{{ files \| countByType("image") }}`  |
| `totalSize`       | Sum file sizes        | `{{ files \| totalSize }}`             |
| `lastCacheUpdate` | Last cache timestamp  | `{{ cache \| lastCacheUpdate }}`       |

**Common Use Cases:**

- Display attachment info: `{{ file.size | filesize }}`
- Asset statistics: `{{ assets | countByType("pdf") }}`

### Color Filters ([color.js](./color.js))

Process color values and Figma design tokens.

Documented in [color.js](./color.js) - primarily for design token processing.

### DOM Filters ([dom.js](./dom.js))

Manipulate HTML and DOM structures.

| Filter   | Purpose                   | Example                          |
| -------- | ------------------------- | -------------------------------- |
| `expand` | Expand template variables | `{{ template \| expand(data) }}` |

### General Filters ([filters.js](./filters.js))

Cross-cutting utilities that don't fit other categories.

| Filter          | Purpose                              | Example                                              |
| --------------- | ------------------------------------ | ---------------------------------------------------- |
| `datatype`      | Get variable type                    | `{{ value \| datatype }}` → `"array"`                |
| `findFigmaPage` | Find Figma page                      | `{{ designSystem \| findFigmaPage("Colors") }}`      |
| `findRecord`    | **Critical**: Resolve linked records | `{{ collections.organizations \| findRecord(ids) }}` |
| `filterByKey`   | Filter by property                   | `{{ items \| filterByKey("status", "live") }}`       |

## Critical Filter: findRecord

**Purpose**: Connect linked record IDs to actual content records.

**Why It's Critical**: CMS relationships can return arrays of record IDs. This filter resolves those IDs to actual record objects from collections.

**Usage Pattern**:

```njk
{# Project has organization_ids: ["rec123", "rec456"] #}
{% set orgs = collections.organizations | findRecord(project.fields.organization_ids) %}

{% for org in orgs %}
  <div>{{ org.fields.name }}</div>
{% endfor %}
```

**Handles**:

- Single ID: `"rec123"` → Single record
- Array of IDs: `["rec123", "rec456"]` → Array of records
- Comma-separated: `"rec123,rec456"` → Array of records
- Null/undefined: Returns `null` safely

## Filter Loading Pattern

All filters follow this registration pattern:

```javascript
// In individual filter file (e.g., string.js)
export default function (eleventyConfig) {
  eleventyConfig.addFilter("filterName", filterFunction);
}

export function filterFunction(input, ...args) {
  // Implementation
  return output;
}
```

**Key Points**:

- Default export registers with eleventyConfig
- Named exports allow testing and reuse
- Filters are pure functions (no side effects)

## Common Patterns

### Chaining Filters

Filters can be chained left-to-right:

```njk
{{ collections.projects
   | sortByKey("fields.date")
   | getByIndexRange(0, 3)
   | groupBy("fields.category") }}
```

### Conditional Filtering

Use filters in conditionals:

```njk
{% if (collections.projects | findIndexOf("id", projectId)) > -1 %}
  Project exists
{% endif %}
```

### Loop Filtering

Filter within loops:

```njk
{% for project in collections.projects | sortByKey("fields.priority") %}
  <h2>{{ project.fields.title | truncate(50) }}</h2>
  <p>{{ project.fields.description | markdownify }}</p>
{% endfor %}
```

## Filter Performance

**Best Practices**:

1. **Filter early**: Apply filters before loops, not inside them
2. **Cache results**: Assign filtered collections to variables
3. **Limit processing**: Use `getByIndexRange` to limit large arrays
4. **Avoid nested loops**: Use `findRecord` for relationships instead

**Example - Inefficient**:

```njk
{% for project in collections.projects %}
  {# Filters entire collection on each iteration #}
  {% for org in collections.organizations | findRecord(project.fields.org_id) %}
    ...
  {% endfor %}
{% endfor %}
```

**Example - Efficient**:

```njk
{% for project in collections.projects %}
  {# Finds specific records once per project #}
  {% set projectOrgs = collections.organizations | findRecord(project.fields.org_id) %}
  {% for org in projectOrgs %}
    ...
  {% endfor %}
{% endfor %}
```

## Adding New Filters

1. **Create filter file** (or add to existing category file):

```javascript
// eleventy/filters/custom.js
export default function (eleventyConfig) {
  eleventyConfig.addFilter("myFilter", myFilterFunction);
}

export function myFilterFunction(input, arg1, arg2) {
  // Process input
  return output;
}
```

2. **Import in filters.js**:

```javascript
import customConfig from "./custom.js";

export default function (eleventyConfig) {
  // ... other imports
  customConfig(eleventyConfig);
}
```

3. **Document in README** (this file)

4. **Use in templates**:

```njk
{{ data | myFilter(arg1, arg2) }}
```

## Testing Filters

Filters are exported as named functions for testing:

```javascript
import { truncate } from "./eleventy/filters/string.js";

// Test directly
const result = truncate("Long text here", 10);
console.assert(result === "Long text ...");
```

## Debugging Filters

**Check filter output**:

```njk
{{ data | myFilter | dump }}
```

**Check data type**:

```njk
{{ data | datatype }}  {# Returns: "array", "object", etc. #}
```

**Inspect in development**:

```njk
<pre>{{ data | dump(2) }}</pre>  {# Pretty-print with indentation #}
```

## Related Files

- **Configuration**: `.eleventy.js` - Loads filter system
- **Collections**: `eleventy/collections/` - Data source for filters
- **Templates**: `views/` - Filter usage examples
- **Config**: `site.json` - CMS defaults

## Filter Inventory

| Category  | Filter Count | File                       |
| --------- | ------------ | -------------------------- |
| String    | 4            | [string.js](./string.js)   |
| Array     | 7            | [array.js](./array.js)     |
| Date      | 1            | [date.js](./date.js)       |
| Image     | 1            | [image.js](./image.js)     |
| File      | 5            | [file.js](./file.js)       |
| Color     | Multiple     | [color.js](./color.js)     |
| DOM       | 1            | [dom.js](./dom.js)         |
| General   | 4            | [filters.js](./filters.js) |
| **Total** | **23+**      | 8 files                    |

## Quick Reference

**Most Used Filters**:

- `findRecord` - Resolve linked relationships
- `sortByKey` - Sort collections
- `markdownify` - Render rich text
- `truncate` - Preview text
- `postDate` - Format dates
- `groupBy` - Organize collections

**Performance Filters**:

- `getByIndexRange` - Limit large arrays
- `unique` - Remove duplicates
- `filterByKey` - Quick property filtering

**Debug Filters**:

- `datatype` - Check variable types
- `dump` - Pretty-print data (built-in 11ty)

---

**Version**: 1.0  
**Status**: ✅ Current  
**Total Filters**: 23+
