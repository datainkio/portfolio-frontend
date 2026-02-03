<!-- @format -->

# \_includes Directory - Atomic Design System

**CRITICAL WARNING**: This directory contains the complete atomic design system for the dataink.io portfolio site. The architecture follows strict atomic design principles with atoms → molecules → organisms → templates hierarchy. Breaking these patterns can cause cascading failures across the entire site.

## Architecture Overview

The atomic design system organizes UI components into four hierarchical levels:

### **Atoms** (`atoms/`)

The foundational building blocks - indivisible UI elements that cannot be broken down further.

- **Button components**: Interactive elements with consistent styling
- **Link components**: Navigation elements with accessibility features
- **Icon components**: SVG-based iconography system
- **Typography components**: Text rendering with design token integration
- **Form components**: Input elements and field wrappers

**DEPENDENCY RULE**: Atoms CANNOT depend on other atoms, molecules, or organisms.

### **Molecules** (`molecules/`)

Functional groups combining atoms into meaningful UI patterns.

- **Navigation molecules**: Menu systems combining links and buttons
- **Card molecules**: Content display patterns combining typography and media
- **Form molecules**: Input groups with validation and labeling
- **List molecules**: Data presentation patterns with consistent styling

**DEPENDENCY RULE**: Molecules CAN use atoms but CANNOT use other molecules or organisms.

### **Organisms** (`organisms/`)

Complex interface sections combining molecules and atoms with business logic.

- **Navigation organisms**: Complete navigation systems with dropdown behavior
- **Layout organisms**: Page structure components with responsive design
- **Content organisms**: CMS-driven content display with state management
- **Interactive organisms**: Complex user interactions with focus management

**DEPENDENCY RULE**: Organisms CAN use molecules and atoms but NOT other organisms.

### **Templates** (`templates/`)

Complete page layouts orchestrating organisms into full user experiences.

- **Base templates**: Foundation layouts with site-wide resources
- **Content templates**: Specialized layouts for different content types
- **Landing templates**: Conversion-focused layouts with animation choreography

**DEPENDENCY RULE**: Templates CAN use organisms, molecules, and atoms to create complete page experiences.

## Integration Dependencies

### **Critical System Dependencies**

**11ty Static Site Generator**: All components use Nunjucks templating with data from collections and global configuration.

**Tailwind CSS 4.0**: Component styling uses utility classes with design tokens from Figma integration.

**GSAP Animation System**: Interactive components integrate with choreography system in `js/choreography/`.

**Airtable CMS**: Content components expect specific data structures from CMS collections.

**Figma Design Tokens**: Typography and color systems sync automatically with design file changes.

### **Build Process Integration**

The component system integrates with automated build processes:

1. **Design Token Sync**: `scripts/fetchFigma.js` updates CSS files that components depend on
2. **Collection Processing**: `eleventy/collections/` transforms CMS data for component consumption
3. **Asset Pipeline**: Components reference assets in `assets/` copied to `_site/assets/`
4. **Animation Coordination**: `js/choreography/Director.js` initializes page-level component animations

## Development Workflow

### **Component Creation Process**

1. **Identify atomic level** - determine if component is atom, molecule, organism, or template
2. **Document dependencies** - list all atoms/molecules the component will use
3. **Design data contract** - define expected parameters and data structures
4. **Implement responsive behavior** - mobile-first design with Tailwind utilities
5. **Add animation integration** - coordinate with GSAP choreography system if interactive
6. **Test accessibility** - screen reader navigation and keyboard interaction
7. **Validate performance** - ensure no negative impact on Core Web Vitals

### **Modification Guidelines**

Before editing any component:

1. **Map dependency chain** - identify all components that use the target component
2. **Check animation integration** - verify GSAP timeline coordination won't break
3. **Validate data contracts** - ensure parameter changes won't break parent components
4. **Test responsive behavior** - mobile through desktop breakpoint validation
5. **Run accessibility audit** - screen reader and keyboard navigation testing
6. **Performance profile** - measure impact on page load and animation performance

### **Testing Strategy**

Each atomic level requires different testing approaches:

- **Atoms**: Isolation testing with various parameter combinations
- **Molecules**: Integration testing with child atoms and data flow validation
- **Organisms**: User experience testing with realistic data and interaction patterns
- **Templates**: End-to-end testing across complete user journeys and browser compatibility

## Common Integration Pitfalls

### **Animation System Conflicts**

**Problem**: GSAP choreography system expects specific CSS classes and DOM structure. Component changes can silently break animations.

