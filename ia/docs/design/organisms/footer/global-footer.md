---
title: Global footer
description: The site footer with the primary nav, social accounts, and copyright line.
type: reference
component: organisms/footer/global-footer.njk
specimens: []
specimenNote: This page already renders the global footer, which embeds the primary nav with its fixed id, so a second copy would duplicate that id.
inContext:
  - { url: /, label: Homepage }
  - { url: /contact/, label: Contact page }
---

The homepage pins it to the bottom of the body with `classes`, and other pages leave it in flow. The caller passes `year`, `cms`, `pages`, and `currentUrl`.
