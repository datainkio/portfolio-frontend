<!-- @format -->

# 🧬 Molecules

**Atomic Design Level**: Simple component groups combining multiple atoms.

## Overview

Molecules are the first level of component composition in the Blockframes system. They combine 2-3 atoms into simple, functional UI patterns that serve a single purpose. Each molecule is more useful than its individual atoms but still relatively simple.

## Purpose

Molecules bridge the gap between primitive atoms and complex organisms by:

- Combining atoms into cohesive UI patterns
- Creating reusable compound components
- Maintaining single-responsibility patterns
- Serving as building blocks for organisms

## File Structure

Each molecule exports a `paint` function that styles both the molecule container and its child atoms:

```javascript
import * as Button from '../atoms/Button.js';
import * as Text from '../atoms/Text.js';

export function paint(node, palette) {
  // Style the molecule container
  node.setAttribute('fill', palette.neutral.lightest);

  // Find and style child atoms
  const button = node.querySelector('.Button');
  const label = node.querySelector('.Text');

  if (button) Button.paint(button, palette);
  if (label) Text.paint(label, palette);
}
```

## Available Molecules

### **Card.js**

Content card with image, title, and description.

**Composition**: Image + Text + (optional) Button

**SVG Structure**:

```xml
<g class="Card">
  <g class="Image"></g>
  <g class="Text title"></g>
  <g class="Text description"></g>
  <g class="Button"></g>
</g>
```

**Use Cases**: Product cards, blog post previews, feature highlights

---

### **Chrome.js**

Browser window chrome (title bar, address bar, controls).

**Composition**: Text + Button (minimize/maximize/close)

**SVG Structure**:

```xml
<g class="Chrome">
  <rect class="title-bar"></rect>
  <g class="Text url"></g>
  <g class="Button close"></g>
  <g class="Button minimize"></g>
  <g class="Button maximize"></g>
</g>
```

**Use Cases**: Browser mockups, application screenshots, web interface demos

---

### **Dropdown.js**

Dropdown menu or select input.

**Composition**: Textfield + Button (arrow/chevron) + (optional) Menu items

**SVG Structure**:

```xml
<g class="Dropdown">
  <g class="Textfield"></g>
  <g class="Operator chevron"></g>
  <g class="menu-items">
    <g class="Text item"></g>
    <!-- More items -->
  </g>
</g>
```

**Use Cases**: Form selects, filter menus, navigation dropdowns

---

### **Map.js**

Simple map display with streets and pins.

**Composition**: Streets + Pin(s)

**SVG Structure**:

```xml
<g class="Map">
  <g class="Streets"></g>
  <g class="Pin"></g>
  <g class="Pin"></g>
  <!-- More pins -->
</g>
```

**Use Cases**: Location pickers, store locators, contact pages

---

### **Module.js**

Modular content block (generic container).

**Composition**: Variable - can contain any combination of atoms

**SVG Structure**:

```xml
<g class="Module">
  <!-- Flexible content structure -->
</g>
```

**Use Cases**: Dashboard widgets, content sections, reusable blocks

---

### **Sidebar.js**

Navigation sidebar with menu items.

**Composition**: Text (header) + Bullet + Text (menu items)

**SVG Structure**:

```xml
<g class="Sidebar">
  <g class="Text header"></g>
  <g class="menu">
    <g class="Bullet"></g>
    <g class="Text"></g>
  </g>
  <!-- More menu items -->
</g>
```

**Use Cases**: App navigation, settings menus, dashboard sidebars

---

### **Teaser.js**

Content teaser/preview (image + snippet).

**Composition**: Image + Text (headline + summary)

**SVG Structure**:

```xml
<g class="Teaser">
  <g class="Image"></g>
  <g class="Text headline"></g>
  <g class="Text summary"></g>
</g>
```

**Use Cases**: News previews, blog listings, content grids

---

### **TextBlock.js**

Multi-line text content block.

**Composition**: Text (header) + Text (body/paragraph)

**SVG Structure**:

```xml
<g class="TextBlock">
  <g class="Text header"></g>
  <g class="Text body"></g>
  <g class="Text body"></g>
  <!-- More paragraphs -->
</g>
```

