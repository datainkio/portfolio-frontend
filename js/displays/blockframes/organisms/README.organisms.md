<!-- @format -->

# 🦠 Organisms

**Atomic Design Level**: Complex component sections combining molecules and atoms.

## Overview

Organisms are complex UI components that combine molecules and atoms into distinct, functional sections of an interface. They represent relatively complex, standalone portions of a UI and are the highest level before complete templates.

## Purpose

Organisms serve as major building blocks by:

- Combining molecules into complex interface sections
- Creating reusable, self-contained UI regions
- Representing distinct functional areas (header, sidebar, product grid, etc.)
- Bridging molecules and full-page templates

## File Structure

Each organism exports a `paint` function that orchestrates styling of multiple molecules and atoms:

```javascript
import * as Card from '../molecules/Card.js';
import * as TextBlock from '../molecules/TextBlock.js';
import * as Image from '../atoms/Image.js';

export function paint(node, palette) {
  // Style organism container
  node.setAttribute('fill', palette.neutral.lightest);

  // Paint child molecules
  const cards = node.querySelectorAll('.Card');
  cards.forEach(card => Card.paint(card, palette));

  // Paint individual atoms
  const images = node.querySelectorAll('.Image');
  images.forEach(img => Image.paint(img, palette.secondary));
}
```

## Available Organisms

### **Card.js**

Enhanced card organism (more complex than the molecule version).

**Composition**: Multiple molecules (Card + TextBlock + metadata)

**SVG Structure**:

```xml
<g class="Card organism">
  <g class="Card molecule"></g>
  <g class="TextBlock"></g>
  <g class="metadata">
    <g class="Text date"></g>
    <g class="Text author"></g>
  </g>
  <g class="actions">
    <g class="Button like"></g>
    <g class="Button share"></g>
    <g class="Button comment"></g>
  </g>
</g>
```

**Use Cases**: Blog post cards, product detail cards, social media posts

**Note**: This is a more complex version than the molecule `Card.js`, containing multiple sub-components and interaction areas.

---

### **Cart Item.js**

Shopping cart item with product details and quantity controls.

**Composition**: Image + TextBlock + TextInput (quantity) + Button (remove) + Text (price)

**SVG Structure**:

```xml
<g class="CartItem">
  <g class="Image product"></g>
  <g class="TextBlock details">
    <g class="Text name"></g>
    <g class="Text description"></g>
  </g>
  <g class="quantity-controls">
    <g class="Button decrease"></g>
    <g class="TextInput quantity"></g>
    <g class="Button increase"></g>
  </g>
  <g class="Text price"></g>
  <g class="Button remove"></g>
</g>
```

**Use Cases**: E-commerce carts, order summaries, wish lists

**Styling Considerations**:

- Product image uses secondary palette
- Price text uses accent color for emphasis
- Remove button uses semantic error color
- Quantity controls use primary palette

---

### **Form.js**

Complete form section with multiple inputs and submit button.

**Composition**: TextInput molecules + Button + validation feedback

**SVG Structure**:

```xml
<g class="Form">
  <g class="Text heading"></g>
  <g class="TextInput email"></g>
  <g class="TextInput password"></g>
  <g class="TextInput confirm-password"></g>
  <g class="Text error-message"></g>
  <g class="Button submit"></g>
  <g class="Text helper-text"></g>
</g>
```

**Use Cases**: Login forms, registration forms, contact forms, checkout forms

**Styling Considerations**:

- Input labels use neutral dark
- Input fields use neutral lightest backgrounds
- Error messages use semantic error color
- Submit button uses primary color
- Helper text uses neutral base (muted)

---

### **Image.js**

Complex image organism with caption, metadata, and controls.

**Composition**: Image atom + TextBlock + Button (zoom/download/share)

**SVG Structure**:

```xml
<g class="Image organism">
  <g class="Image atom"></g>
  <g class="TextBlock caption">
    <g class="Text title"></g>
    <g class="Text description"></g>
  </g>
  <g class="metadata">
    <g class="Text date"></g>
    <g class="Text photographer"></g>
  </g>
  <g class="controls">
    <g class="Button zoom"></g>
    <g class="Button download"></g>
    <g class="Button share"></g>
  </g>
</g>
```

**Use Cases**: Photo galleries, image viewers, portfolio displays

**Styling Considerations**:

- Main image uses full palette for theming
- Caption text uses neutral dark for readability
- Metadata uses neutral base (subtle)
- Control buttons use primary or accent colors

**Note**: Distinguished from the atom `Image.js` by including interactive controls and metadata.

