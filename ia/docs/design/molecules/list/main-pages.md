---
title: Main pages list
description: A list of the site's main navigation links. The entry matching the current URL becomes plain text marked as the current page.
type: reference
component: molecules/list/main-pages.njk
specimens:
  - title: Primary navigation
    note: The current URL is "/work/", so that entry is a span.
    params:
      currentUrl: /work/
      classes: flex flex-row list-none divide-x divide-slate-700
      items:
        - { key: Work, url: /work/ }
        - { key: About, url: /about/ }
        - { key: Contact, url: /contact/ }
      styles:
        item: px-4 text-center
        link: text-primary-300
inContext:
  - { url: /, label: Header and footer navigation }
---

Items need a `url` or `href` and a `title` or `key`, and any other entry is skipped.
