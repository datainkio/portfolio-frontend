---
title: Primary nav
description: The site's main navigation as a row of links built from the CMS navigation document, with the current page marked.
type: reference
component: organisms/navigation/primary-nav.njk
specimens: []
specimenNote: This page's own header and footer already render this nav, and it always emits the id "primary-nav", so a specimen would add a third duplicate id.
inContext:
  - { url: /, label: Header and footer on every page }
---

The links come from the CMS navigation document's header items, then from an `items` param, then from the Eleventy navigation tree. The id `primary-nav` is hard-coded, which is why the header plus footer already duplicate it on every page.
