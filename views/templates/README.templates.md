---
id: frontend.views.templates.readme
role: Documents the templates/ directory — partials and the readme documentation renderer.
status: stable
surface: internal
owner: Template Steward
type: guide
scope: frontend
audience: maintainers
tags:
  - "#design/atomic-design/templates"
  - "#frontend/nunjucks/partials"
  - "#frontend/nunjucks"
perf:
  readPriority: medium
  cacheSafe: true
  critical: false
---
<!-- @format -->

# Templates Directory - Page Layout Templates

**CRITICAL WARNING**: Templates define complete page structures and orchestrate all organisms, molecules, and atoms. Changes here affect entire page types and user journeys. Template modifications have site-wide impact and require comprehensive testing across all content types.

## Architecture Overview

Templates represent complete page layouts that combine organisms into functional user experiences. These components:

- **ORCHESTRATE complete page experiences** with multiple organisms
- **DEFINE responsive layout strategies** for different content types
- **IMPLEMENT SEO and performance optimizations** at the page level
- **COORDINATE animation choreography** across multiple page sections

## Directory Contents

### Partials (`partials/`)

Reusable HTML fragments injected into page layouts.

- `head.njk` - `<head>` element with meta tags and CSS loading
- `fonts.njk` - Font loading strategy
- `gtm-script.njk` / `gtm-noscript.njk` - Google Tag Manager snippets
- `choreography-script.njk` - GSAP choreography initialization script
- `robots.njk` - Robots meta tag partial

### `readme.njk`

Documentation renderer. Wraps README files in a styled layout with sidebar navigation for the `/dev/` documentation pages.

---

> **Note:** Base and page layout templates (`base.njk`, `blog.njk`, `case-study.njk`, `cols-2-*`, `cols-3.njk`, `storyboards.njk`) live in `layouts/`, not here.

**INTEGRATION CRITICAL**: Partials control site-wide resources including CSS loading order, JavaScript module imports, and meta tag generation.

Content type layouts (`blog.njk`, `case-study.njk`, `storyboards.njk`) and multi-column layouts (`cols-2-before.njk`, `cols-2-after.njk`, `cols-3.njk`) are in `layouts/`.

## Usage Guidelines

### Template Extension

```nunjucks
{# Correct template inheritance — extend from layouts/, not templates/ #}
{% extends "layouts/base.njk" %}

{% block content %}
  {% include "organisms/section/hero.njk" with heroData %}
  {% include "organisms/content/project-grid.njk" with projectsData %}
{% endblock %}
```

### Data Coordination

Templates should:

1. **Aggregate data** from multiple 11ty collections and global data
2. **Transform data structures** for organism consumption
3. **Implement pagination** for large data sets
4. **Handle missing data gracefully** with fallback content
5. **Coordinate SEO metadata** with content-specific information

### Integration Dependencies

**11ty Collections**: Templates consume data from `eleventy/collections/` processors that transform Sanity data into usable collections.

**Animation Choreography**: Page templates initialize `js/choreography/Director.js` which coordinates all section animations and scroll behaviors.

**CSS Loading**: Templates control CSS loading order including Tailwind, design tokens, and component-specific styles.

**JavaScript Modules**: Templates manage ES module loading for interactive features and animation systems.

## Development Warnings

### Template Creation

When creating new templates:

1. **DESIGN comprehensive data flow** from collections to organisms
2. **PLAN animation choreography** for page-level user experience
3. **IMPLEMENT responsive strategy** with mobile-first design principles
4. **OPTIMIZE performance budgets** for target Core Web Vitals scores
5. **VALIDATE SEO requirements** including structured data and meta tags
6. **TEST accessibility** across the complete user journey

### Modification Guidelines

Before editing existing templates:

1. **MAP content type dependencies** - identify which content uses this template
2. **AUDIT performance impact** - measure before and after Core Web Vitals
3. **VERIFY animation integration** - test GSAP choreography coordination
4. **CHECK responsive behavior** - validate across all breakpoints and devices
5. **RUN SEO validation** - ensure meta tags and structured data remain intact
6. **TEST accessibility compliance** - screen reader navigation and keyboard usage

### Common Gotchas

- **CSS loading order**: Incorrect order breaks design token integration and Tailwind compilation
- **JavaScript module dependencies**: ES module loading sequence affects animation initialization
- **Data structure assumptions**: Templates expect specific collection shapes from CMS processing
- **Animation conflicts**: Multiple organisms on same page can create competing animation timelines
- **SEO metadata conflicts**: Dynamic meta tag generation can override static SEO configurations

## Browser Compatibility

All templates must support:

