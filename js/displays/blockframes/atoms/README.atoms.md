<!-- @format -->

# ⚛️ Atoms

**Atomic Design Level**: Foundational building blocks that cannot be broken down further.

## Overview

Atoms are the smallest functional units in the Blockframes design system. Each atom represents a single, indivisible UI element such as a button, text field, icon, or image placeholder. Atoms are pure, stateless components that receive styling through palette objects.

## Purpose

Atoms serve as the fundamental visual vocabulary for constructing more complex components. They:

- Provide consistent, reusable primitive elements
- Accept color palettes for theming
- Maintain no internal state or logic
- Can be combined to create molecules

## File Structure

Each atom module exports a painter function that applies colors/styles to SVG elements:

```javascript
export function paint(node, palette) {
  // Apply palette colors to SVG node attributes
  node.setAttribute("fill", palette.primary.base);
  node.setAttribute("stroke", palette.neutral.dark);
}
```

## Available Atoms

### **Avatar.js**

User profile image or placeholder circle.

**SVG Classes**: `.Avatar`, `.avatar`

**Typical Styling**:

- Fill: Primary or neutral colors
- Stroke: Contrast border
- Use in: Profile cards, comment sections, user lists

---

### **Bullet.js**

List item marker or indicator dot.

**SVG Classes**: `.Bullet`, `.bullet`

**Typical Styling**:

- Fill: Accent or primary color
- Small geometric shape (circle, square)
- Use in: Lists, navigation, step indicators

---

### **Button.js**

Interactive button element with label and background.

**SVG Classes**: `.Button`, `.button`

**Typical Styling**:

- Fill: Primary color (background)
- Stroke: Optional border
- Text: Contrast color for readability
- Use in: Forms, CTAs, navigation

---

### **Donut.js**

Donut chart segment for data visualization.

**SVG Classes**: `.Donut`, `.donut`

**Typical Styling**:

- Fill: Data-specific colors from palette
- Stroke: White or background color for separation
- Use in: Dashboard charts, analytics displays

---

### **Image.js**

Image placeholder rectangle with optional icon.

**SVG Classes**: `.Image`, `.image`

**Typical Styling**:

- Fill: Neutral light (placeholder background)
- Stroke: Subtle border
- Icon fill: Neutral base
- Use in: Gallery grids, article headers, product cards

---

### **Operator.js**

Mathematical or action operator symbols (+, -, ×, ÷, =).

**SVG Classes**: `.Operator`, `.operator`

**Typical Styling**:

- Fill: Semantic colors (green for add, red for delete)
- Use in: Calculators, quantity selectors, action buttons

---

### **Pie.js**

Pie chart segment for percentage visualization.

**SVG Classes**: `.Pie`, `.pie`

**Typical Styling**:

- Fill: Sequential palette colors
- Stroke: Background color for separation
- Use in: Dashboard analytics, statistics displays

---

### **Pin.js**

Map location marker icon.

**SVG Classes**: `.Pin`, `.pin`

**Typical Styling**:

- Fill: Primary or accent color
- Stroke: Dark outline for visibility
- Use in: Map interfaces, location lists

---

### **Play.js**

Media player control button (play/pause triangle).

**SVG Classes**: `.Play`, `.play`

**Typical Styling**:

- Fill: White or primary color
- Background circle: Accent or neutral color
- Use in: Video players, audio controls, media cards

---

### **Star.js**

Rating or favorite indicator star icon.

**SVG Classes**: `.Star`, `.star`

**Typical Styling**:

- Fill: Accent color (active) or neutral light (inactive)
- Stroke: Optional outline
- Use in: Product ratings, favorites lists, review systems

---

### **Streets.js**

Map street layout lines and paths.

**SVG Classes**: `.Streets`, `.streets`

**Typical Styling**:

- Stroke: Neutral base or dark
- Fill: None (line-based)
- Use in: Map backgrounds, location interfaces

---

### **Text.js**

Text label or content block.

**SVG Classes**: `.Text`, `.text`

**Typical Styling**:

- Fill: Neutral dark (readable text color)
- Font attributes: Size, weight, family
- Use in: Labels, headers, body content

---

### **Textfield.js**

Input field representation (rectangle with border).

**SVG Classes**: `.Textfield`, `.textfield`, `.text-field`

**Typical Styling**:

- Fill: Neutral lightest (input background)
- Stroke: Neutral base (border)
- Active state: Primary color border
- Use in: Forms, search bars, login screens

---

## Palette Object Structure

Atoms expect a palette object with this structure:

