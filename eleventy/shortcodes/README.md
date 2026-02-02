<!-- @format -->

# Shortcodes - Reusable Template Components

Shortcodes are convenient macros that encapsulate common patterns, allowing templates to use powerful functionality with simple, readable syntax.

## Available Shortcodes

### `picture` - Responsive Image Handler

Applies CSS classes to picture elements and removes restrictive width/height attributes.

**Signature**:

```javascript
picture(htmlString, (pictureClasses = ''), (imgClasses = ''));
```

**Parameters**:

- `htmlString` - The `<picture>` or `<img>` HTML element as a string
- `pictureClasses` - CSS classes to apply to the `<picture>` wrapper (optional)
- `imgClasses` - CSS classes to apply to the `<img>` element (optional)

**Usage in Templates**:

```nunjucks
{# Add responsive styling to an image #}
{% picture imageElement, "w-full max-w-4xl mx-auto", "object-cover" %}

{# Simple image with just wrapper classes #}
{% picture imageElement, "shadow-lg rounded-lg" %}

{# No classes - just process the element #}
{% picture imageElement %}
```

**What It Does**:

- Adds specified CSS classes to `<picture>` and `<img>` elements
- Removes `width` and `height` attributes that can cause CSS layout issues
- Handles both `<picture>` elements and standalone `<img>` tags
- Returns processed HTML string ready for template rendering

**Why This Matters**:
Modern responsive images need flexible sizing controlled by CSS, not HTML attributes. This shortcode ensures images scale properly across devices while maintaining aspect ratios.

---

### `lightbox` - Modal Image Viewer

Creates an interactive image that opens in a modal dialog when clicked.

**Signature**:

```javascript
lightbox(htmlString, (title = ''), (caption = ''), (pictureClasses = ''), (imgClasses = ''));
```

**Parameters**:

- `htmlString` - The `<picture>` or `<img>` HTML element as a string
- `title` - Title text for the modal (optional)
- `caption` - Caption/description shown below the image (optional)
- `pictureClasses` - CSS classes for the `<picture>` element
- `imgClasses` - CSS classes for the `<img>` element

**Usage in Templates**:

```nunjucks
{# Lightbox with caption #}
{% lightbox imageElement, "Gallery Image", "Photography by Jane Doe" %}

{# Just title, no caption #}
{% lightbox imageElement, "Project Screenshot" %}

{# No title or caption - just the image #}
{% lightbox imageElement %}

{# With responsive styling #}
{% lightbox imageElement, "Featured", "Click to enlarge", "rounded-lg shadow", "object-cover" %}
```

**What It Does**:

- Wraps the image in a clickable button
- Creates a hidden `<dialog>` element containing the modal
- Shows a close button (✕) in the top-right corner
- Centers the image vertically and horizontally in the modal
- Displays optional caption text below the image
- Uses DaisyUI modal styling for consistent appearance

**Accessibility**:

- Dialog element provides native browser accessibility
- Focus is automatically managed
- Users can close with Escape key or close button
- Screen readers announce the modal appropriately

---

### `loremChars` - Character-Level Placeholder Text

Generates placeholder text at the character level for prototyping and testing.

**Signature**:

```javascript
loremChars((charCount = 50));
```

**Parameters**:

- `charCount` - Number of characters to generate (default: 50)

**Usage in Templates**:

```nunjucks
{# Generate 100 characters of placeholder text #}
<p>{% loremChars 100 %}</p>

{# Short placeholder for inline usage #}
<span>{% loremChars 30 %}</span>

{# Default 50 characters #}
<p>{% loremChars %}</p>
```

**Output Example**:

```
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusm...
```

**Use Cases**:

- Testing text wrapping and overflow behavior
- Creating realistic content layouts during development
- Validating text rendering with different lengths
- Component prototyping before content is finalized

---

### `loremPars` - Paragraph-Level Placeholder Text

Generates multiple paragraphs of placeholder text for testing longer content areas.

**Signature**:

```javascript
loremPars((paragraphCount = 1));
```

**Parameters**:

- `paragraphCount` - Number of paragraphs to generate (default: 1)

**Usage in Templates**:

```nunjucks
{# Generate 3 paragraphs of Lorem Ipsum #}
{% loremPars 3 %}

{# Single paragraph (default) #}
{% loremPars %}

{# Wrap in a container for styling #}
<div class="prose max-w-2xl mx-auto">
  {% loremPars 5 %}
</div>
```

**What It Does**:

- Generates realistic paragraph-length text blocks
- Each paragraph is wrapped in a `<p>` tag
- Multiple paragraphs are separated naturally
- Text uses standard Lorem Ipsum content for consistency

**Use Cases**:

- Testing article and blog post layouts
- Validating content section spacing and typography
- Creating realistic mockups for design reviews
- Component development before real content is available

---

## Integration with Airtable Content

Shortcodes work seamlessly with Airtable-sourced content:

```nunjucks
{# Example: Display project images with lightbox #}
{% set images = collections.images | findRecord(project.gallery) %}

{% for image in images %}
  <div class="gallery-item">
    {% lightbox image.html, image.title, image.credit, "rounded-lg" %}
  </div>
{% endfor %}
```

## Performance Notes

- **`picture` and `lightbox`** use Cheerio for DOM manipulation (minimal overhead)
- **`loremChars` and `loremPars`** generate text at build time (no runtime cost)
- All shortcodes are registered once during 11ty initialization
- Output is cached during builds for consistent results

## Common Patterns

### Responsive Gallery

```nunjucks
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {% for image in galleryImages %}
    {% lightbox image.html, image.alt %}
  {% endfor %}
</div>
```

### Hero Image with Styling

```nunjucks
<header class="h-96 overflow-hidden">
  {% picture heroImage, "h-full w-full", "h-full w-full object-cover" %}
</header>
```

### Content Preview Section

```nunjucks
<section class="prose max-w-2xl">
  <h2>Preview Content</h2>
  {% loremPars 2 %}
</section>
```

---

**See Also**:

- [Filters documentation](../filters/README.md) - Complete filter reference (23+ filters) with usage examples
- [Shortcodes detailed reference](./README.md) - This comprehensive guide
- [Eleventy configuration](../README.md) - 11ty system overview
- [Nunjucks templates](../../njk/README.md) - Template architecture
