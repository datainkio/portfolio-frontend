---
description: "Paired shortcode that renders radio-driven accordion markup (title + collapsible content)."
status: stable
tags:
  - shortcodes
aliases:
  - Collapsible shortcode
links:
  - "[[README.shortcodes]]"
  - "[[shortcodes]]"
---

# Collapsible shortcode

Renders a single radio-input accordion item. Multiple items sharing one `accordion` name
behave as a mutually-exclusive group.

```js
collapsible(content, label, accordion);
```

Emits a `radio` input + `.collapse-title` label + `.collapse-content` body.

## Source

- Path: `eleventy/shortcodes/collapsible.js`
