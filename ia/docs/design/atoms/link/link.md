---
title: Link
description: The base anchor. It adds noopener, a new tab, and an indicator icon to external URLs, and takes text or a call body.
type: reference
component: atoms/link/link.njk
specimens:
  - title: Internal
    params:
      url: /work/
      text: See the work
  - title: External
    note: An absolute URL opens in a new tab with an external-link icon.
    params:
      url: https://example.com/
      text: Example site
  - title: Markup content
    note: A call body replaces the text.
    params:
      url: /contact/
      ariaLabel: Contact me
    content: <strong>Get</strong> in touch
inContext:
  - { url: /contact/, label: Contact page links }
---
