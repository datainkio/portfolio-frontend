---
title: Child pages list
description: A list of links to an entry's child pages, taken from an eleventyNavigation entry. The current page is marked.
type: reference
component: molecules/list/child-pages.njk
specimens:
  - title: Entry with children
    params:
      currentUrl: /about/
      entry:
        key: Site
        children:
          - { key: Work, url: /work/ }
          - { key: About, url: /about/ }
          - { key: Contact, url: /contact/ }
inContext:
  - { url: /, label: Homepage }
---
