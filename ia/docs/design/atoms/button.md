---
title: Button
description: The single <button> primitive. It owns the accessibility baseline, and callers add classes, attributes, and content on top.
type: reference
component: atoms/button.njk
specimens:
  - title: Unstyled
    note: The baseline alone, with a focus-visible ring, disabled styling, and type="button".
    params:
      label: Button
    surface: paper
  - title: Call to action
    params:
      label: Get in touch
      variant: cta
  - title: Submit
    note: The stamped form action. The trailing arrow is a CSS `after:` pseudo-element, not part of the label.
    params:
      label: Send
      type: submit
      variant: submit
    surface: paper
  - title: Dark
    note: Used for the lightbox Close, over a dark backdrop.
    params:
      label: Close
      variant: dark
    surface: dark
  - title: Icon
    note: Outlined, icon-only. The accessible name comes from aria-label.
    params:
      variant: icon
      attrs: aria-label="Close"
    content: <span aria-hidden="true">×</span>
  - title: Disabled
    params:
      label: Sending…
      variant: cta
      attrs: disabled
  - title: Markup content
    note: A call body replaces the label, so icons and spans work.
    params:
      classes: inline-flex items-center gap-2 rounded px-3 py-2 bg-neutral-800 text-neutral-100 hover:bg-neutral-700
      attrs: aria-label="Open the drawer"
    content: <span aria-hidden="true">☰</span> Menu
inContext:
  - url: /contact/
    label: Contact form submit
---

Add a look as a named `variant`, not a new param. A caller's `focusColor`
replaces the ring colour without two colour utilities competing.
