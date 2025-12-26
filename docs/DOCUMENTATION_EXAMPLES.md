<!-- @format -->

# Documentation Updates - Before & After Examples

## Template Usage Guidance

### BEFORE: Ambiguous component usage

```njk
{# Unclear whether to use registry or direct include #}
{% from "_includes/_registry.njk" import component, icon, button %}
{{ icon("chevron-down", "md", "text-primary-500") }}
{{ component("atoms", "button", { label: "Click me" }) %}
```

### AFTER: Clear production pattern

```njk
{# Direct includes are the standard pattern for production #}
{% include "atoms/icon.njk" with { name: "chevron-down", size: "md" } %}
{% include "atoms/button.njk" with { label: "Click me", type: "primary" } %}
```

---

## Airtable Integration

### BEFORE: Unclear collection access

```njk
{# Doesn't show how to work with Airtable collections #}
{{ component("molecules", "project-card", { title: "Project" }) }}
```

### AFTER: Clear Airtable patterns

```njk
{# Direct collection access - automatically created from Airtable tables #}
{% for project in collections.projects %}
  {% include "molecules/card/project.njk" with { project: project } %}
{% endfor %}

{# Link related content using findRecord filter #}
{% set organizations = collections.organizations | findRecord(project.organization_ids) %}
{% include "organisms/figure/organizations.njk" with { orgs: organizations } %}
```

---

## Filter Documentation

### BEFORE: Minimal documentation

```javascript
/**
 * Convert markdown string to HTML.
 */
export function markdownify(markdownString) {
  // ... implementation
}
```

### AFTER: Comprehensive documentation

```javascript
/**
 * Convert markdown to HTML.
 * Supports:
 * - Inline formatting (bold, italic, links)
 * - Code blocks and inline code
 * - Lists and nested lists
 * - Line breaks (single \n becomes <br>)
 * - URL auto-linking
 *
 * @param {string} markdownString - Markdown content to convert
 * @returns {string} HTML output safe for template rendering
 *
 * EXAMPLE:
 * {{ "**Bold** and *italic* text" | markdownify }}
 * => "<p><strong>Bold</strong> and <em>italic</em> text</p>"
 */
export function markdownify(markdownString) {
  const md = new markdownIt({
    html: false, // Don't allow raw HTML in markdown
    breaks: true, // Convert \n to <br> in paragraphs
    linkify: true, // Auto-link URLs
    typographer: true, // Smart quotes and dashes
  });

  return md.render(markdownString);
}
```

---

## Array Filter Usage

### BEFORE: Unclear what filters do

```javascript
export function groupByFilter(array, key) {
  // ... implementation
}
```

### AFTER: Complete usage guide

```javascript
/**
 * Group array items by a property value into an object.
 * Creates an object where keys are property values and values are arrays of items.
 *
 * @param {Array} array - Array to group
 * @param {string} key - Property name to group by
 * @returns {Object} Grouped object structure
 *
 * EXAMPLE:
 * {{ projects | groupBy("category") }}
 * => { "web": [{...}, {...}], "print": [{...}] }
 *
 * TEMPLATE USAGE:
 * {% for category, projects in grouped %}
 *   <h3>{{ category }}</h3>
 *   {% for project in projects %}
 *     <div>{{ project.title }}</div>
 *   {% endfor %}
 * {% endfor %}
 */
export function groupByFilter(array, key) {
  // ... implementation
}
```

---

## Shortcode Documentation

### BEFORE: No documentation

```javascript
export function picture(pe, peClasses = '', imgClasses = '') {
  // ... implementation (no explanation)
}
```

### AFTER: Complete shortcode README with examples

````markdown
### `picture` - Responsive Image Handler

Applies CSS classes to picture elements and removes restrictive width/height attributes.

**Signature**:

```javascript
picture(htmlString, (pictureClasses = ''), (imgClasses = ''));
```
````

**Parameters**:

- `htmlString` - The `<picture>` or `<img>` HTML element as a string
- `pictureClasses` - CSS classes to apply to the `<picture>` wrapper
- `imgClasses` - CSS classes to apply to the `<img>` element

