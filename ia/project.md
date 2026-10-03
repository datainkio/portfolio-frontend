---
description: "Paginated route generating /case-studies/<slug>/ for every entry in collections.projectPages."
layout: pages/project/project.njk
permalink: "/case-studies/{{ project.slug }}/"
eleventyComputed:
  title: "{{ project.seo.title or project.title }}"
  metaDescription: "{{ project.seo.description or project.abstract | default('no metaDescription defined') }}"
  ogImage: "{{ project.seo.ogImage or project.featuredImage.asset.url }}"
  noIndex: "{{ 'true' if project.seo.noIndex else '' }}"
pagination:
  data: collections.projectPages
  size: 1
  alias: project
enableChoreography: true
# Target of the pager's "All" link on every project page.
projectIndex:
  href: "/work/"
  label: "All"
---
