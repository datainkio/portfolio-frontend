---
title: Honeypot field
description: A hidden spam-trap input that real visitors never see and bots tend to fill in.
type: reference
component: molecules/form/honeypot.njk
specimens:
  - title: Hidden trap
    note: The wrapper is hidden, so the frame looks empty on purpose. Inspect the markup below to see the field.
    params:
      sectionId: specimen
    frame: min-h-8
inContext:
  - { url: /contact/, label: Contact form }
---

The field is named `botField`, and the form script rejects any submission that fills it. Its id is built from `sectionId`, so give each form its own.
