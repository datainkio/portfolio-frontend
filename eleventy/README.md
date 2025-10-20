<!-- @format -->

# 11ty Configuration for UX Designers

This directory contains the 11ty (Eleventy) static site generator configuration
that powers the content management and user experience patterns for the
portfolio. Think of 11ty as the engine that transforms structured content into
accessible, performant web experiences.

## What 11ty Does for UX

11ty serves as the **content-to-experience pipeline**, automatically:

- **Transforms content** from Airtable into web pages
- **Generates navigation** based on content relationships
- **Optimizes images** for fast loading and accessibility
- **Creates interactive components** like lightboxes and collapsible content
- **Ensures consistency** across all pages through templates

## Directory Structure

### `/collections/` - Content Organization

**What it does**: Defines how content gets grouped and made available to
templates

- **`content.js`** - Connects Airtable tables to 11ty collections (projects →
  pages)
- **`navigation.js`** - Registers navigation collections with 11ty (delegates processing to services)
- **`index.js`** - Orchestrates all collection building

**UX Impact**: Determines information architecture and how users navigate
between content

### `/services/` - Business Logic Processing

**What it does**: Encapsulates complex data processing logic in reusable, testable classes

- **`NavigationBuilder.js`** - Handles all navigation processing (directory scanning, hierarchy building, data transformation)
- **Service Pattern** - Separates business logic from 11ty configuration for better maintainability

**UX Impact**: Ensures consistent navigation behavior and enables complex content relationships

### `/filters/` - Content Processing

**What it does**: Transforms raw content into user-friendly formats

- **`string.js`** - Text processing (truncate, markdown conversion, formatting)
- **`date.js`** - Date formatting for human readability
- **`array.js`** - List manipulation for content organization
- **`image.js`** - Image optimization and responsive sizing
- **`color.js`** - Color manipulation for theming
- **`dom.js`** - HTML element manipulation
- **`file.js`** - File handling utilities

**UX Impact**: Ensures content displays consistently and accessibly across all
contexts

### `/shortcodes/` - Reusable Components

**What it does**: Creates reusable UI patterns that content editors can easily
use

- **`image.js`** - Smart image handling with automatic lightbox functionality
- **`loremipsatron.js`** - Placeholder text generation for prototyping
- **`collapsible.js`** - Expandable content sections

**UX Impact**: Provides consistent interaction patterns and reduces cognitive
load

### `/plugins/` - Core Functionality

**What it does**: Extends 11ty with essential features

- **Navigation plugin** - Hierarchical menu generation
- **HTML optimization** - Performance improvements through minification
- **Base URL handling** - Ensures links work across different environments

**UX Impact**: Improves performance and ensures reliable navigation

## Key UX Patterns Enabled

### 1. **Adaptive Navigation with Service Architecture**

```javascript
// Service-based navigation processing
const navigationBuilder = new NavigationBuilder(site);
eleventyConfig.addCollection('nav_primary', function (collectionApi) {
  return navigationBuilder.buildPrimaryNavigationFromData(directories, projects);
});
```

Navigation automatically updates when content changes through a clean service layer that separates business logic from 11ty configuration, improving maintainability and testability.

### 2. **Smart Image Handling**

```javascript
// Responsive images with lightbox functionality
{% lightbox imageData, "Alt text", "Caption" %}
```

Images automatically optimize for different screen sizes and provide accessible
zoom functionality.

### 3. **Content Relationships**

```javascript
// Links related content automatically
{% set orgs = collections.organizations | findRecord(project.organizations) %}
```

Related content surfaces automatically, helping users discover relevant
information.

### 4. **Accessible Interactions**

All components include proper ARIA labels, keyboard navigation, and semantic
HTML structure.

## Content Creator Benefits

- **No HTML knowledge required** - Use shortcodes like `{% picture %}` instead
  of complex markup
- **Consistent formatting** - Filters ensure dates, text, and images display
  uniformly
- **Automatic optimization** - Images and HTML are optimized without manual
  intervention
- **Preview-friendly** - Changes are immediately visible in development mode
- **Service-driven reliability** - Complex operations handled by tested service classes

## Architecture Benefits

### Service Layer Pattern

- **Separation of Concerns** - Business logic separated from 11ty configuration
- **Testability** - Services can be unit tested independently
- **Reusability** - Logic can be used across multiple contexts
- **Maintainability** - Changes to complex operations isolated in service classes

### Collection Architecture

- **Clean Registration** - Collections focus only on 11ty integration
- **Dependency Management** - Services handle complex data dependencies
- **Error Isolation** - Service errors don't break entire build process

## Performance Features

- **HTML minification** - Removes unnecessary whitespace for faster loading
- **Image optimization** - Multiple sizes generated automatically
- **Efficient navigation** - Hierarchical menus built once, cached for reuse
- **Smart caching** - Content updates only when source data changes

## Accessibility Features

- **Semantic HTML** - All components generate proper HTML structure
- **Alt text handling** - Image shortcodes require descriptive text
- **Keyboard navigation** - Interactive elements support keyboard users
- **Screen reader friendly** - Proper heading hierarchy and ARIA labels

This configuration ensures that design decisions translate into inclusive,
performant user experiences without requiring technical expertise from content
creators. The service architecture provides a robust foundation for complex
content operations while maintaining clean separation between data processing
and presentation logic.
