---
description: "Paginated route generating one page per entry in collections.sitePages, at the URL built from its parent chain."
layout: templates/site-page/site-page.njk
permalink: "{{ sitePage.url }}"
eleventyComputed:
  # `| safe`: see ia/project.md.
  title: "{{ (sitePage.seo.title or sitePage.title) | safe }}"
  metaDescription: "{{ (sitePage.seo.description or sitePage.abstract | default('no metaDescription defined')) | safe }}"
  ogImage: "{{ sitePage.seo.ogImage | safe }}"
  noIndex: "{{ 'true' if sitePage.seo.noIndex else '' }}"
pagination:
  data: collections.sitePages
  size: 1
  alias: sitePage
  addAllPagesToCollections: true
---
