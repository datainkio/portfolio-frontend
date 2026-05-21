---
layout: layouts/base.njk
pagination:
  data: collections.projects
  size: 1
  alias: project
permalink: "/case-studies/{{ project.slug }}/"
eleventyComputed:
  title: "{{ project.title }}"
  metaDescription: "{{ project.abstract | default('no metaDescription defined') }}"
---
