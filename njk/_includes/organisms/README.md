<!-- @format -->

# Organisms Directory - Complex UI Assemblies

**CRITICAL WARNING**: Organisms represent complete interface sections with complex internal logic. Changes here directly affect page layouts and user workflows. These components often contain state management and business logic that can break entire site sections.

## Architecture Overview

Organisms combine molecules and atoms into complete, functional interface sections. These components:

- **CONTROL complex user interactions** with internal state management
- **ORCHESTRATE multiple molecules** to create cohesive experiences
- **IMPLEMENT business logic** for content display and user workflows
- **MANAGE data integration** from CMS, APIs, and site collections

## Component Categories

### Navigation Organisms (`navigation/`)

Complete navigation systems that control site-wide user movement.

**CRITICAL DEPENDENCY**: Integrates with `eleventy/collections/navigation.js` and GSAP choreography system for dropdown animations.

**WARNING**: Navigation changes affect SEO, analytics tracking, and user experience metrics. Test thoroughly before deployment.

### Layout Organisms (`layout/`)

Page structure components that define content areas and responsive behavior.

- Header assemblies with navigation and branding
- Footer systems with sitemap and contact information
- Sidebar configurations for content filtering

**INTEGRATION RISK**: Layout organisms control CSS Grid and Flexbox structures. Changes can break responsive design across all breakpoints.

### Content Organisms (`content/`)

Dynamic content display systems for CMS-driven content.

**DATA DEPENDENCY**: Expects specific Airtable collection structures and field mappings. Schema changes in CMS require organism updates.

### Interactive Organisms (`interactive/`)

Complex user interaction patterns with state management.

- Modal systems with focus management
- Filtering interfaces with URL state synchronization
- Search components with real-time results

**PERFORMANCE WARNING**: Interactive organisms can impact Core Web Vitals if not properly optimized for main thread blocking.

### Section Organisms (`section/`)

Page section assemblies that combine content with layout patterns.

- Hero sections with animation choreography
- Portfolio grids with filtering and pagination
- Biography sections with media integration

### Figure Organisms (`figure/`)

Media display systems with responsive behavior and accessibility features.

**MEDIA DEPENDENCY**: Requires proper image processing pipeline and responsive image generation.

### Modal Organisms (`modal/`)

Overlay interface systems with complex focus management and accessibility requirements.

**ACCESSIBILITY CRITICAL**: Modal components must implement proper ARIA attributes, focus trapping, and escape key handling.

## Usage Guidelines

### Template Integration

```nunjucks
{# Correct organism usage #}
{% include "organisms/navigation/header.njk" with {
  navigation: collections.nav_primary,
  site: site,
  currentUrl: page.url,
  isHomepage: page.url == "/"
} %}
```

### Data Management

Organisms should:

1. **Accept high-level data** from page templates or global context
2. **Transform and distribute** data to child molecules and atoms
3. **Handle error states** when data is missing or malformed
4. **Implement caching strategies** for expensive data operations
5. **Manage user interaction state** within the component boundary

### Integration Dependencies

**Animation Choreography**: Organisms coordinate with `js/choreography/Director.js` for complex animation sequences. CSS classes and data attributes must remain consistent.

**CMS Collections**: Content organisms depend on Airtable data processed through `eleventy/collections/content.js`. Field name changes break data binding.

**Navigation System**: Navigation organisms integrate with `eleventyNavigation` plugin and custom collection processing. URL structure changes affect navigation generation.

**Responsive Design**: Layout organisms control Tailwind CSS Grid and Flexbox systems. Breakpoint changes require organism updates.

## Development Warnings

### Component Creation

When creating new organisms:

1. **DESIGN comprehensive data contracts** with clear parameter documentation
2. **IMPLEMENT error boundaries** for graceful failure handling
3. **PLAN animation integration** with site-wide choreography system
4. **BUILD responsive behavior** with mobile-first design principles
5. **VALIDATE accessibility** with screen readers, keyboard navigation, and automated testing

### Modification Guidelines

Before editing existing organisms:

1. **MAP page template dependencies** - identify which pages use this organism
2. **AUDIT animation choreography** - check GSAP timeline integration points
3. **VERIFY CMS data compatibility** - ensure Airtable field mappings remain valid
4. **TEST responsive breakpoints** - validate mobile through desktop behavior
5. **RUN accessibility audit** - screen reader testing and keyboard navigation
6. **PERFORMANCE PROFILE** - measure impact on Core Web Vitals

