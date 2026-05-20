<!-- @format -->

# 📄 Templates

**Atomic Design Level**: Complete page layouts combining organisms, molecules, and atoms.

## Overview

Templates are complete page-level wireframe layouts that define the overall structure and content organization of different page types. They combine organisms, molecules, and atoms into cohesive, functional page designs representing common web application patterns.

## Purpose

Templates serve as the final composition layer by:

- Defining complete page structures and layouts
- Combining organisms into full-page designs
- Establishing content hierarchy and flow
- Providing reusable page archetypes
- Serving as wireframe blueprints for actual pages

## File Structure

Each template exports a `paint` function that orchestrates the styling of the entire page layout:

```javascript
import * as Header from '../organisms/Header.js';
import * as Sidebar from '../molecules/Sidebar.js';
import * as Card from '../molecules/Card.js';

export function paint(node, palette) {
  // Paint page background/container
  node.setAttribute('fill', palette.neutral.lightest);

  // Paint major sections (organisms)
  const header = node.querySelector('.Header');
  if (header) Header.paint(header, palette);

  // Paint content areas (molecules/organisms)
  const cards = node.querySelectorAll('.Card');
  cards.forEach(card => Card.paint(card, palette));
}

// Optional: Animation functions
export function intro(node) {
  return gsap.from(node, { duration: 1, opacity: 0 });
}

export function outro(node) {
  return gsap.to(node, { duration: 0.5, opacity: 0 });
}
```

## Available Templates

### **Article.js**

Blog post or article reading layout.

**Layout Structure**:

- Header with breadcrumb navigation
- Large hero image
- Article title and metadata
- Multi-column text content
- Related articles sidebar

**SVG Structure**:

```xml
<g class="Article">
  <g class="breadcrumb"></g>
  <g class="image hero"></g>
  <g class="header"></g>
  <g class="introduction"></g>
  <g class="chrome"></g>
  <g class="content">
    <!-- Article body content -->
  </g>
</g>
```

**Use Cases**: Blog posts, news articles, documentation pages, editorial content

**Styling Notes**:

- Hero image uses secondary palette for visual interest
- Header uses semantic alert color for emphasis
- Chrome (browser frame) uses primary color with dark border

---

### **Basic.js**

Simple, generic content page.

**Layout Structure**:

- Header
- Main content area
- Optional sidebar
- Footer

**Use Cases**: About pages, simple landing pages, static content

---

### **Blog.js**

Blog listing or feed page.

**Layout Structure**:

- Header with navigation
- Featured post card
- Grid of blog post teasers
- Pagination controls
- Sidebar with categories/tags

**Use Cases**: Blog home, category pages, archive pages

---

### **Calendar.js**

Calendar or schedule view interface.

**Layout Structure**:

- Month/week/day navigation
- Date grid with events
- Event details panel
- Controls for view switching

**Use Cases**: Event calendars, booking systems, schedule management

---

### **Cart.js**

Shopping cart and checkout page.

**Layout Structure**:

- Cart items list (CartItem organisms)
- Order summary sidebar
- Promo code input
- Checkout button
- Continue shopping link

**Use Cases**: E-commerce carts, order review pages

---

### **Chart.js**

Data visualization dashboard.

**Layout Structure**:

- Header with filters
- Multiple chart cards (pie, donut, bar)
- Data table
- Legend and controls

**Use Cases**: Analytics dashboards, reporting interfaces, admin panels

---

### **Contact.js**

Contact or feedback form page.

**Layout Structure**:

- Header with page title
- Contact form (Form organism)
- Contact information sidebar (address, phone, email)
- Optional map location

**Use Cases**: Contact pages, support forms, feedback pages

---

### **Features.js**

Product or service features showcase.

**Layout Structure**:

- Hero section with title
- Grid of feature cards
- Icon + description for each feature
- CTA section

**Use Cases**: Product landing pages, service descriptions, feature highlights

---

### **Feed.js**

Social media or activity feed layout.

**Layout Structure**:

- Header with filters
- Post cards in chronological order
- User profiles with avatars
- Interaction buttons (like, comment, share)
- Load more / infinite scroll area

**Use Cases**: Social media feeds, activity streams, news feeds

---

### **Landing.js**

Marketing landing page layout.

