---
title: Inline SVG
description: Inlines SVG markup with its hard-coded fills removed so it takes the current colour, or falls back to an image from a URL.
type: reference
component: atoms/svg/inline.njk
specimens:
  - title: SVG markup
    note: The black fill is stripped, so the text colour wins.
    params:
      alt: Sample logo
      classes: w-16 h-16 text-primary-400
      svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#000"/></svg>
  - title: Image fallback
    note: Without SVG markup it renders an img from src.
    params:
      alt: Sample image
      src: /assets/images/logos/default.svg
      classes: w-16 h-16
inContext:
  - { url: /, label: Homepage awards section }
---