- **Modern browsers**: Chrome 120+, Firefox 121+, Safari 17+, Edge 120+
- **Mobile devices**: iOS Safari 17+, Android Chrome 120+, responsive from 320px to 4K displays
- **Accessibility standards**: WCAG 2.1 AA compliance with screen reader optimization
- **Performance targets**: Lighthouse scores >90 across all categories
- **SEO requirements**: Core Web Vitals thresholds for search ranking

## Testing Strategy

### Page-Level Integration

- Complete user journey testing across template types
- Cross-browser compatibility for all interactive features
- Animation choreography coordination between organisms
- Responsive design validation across device categories
- SEO metadata verification and structured data validation

### Performance Validation

- Core Web Vitals measurement under various network conditions
- Bundle size impact analysis for JavaScript and CSS
- Image optimization and lazy loading verification
- Animation performance profiling for 60fps target
- Memory usage monitoring for complex interactive pages

### Accessibility Compliance

- Screen reader navigation testing for complete page flows
- Keyboard navigation validation for all interactive elements
- Color contrast verification across all page sections
- Focus management testing for complex page interactions

## Enhancement Opportunities

### Performance Optimization

- Critical CSS inlining for above-the-fold content
- Progressive web app features for offline functionality
- Service worker implementation for caching strategies
- Image optimization pipeline with next-gen format support

### SEO Improvements

- Enhanced structured data implementation
- Dynamic sitemap generation from CMS content
- Social media meta tag optimization
- Core Web Vitals optimization strategies

### Developer Experience

- Template documentation with realistic data examples
- Component usage guidelines for organism integration
- Performance budgets and monitoring integration
- Automated accessibility testing in build pipeline

## Technical Debt

### Known Issues

- Base template complexity makes maintenance difficult
- SEO metadata generation inconsistent across template types
- Animation choreography tightly coupled to specific DOM structure
- Performance optimization strategies not standardized

### Migration Priorities

1. Simplify base template architecture for easier maintenance
2. Standardize SEO metadata patterns across all templates
3. Decouple animation system from rigid DOM requirements
4. Implement consistent performance optimization strategies

### Integration Risks

**Animation System**: GSAP choreography system depends on specific DOM structure and CSS classes. Template changes can silently break animations.

**CMS Integration**: Sanity schema changes affect multiple templates that expect specific data structures from collection processing.

**CSS Framework**: Tailwind CSS updates may affect responsive design patterns used across template hierarchy.

**Build System**: 11ty configuration changes can break template processing, data flow, and static asset handling.

## Debugging Guidelines

### Common Issues

1. **Template compilation errors**: Check Nunjucks syntax and data availability
2. **Missing data**: Verify collection processing and CMS field mappings
3. **Animation failures**: Debug GSAP timeline coordination and DOM structure
4. **Responsive breakage**: Test CSS Grid/Flexbox behavior across breakpoints
5. **Performance degradation**: Profile animation performance and resource loading
6. **SEO problems**: Validate meta tags, structured data, and sitemap generation

### Debugging Tools

- 11ty debug mode for template compilation and data flow
- Chrome DevTools for performance profiling and responsive testing
- Lighthouse for SEO, accessibility, and performance auditing
- GSAP timeline debugging for animation coordination
- Accessibility testing tools for compliance verification

### Error Recovery

Templates should implement comprehensive error handling:

- **Graceful degradation** when organisms fail to render
- **Fallback content** for missing CMS data
- **Progressive enhancement** for JavaScript-dependent features
- **Error pages** for template processing failures
- **Performance monitoring** with real user metrics

## Data Flow Architecture

### Collection Processing

1. **Sanity data** fetched and cached by collection processors
2. **11ty collections** transform raw data into template-ready structures
3. **Global data** provides site-wide configuration and navigation
4. **Page-specific data** combines collections with frontmatter configuration

### Performance Considerations

- Lazy load non-critical organisms and JavaScript modules
- Implement intersection observer for animation triggering
- Use service workers for aggressive caching strategies
- Optimize bundle splitting for page-specific functionality
- Monitor real user metrics for performance regression detection

## Animation Coordination

### Choreography Integration

Templates coordinate with `js/choreography/Director.js` to manage:

- Scroll-triggered animations across multiple page sections
- Page load animation sequences
- User interaction feedback systems
- Smooth scroll behavior coordination
- Video playback synchronization with scroll position

### Performance Requirements

- Maintain 60fps animation performance across all devices
- Implement animation budgets to prevent main thread blocking
- Use CSS transforms and opacity for optimal performance
- Coordinate animation timing to avoid visual conflicts
- Implement reduced motion preferences for accessibility

**REMEMBER**: Templates are the orchestration layer that brings the entire design system together. They coordinate data flow, animation choreography, and user experience across complete page journeys. Changes here require the most comprehensive testing and have the highest risk of breaking user workflows. Always implement rollback strategies and monitor real user metrics after template deployments.