**Layout Structure**:

- Hero section with headline and CTA
- Features section
- Testimonials
- Pricing cards
- Final CTA section
- Footer

**Use Cases**: Product launches, marketing campaigns, lead generation

---

### **List.js**

List or table view of items.

**Layout Structure**:

- Header with search/filters
- Table or list of items
- Sorting controls
- Pagination
- Optional sidebar filters

**Use Cases**: Product listings, user management, data tables

---

### **Login.js**

Authentication form page.

**Layout Structure**:

- Centered login form
- Logo/branding
- Username/email input
- Password input
- Remember me checkbox
- Forgot password link
- Submit button
- Sign up link

**Use Cases**: Login pages, registration forms, password reset

---

### **Main.js**

Main application dashboard or home page.

**Layout Structure**:

- Top navigation header
- Sidebar navigation
- Main content area with widgets/cards
- Footer

**Use Cases**: Admin dashboards, app home screens, user portals

---

### **Map.js**

Map-based interface.

**Layout Structure**:

- Large map area with streets and pins
- Location list sidebar
- Search/filter controls
- Location detail panel

**Use Cases**: Store locators, real estate maps, location finders

---

### **Project.js**

Project or portfolio detail page.

**Layout Structure**:

- Hero image/video
- Project title and metadata
- Description and details
- Image gallery
- Related projects

**Use Cases**: Portfolio pieces, case studies, project showcases

---

### **Text.js**

Text-heavy content layout.

**Layout Structure**:

- Header
- Multi-column text content
- Optional sidebar with table of contents
- Footnotes/references

**Use Cases**: Documentation, long-form articles, legal pages

---

### **Timeline.js**

Chronological timeline interface.

**Layout Structure**:

- Vertical or horizontal timeline
- Event markers
- Event details for each point
- Navigation controls

**Use Cases**: Company history, project timelines, event sequences

---

### **Video.js**

Video player and playlist interface.

**Layout Structure**:

- Large video player
- Video title and description
- Playlist sidebar
- Related videos
- Comments section

**Use Cases**: Video platforms, course players, video galleries

---

### **chrome.js**

Browser chrome/frame utilities.

**Purpose**: Utility functions for styling browser UI elements (title bars, address bars, window controls)

**Use Cases**: Browser mockups, application screenshots, web interface demos

---

## Template Export Pattern

Templates commonly export multiple functions:

```javascript
// Required: Main styling function
export function paint(elem, palette) {
  // Style all template elements
}

// Optional: Intro animation
export function intro(elem) {
  return gsap.from(elem, {
    duration: 1,
    opacity: 0,
    y: 20,
    ease: 'power2.out',
  });
}

// Optional: Outro animation
export function outro(elem) {
  return gsap.to(elem, {
    duration: 0.5,
    opacity: 0,
    scale: 0.95,
    ease: 'power2.in',
  });
}

// Optional: Validation
export function validate(elem) {
  // Check required structure exists
  return elem.querySelector('.required-section') !== null;
}
```

## Palette Application Strategy

### Page-Level Color Theming

Templates make the highest-level color decisions:

```javascript
export function paint(elem, palette) {
  // 1. Page background
  elem.setAttribute('fill', palette.neutral.lightest);

  // 2. Header section - emphasized
  const header = elem.querySelector('.header');
  if (header) {
    header.setAttribute('fill', palette.primary.DEFAULT);
    // Pass modified palette to header children
    Header.paint(header, {
      ...palette,
      neutral: { ...palette.neutral, dark: palette.neutral.lightest }, // Invert for contrast
    });
  }

  // 3. Content section - standard
  const content = elem.querySelector('.content');
  Content.paint(content, palette);

  // 4. Sidebar - muted
  const sidebar = elem.querySelector('.sidebar');
  if (sidebar) {
    sidebar.setAttribute('fill', palette.neutral.light);
    Sidebar.paint(sidebar, palette);
  }
}
```

### Semantic Color Usage

Templates often use semantic colors for status/context:

