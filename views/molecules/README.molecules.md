---
aix:
  id: frontend.views.molecules.readme
  role: Documents the molecules/ layer — composite UI groups composed of atoms.
  status: stable
  surface: internal
  owner: Template Steward
  tags:
    - #molecules
    - #atomic-design
    - #nunjucks
  type: guide
  scope: frontend
  audience: maintainers
  perf:
    readPriority: medium
    cacheSafe: true
    critical: false
---

<!-- @format -->

# Molecules Directory - Composite UI Components

**CRITICAL WARNING**: Molecules compose atoms into functional groups. Breaking changes here affect organisms and page templates. Always test integration points before deploying modifications.

## Architecture Overview

Molecules represent combinations of atoms that form functional UI patterns. These components:

- **MUST compose atoms** without duplicating atom functionality
- **CAN depend on** multiple atoms but not other molecules
- **SHOULD encapsulate** specific user interaction patterns
- **MUST maintain** clear data contracts with parent organisms

## Component Categories

### Navigation Components (`navigation/`)

Critical site navigation patterns combining atoms into functional navigation units.

- `nav-item.njk` - Individual navigation item with dropdown support
- `primary-nav.njk` - Main site navigation with hierarchical structure

**INTEGRATION DEPENDENCY**: Works with `eleventy/collections/navigation.js` and requires proper `eleventyNavigation` frontmatter configuration.

### Card Components (`card/`)

Content display patterns for articles, projects, and media items.

**PERFORMANCE WARNING**: Card grids can impact Core Web Vitals if not properly optimized for viewport loading.

### Form Components (`input/`, `form.njk`)

Complex form patterns combining input atoms with validation and submission logic.

- Form validation styling
- Multi-step form coordination
- Error state management

### List Components (`list/`)

Data presentation patterns for dynamic content display.

**DATA DEPENDENCY**: Expects specific collection structures from Sanity CMS integration.

### Content Components

- `award-organization.njk` - Award display with organization metadata
- `fonts.njk` - Typography specimen display
- `robots.njk` - Search engine directive handling

## Usage Guidelines

### Template Inclusion

```nunjucks
{# Correct molecule usage #}
{% include "molecules/navigation/primary-nav.njk" with {
  navigation: collections.nav_primary,
  currentUrl: page.url
} %}
```

### Data Flow Patterns

Molecules should:

1. **Accept structured data** from organisms or page context
2. **Pass appropriate subsets** to child atoms
3. **Handle data transformation** for atom compatibility
4. **Provide fallback behavior** for missing data

### Integration Dependencies

**Navigation Collections**: Navigation molecules depend on `eleventy/collections/navigation.js` processing Sanity data into hierarchical structures.

**GSAP Animations**: Interactive molecules integrate with choreography system in `js/choreography/`. CSS classes must maintain animation compatibility.

**Tailwind Configuration**: Responsive behavior depends on Tailwind breakpoints. Custom CSS can break mobile-first responsive design.

**CMS Data Structure**: Content molecules expect specific field structures from Sanity documents. Schema changes require template updates.

## Development Warnings

### Component Creation

When creating new molecules:

1. **IDENTIFY atom dependencies** and document them clearly
2. **DESIGN data contracts** with parent organisms
3. **IMPLEMENT responsive behavior** across all breakpoints
4. **TEST with realistic data** including edge cases and empty states
5. **VALIDATE accessibility** for keyboard navigation and screen readers

### Modification Guidelines

Before editing existing molecules:

1. **MAP organism dependencies** - check which organisms use this molecule
2. **VERIFY data structure assumptions** - ensure CMS data compatibility
3. **TEST animation integration** - validate GSAP choreography still works
4. **CHECK responsive behavior** - mobile-first design principles
5. **RUN accessibility audit** - screen reader and keyboard navigation

### Common Gotchas

- **Navigation data structure**: Changes to navigation collections break dropdown functionality
- **Card component performance**: Large image assets without lazy loading impact page speed
- **Form validation**: Client-side validation must match server-side validation rules
- **List pagination**: Infinite scroll patterns can break back button navigation
- **Animation timing**: Molecule animations must coordinate with page-level choreography

## Browser Compatibility

All molecules must support:

- **Modern browsers**: Chrome 120+, Firefox 121+, Safari 17+, Edge 120+
- **Mobile devices**: iOS Safari 17+, Android Chrome 120+
- **Accessibility standards**: WCAG 2.1 AA compliance minimum
- **Performance targets**: Lighthouse score >90 for mobile devices

## Testing Strategy

### Component Integration

- Atom composition validation
- Data flow from organisms to atoms
- Animation choreography coordination
- Responsive breakpoint behavior

### User Experience

- Navigation usability testing
- Form completion flows
- Card interaction patterns
- List loading and pagination

### Performance

- Image lazy loading verification
- Animation frame rate monitoring
- Bundle size impact analysis
- Core Web Vitals measurement

## Enhancement Opportunities

### Performance Optimization

- Implement progressive image loading for card components
- Add intersection observer for lazy-loaded list items
- Optimize animation performance with CSS transforms
- Bundle splitting for non-critical molecules

### Accessibility Improvements

- Enhanced keyboard navigation patterns
- Screen reader optimization for complex interactions
- Focus management for dynamic content updates
- Color contrast validation across all variants

### Developer Experience

- Component documentation with usage examples
- Storybook integration for isolated testing
- TypeScript parameter validation
- Automated visual regression testing

## Technical Debt

### Known Issues

- Navigation molecule complexity makes testing difficult
- Card component variants inconsistently implemented
- Form validation feedback not standardized
- List components lack proper loading states

### Migration Priorities

1. Standardize navigation molecule architecture
2. Implement consistent card component API
3. Create unified form validation system
4. Add comprehensive loading state patterns

### Integration Risks

**Animation System**: GSAP choreography changes can break molecule interactions without obvious errors.

**CMS Schema**: Sanity field name changes silently break data binding in content molecules.

**CSS Framework**: Tailwind version updates may deprecate utility classes used in molecules.

**Navigation Logic**: Changes to `eleventy/collections/navigation.js` affect multiple navigation molecules.

## Debugging Guidelines

### Common Issues

1. **Missing data**: Check organism data passing and CMS field names
2. **Animation conflicts**: Verify GSAP timeline coordination with choreography system
3. **Responsive breakage**: Test mobile-first CSS cascade and utility class precedence
4. **Accessibility violations**: Use automated testing tools and manual screen reader testing

### Debugging Tools

- Browser DevTools for responsive design testing
- Lighthouse for performance and accessibility auditing
- GSAP timeline debugging for animation coordination
- 11ty debug mode for template data inspection

**REMEMBER**: Molecules are the functional workhorses of the design system. They bridge the gap between simple atoms and complex organisms. Stability here ensures reliable user experiences across the entire site.