**Use Cases**: Article content, help text, descriptions

---

### **TextInput.js**

Form input field with label.

**Composition**: Text (label) + Textfield (input)

**SVG Structure**:

```xml
<g class="TextInput">
  <g class="Text label"></g>
  <g class="Textfield"></g>
</g>
```

**Use Cases**: Login forms, search bars, contact forms

---

### **Video.js**

Video player interface.

**Composition**: Image (thumbnail) + Play (button) + Text (title/duration)

**SVG Structure**:

```xml
<g class="Video">
  <g class="Image thumbnail"></g>
  <g class="Play"></g>
  <g class="Text title"></g>
  <g class="Text duration"></g>
</g>
```

**Use Cases**: Video galleries, media players, streaming interfaces

---

## Composition Patterns

### Single-Purpose Pattern

Each molecule should serve one clear purpose:

```javascript
// ✅ GOOD - Clear single purpose
export function paint(node, palette) {
  // Styles a search input with button
  const input = node.querySelector('.Textfield');
  const button = node.querySelector('.Button');

  Textfield.paint(input, palette);
  Button.paint(button, palette.primary);
}

// ❌ BAD - Too many responsibilities
export function paint(node, palette) {
  // Handles search, filters, sorting, pagination...
  // This should be an organism, not a molecule
}
```

### Hierarchical Styling

Apply styles from container to atoms:

```javascript
export function paint(node, palette) {
  // 1. Style molecule container
  node.setAttribute('fill', palette.neutral.lightest);
  node.setAttribute('stroke', palette.neutral.base);

  // 2. Style child atoms
  const atoms = node.querySelectorAll('.Button');
  atoms.forEach(atom => Button.paint(atom, palette));
}
```

### Palette Inheritance

Molecules can pass modified palettes to atoms:

```javascript
export function paint(node, palette) {
  const primaryButton = node.querySelector('.Button.primary');
  const secondaryButton = node.querySelector('.Button.secondary');

  // Pass full palette for primary
  Button.paint(primaryButton, palette);

  // Pass modified palette for secondary
  Button.paint(secondaryButton, {
    ...palette,
    primary: palette.secondary,
  });
}
```

## Palette Usage

Molecules use the same palette structure as atoms but may apply colors more contextually:

```javascript
{
  primary: { light: '#xxx', base: '#xxx', dark: '#xxx', DEFAULT: '#xxx' },
  secondary: { light: '#xxx', base: '#xxx', dark: '#xxx', DEFAULT: '#xxx' },
  neutral: { light: '#xxx', base: '#xxx', dark: '#xxx', DEFAULT: '#xxx' },
  accent: { light: '#xxx', base: '#xxx', dark: '#xxx', DEFAULT: '#xxx' },
  semantic: { success: '#xxx', warning: '#xxx', error: '#xxx', info: '#xxx' }
}
```

### Molecule-Level Color Decisions

Molecules make contextual color choices:

- **Container backgrounds**: Usually `neutral.lightest` or `neutral.light`
- **Borders**: `neutral.base` for subtle, `primary.base` for emphasis
- **Interactive elements**: `primary` for CTAs, `secondary` for alternatives
- **Status indicators**: `semantic.*` colors

## Integration with Atoms

### Import Pattern

Always import atom modules at the top:

```javascript
import * as Image from '../atoms/Image.js';
import * as Text from '../atoms/Text.js';
import * as Button from '../atoms/Button.js';
```

### Selective Painting

Not all atoms need styling if defaults are acceptable:

```javascript
export function paint(node, palette) {
  // Only paint atoms that need custom colors
  const highlightedText = node.querySelector('.Text.highlight');
  if (highlightedText) {
    Text.paint(highlightedText, {
      ...palette,
      primary: palette.accent,
    });
  }

  // Other atoms use default/inherited styles
}
```

## Creating New Molecules

### Step-by-Step Process

1. **Identify the atoms needed**

   ```
   Molecule: UserProfile
   Atoms: Avatar + Text (name) + Text (role) + Button (follow)
   ```

2. **Create the file**

   ```bash
   touch molecules/UserProfile.js
   ```

