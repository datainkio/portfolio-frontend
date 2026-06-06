<!-- @format -->

# Utils - Shared Utility Classes and Functions

Collection of reusable JavaScript utilities powering the portfolio site's interactive features. Organized by function with consistent API patterns.

## Quick Overview

```
┌─────────────────────────────────────┐
│      Utils Package                  │
├─────────────────────────────────────┤
│ Logger      → Debugging & logging   │
│ Math        → Vector/animation math │
│ Color       → Color space utilities │
│ Theme       → Dark/light management │
│ Diagnostics → Performance tracking  │
│ Tailwind    → Design token access   │
└─────────────────────────────────────┘
```

## Logger - Unified Logging System

Debug logging with semantic styling, singleton pattern, and environment-based control.

**Location**: `js/utils/logger/`

### Logger Class

Singleton pattern - single instance across entire application:

```javascript
import logger from "../js/utils/logger/index.js";

// Basic logging
logger.trace("Operation complete", optionalData, "brief", "success");
logger.info("Loading resources", resourceArray, "verbose");
logger.warn("Deprecated method used", details, "brief");
logger.error("Failed to load", error, "verbose");

// Group related logs
logger.group(async () => {
  logger.trace("Step 1: Starting");
  await doSomething();
  logger.trace("Step 1: Complete");
});
```

### Logger Styles

```javascript
import { LoggerStyles } from "../js/utils/logger/LoggerStyles.js";

// Semantic styles
("standard"); // ● Gray - Default informational
("success"); // ✅ Green - Successful operations
("error"); // ❌ Red - Errors/failures
("headsup"); // ⚡ Yellow - Important warnings
("custom"); // Custom color + emoji

// Using styles
logger.trace("Complete", data, "brief", LoggerStyles.success);
logger.trace("Warning", data, "verbose", LoggerStyles.headsup);

// Custom styles
import { LoggerStyle } from "../js/utils/logger/LoggerStyle.js";

const customStyle = new LoggerStyle("#ff00ff", "🎨");
logger.trace("Custom", data, "brief", customStyle);
```

### Configuration

```javascript
// Enable/disable logging
logger.enabled = true;

// Control output level
logger.setLevel("verbose"); // 'brief', 'verbose', 'silent'

// Environment control
if (process.env.DEBUG === "true") {
  logger.enabled = true;
  logger.setLevel("verbose");
}
```

### Use Cases

- Build script progress tracking
- Animation timeline debugging
- Data fetch/sync monitoring
- Performance profiling
- Error reporting

See [logger/README.md](./logger/README.md) for complete API reference.

## Math - Numerical & Vector Utilities

Mathematical functions for animation calculations and geometry.

**Location**: `js/utils/math/`

### Available Functions

#### Vector Operations

```javascript
import { Vector2, Vector3 } from "./math/Vector.js";

// 2D Vectors
const v1 = new Vector2(10, 20);
const v2 = new Vector2(5, 10);

v1.add(v2); // [15, 30]
v1.subtract(v2); // [5, 10]
v1.multiply(2); // [20, 40]
v1.divide(2); // [5, 10]
v1.length(); // Magnitude
v1.normalize(); // Unit vector
v1.dot(v2); // Dot product
v1.distance(v2); // Distance between vectors

// 3D Vectors
const v3d = new Vector3(1, 2, 3);
v3d.cross(other); // Cross product
```

#### Interpolation

```javascript
import { lerp, easeInOut, easeInQuad } from "./math/interpolation.js";

// Linear interpolation
lerp(0, 100, 0.5); // 50

// Easing functions
easeInOut(t); // t = 0-1
easeInQuad(t);
easeOutCubic(t);
easeInOutExpo(t);
```

#### Angle & Rotation

```javascript
import { toRadians, toDegrees, normalizeAngle } from "./math/angle.js";

toRadians(90); // 1.57...
toDegrees(Math.PI); // 180
normalizeAngle(450); // 90
```

### Integration with GSAP

```javascript
// Combine with GSAP for physics-based animations
import { lerp, Vector2 } from "./math/index.js";

const timeline = gsap.timeline();
timeline.fromTo(
  element,
  { x: 0, y: 0 },
  {
    x: 100,
    y: 100,
    ease: "power2.inOut",
    duration: 1,
  },
);
```

## Color - Color Space Utilities

Color conversion, manipulation, and analysis tools.

**Location**: `js/utils/color/`

### ColorSpace Class

