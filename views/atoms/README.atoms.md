---
aix:
  id: frontend.views.atoms.readme
  role: Documents the atoms/ layer — foundational UI building blocks of the design system.
  status: stable
  surface: internal
  owner: Template Steward
  tags:
    -  #atoms
    -  #atomic-design
    -  #nunjucks
  type: guide
  scope: frontend
  audience: maintainers
  perf:
    readPriority: medium
    cacheSafe: true
    critical: false
---

<!-- @format -->

# Atoms Directory - Foundational UI Components

**CRITICAL WARNING**: Atoms are the foundational building blocks of the entire design system. Modifying or removing any atom component can break multiple molecules and organisms throughout the site. Always audit dependencies before making changes.

## Architecture Overview

Atoms represent the most basic, indivisible UI elements in the atomic design system. These components:

- **MUST remain stateless and pure** - no internal logic or data manipulation
- **CANNOT import or depend on** other atoms, molecules, or organisms
- **SHOULD accept data** only through Nunjucks parameters and global data
- **MUST follow consistent** naming and parameter conventions

## Component Categories

### Button Components (`button/`)

Basic interactive elements with consistent styling and behavior.

- `button.njk` - Base button component with variant support
- `menu-toggle.njk` - Hamburger menu toggle for mobile navigation

### Link Components (`link/`)

Navigation and reference elements with proper accessibility.

- `link.njk` - Base link component with external link handling
- `nav-link.njk` - Navigation-specific link with active state support

### Icon Components (`icon/`)

SVG-based iconography with consistent sizing and styling.
**WARNING**: Missing icon templates will cause build failures in dependent components.

### Typography Components (`typography/`)

Text rendering elements with design system integration.
**DEPENDENCY**: Must align with Figma typography tokens in `styles/typography/`

### Media Components (`video/`)

Multimedia display elements with responsive behavior.
**PERFORMANCE**: Video components affect Core Web Vitals - optimize carefully.

### Form Components

- `field.njk` - Form field wrapper with label and validation
- `input.njk` - Base input element with type variations

### Utility Components

- `avatar.njk` - User/author image display with fallback handling
- `heading.njk` - Semantic heading levels with design system typography
- `textformat.njk` - Rich text content formatting with Markdown support

### Analytics Components

- `gtm-script.njk` - Google Tag Manager initialization
- `gtm-noscript.njk` - GTM fallback for non-JavaScript environments

## Usage Guidelines

### Template Inclusion

```nunjucks
{# Correct atom usage #}
{% include "atoms/button/button.njk" with {
  text: "Click Me",
  variant: "primary",
  type: "submit"
} %}
```

### Parameter Standards

- **Required parameters** must be documented in component comments
- **Optional parameters** should have sensible defaults
- **Data validation** should happen in parent molecules/organisms
- **CSS classes** should use Tailwind utilities only

### Integration Dependencies

**Tailwind CSS**: All atoms rely on Tailwind utility classes. Changes to Tailwind configuration can break atom styling.

**Design Tokens**: Typography and color atoms sync with Figma design system. Manual CSS overrides will be lost during design token updates.

**11ty Data**: Atoms access site-wide data through `{{ site }}` object. Changes to `_data/site.json` affect multiple components.

**Animation System**: Interactive atoms (buttons, links) integrate with GSAP choreography system. Removing CSS classes can break animations.

## Development Warnings

### Component Creation

When creating new atoms:

1. **NEVER create dependencies** between atoms
2. **ALWAYS document parameters** in component comments
3. **TEST in isolation** before using in molecules
4. **VALIDATE accessibility** with screen readers and keyboard navigation
5. **CHECK responsive behavior** across all breakpoints

### Modification Guidelines

Before editing existing atoms:

1. **SEARCH for dependencies** across molecules/ and organisms/ directories
2. **RUN full build** to check for template compilation errors
3. **VALIDATE visual regression** with before/after screenshots
4. **TEST interactive elements** for keyboard and mouse input
5. **CHECK animation integration** if component has interactive states

### Common Gotchas

- **Missing icon templates**: Create placeholders to prevent build failures
- **Parameter typos**: Nunjucks fails silently on undefined variables
- **CSS class changes**: Can break GSAP animation selectors
- **Data structure assumptions**: Components may expect specific data shapes
- **Responsive utilities**: Mobile-first approach required for consistent behavior

## Browser Compatibility

All atoms must support:

- **Modern browsers**: Chrome 120+, Firefox 121+, Safari 17+, Edge 120+
- **Mobile browsers**: iOS Safari 17+, Chrome Mobile 120+
- **Accessibility tools**: Screen readers, keyboard navigation, high contrast mode
- **Performance budgets**: Minimal CSS/JS footprint per component

## Testing Strategy

### Visual Testing

- Screenshot comparison across breakpoints
- Dark/light theme validation
- High contrast mode compatibility
- Print stylesheet behavior

### Functional Testing

- Parameter validation with various data types
- Edge cases (empty strings, null values, long text)
- Keyboard navigation for interactive elements
- Screen reader announcement verification

### Integration Testing

- Template compilation with real site data
- Animation choreography compatibility
- Form submission and validation flows
- Error handling for missing dependencies

## Enhancement Opportunities

### Performance

- Lazy load non-critical icons
- Optimize SVG assets for smaller bundle size
- Implement CSS containment for better rendering performance

### Accessibility

- Add ARIA labels and descriptions where needed
- Implement focus management for complex interactions
- Ensure color contrast meets WCAG AAA standards

### Developer Experience

- Add TypeScript-style parameter documentation
- Create Storybook integration for visual component testing
- Implement automated accessibility testing

## Technical Debt

### Known Issues

- Some icon components missing from `icon/` directory
- Typography atoms not fully integrated with Figma token system
- Form validation styling inconsistent across components

### Migration Priorities

1. Complete icon component library
2. Standardize parameter naming conventions
3. Implement component-level error boundaries
4. Add comprehensive JSDoc-style documentation

**REMEMBER**: Atoms are the foundation. Changes here ripple through the entire system. When in doubt, create a new variant rather than modifying existing behavior.
