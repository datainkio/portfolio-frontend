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
