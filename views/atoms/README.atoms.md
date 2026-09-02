---
description: "Documents the atoms/ layer — foundational UI building blocks of the design system."
type: guide
status: stable
---

<!-- @format -->

# Atoms Directory - Foundational UI Components

**CRITICAL WARNING**: Atoms are the foundational building blocks of the entire design system. Modifying or removing any atom component can break multiple molecules and organisms throughout the site. Always audit dependencies before making changes.

## Architecture Overview

Atoms represent the most basic, indivisible UI elements in the atomic design system. These components:

- **MUST remain stateless and pure** - no internal logic or data manipulation
- **CANNOT import or depend on** other atoms, molecules, or organisms — **with one documented exception**: `atoms/icon.njk` and the `atoms/svg/*` primitives may be imported by other atoms. Both are pure, dependency-free leaf nodes (SVG markup only, no further imports), so importing them doesn't create the kind of cross-atom coupling this rule exists to prevent. Current users of the exception: `atoms/link/link.njk`, `atoms/link/nav-link.njk`, `atoms/printmarks/registration-marks.njk`, `atoms/printmarks/ink-marks.njk`. Don't extend the exception to any other atom pair without updating this note.
- **SHOULD accept data** only through Nunjucks parameters and global data
- **MUST follow consistent** naming and parameter conventions

## Component Invocation Contract

**Required pattern for every atom (and molecule/organism):**

```nunjucks
{% import "atoms/heading.njk" as Heading %}
{{ Heading.render({ level: 2, text: "Section Title" }) }}
```

Every component wraps its markup in `{% macro render(params = {}) %}...{% endmacro %}`, and callers `{% import ... as X %}` then call `X.render({...})`. Params are namespaced under `params.*` — explicit, self-contained, and the component's parameter list is readable at a glance from its `render()` signature.

**Don't** write a component that reads bare top-level variables from whatever scope happens to be in effect on include (relying on Nunjucks's automatic parent-scope inheritance). That pattern used to be common here and is being migrated away from: it has no explicit parameter list, a variable-name collision between caller and component scope silently produces wrong output instead of an error, and it tempted a few atoms (`icon.njk`, `link/nav-link.njk`) into maintaining *both* patterns in the same file to paper over the ambiguity — don't add a third file to that list.

**Also don't** reach for `{% include "x.njk" with { key: value } %}` as a way to pass params to a non-macro template — that clause is Jinja2-only and **is not valid Nunjucks** in this project's Nunjucks version. It parses without error in some contexts and just silently does nothing, which makes it an easy, hard-to-detect mistake. Several older doc comments in this codebase demonstrate it — they're wrong; use the import+macro pattern above instead.

## Flat vs. Nested: When to Use a Subdirectory

`atoms/` mixes two shapes and the rule is implicit, not written down elsewhere — this section is the canonical statement of it.

- **Flat file** (`heading.njk`, `icon.njk`, `cta.njk`, ...): use when the atom is a single component with no distinct sub-parts or size/shape variants. 13 atoms currently use this shape.
- **Directory** (`button/`, `link/`, `loader/`, `svg/`, `printmarks/`, `video/`): use when the atom has multiple variants or sub-parts that each need their own `.njk`/`.md` pair — e.g. `link/` holds `link.njk`, `nav-link.njk`, `breadcrumb.njk`, `site-title.njk`; `printmarks/` holds four distinct mark types.

**Known exceptions**: `debug/` (`sanity-schema.njk`) and `hanko/` (`hanko.njk`) are directories containing a single file each — they don't fit the variants rule above. Treat them as historical exceptions, not precedent; don't nest a new single-file atom to match them. If touching either, consider flattening it to match the rule.

When scaffolding a new atom, default to a flat file. Only create a subdirectory once a second variant or sub-part is added — don't nest speculatively.

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
