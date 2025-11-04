# Page-Specific Animations

Directory for page-specific animation controllers (e.g., project detail pages, about pages).

## Usage

Create new controllers here when animations don't fit section-based pattern.

```javascript
// Example: js/choreography/pages/ProjectDetail.js
export class ProjectDetail {
  constructor(bus) {
    this.bus = bus;
    this.init();
  }

  init() {
    // Page-specific animation logic
  }
}
```

Director can conditionally load based on `data-page-type` attribute on `<body>` element.