```javascript
export function paint(elem, palette) {
  // Success state
  const successMessage = elem.querySelector('.message.success');
  if (successMessage) {
    successMessage.setAttribute('fill', palette.semantic.success);
  }

  // Error state
  const errorMessage = elem.querySelector('.message.error');
  if (errorMessage) {
    errorMessage.setAttribute('fill', palette.semantic.error);
  }

  // Warning state
  const warningBanner = elem.querySelector('.banner.warning');
  if (warningBanner) {
    warningBanner.setAttribute('fill', palette.semantic.warning);
  }
}
```

## Integration with Painter.js

Templates are imported and routed through `Painter.js`:

```javascript
// In Painter.js
import * as Article from './templates/Article.js';
import * as Blog from './templates/Blog.js';
// ... more imports

export function block(blockNode, palette) {
  const type = blockNode.classList[0].toLowerCase();

  switch (type) {
    case 'article':
      Article.paint(blockNode, palette);
      break;
    case 'blog':
      Blog.paint(blockNode, palette);
      break;
    // ... more cases
  }
}
```

## Animation Integration

### Using Template Animations

```javascript
import * as Article from './templates/Article.js';

// Get article element from SVG
const article = blockframes.getBlock('.Article');

// Paint with colors
Article.paint(article, palette);

// Animate entrance
if (Article.intro) {
  const timeline = Article.intro(article);
  timeline.play();
}
```

### Common Animation Patterns

```javascript
// Fade in from bottom
export function intro(elem) {
  return gsap.from(elem, {
    duration: 1,
    opacity: 0,
    y: 50,
    ease: 'power2.out',
  });
}

// Stagger children
export function intro(elem) {
  const children = elem.querySelectorAll('.Card');
  return gsap.from(children, {
    duration: 0.8,
    opacity: 0,
    y: 30,
    stagger: 0.1,
    ease: 'power2.out',
  });
}

// Complex sequence
export function intro(elem) {
  const tl = gsap.timeline();

  tl.from(elem.querySelector('.header'), {
    duration: 0.5,
    opacity: 0,
    y: -20,
  })
    .from(
      elem.querySelector('.image'),
      {
        duration: 0.7,
        scale: 0.9,
        opacity: 0,
      },
      '-=0.2'
    )
    .from(
      elem.querySelectorAll('.content > *'),
      {
        duration: 0.5,
        opacity: 0,
        y: 20,
        stagger: 0.1,
      },
      '-=0.3'
    );

  return tl;
}
```

## Creating New Templates

### Step-by-Step Process

1. **Analyze the page structure**

   - Identify major sections (header, hero, content, sidebar, footer)
   - Determine which organisms/molecules are needed
   - Sketch the layout hierarchy

2. **Create the template file**

   ```bash
   touch templates/ProductDetail.js
   ```

3. **Import dependencies**

   ```javascript
   import * as Image from '../organisms/Image.js';
   import * as Card from '../molecules/Card.js';
   import * as TextBlock from '../molecules/TextBlock.js';
   import * as Button from '../atoms/Button.js';
   ```

4. **Implement paint function**

   ```javascript
   export function paint(elem, palette) {
     if (!elem) return;

     // Page background
     elem.setAttribute('fill', palette.neutral.lightest);

     // Hero section
     const hero = elem.querySelector('.hero');
     if (hero) {
       hero.setAttribute('fill', palette.primary.light);
       const image = hero.querySelector('.Image');
       if (image) Image.paint(image, palette);
     }

     // Product details
     const details = elem.querySelector('.details');
     if (details) TextBlock.paint(details, palette);

     // Related products
     const related = elem.querySelectorAll('.Card.related');
     related.forEach(card => Card.paint(card, palette.secondary));

     // CTA button
     const cta = elem.querySelector('.Button.cta');
     if (cta) Button.paint(cta, { ...palette, primary: palette.accent });
   }
   ```

5. **Add animations (optional)**

   ```javascript
   export function intro(elem) {
     const tl = gsap.timeline();

     tl.from(elem.querySelector('.hero'), { duration: 0.8, opacity: 0 })
       .from(elem.querySelector('.details'), { duration: 0.6, x: -50, opacity: 0 }, '-=0.4')
       .from(elem.querySelectorAll('.related'), { duration: 0.5, y: 30, opacity: 0, stagger: 0.1 }, '-=0.3');

     return tl;
   }
   ```

6. **Register in Painter.js**

   ```javascript
   import * as ProductDetail from "./templates/ProductDetail.js";

   // Add to switch statement
   case "productdetail":
     ProductDetail.paint(blockNode, palette);
     break;
   ```

