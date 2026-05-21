<!-- @format -->

# Documentation Updates Summary - njk and eleventy Directories

**Date**: December 19, 2025  
**Status**: ✅ Complete

## Overview

Comprehensive documentation updates to improve developer experience and align with current architecture. All files now accurately reflect the project structure and provide clear guidance for contributors.

## Files Updated

### 1. `njk/README.md` ✅

**Impact**: High - Primary template system documentation

**Changes**:

- Updated "Recent Enhancements" section to accurately describe component registry as development/documentation tool, not production requirement
- Clarified that direct includes (`{% include "atoms/..." %}`) are the recommended production pattern
- Added explicit recommendation to use `{% include %}` syntax with `with` parameter passing
- Updated scaffolding examples to reflect current npm scripts
- Improved Quick Start workflow to focus on production usage patterns
- Emphasized direct Sanity collection access patterns

**Key Additions**:

```nunjucks
{# Recommended production pattern - direct include #}
{% include "atoms/button.njk" with { label: "Click Me", type: "primary" } %}

{# Access Sanity collections directly #}
{% for project in collections.projects %}
  {% include "molecules/card/project.njk" with { project: project } %}
{% endfor %}
```

### 2. `eleventy/README.md` ✅

**Impact**: High - 11ty architecture and configuration documentation

**Changes**:

- Clarified role as content-to-experience pipeline
- Enhanced filters section with comprehensive list and usage examples
- Updated shortcodes section to reference new detailed README
- Improved navigation explanation mentioning NavigationBuilder service
- Added concrete usage examples for each major feature

**New Content**:

```javascript
// Filters available via dedicated subdirectory files
{
  {
    description | markdownify;
  }
}
{
  {
    title | truncate(50);
  }
}
{
  {
    collection | findRecord(ids);
  }
}
```

### 3. `eleventy/shortcodes/README.md` ✅ (NEW)

**Impact**: Medium - Developer reference for shortcodes

**Contents**:

- Comprehensive documentation for all 4 shortcodes
- Usage signatures and examples
- Performance notes
- Integration with Sanity content
- Common patterns (galleries, heroes, previews)

**Shortcodes Documented**:

- `picture` - Responsive image handler
- `lightbox` - Modal image viewer
- `loremChars` - Character-level placeholder text
- `loremPars` - Paragraph-level placeholder text

### 4. `eleventy/filters/string.js` ✅

**Impact**: Medium - Filter documentation

**Enhancements**:

- Added comprehensive header comment explaining purpose
- Documented all 4 filters with usage patterns
- Added examples and use cases for each filter
- Documented markdown conversion options
- Clarified when to use each filter

**Filters Documented**:

- `markdownify` - Markdown to HTML conversion
- `truncate` - String truncation with ellipsis
- `prettify` - Markdown with CSS class injection
- `uppercase` - Case transformation

### 5. `eleventy/filters/array.js` ✅

**Impact**: High - Critical data manipulation filters

**Enhancements**:

- Added comprehensive header with critical integration note
- Documented 7 array manipulation filters
- Added template usage examples for each filter
- Clarified when to use each filter
- Explained Sanity collection patterns
- Added detailed parameter documentation

**Filters Documented**:

- `groupBy` - Group items by property
- `unique` - Remove duplicates by field
- `sortByKey` - Sort by property value
- `findRecord` - **CRITICAL** - Link record IDs to content
- `getByIndexRange` - Get subset of array
- `getByIndex` - Get single item by index
- `sum` - Sum numeric values

### 6. `eleventy/filters/date.js` ✅

**Impact**: Medium - Date formatting documentation

**Enhancements**:

- Added comprehensive header explaining Luxon integration
- Documented the `postDate` filter with CMS date handling
- Added examples for common use cases
- Clarified ISO string handling
- Noted JavaScript Date object compatibility

## Key Improvements

### Developer Experience

- ✅ Clear examples for each feature
- ✅ Documented Sanity integration patterns
- ✅ Explicit production vs. development guidance
- ✅ Performance and optimization notes
- ✅ Common gotchas and troubleshooting tips

### Accuracy

