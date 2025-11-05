<!-- @format -->

# Template Architecture & Component System

**CRITICAL WARNING:** This directory contains the enhanced content presentation layer using Nunjucks templates with Atomic Design principles and advanced developer ergonomics. The system has been significantly improved with component registry, scaffolding tools, and comprehensive documentation.

## 🚀 **Recent Enhancements - Developer Ergonomics**

### **Component Registry System** ✅

- **Unified component loading**: `_registry.njk` provides centralized component discovery
- **Error handling**: Missing components show helpful error messages instead of breaking builds
- **Shorthand macros**: `icon()` and `button()` helpers for common components
- **Auto-documentation**: Component metadata extracted from frontmatter

### **Scaffolding System** ✅

- **Rapid component creation**: `npm run scaffold:component atoms button-group`
- **Standardized templates**: Consistent frontmatter and documentation structure
- **GSAP integration**: Animation-aware organism templates
- **Airtable compatibility**: Built-in support for dynamic content

### **Consolidated Icon System** ✅

- **Single icon component**: Replaced fragmented icon files with unified `atoms/icon.njk`
- **Flexible sizing**: xs, sm, md, lg, xl, 2xl size options
- **Error indicators**: Missing icons show helpful debug information
- **Design token integration**: Uses currentColor for flexible theming

### **Component Testing Page** ✅

- **Live component showcase**: `/dev/components/` displays all components with test data
- **Design token validation**: Tests Figma integration in real-time
- **Development utilities**: Component usage examples and scaffolding help

## 🎯 **What This Template System Enables**

The enhanced template system serves as the **content-to-HTML transformation engine** with:

- **🔄 Component reusability** - Build once, use everywhere with registry system
- **📊 Content separation** - UX structure independent of actual content
- **⚡ Dynamic generation** - Pages automatically adapt to Airtable content changes
- **♿ Accessibility by default** - Semantic HTML structure enforced through templates
- **🎨 Design system enforcement** - Figma tokens ensure brand consistency
- **🎬 Animation integration** - GSAP compatibility built into component structure
- **🛠️ Developer experience** - Scaffolding, testing, and documentation automation

## 🚀 **Quick Start - Enhanced Workflow**

### **Using the Component Registry**

```njk
{# Import the registry system #}
{% from "_includes/_registry.njk" import component, icon, button %}

{# Use shorthand helpers #}
{{ icon("chevron-down", "md", "text-primary-500") }}
{{ button("Click Me", "primary", "px-6 py-3") }}

{# Or use the full component() macro #}
{{ component("atoms", "avatar", { src: "image.jpg", alt: "User" }) }}
{{ component("molecules", "project-card", { title: "Project", content: "..." }) }}
```

### **Creating New Components**

```bash
# Create new atomic component
npm run scaffold:component atoms progress-bar

# Create new molecular component
npm run scaffold:component molecules project-card

# Create new organism with GSAP integration
npm run scaffold:component organisms hero-section

# Create new page template
npm run scaffold:page portfolio

# List all available components
npm run scaffold:list
```

### **Testing Components**

```bash
# Visit the component testing page
npm start
# Then navigate to: http://localhost:8080/dev/components/

# Components are tested with:
# - Live design token integration
# - Sample data from development environment
# - GSAP animation compatibility checks
# - Accessibility validation
```

## 🏗️ **Atomic Design Architecture**

Templates follow Brad Frost's Atomic Design methodology with enhanced developer ergonomics:

```
Atoms → Molecules → Organisms → Templates → Pages
```

This structure mirrors how designers naturally think about component systems and
enables efficient collaboration.

## Directory Structure & Component Hierarchy

### `/_includes/` - Reusable Component Library

#### `/atoms/` - Fundamental Building Blocks

**What they are**: The smallest, indivisible UI components **UX Impact**:
Ensures consistency in basic interactive elements across the entire experience

**Key Atoms:**

- **`heading.njk`** - Semantic heading levels (h1-h6) with accessibility
  validation
- **`button/`** - Interactive button states and variants
- **`link/`** - Navigation and action links with proper ARIA labels
- **`icon/`** - SVG icon system with consistent sizing
- **`input.njk`** - Form field components with validation states
- **`gtm-script.njk`**, **`gtm-noscript.njk`** - Analytics tracking

**Example Usage:**

```nunjucks
{% include "atoms/heading.njk" with { level: 2, text: "Section Title", class: "text-primary-600" } %}
```

#### `/molecules/` - Simple Component Combinations

**What they are**: Groups of atoms functioning together as a cohesive unit **UX
Impact**: Creates predictable interaction patterns users recognize across
contexts

**Key Molecules:**

- **`card/`** - Content cards for projects, articles, and media
- **`form.njk`** - Complete form layouts with validation
- **`input/`** - Complex input patterns (search, filters, navigation controls)
- **`list/`** - Organized content lists with various display patterns
- **`award-organization.njk`** - Recognition and affiliation displays

**Example: Project Card**

```nunjucks
{% import "molecules/card/project.njk" as projectCard %}

{# Automatically handles images, roles, titles, and CTAs #}
{{ projectCard.render({ project: project, modal: true }) }}
```

#### `/organisms/` - Complex Component Systems

**What they are**: Substantial interface sections composed of molecules and
atoms **UX Impact**: Defines major user interaction zones and navigation
paradigms

**Key Organisms:**