---

## Composition Complexity

### Organism Characteristics

**Organisms differ from molecules by:**

- Containing multiple molecules (not just atoms)
- Representing complete UI sections
- Having 5-15+ child components
- Managing contextual styling logic
- Coordinating multiple interaction areas

### Example Hierarchy

```
Organism: Header
├── Molecule: Logo (Image + Text)
├── Molecule: Navigation
│   ├── Atom: Text (links)
│   └── Atom: Bullet (separators)
├── Molecule: SearchBar (TextInput + Button)
└── Molecule: UserProfile
    ├── Atom: Avatar
    └── Atom: Text (username)
```

## Palette Usage Strategies

### Contextual Color Application

Organisms make high-level color decisions based on purpose:

```javascript
export function paint(node, palette) {
  // Background color based on organism type
  node.setAttribute('fill', palette.neutral.lightest);

  // Highlighted sections get accent backgrounds
  const featured = node.querySelector('.featured');
  if (featured) {
    featured.setAttribute('fill', palette.accent.light);
  }

  // Pass appropriate palettes to children
  const header = node.querySelector('.Card');
  Card.paint(header, palette.primary); // Emphasize header card

  const items = node.querySelectorAll('.Card.item');
  items.forEach(item => Card.paint(item, palette.secondary)); // Muted item cards
}
```

### Palette Modification Patterns

```javascript
// Create palette variants for different sections
const headerPalette = { ...palette, primary: palette.accent };
const contentPalette = palette;
const footerPalette = { ...palette, primary: palette.neutral };

Header.paint(header, headerPalette);
Content.paint(content, contentPalette);
Footer.paint(footer, footerPalette);
```

## Integration Patterns

### With Molecules

```javascript
import * as Card from '../molecules/Card.js';
import * as Sidebar from '../molecules/Sidebar.js';

export function paint(node, palette) {
  // Paint multiple instances of molecules
  const cards = node.querySelectorAll('.Card');
  cards.forEach((card, index) => {
    // Apply alternating styles
    const cardPalette =
      index % 2 === 0
        ? palette
        : {
            ...palette,
            primary: palette.secondary,
          };
    Card.paint(card, cardPalette);
  });

  // Paint unique molecules
  const sidebar = node.querySelector('.Sidebar');
  if (sidebar) Sidebar.paint(sidebar, palette);
}
```

### With Atoms (Direct Access)

```javascript
import * as Button from '../atoms/Button.js';
import * as Text from '../atoms/Text.js';

export function paint(node, palette) {
  // Sometimes organisms need direct atom access
  // for fine-grained control

  const ctaButton = node.querySelector('.Button.cta');
  if (ctaButton) {
    Button.paint(ctaButton, {
      ...palette,
      primary: { ...palette.accent, DEFAULT: palette.accent.base },
    });
  }
}
```

## Creating New Organisms

### Design Considerations

**Before creating an organism, ask:**

1. Does this combine 3+ molecules or 8+ atoms?
2. Does it represent a distinct UI section?
3. Will it be reused across multiple templates?
4. Does it manage contextual styling logic?

If yes to 3+, create an organism. Otherwise, use a molecule.

### Implementation Steps

1. **Plan the composition**

   ```
   Organism: ProductGrid
   ├── Molecule: FilterBar (Dropdown + TextInput + Button)
   ├── Molecules: Card[] (product cards in grid)
   └── Molecule: Pagination (Button[] + Text)
   ```

2. **Create the file**

   ```bash
   touch organisms/ProductGrid.js
   ```

3. **Import dependencies**

   ```javascript
   import * as FilterBar from '../molecules/FilterBar.js';
   import * as Card from '../molecules/Card.js';
   import * as Pagination from '../molecules/Pagination.js';
   ```

4. **Export paint function**

   ```javascript
   export function paint(node, palette) {
     if (!node) return;

     // Organism container
     node.setAttribute('fill', palette.neutral.lightest);

     // Filter section
     const filterBar = node.querySelector('.FilterBar');
     if (filterBar) FilterBar.paint(filterBar, palette);

     // Product grid
     const cards = node.querySelectorAll('.Card');
     cards.forEach(card => Card.paint(card, palette));

     // Pagination controls
     const pagination = node.querySelector('.Pagination');
     if (pagination) Pagination.paint(pagination, palette);
   }
   ```

5. **Use in templates**

   ```javascript
   import * as ProductGrid from '../organisms/ProductGrid.js';

   export function paint(node, palette) {
     const grid = node.querySelector('.ProductGrid');
     if (grid) ProductGrid.paint(grid, palette);
   }
   ```

