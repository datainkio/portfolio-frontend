---
title: Section frame
description: A section bordered on three sides with its heading on the open top edge. Content goes in the call body, and tone sets the colour.
type: reference
component: molecules/section/section-frame.njk
specimens:
  - title: Default tone
    params:
      heading: Overview
      id: frame-default-heading
    content: <p class="p-4 text-neutral-300">Content goes in the call body.</p>
  - title: Neutral 600
    params:
      heading: Summary
      id: frame-neutral-heading
      tone: neutral-600
    content: <p class="p-4 text-neutral-300">A lighter neutral.</p>
  - title: Accent
    params:
      heading: Recognition
      id: frame-accent-heading
      tone: accent-600
    content: <p class="p-4 text-neutral-300">The accent tone, used for awards.</p>
inContext:
  - { url: /case-studies/enquos/, label: A project page }
---

Give each frame a unique `id`, since it is also the section's `aria-labelledby`.
