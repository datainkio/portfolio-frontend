---
title: Breadcrumbs nav
description: A breadcrumb trail of the current page's ancestors in the Eleventy navigation tree, which renders nothing for a top-level page.
type: reference
component: organisms/navigation/breadcrumbs-nav.njk
specimens:
  - title: Three levels deep
    note: No real page has a navigation parent yet, so the live collection would render nothing. This specimen passes a small sample tree shaped like collection items, and the trail lists ancestors without the page itself.
    params:
      key: project
      nav:
        - data:
            page: { url: / }
            eleventyNavigation: { key: home, title: Home }
        - data:
            page: { url: /work/ }
            eleventyNavigation: { key: work, title: Work, parent: home }
        - data:
            page: { url: /case-studies/enquos/ }
            eleventyNavigation: { key: project, title: Enquos, parent: work }
inContext:
  - { url: /case-studies/enquos/, label: Project page }
---