- **`header.njk`** - Site header with responsive navigation
- **`footer.njk`** - Site footer with links and metadata
- **`primary-nav.njk`** - Main navigation system with hierarchy
- **`mega-menu.njk`** - Expandable navigation for complex structures
- **`gallery.njk`** - Image and media galleries with lightbox
- **`section/`** - Content section patterns (hero, testimonials, features)
- **`modal/`** - Dialog and overlay interaction patterns
- **`pagination.njk`** - Multi-page content navigation

**Example: Section with Background**

```nunjucks
{% include "organisms/section.njk" with {
  heading: "Featured Projects",
  content: projectList,
  background: "bg-primary-50"
} %}
```

#### `/templates/` - Page Layout Structures

**What they are**: Complete page scaffolds that define overall layout patterns
**UX Impact**: Ensures consistent page structure and navigation across site
sections

**Available Templates:**

- **`base.njk`** - Master layout with header, main, footer structure
- **`landing.njk`** - Homepage and landing page layouts
- **`blog.njk`** - Article and content-focused layouts
- **`documentation.njk`** - Technical content with navigation
- **`parallax.njk`** - Scroll-based narrative experiences

**Example Page Using Template:**

```nunjucks
---
layout: templates/base.njk
title: "About"
bodyStyles: "bg-neutral-50"
---
<section>Your content here</section>
```

### `/_pages/` - Actual Website Pages

**What it is**: The content and configuration for each URL on the site **UX
Impact**: Defines information architecture and user journey structure

**Page Organization:**

- **`index.njk`** - Homepage with scroll choreography
- **`/about/`** - About section pages
- **`/projects/`** - Individual project detail pages
- **`/lab/`** - Experimental and interactive features
- **`/design/`** - Design system documentation
- **`/_static/`** - Static pages (robots.txt, manifest.json)

**Page Anatomy:**

```nunjucks
---
layout: templates/base.njk        # Which template scaffold to use
title: "Page Title"                # Browser tab and SEO
metaDescription: "..."             # SEO description
bodyStyles: "bg-graphpaper-dark"   # Page-specific styling
scripts: >                         # Page-specific JavaScript
  <script src="/assets/js/..."></script>
---
{# Page content using organisms and molecules #}
```

### `/_data/` - Global Configuration

**What it is**: Site-wide settings and content available to all templates **UX
Impact**: Centralizes brand information and CMS configuration

- **`site.json`** - Site metadata, manifest, Airtable table configuration,
  navigation settings
- **`introduction.json`** - Global content snippets and messaging

## Content Flow Architecture

```
Airtable CMS → 11ty Collections → Nunjucks Templates → HTML Pages
```

### 1. **Airtable Content**

Content editors manage projects, articles, images in Airtable

### 2. **11ty Collections**

Build process transforms Airtable data into queryable collections:

```nunjucks
{% set projects = collections.projects %}
{% set featured = collections.projects | findRecord(site.featured_projects.change) %}
```

### 3. **Template Rendering**

Components dynamically render with actual content:

```nunjucks
{% import "molecules/card/project.njk" as projectCard %}

{% for project in projects %}
  {{ projectCard.render({ project: project }) }}
{% endfor %}
```

### 4. **Static HTML Output**

Final accessible, performant HTML pages in `_site/` directory

## Template Filters & Utilities

Templates have access to powerful content processing filters:

### Content Transformation

```nunjucks
{{ description | markdownify }}     {# Convert markdown to HTML #}
{{ longText | truncate(150) }}       {# Shorten text with ellipsis #}
{{ publishDate | dateFormat }}       {# Human-readable dates #}
```

### Content Relationships

```nunjucks
{% set orgs = collections.organizations | findRecord(project.organizations) %}
{% set images = collections.images | findRecord(project.gallery) %}
```

### Media Handling

```nunjucks
{% picture imageData, "w-full", "object-cover" %}
{% lightbox imageData, "Alt text", "Caption" %}
```

## Accessibility Features Built-In

- **Semantic HTML**: All templates use proper heading hierarchy and landmarks
- **ARIA Labels**: Interactive components include descriptive labels
- **Keyboard Navigation**: Focus management and keyboard shortcuts
- **Alt Text**: Image templates require descriptive text
- **Color Contrast**: Design token integration maintains WCAG compliance

## Performance Optimizations

- **Lazy Loading**: Images load as needed
- **Responsive Images**: Multiple sizes generated automatically
- **Minified HTML**: Output is optimized for fast delivery
- **Strategic Script Loading**: JavaScript loads only when needed with `defer`

## Content Creator Workflow

### Adding a New Page

1. Create `.njk` file in appropriate `_pages/` subdirectory
2. Add frontmatter with layout and metadata
3. Compose content using organism and molecule includes
4. Page automatically appears in navigation

### Using Components

No HTML knowledge required - use includes with plain English parameters:

```nunjucks
{% include "organisms/gallery.njk" with { images: myImages, columns: 3 } %}
```

### Content Updates

Edit in Airtable → Rebuild site → Changes appear automatically in all relevant
components

## Design System Integration

Templates automatically access design tokens:

- **Colors**: `text-primary-500`, `bg-accent-100`
- **Typography**: `font-serif`, `text-2xl`, `font-bold`
- **Spacing**: `p-4`, `gap-8`, `mb-12`
- **Responsive**: `md:grid-cols-2`, `lg:text-4xl`

All values sync from Figma, ensuring brand consistency without manual
coordination.

This template architecture creates a maintainable, scalable system where UX
patterns are codified as reusable components, content flows automatically from
the CMS, and design tokens ensure consistent brand expression across all user
touchpoints.
