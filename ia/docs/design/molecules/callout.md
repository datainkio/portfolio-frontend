---
title: Callout
description: A short note, tip, or warning block with a tone, an optional title, and text, html, or a call body.
type: reference
component: molecules/callout.njk
specimens:
  - title: Info with text
    params:
      title: Note
      tone: info
      text: Specimens render without the choreography bundle.
    frame: max-w-md
  - title: Warning
    params:
      title: Heads up
      tone: warning
      text: This component is not used on a live page yet.
    frame: max-w-md
  - title: Call body
    note: A call body wins over html and text, so links and lists work.
    params:
      title: Tip
      tone: success
    content: <p class="m-0">Rich content <a class="underline" href="/work/">with a link</a>.</p>
    frame: max-w-md
  - title: Danger
    params:
      tone: danger
      html: <strong>Destructive.</strong> This cannot be undone.
    frame: max-w-md
---

Tones are `info` (the default), `success`, `warning`, and `danger`. An unknown tone falls back to info. The `classes` param accepts a string or a variant map.
