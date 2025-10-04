<!-- @format -->

# Lab Directory - Experimental Pages & Prototypes

**CRITICAL INFO**: The Lab section is designed for rapid prototyping and experimentation. This directory uses 11ty's automatic navigation generation to seamlessly add new experimental pages without manual configuration.

## Architecture Overview

The Lab operates as a self-contained experimental workspace within the 11ty static site:

- **Automatic Navigation**: New pages automatically appear in navigation menus
- **Template Inheritance**: All lab pages extend `templates/documentation.njk` for consistency
- **Asset Integration**: Full access to site-wide GSAP animations, design tokens, and CSS framework
- **Isolated Experiments**: Each page can include custom JavaScript and styles without affecting other pages

## Quick Start: Adding a New Lab Page

### 1. Create Your Page File

Create a new `.njk` file in this directory following the naming convention:

```bash
# Example: Creating a new canvas experiment
touch njk/_pages/lab/canvas-effects.njk
```

### 2. Add Frontmatter Configuration

Every lab page requires this frontmatter structure:

```yaml
---
layout: templates/documentation.njk
title: Canvas Effects # Display name in navigation and page title
description: Experimental canvas animations # Optional meta description
eleventyNavigation:
  key: Canvas Effects # Navigation identifier (usually same as title)
  parent: Lab # REQUIRED: Links this page to Lab section
scripts: > # Optional: Custom script tags for external libraries
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js"></script>
styles: > # Optional: Custom CSS for this page only
  <style>
    .experiment-container { background: #000; }
  </style>
---
```

### 3. Add Your Content

Lab pages support full HTML, Nunjucks templating, and component inclusion:

```nunjucks
<section>
  <h2>Canvas Animation Experiment</h2>
  <div id="canvas-container"></div>

  <script type="module">
    // Your experimental JavaScript
    import { gsap } from '/assets/js/gsap/all.js';

    // Experiment code here
  </script>
</section>
```

### 4. Navigation Updates Automatically

**MAGIC HAPPENS HERE**: The navigation system automatically:

1. **Scans all `.njk` files** in the lab directory during build
2. **Reads `eleventyNavigation` frontmatter** to extract page metadata
3. **Builds hierarchical navigation** with Lab as parent and your page as child
4. **Updates dropdown menus** in the site header to include your new page
5. **Generates URLs** based on filename (e.g., `canvas-effects.njk` → `/lab/canvas-effects/`)

## Navigation System Integration

### How It Works

The navigation system is powered by `eleventy/collections/navigation.js`:

- **Directory Scanning**: Automatically finds all pages with `eleventyNavigation.parent: Lab`
- **Hierarchical Building**: Creates nested menu structure with Lab → Child Pages
- **Template Integration**: Navigation components in `organisms/navigation/` render the menu
- **GSAP Animation**: Dropdown animations coordinate with page-level choreography system

### Navigation Requirements

For automatic navigation inclusion, your page MUST have:

```yaml
eleventyNavigation:
  key: 'Your Page Name' # Required: Unique identifier
  parent: Lab # Required: Links to Lab section
```

**CRITICAL**: Missing `parent: Lab` means your page won't appear in Lab navigation dropdown.

## Template System

### Documentation Template

All lab pages use `templates/documentation.njk` which provides:

- **Consistent Layout**: Header, navigation, footer structure
- **Asset Loading**: Automatic CSS and JavaScript inclusion
- **SEO Integration**: Meta tags, Open Graph, schema markup
- **Animation Coordination**: GSAP choreography initialization
- **Responsive Design**: Mobile-first layout with Tailwind CSS

### Custom Assets

Lab pages can include custom assets in multiple ways:

#### External Libraries (CDN)

```yaml
scripts: >
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js"></script>
```

#### Site Assets

```nunjucks
<script type="module">
  import { gsap } from '/assets/js/gsap/all.js';
  import { TextMorph } from '/assets/js/effects/text/text-morph.js';
</script>
```

#### Page-Specific Styles

```yaml
styles: >
  <style>
    .experiment-canvas { 
      width: 100vw; 
      height: 100vh; 
    }
  </style>
```

## Available Site Resources

Lab pages have full access to the site's design system and animation framework:

### GSAP Animation System

```javascript
import { gsap } from '/assets/js/gsap/all.js';
import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';
import { MorphSVGPlugin } from '/assets/js/gsap/MorphSVGPlugin.js';
```

### Design System Components

```nunjucks
{% include "atoms/button/button.njk" with {
  text: "Run Experiment",
  variant: "primary"
} %}
```

### Tailwind CSS Framework

```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-8">
  <div class="bg-accent text-accent-content rounded-lg p-4">Experiment content</div>
</div>
```

### Figma Design Tokens

- Colors automatically sync from Figma design system
- Typography scales available as CSS custom properties
- Consistent spacing and sizing tokens

## Development Workflow

### Local Development

1. **Start the development server**:

   ```bash
   npm start  # Runs Tailwind watch + 11ty serve in parallel
   ```

2. **Create your lab page** following the frontmatter structure above

3. **View in browser**: Navigate to `http://localhost:8080/lab/your-page-name/`

4. **Iterate rapidly**: 11ty automatically rebuilds on file changes

