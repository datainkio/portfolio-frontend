---
title: Form field
description: A labelled input or textarea with a help line and a hidden error line, wired together with aria-describedby.
type: reference
component: molecules/form/field.njk
specimens:
  - title: Email input
    params:
      id: specimen-email
      name: email
      type: email
      label: Email
      autocomplete: email
      required: true
      help: We reply within two days.
      styles:
        label: block text-sm text-neutral-300
        field: w-full border-b border-neutral-500 bg-transparent py-2 text-neutral-100
    frame: max-w-sm
  - title: Textarea
    params:
      id: specimen-message
      name: message
      type: textarea
      label: Message
      rows: 4
      styles:
        label: block text-sm text-neutral-300
        field: w-full border border-neutral-500 bg-transparent p-2 text-neutral-100
    frame: max-w-sm
inContext:
  - { url: /contact/, label: Contact form }
---

The error paragraph stays `hidden` until the form script fills it. Every specimen needs a unique `id`, because the id feeds the label, the description, and the error line.