```javascript
import { ColorSpace } from "./color/ColorSpace.js";

// Parse any color format
const color = new ColorSpace("#ff00ff"); // Hex
const color2 = new ColorSpace("rgb(255,0,255)"); // RGB
const color3 = new ColorSpace("hsl(300,100%,50%)"); // HSL

// Convert between formats
color.toHex(); // '#ff00ff'
color.toRGB(); // 'rgb(255,0,255)'
color.toHSL(); // 'hsl(300,100%,50%)'
color.toRGBA(0.5); // 'rgba(255,0,255,0.5)'

// Analyze color
color.luminance(); // 0-1 brightness
color.isDark(); // Boolean
color.isLight(); // Boolean
color.getContrast(otherColor); // WCAG contrast ratio
```

### Color Manipulation

```javascript
// Adjust properties
color.lighten(20); // Increase lightness by 20%
color.darken(10); // Decrease lightness by 10%
color.saturate(30); // Increase saturation
color.desaturate(15); // Decrease saturation
color.rotate(45); // Rotate hue by 45°
color.invert(); // Invert color

// Get variants
color.complementary(); // Opposite on color wheel
color.triadic(); // 3-color harmony
color.analogous(); // Adjacent colors
```

### Design Token Integration

```javascript
import { ThemeColors } from "./color/ThemeColors.js";

// Access design tokens
const primaryColor = ThemeColors.primary500;
const secondaryColor = ThemeColors.secondary700;

// Works with CSS custom properties
const computedColor = getComputedStyle(
  document.documentElement,
).getPropertyValue("--color-primary-500");
```

## Theme - Dark/Light Mode Management

Persistent theme switching with localStorage and system preference detection.

**Location**: `js/utils/theme.js`

### Theme Management

```javascript
import { setTheme, getTheme, initTheme } from "./theme.js";

// Initialize on page load (respects system preference)
initTheme();

// Get current theme
const current = getTheme(); // 'light' or 'dark'

// Set theme
setTheme("dark");
setTheme("light");

// Toggle theme
const newTheme = getTheme() === "dark" ? "light" : "dark";
setTheme(newTheme);

// Listen to theme changes
document.addEventListener("theme-change", (e) => {
  console.log(`Theme changed to: ${e.detail.theme}`);
});
```

### System Preference Detection

```javascript
// Automatically detect system preference
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  setTheme("dark");
} else {
  setTheme("light");
}

// Listen to system preference changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    setTheme(e.matches ? "dark" : "light");
  });
```

### CSS Integration

```css
/* Automatic theme detection */
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
}

[data-theme="dark"] {
  --bg-color: #000000;
  --text-color: #ffffff;
}
```

## Diagnostics - Performance & Debugging

Performance tracking and accessibility utilities.

**Location**: `js/utils/diagnostics/`

### ScrollBlocked Detection

```javascript
import { ScrollBlockedDiagnostic } from "./diagnostics/ScrollBlockedDiagnostic.js";

const diagnostic = new ScrollBlockedDiagnostic({
  showLogs: true, // Console output
  threshold: 100, // Time in ms to consider blocked
});

diagnostic.start();

// Monitor performance
diagnostic.getReport(); // {
//   totalFrames: 1800,
//   blockedFrames: 25,
//   averageBlockDuration: 45,
//   fps: 58
// }

diagnostic.stop();
```

### Accessibility Checking

```javascript
import { AccessibilityAuditor } from "./diagnostics/AccessibilityAuditor.js";

const auditor = new AccessibilityAuditor();

// Check specific elements
auditor.checkElement(element); // Returns issues array

// Full page audit
auditor.auditPage(); // {
//   missingAltText: 12,
//   lowContrast: 3,
//   missingAriaLabels: 7,
//   total: 22
// }
```

### Memory Profiling

```javascript
import { MemoryProfiler } from "./diagnostics/MemoryProfiler.js";

const profiler = new MemoryProfiler();

profiler.mark("start-operation");
doHeavyOperation();
profiler.mark("end-operation");

profiler.getReport();
// { 'start-operation': 45.2 MB, 'end-operation': 67.8 MB }
```

## Tailwind - Design Token Access

Access Tailwind configuration and custom design tokens programmatically.

**Location**: `js/utils/tailwind/`

### Theme Tokens

```javascript
import { ThemeTokens } from "./tailwind/ThemeTokens.js";

// Access color tokens
const colors = ThemeTokens.colors;
colors.primary[500]; // Primary 500 color
colors.secondary[700]; // Secondary 700 color

// Access typography
const typography = ThemeTokens.typography;
typography.fontFamily.sans;
typography.fontSize.lg;
typography.fontWeight.bold;

// Access spacing
const spacing = ThemeTokens.spacing;
spacing.px; // 1px
spacing[4]; // 1rem
spacing[8]; // 2rem
```

### ThemeColors Class

```javascript
import { ThemeColors } from "./tailwind/ThemeColors.js";

// Static access
ThemeColors.primary500;
ThemeColors.neutral700;
ThemeColors.success400;

// Dynamic access
ThemeColors.getColor("primary", 500);
ThemeColors.getColor("secondary", 700);

// Get all colors in scale
ThemeColors.getScale("primary"); // [50, 100, 200, ..., 950]
```