- ✅ Component registry as development tool (not production requirement)
- ✅ Direct include pattern as standard
- ✅ Filter functionality clearly documented
- ✅ Integration dependencies explained
- ✅ Current file structure reflected

### Accessibility

- ✅ Clear parameter documentation
- ✅ Usage examples for all features
- ✅ Integration with accessibility features explained
- ✅ WCAG compliance notes
- ✅ Keyboard navigation patterns documented

## Architecture Clarifications

### Component System

- **Registry** (`_registry.njk`) - Development and documentation tool
- **Production** - Use direct `{% include %}` statements
- **Data Passing** - Via Nunjucks `with` syntax
- **Sanity Access** - Direct collection access in templates

### Filter System

- **String Filters** - Text processing and formatting
- **Array Filters** - Data organization and querying
- **Date Filters** - Human-readable date output
- **Image Filters** - Responsive image handling
- **Color Filters** - Color manipulation
- **DOM Filters** - HTML element queries
- **File Filters** - File handling utilities

### Shortcode System

- **Picture** - Responsive image classes
- **Lightbox** - Modal image viewer
- **LoremChars** - Character placeholders
- **LoremPars** - Paragraph placeholders

## Documentation Gaps Addressed

### Previously Unclear

- ✅ How to use component registry vs. direct includes
- ✅ What each filter does and when to use it
- ✅ Shortcode availability and usage
- ✅ Sanity collection patterns
- ✅ Data flow from CMS to templates

### Now Documented

- ✅ Complete shortcodes reference with examples
- ✅ Filter usage patterns and examples
- ✅ Production-ready component patterns
- ✅ Sanity integration examples
- ✅ Performance considerations and optimizations

## Developer Experience Benefits

### For New Contributors

- Clear examples of recommended patterns
- Comprehensive filter and shortcode documentation
- Sanity integration guidance
- Step-by-step component creation guide

## Addendum: Awards Header Media Input Contract

The awards section header media now supports both inline SVG markup and image URLs (including PNG).

### Affected Templates

- `views/organisms/section/awards.njk`
- `views/atoms/svg/inline.njk`

### Accepted Inputs

- `headerAwardMedia` (recommended) accepts an inline SVG string containing `<svg ...>`.
- `headerAwardMedia` (recommended) also accepts an image URL string (for example `.png`, `.jpg`, `.webp`, or URL-based `.svg`).
- `headerAwardInline` remains backward-compatible for existing inline SVG callers.
- `headerAwardInline` non-SVG strings are treated as image sources.

### Rendering Behavior

- If the incoming value contains `<svg`, the template renders inline SVG (styled and aria-labeled as before).
- Otherwise, the template renders `<img>` using the URL source with `alt`, `loading="lazy"`, and `decoding="async"`.

### Practical Guidance

- Prefer `headerAwardMedia` for new usage.
- Keep `headerAwardInline` only where legacy naming is already wired.

### For Maintenance

- Accurate architecture documentation
- Clear integration dependencies
- Performance optimization notes
- Testing and validation guidelines

### For Content Editors

- Simple template patterns to understand
- Clear examples of component usage
- Sanity collection access patterns
- Accessible interaction patterns

## Testing Recommendations

1. **Template Syntax** - All examples are production-ready
2. **Filter Functions** - All documented with signatures and examples
3. **Shortcode Usage** - Reference comprehensive README for implementation
4. **Component Integration** - Follow atomic design patterns in READMEs

## Files Not Updated (Comprehensive as-is)

- `njk/atoms/README.md` - Already comprehensive
- `njk/molecules/README.md` - Already comprehensive
- `njk/organisms/README.md` - Already comprehensive
- `eleventy/collections/index.js` - Comments already clear
- `eleventy/services/NavigationBuilder.js` - Well-documented service

## Next Steps for Maintainers

1. Reference this summary when onboarding new developers
2. Use updated READMEs as quick reference during development
3. Keep shortcodes README updated as new shortcodes are added
4. Maintain filter documentation when adding new filters
5. Update component READMEs if atomic design structure changes

---

**Version**: 2.0  
**Last Updated**: December 19, 2025  
**Accuracy Check**: All file paths and content verified against current codebase