## Best Practices

✅ **DO:**

- Combine molecules into cohesive sections
- Manage contextual color decisions
- Use descriptive class names for sections
- Document expected SVG structure
- Check child existence before painting
- Pass appropriate palette variants
- Keep organisms focused on single section

❌ **DON'T:**

- Create organisms for simple 2-3 atom combinations (use molecules)
- Mix unrelated UI sections in one organism
- Hard-code colors (use palette parameters)
- Create organisms with 50+ child elements (split into multiple organisms)
- Add animation logic (use Animator.js)
- Manipulate DOM outside organism scope

## Organism vs Template Decision

**Use an Organism when:**

- Represents a distinct UI section (header, sidebar, card grid)
- Combines 3+ molecules or 8+ atoms
- Reused across multiple page templates
- Manages contextual styling for children
- Examples: Navigation header, comment section, product carousel

**Use a Template when:**

- Represents a complete page layout
- Combines multiple organisms
- Defines overall page structure
- Rarely reused (page-specific)
- Examples: Home page, product detail page, checkout page

## Common Issues

### Molecules Not Styling Correctly

**Problem**: Child molecules not receiving correct colors

**Solutions**:

- Verify import paths are correct (`../molecules/...`)
- Check palette object is complete
- Ensure molecule paint functions are exported
- Pass palette object to each molecule painter

### Too Many Direct Atom References

**Problem**: Organism imports 20+ atom modules directly

**Solutions**:

- Refactor into molecules first
- Group related atoms into new molecules
- This reduces organism complexity and improves reusability

### Circular Dependencies

**Problem**: Organism A imports Organism B, which imports Organism A

**Solutions**:

- Organisms should not import other organisms
- Extract common logic to shared molecules
- Redesign component hierarchy

### Performance Degradation

**Problem**: Painting large organisms is slow

**Solutions**:

- Cache `querySelectorAll` results
- Paint only visible organisms (lazy loading)
- Batch DOM manipulations
- Use `requestAnimationFrame` for heavy operations

## Performance Optimization

### Efficient Querying

```javascript
// ❌ BAD - Multiple queries
export function paint(node, palette) {
  node.querySelectorAll('.Card').forEach(c => Card.paint(c, palette));
  node.querySelectorAll('.Card').forEach(c => validate(c));
  node.querySelectorAll('.Card').forEach(c => track(c));
}

// ✅ GOOD - Single query, reuse results
export function paint(node, palette) {
  const cards = node.querySelectorAll('.Card');
  cards.forEach(card => {
    Card.paint(card, palette);
    validate(card);
    track(card);
  });
}
```

### Palette Object Reuse

```javascript
// ❌ BAD - Creating objects in loop
cards.forEach(card => {
  Card.paint(card, { ...palette, primary: palette.secondary });
});

// ✅ GOOD - Create once, reuse
const cardPalette = { ...palette, primary: palette.secondary };
cards.forEach(card => Card.paint(card, cardPalette));
```

## Testing Patterns

### Structure Validation

```javascript
export function validate(node) {
  const required = {
    molecules: ['.Card', '.Sidebar'],
    atoms: ['.Button.submit', '.Text.heading'],
  };

  const missing = [];
  required.molecules.forEach(sel => {
    if (!node.querySelector(sel)) missing.push(sel);
  });

  if (missing.length > 0) {
    console.warn(`Organism missing: ${missing.join(', ')}`);
    return false;
  }
  return true;
}
```

### Visual Regression Testing

```javascript
export function paintWithDefaults(node) {
  const testPalette = {
    primary: { base: '#0000ff', light: '#6666ff', dark: '#000066' },
    secondary: { base: '#00ff00', light: '#66ff66', dark: '#006600' },
    neutral: { base: '#666666', light: '#cccccc', dark: '#333333' },
    accent: { base: '#ff0000', light: '#ff6666', dark: '#660000' },
  };

  paint(node, testPalette);
}
```

## Related Documentation

- **Parent README**: `../README.md` - Blockframes system overview
- **Atoms**: `../atoms/README.md` - Primitive building blocks
- **Molecules**: `../molecules/README.md` - Simple component groups
- **Templates**: `../templates/README.md` - Complete page layouts
- **Painter.js**: `../Painter.js` - Main routing system

---

**Atomic Design Level**: Organisms (Level 3 of 5)  
**Composition**: Atoms → Molecules → **Organisms** → Templates → Pages