3. **Import dependencies**

   ```javascript
   import * as Avatar from '../atoms/Avatar.js';
   import * as Text from '../atoms/Text.js';
   import * as Button from '../atoms/Button.js';
   ```

4. **Export paint function**

   ```javascript
   export function paint(node, palette) {
     if (!node) return;

     // Container styling
     node.setAttribute('fill', palette.neutral.lightest);
     node.setAttribute('stroke', palette.neutral.base);
     node.setAttribute('stroke-width', 1);

     // Find and paint atoms
     const avatar = node.querySelector('.Avatar');
     const name = node.querySelector('.Text.name');
     const role = node.querySelector('.Text.role');
     const button = node.querySelector('.Button');

     if (avatar) Avatar.paint(avatar, palette);
     if (name) Text.paint(name, palette);
     if (role) Text.paint(role, { ...palette, primary: palette.neutral });
     if (button) Button.paint(button, palette);
   }
   ```

5. **Use in organisms or templates**

   ```javascript
   import * as UserProfile from '../molecules/UserProfile.js';

   export function paint(node, palette) {
     const profiles = node.querySelectorAll('.UserProfile');
     profiles.forEach(profile => UserProfile.paint(profile, palette));
   }
   ```

## Best Practices

✅ **DO:**

- Combine 2-5 related atoms
- Maintain single purpose/responsibility
- Use consistent naming conventions
- Check for child existence before painting
- Import all required atoms
- Document expected SVG structure

❌ **DON'T:**

- Create molecules with 10+ atoms (use organisms)
- Mix unrelated functionality
- Hard-code colors (use palette)
- Manipulate DOM outside molecule scope
- Create circular dependencies with other molecules
- Add animation logic (use Animator.js)

## Molecule vs Organism Decision

**Use a Molecule when:**

- Combines 2-5 atoms
- Serves single, simple purpose
- Appears in multiple contexts
- Doesn't contain other molecules
- Examples: Search bar, user badge, stat card

**Use an Organism when:**

- Combines molecules and atoms
- Represents distinct section of UI
- Contains complex interactions
- Has multiple sub-components
- Examples: Header with nav, comment section, product grid

## Common Issues

### Atoms Not Found

**Problem**: `querySelector` returns null for atom

**Solutions**:

- Check SVG class names match atom selectors
- Verify SVG structure matches expected format
- Add existence checks: `if (atom) Atom.paint(atom, palette)`

### Styling Not Applying

**Problem**: Molecule styles override atom styles (or vice versa)

**Solutions**:

- Apply molecule container styles first
- Then apply atom styles (they override container)
- Use more specific selectors if needed

### Palette Not Propagating

**Problem**: Child atoms not receiving correct colors

**Solutions**:

- Pass palette object to all atom painters
- Check palette object structure is complete
- Verify no typos in palette key names

## Performance Considerations

- **querySelector Overhead**: Cache results if painting same molecule multiple times
- **Iteration Cost**: Use `querySelectorAll` with `forEach` efficiently
- **Palette Objects**: Reuse same palette object across molecules
- **Import Cost**: Tree-shaking removes unused imports (use ES6 modules)

## Testing Patterns

### Visual Testing

```javascript
// Create test harness
const testPalette = {
  primary: { base: '#0000ff' },
  secondary: { base: '#00ff00' },
  neutral: { base: '#666666' },
  accent: { base: '#ff0000' },
};

const card = document.querySelector('.Card');
Card.paint(card, testPalette);
```

### Structure Validation

```javascript
export function validate(node) {
  const required = ['.Image', '.Text.title', '.Button'];
  const missing = required.filter(sel => !node.querySelector(sel));

  if (missing.length > 0) {
    console.warn(`Card missing: ${missing.join(', ')}`);
    return false;
  }
  return true;
}
```

## Related Documentation

- **Parent README**: `../README.md` - Blockframes system overview
- **Atoms**: `../atoms/README.md` - Building blocks for molecules
- **Organisms**: `../organisms/README.md` - Next composition level
- **Templates**: `../templates/README.md` - Complete page layouts

---

**Atomic Design Level**: Molecules (Level 2 of 5)  
**Composition**: Atoms → **Molecules** → Organisms → Templates → Pages