```javascript
{
  primary: { light: '#xxx', base: '#xxx', dark: '#xxx', DEFAULT: '#xxx' },
  secondary: { light: '#xxx', base: '#xxx', dark: '#xxx', DEFAULT: '#xxx' },
  neutral: { light: '#xxx', base: '#xxx', dark: '#xxx', DEFAULT: '#xxx' },
  accent: { light: '#xxx', base: '#xxx', dark: '#xxx', DEFAULT: '#xxx' },
  semantic: {
    success: '#xxx',
    warning: '#xxx',
    error: '#xxx',
    info: '#xxx',
    alert: '#xxx'
  }
}
```

## Usage Pattern

Atoms are typically called from molecule, organism, or template painters:

```javascript
// In a molecule painter
import * as Button from "../atoms/Button.js";
import * as Text from "../atoms/Text.js";

export function paint(node, palette) {
  const button = node.querySelector(".Button");
  const label = node.querySelector(".Text");

  Button.paint(button, palette);
  Text.paint(label, palette);
}
```

## SVG Node Requirements

**CRITICAL**: Each atom expects specific SVG structure:

1. **Class-based selection** - Elements must have matching class names
2. **SVG DOM attributes** - Uses `setAttribute()` for fill, stroke, etc.
3. **Valid SVG elements** - Must be `<rect>`, `<circle>`, `<path>`, `<text>`, etc.

## Styling Conventions

### Color Application Priority

1. **Fill** - Primary visual color
2. **Stroke** - Border/outline color
3. **Stroke-width** - Border thickness (typically 1-4)

### Palette Selection Guidelines

- **Primary**: Brand colors, main actions
- **Secondary**: Supporting content, less emphasis
- **Neutral**: Text, backgrounds, subtle elements
- **Accent**: Highlights, interactive states, CTAs
- **Semantic**: Status indicators (success, warning, error)

## Extending Atoms

### Creating a New Atom

1. Create file in `atoms/` directory (e.g., `Badge.js`)
2. Export `paint` function:

```javascript
export function paint(node, palette) {
  if (!node) return;

  node.setAttribute("fill", palette.accent.base);
  node.setAttribute("stroke", palette.accent.dark);
  node.setAttribute("stroke-width", 2);

  // Find nested elements
  const text = node.querySelector(".badge-text");
  if (text) {
    text.setAttribute("fill", palette.neutral.lightest);
  }
}
```

3. Import in parent components as needed
4. Add documentation to this README

### Optional Export Pattern

Some atoms may export multiple variations:

```javascript
export function paint(node, palette) {
  // Default styling
}

export function paintActive(node, palette) {
  // Active state styling
}

export function paintDisabled(node, palette) {
  // Disabled state styling
}
```

## Best Practices

✅ **DO:**

- Keep atoms simple and single-purpose
- Use palette object for all colors
- Check for node existence before manipulation
- Follow consistent naming conventions
- Document expected SVG structure

❌ **DON'T:**

- Add animation logic (use Animator.js)
- Include business logic or state
- Hard-code color values
- Manipulate parent or sibling elements
- Query outside the provided node scope

## Common Issues

### Atom Not Styling

**Problem**: Colors not applying to SVG element

**Solutions**:

- Verify SVG class name matches import
- Check palette object has required keys
- Ensure node exists (not null)
- Inspect SVG element type (must accept fill/stroke)

### Palette Colors Not Defined

**Problem**: `palette.primary.base` is undefined

**Solutions**:

- Verify palette object structure matches expected format
- Check parent caller is passing complete palette
- Add fallback colors: `palette.primary?.base || '#000000'`

### Multiple Atoms Conflict

**Problem**: One atom's styles overwrite another

**Solutions**:

- Use more specific class selectors
- Ensure unique class names in SVG source
- Check querySelector returns correct element

## Performance Notes

- **Lightweight**: Atoms only manipulate DOM attributes (fast)
- **No Animation**: Pure styling functions (no GSAP overhead)
- **Reusable**: Same atom can be painted multiple times with different palettes
- **Cacheable**: Palette objects can be reused across many atoms

## Related Documentation

- **Parent README**: `../README.md` - Blockframes system overview
- **Molecules**: `../molecules/README.md` - How atoms combine
- **Templates**: `../templates/README.md` - Complete usage examples
- **Painter.js**: `../Painter.js` - Main routing system

---

**Atomic Design Level**: Atoms (Level 1 of 5)  
**Next Level**: Molecules → Organisms → Templates → Pages