### Runtime Theme Customization

```javascript
import { ThemeTokens } from "./tailwind/ThemeTokens.js";

// Extend tokens at runtime
ThemeTokens.extend({
  colors: {
    accent: "#ff00ff",
  },
});

// Generate CSS variables
const cssVariables = ThemeTokens.toCSSVariables();
// { '--color-primary-500': '#...', ... }
```

## AssetPath - Asset Resolution

Resolve asset paths for different build environments.

**Location**: `js/utils/assetPath.js`

```javascript
import { getAssetPath, getImagePath, getVideoPath } from "./assetPath.js";

// Resolve asset paths
getAssetPath("icons/menu.svg"); // '/assets/icons/menu.svg'
getImagePath("hero.jpg"); // '/assets/images/hero.jpg'
getVideoPath("background.mp4"); // '/assets/video/background.mp4'

// With environment variables
const cdnUrl = process.env.CDN_URL || "/assets/";
getAssetPath("styles.css", cdnUrl); // 'https://cdn.example.com/styles.css'
```

## Directory Structure

```plaintext
js/utils/
├── README.md                    # This file
├── logger/                      # Logging system
│   ├── README.md               # Logger documentation
│   ├── index.js                # Package entry point
│   ├── Logger.js               # Singleton logger
│   ├── LoggerStyle.js          # Style definition
│   └── LoggerStyles.js         # Predefined styles
├── math/                        # Mathematical utilities
│   ├── Vector.js               # Vector2/Vector3 classes
│   ├── interpolation.js        # Lerp & easing functions
│   ├── angle.js                # Angle calculations
│   └── index.js                # Package exports
├── color/                       # Color utilities
│   ├── ColorSpace.js           # Color conversion class
│   ├── ThemeColors.js          # Design token access
│   └── index.js                # Package exports
├── diagnostics/                 # Performance tracking
│   ├── ScrollBlockedDiagnostic.js  # Frame performance
│   ├── AccessibilityAuditor.js     # A11y checking
│   ├── MemoryProfiler.js           # Memory usage
│   └── index.js                    # Package exports
├── tailwind/                    # Tailwind integration
│   ├── ThemeTokens.js          # Token access
│   ├── ThemeColors.js          # Color helpers
│   └── index.js                # Package exports
├── theme.js                     # Theme management
└── assetPath.js                # Asset path resolution
```

## Usage Patterns

### Logging with Grouping

```javascript
import logger from "./logger/index.js";

logger.group(async () => {
  logger.trace("Starting build", {}, "brief", "headsup");

  await buildCSS();
  logger.trace("CSS built", {}, "brief", "success");

  await buildTemplates();
  logger.trace("Templates built", {}, "brief", "success");
});
```

### Color Analysis for Accessibility

```javascript
import { ColorSpace } from "./color/ColorSpace.js";

function ensureContrast(foreground, background) {
  const fg = new ColorSpace(foreground);
  const bg = new ColorSpace(background);

  const contrast = fg.getContrast(bg);

  if (contrast < 4.5) {
    // AA compliance failed
    return fg.lighten(20); // Adjust color
  }

  return foreground;
}
```

### Responsive Theme Switching

```javascript
import { setTheme, getTheme } from "./theme.js";
import { ThemeColors } from "./tailwind/ThemeColors.js";

// Listen to system preference
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    setTheme(e.matches ? "dark" : "light");
  });

// Update component based on theme
function updateComponentForTheme() {
  const theme = getTheme();
  const colors = ThemeColors[theme];

  applyColors(colors);
}
```

### Performance Diagnostics in Development

```javascript
import { ScrollBlockedDiagnostic } from "./diagnostics/ScrollBlockedDiagnostic.js";

if (window.DEBUG) {
  const diagnostic = new ScrollBlockedDiagnostic({ showLogs: true });
  diagnostic.start();

  window.addEventListener("beforeunload", () => {
    const report = diagnostic.getReport();
    console.table(report);
    diagnostic.stop();
  });
}
```

## Best Practices

1. **Logger**: Use semantic styles for different message types
2. **Colors**: Always check contrast for accessibility
3. **Theme**: Respect system preferences on first load
4. **Math**: Use Vector classes for multi-dimensional calculations
5. **Diagnostics**: Enable only during development to avoid performance overhead
6. **Tailwind**: Access tokens programmatically rather than hardcoding values

## References

- [Logger Documentation](./logger/README.md)
- [GSAP Math Integration](https://gsap.com/)
- [Web Color Standards](https://www.w3.org/TR/css-color-3/)
- [Accessibility Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