7. **Add to SVG source**
   ```xml
   <g class="Blocks">
     <g class="ProductDetail">
       <!-- Template structure -->
     </g>
   </g>
   ```

## Best Practices

✅ **DO:**

- Define clear page structure and hierarchy
- Use organisms for major sections
- Apply consistent spacing and rhythm
- Document expected SVG structure
- Provide intro/outro animations
- Use semantic colors appropriately
- Test with multiple palettes
- Keep templates focused on single page types

❌ **DON'T:**

- Create overly complex templates (split into multiple)
- Mix multiple page types in one template
- Hard-code colors (use palette)
- Add business logic (templates are presentational)
- Manipulate elements outside template scope
- Forget to check for element existence
- Ignore responsive considerations

## Common Issues

### Missing Elements

**Problem**: Template expects elements that don't exist in SVG

**Solutions**:

- Always check existence: `if (elem) paint(elem, palette)`
- Validate SVG structure matches template expectations
- Provide graceful degradation for optional elements

### Color Conflicts

**Problem**: Child organisms override template colors incorrectly

**Solutions**:

- Apply template background first
- Then paint children (they inherit/override)
- Pass modified palettes for specific sections

### Animation Timing Issues

**Problem**: Animations don't coordinate well

**Solutions**:

- Use GSAP timelines for sequencing
- Add negative delays for overlaps: `'-=0.3'`
- Test animations at different speeds

## Performance Considerations

### Lazy Painting

```javascript
// Only paint visible templates
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const template = entry.target;
      const type = template.classList[0];
      paintTemplate(type, template, palette);
    }
  });
});

templates.forEach(t => observer.observe(t));
```

### Batch DOM Updates

```javascript
// ❌ BAD - Multiple reflows
export function paint(elem, palette) {
  elem.setAttribute('fill', palette.neutral.lightest);
  elem.querySelector('.header').setAttribute('fill', palette.primary.base);
  elem.querySelector('.content').setAttribute('fill', palette.neutral.light);
}

// ✅ GOOD - Batch updates
export function paint(elem, palette) {
  requestAnimationFrame(() => {
    elem.setAttribute('fill', palette.neutral.lightest);
    elem.querySelector('.header').setAttribute('fill', palette.primary.base);
    elem.querySelector('.content').setAttribute('fill', palette.neutral.light);
  });
}
```

## Testing Patterns

### Visual Regression Testing

```javascript
export function paintWithTestPalette(elem) {
  const testPalette = {
    primary: { base: '#FF0000', light: '#FF6666', dark: '#990000', DEFAULT: '#FF0000' },
    secondary: { base: '#00FF00', light: '#66FF66', dark: '#009900', DEFAULT: '#00FF00' },
    neutral: { base: '#666666', light: '#CCCCCC', dark: '#333333', lightest: '#F5F5F5', DEFAULT: '#666666' },
    accent: { base: '#0000FF', light: '#6666FF', dark: '#000099', DEFAULT: '#0000FF' },
    semantic: { success: '#00CC00', error: '#CC0000', warning: '#CCCC00', info: '#00CCCC', alert: '#CC00CC' },
  };

  paint(elem, testPalette);
}
```

### Structure Validation

```javascript
export function validate(elem) {
  const required = ['.header', '.content'];
  const optional = ['.sidebar', '.footer'];

  const missing = required.filter(sel => !elem.querySelector(sel));
  if (missing.length > 0) {
    console.error(`Template missing required: ${missing.join(', ')}`);
    return false;
  }

  return true;
}
```

## Related Documentation

- **Parent README**: `../README.md` - Blockframes system overview
- **Atoms**: `../atoms/README.md` - Primitive building blocks
- **Molecules**: `../molecules/README.md` - Simple component groups
- **Organisms**: `../organisms/README.md` - Complex UI sections
- **Painter.js**: `../Painter.js` - Template routing system
- **Animator.js**: `../Animator.js` - Animation utilities

---

**Atomic Design Level**: Templates (Level 4 of 5)  
**Composition**: Atoms → Molecules → Organisms → **Templates** → Pages  
**Final Output**: Complete wireframe layouts ready for content