**Usage in Templates**:

```nunjucks
{% picture imageElement, "w-full max-w-4xl mx-auto", "object-cover" %}
```

**What It Does**:

- Adds specified CSS classes to `<picture>` and `<img>` elements
- Removes `width` and `height` attributes that can cause CSS layout issues
- Handles both `<picture>` elements and standalone `<img>` tags

````

---

## Architecture Clarity

### BEFORE: Unclear 11ty role
```markdown
## What 11ty Does for UX

11ty serves as the **content-to-experience pipeline**, automatically:
- Transforms content from Airtable CMS into web pages
- Generates navigation based on content relationships
- Optimizes images for fast loading and accessibility
- Creates interactive components like lightboxes
- Ensures consistency across all pages through templates
````

### AFTER: Clear, detailed explanation

```markdown
## What 11ty Does for UX

11ty serves as the **content-to-experience pipeline**, automatically:

- **Transforms content** from Airtable CMS into web pages
- **Generates navigation** based on file structure and content metadata
- **Creates collections** that make content queryable in templates
- **Optimizes images** for responsive display and accessibility
- **Manages filters and shortcodes** for consistent content presentation
- **Ensures consistency** across all pages through template inheritance

Think of it as the automation layer between your content management
system (Airtable) and your design system (Figma tokens), handled through
reusable template patterns.
```

---

## Filter Integration

### BEFORE: Missing usage context

```markdown
### `/filters/` - Content Processing

**What it does**: Transforms raw content into user-friendly formats

- **`string.js`** - Text processing (truncate, markdown conversion, formatting)
- **`date.js`** - Date formatting for human readability
- **`array.js`** - List manipulation for content organization
```

### AFTER: Clear usage and Airtable integration

````markdown
### `/filters/` - Content Processing

**Available Filters** (in `filters/` subdirectory):

- **`string.js`** - Text processing (truncate, markdown conversion, slug generation)
- **`date.js`** - Date formatting for human readability
- **`array.js`** - List manipulation and filtering (findRecord, unique, groupBy)

**Common Usage**:

```nunjucks
{{ description | markdownify }}     {# Markdown to HTML #}
{{ title | truncate(50) }}          {# Shorten with ellipsis #}
{{ publishDate | dateFormat }}      {# Human-readable date #}
{{ collection | findRecord(ids) }}  {# Match records by ID array #}
```
````

**Airtable Integration**:

```nunjucks
{{ activity.date | postDate }}      {# Converts ISO → "Jan 15, 2024" #}
```

````

---

## Component System Clarity

### BEFORE: Registry-first guidance
```markdown
### **Quick Start - Enhanced Workflow**

### **Using the Component Registry**

```njk
{# Import the registry system #}
{% from "_includes/_registry.njk" import component, icon, button %}

{# Use shorthand helpers #}
{{ icon("chevron-down", "md", "text-primary-500") }}
````

### AFTER: Direct-include first guidance

````markdown
### **Quick Start - Production Workflow**

### **Using Components in Templates**

Always use direct includes for production templates:

```njk
{# Direct include - recommended for production #}
{% include "atoms/button.njk" with { label: "Click Me", type: "primary" } %}
{% include "atoms/icon.njk" with { name: "chevron-down", size: "md" } %}
{% include "molecules/card/project.njk" with { project: projectData } %}
```
````

The registry system is available for documentation purposes.

```

---

## Summary of Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **Component Usage** | Ambiguous registry-first pattern | Clear direct-include pattern |
| **Filter Docs** | Minimal comments | Comprehensive with examples |
| **Shortcodes** | No documentation | Complete API reference |
| **11ty Role** | Generic description | Detailed pipeline explanation |
| **Airtable Integration** | Unclear | Multiple clear examples |
| **Date Handling** | Not explained | Clear ISO string handling |
| **Array Operations** | Implementation only | Complete with use cases |
| **Developer Onboarding** | Time-consuming learning curve | Quick reference available |

---

**Result**: Developers now have clear, example-driven documentation that reduces learning curve and improves code quality through clear patterns and best practices.
```