### File Organization

```
njk/_pages/lab/
├── README.md                 # This file
├── index.njk                # Lab section landing page
├── blockframes.njk          # SVG animation experiments
├── printmarks.njk           # CSS print styling experiments
├── text-party.njk           # Font morphing and text effects
├── text-radial-stagger.njk  # Radial text animation patterns
└── text-to-vector.njk       # Typography to vector conversion
```

### Naming Conventions

- **Kebab-case filenames**: `canvas-effects.njk` not `CanvasEffects.njk`
- **Descriptive names**: `text-morphing.njk` not `experiment1.njk`
- **Consistent titles**: Match `title` and `eleventyNavigation.key` for clarity

## Common Experiment Patterns

### Interactive Canvas Experiments

```nunjucks
---
layout: templates/documentation.njk
title: Canvas Experiment
eleventyNavigation:
  key: Canvas Experiment
  parent: Lab
scripts: >
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js"></script>
---

<section>
  <div id="canvas-container"></div>
  <script>
    function setup() {
      createCanvas(windowWidth, windowHeight);
    }

    function draw() {
      // Your p5.js code
    }
  </script>
</section>
```

### GSAP Animation Experiments

```nunjucks
---
layout: templates/documentation.njk
title: Animation Experiment
eleventyNavigation:
  key: Animation Experiment
  parent: Lab
---

<section>
  <div class="animation-container">
    <div class="box">Animate me!</div>
  </div>

  <script type="module">
    import { gsap } from '/assets/js/gsap/all.js';

    gsap.from('.box', {
      duration: 2,
      y: 100,
      opacity: 0,
      ease: 'bounce.out'
    });
  </script>
</section>
```

### Text Effects Experiments

```nunjucks
---
layout: templates/documentation.njk
title: Text Effects
eleventyNavigation:
  key: Text Effects
  parent: Lab
scripts: >
  <script src="https://cdnjs.cloudflare.com/ajax/libs/opentype.js/1.3.4/opentype.min.js"></script>
---

<section>
  <h1 id="morphing-text">EXPERIMENT</h1>

  <script type="module">
    import { TextMorph } from '/assets/js/effects/text/text-morph.js';

    const morph = new TextMorph('#morphing-text');
    morph.morphTo('COMPLETE');
  </script>
</section>
```

## Performance Considerations

### Optimization Strategies

- **Lazy load heavy libraries**: Use dynamic imports for non-critical dependencies
- **Minimize external scripts**: Bundle frequently used libraries in site assets
- **Optimize animations**: Use CSS transforms and GSAP for 60fps performance
- **Image optimization**: Use responsive images and WebP format when possible

### Bundle Size Monitoring

Large experiments can impact site performance:

- **Check bundle impact**: Monitor total JavaScript size with each experiment
- **Code splitting**: Use dynamic imports for experiment-specific code
- **Asset optimization**: Compress images and optimize video files

## Debugging Guidelines

### Common Issues

1. **Navigation not appearing**: Check `eleventyNavigation.parent: Lab` in frontmatter
2. **404 errors**: Verify filename matches URL structure expectations
3. **JavaScript errors**: Check browser console and module import paths
4. **Styling issues**: Verify Tailwind class names and CSS cascade order
5. **Animation conflicts**: Test with choreography system disabled

### Debugging Tools

- **11ty Debug Mode**: `DEBUG=Eleventy* npm run build:11ty`
- **Browser DevTools**: Performance tab for animation profiling
- **Console Logging**: Add debug output to experiment JavaScript
- **Lighthouse Auditing**: Performance and accessibility validation

## Enhancement Opportunities

### Experiment Templates

Create reusable templates for common experiment types:

- Canvas-based experiments with p5.js integration
- GSAP animation showcase templates
- Three.js 3D experiment boilerplate
- Text effects playground templates

### Documentation Integration

- **Inline documentation**: Add code comments explaining experiment techniques
- **Video demos**: Record experiment interactions for documentation
- **Performance metrics**: Display frame rates and performance data
- **Interactive controls**: Add GUI controls for real-time parameter adjustment

### Sharing and Export

- **URL parameters**: Allow deep linking to specific experiment states
- **Export functionality**: Save experiment results as images or videos
- **Social sharing**: Generate preview images for experiment sharing
- **Code export**: Allow downloading of experiment source code

## Technical Integration

### Build Process Integration

Lab pages integrate with the full site build pipeline:

1. **Design Token Sync**: Figma tokens available in all experiments
2. **Asset Processing**: Images and media processed through 11ty pipeline
3. **CSS Compilation**: Tailwind utilities available with design system tokens
4. **JavaScript Bundling**: ES modules work with site-wide animation system

### Animation Choreography

Experiments can integrate with site-wide animation system:

- **ScrollTrigger coordination**: Sync with page scroll behavior
- **Timeline management**: Coordinate with other page animations
- **Performance optimization**: Share GSAP context with site animations

**REMEMBER**: The Lab is your experimental playground. The navigation system automatically includes new pages, so you can focus on creativity and innovation. The template system provides consistency while allowing complete creative freedom within each experiment. When in doubt, look at existing lab pages for patterns and copy their frontmatter structure for guaranteed navigation integration.