**Solution**: Always test animation integration after component modifications. Check `js/choreography/` for animation dependencies.

### **CMS Data Structure Assumptions**

**Problem**: Components often expect specific Airtable field structures. CMS schema changes break data binding without obvious errors.

**Solution**: Document expected data structures in component comments. Implement defensive null checking and fallback content.

### **CSS Loading Order Dependencies**

**Problem**: Components depend on CSS loading sequence: fonts → Tailwind → base styles → design tokens. Incorrect order breaks styling.

**Solution**: Maintain CSS import order in `styles/main.css`. Never inline critical CSS without understanding cascade implications.

### **Responsive Design Breakage**

**Problem**: Tailwind utility classes use mobile-first methodology. Desktop-first modifications break responsive design.

**Solution**: Always test responsive behavior from 320px to 2560px width. Use Tailwind responsive prefixes consistently.

## Performance Considerations

### **Bundle Size Impact**

- **Atoms**: Minimal individual impact, but large quantities affect bundle size
- **Molecules**: Medium impact due to atom composition and interaction logic
- **Organisms**: High impact due to complex logic and animation coordination
- **Templates**: Highest impact due to complete page functionality

### **Animation Performance**

- Use CSS transforms and opacity for optimal performance
- Coordinate GSAP timelines to prevent competing animations
- Implement intersection observer for scroll-triggered animations
- Monitor frame rates to maintain 60fps performance target

### **Image and Media Optimization**

- Implement lazy loading for non-critical media components
- Use responsive image techniques with `srcset` and `sizes`
- Optimize video components for Core Web Vitals compliance
- Cache processed media assets for faster subsequent loads

## Accessibility Standards

All components must meet WCAG 2.1 AA compliance:

- **Keyboard navigation**: All interactive elements accessible via keyboard
- **Screen reader support**: Proper ARIA attributes and semantic HTML
- **Color contrast**: Minimum 4.5:1 ratio for normal text, 3:1 for large text
- **Focus management**: Visible focus indicators and logical tab order
- **Motion preferences**: Respect `prefers-reduced-motion` for animations

## Debugging Guidelines

### **Common Issues and Solutions**

1. **Template compilation errors**: Check Nunjucks syntax and parameter passing between component levels
2. **Missing data**: Verify collection processing and CMS field name mappings
3. **Animation failures**: Debug GSAP timeline coordination and CSS class dependencies
4. **Responsive breakage**: Test mobile-first CSS cascade and utility class precedence
5. **Accessibility violations**: Use automated testing tools and manual screen reader testing

### **Debugging Tools**

- **11ty Debug Mode**: `DEBUG=Eleventy* npx @11ty/eleventy` for template processing
- **Chrome DevTools**: Performance tab for animation profiling and responsive testing
- **GSAP Timeline Debugging**: Console logging for animation coordination issues
- **Lighthouse Audits**: Automated accessibility, performance, and SEO validation
- **Screen Reader Testing**: Manual testing with VoiceOver (macOS) or NVDA (Windows)

## Enhancement Roadmap

### **Short Term (Next Sprint)**

- Complete missing icon components in `atoms/icon/` directory
- Standardize parameter naming conventions across all atomic levels
- Implement automated visual regression testing for component changes
- Add comprehensive JSDoc-style documentation for all components

### **Medium Term (Next Quarter)**

- Integrate Storybook for isolated component development and testing
- Implement TypeScript interfaces for component data contracts
- Add automated accessibility testing to build pipeline
- Create performance budgets for each atomic level

### **Long Term (Next Year)**

- Implement component-level error boundaries for graceful failure handling
- Add comprehensive animation performance monitoring
- Create automated component generation tools for new atomic patterns
- Integrate with design system management platform for automated Figma sync

## Documentation Standards

All component directories include comprehensive README.md files with clear documentation:

- **Integration warnings** about potential breaking changes and dependencies
- **Complete dependency documentation** for safe modification
- **Architecture context** for understanding component relationships
- **Debugging guides** for troubleshooting common issues
- **Performance considerations** for optimization strategies

**REMEMBER**: The atomic design system is the architectural foundation of the entire site. Components follow a strict hierarchical dependency model:

- **Atoms**: Zero dependencies
- **Molecules**: Depend only on atoms
- **Organisms**: Depend on molecules and atoms
- **Templates**: Depend on organisms, molecules, and atoms

This hierarchy must be maintained. Before modifying any component, understand its full dependency chain and test comprehensively across all levels that depend on it.
