---
title: Hero section
description: The homepage opening, a full-viewport title over the accession label, followed by one mission-statement section per statement.
type: reference
component: organisms/section/hero.njk
specimens:
  - title: Value proposition
    note: Live copy from the home singleton. The page's hero passes a statements list so each statement carries its own image; this specimen uses the single value-prop fallback. The title is full viewport height, and motion reveals are not loaded on docs pages.
    params:
      id: specimen-hero
    bind:
      "copy.heading": cms.home.0.valuePropHeading
      "copy.body": cms.home.0.valuePropBodyHtml
      buildDate: buildDate
    frame: p-0 h-[32rem] overflow-y-auto
inContext:
  - { url: /, label: Homepage }
---

The `data-hero-el` hooks bind the choreography in `organisms/hero/Hero.js`.
Don't rename them in markup alone.
