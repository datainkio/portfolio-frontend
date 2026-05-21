---
layout: pages/project/project.njk
pagination:
  data: collections.projectPages
  size: 1
  alias: project
permalink: "/case-studies/{{ project.slug }}/"
eleventyComputed:
  title: "{{ project.title }}"
  metaDescription: "{{ project.abstract | default('no metaDescription defined') }}"
---
