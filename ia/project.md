---
description: "Paginated route generating /case-studies/<slug>/ for every entry in collections.projectPages."
layout: pages/project/project.njk
permalink: "/case-studies/{{ project.slug }}/"
eleventyComputed:
  title: "{{ project.title }}"
  metaDescription: "{{ project.abstract | default('no metaDescription defined') }}"
pagination:
  data: collections.projectPages
  size: 1
  alias: project
enableChoreography: true
---