### Common Gotchas

- **Animation sequence conflicts**: Multiple organisms animating simultaneously can cause jank
- **Data structure assumptions**: Organisms often expect specific CMS field structures
- **Modal focus management**: Complex focus trapping can break with DOM changes
- **Responsive image loading**: Organisms with media need proper `srcset` and `sizes` attributes
- **State synchronization**: Interactive organisms may conflict with browser back/forward navigation

## Browser Compatibility

All organisms must support:

- **Modern browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile devices**: iOS Safari 14+, Android Chrome 88+, responsive design from 320px to 2560px
- **Accessibility tools**: Screen readers, keyboard navigation, voice control, high contrast mode
- **Performance constraints**: 60fps animations, <2.5s LCP, <100ms FID

## Testing Strategy

### Component Integration

- End-to-end user workflow testing
- Cross-browser compatibility validation
- Animation performance profiling
- Accessibility compliance verification
- SEO impact analysis for navigation changes

### User Experience

- Usability testing for complex interactions
- Mobile device testing across screen sizes
- Performance testing under slow network conditions
- Edge case handling for missing or malformed data

### Technical Validation

- Bundle size impact measurement
- Animation frame rate monitoring
- Memory leak detection for interactive components
- Focus management validation for modal systems

## Enhancement Opportunities

### Performance Optimization

- Implement lazy loading for non-critical organisms
- Add intersection observer for animation triggering
- Optimize GSAP timeline coordination
- Bundle splitting for page-specific organisms

### Accessibility Improvements

- Enhanced keyboard navigation patterns
- Screen reader optimization for dynamic content
- Focus management for complex interactions
- Color contrast validation across all variants

### Developer Experience

- Component documentation with realistic usage examples
- Storybook integration for isolated organism testing
- TypeScript interfaces for data contracts
- Automated visual regression testing
- Performance budgets for organism complexity

## Technical Debt

### Known Issues

- Navigation organism complexity makes maintenance difficult
- Modal focus management inconsistent across different modal types
- Section organisms tightly coupled to specific CMS data structures
- Animation coordination between organisms can cause conflicts

### Migration Priorities

1. Standardize organism data contract patterns
2. Implement consistent modal accessibility patterns
3. Decouple organisms from specific CMS field structures
4. Create unified animation coordination system

### Integration Risks

**Animation System**: GSAP choreography system changes affect multiple organisms simultaneously. Version updates require careful coordination testing.

**CMS Schema Evolution**: Airtable schema changes can silently break multiple organisms that depend on specific field structures.

**CSS Framework Updates**: Tailwind CSS updates may deprecate utility classes used extensively in layout organisms.

**Navigation Logic Changes**: Modifications to `eleventy/collections/navigation.js` affect multiple navigation organisms and can break site-wide navigation.

## Debugging Guidelines

### Common Issues

1. **Missing or malformed data**: Check CMS field mappings and collection processing
2. **Animation conflicts**: Verify GSAP timeline coordination between organisms
3. **Responsive breakage**: Test CSS Grid/Flexbox behavior across all breakpoints
4. **Accessibility violations**: Use automated tools and manual testing with assistive technology
5. **Performance degradation**: Profile animation performance and bundle size impact

### Debugging Tools

- Chrome DevTools Performance tab for animation profiling
- Lighthouse for accessibility and performance auditing
- GSAP timeline debugging for animation coordination
- 11ty debug mode for data flow inspection
- Accessibility testing tools (axe-core, WAVE, screen readers)

### Error Recovery

Organisms should implement graceful degradation:

- **Fallback content** when CMS data is unavailable
- **Progressive enhancement** for JavaScript-dependent features
- **Error boundaries** to prevent complete page failure
- **Loading states** for async data fetching
- **Accessibility fallbacks** when interactive features fail

## State Management

### Data Flow Patterns

1. **Page-level data** flows down through organisms to molecules and atoms
2. **User interaction state** managed within organism boundaries
3. **Global state changes** (theme, navigation) handled through event systems
4. **URL state synchronization** for filterable and searchable organisms

### Performance Considerations

- Minimize re-renders in data-heavy organisms
- Implement virtual scrolling for large lists
- Use intersection observer for lazy loading
- Cache expensive data transformations
- Debounce user input handling

**REMEMBER**: Organisms are the complex brain centers of the design system. They coordinate multiple molecules, manage state, and implement business logic. Changes here have the highest risk and highest impact. Always test comprehensively and consider rollback strategies for production deployments.
