---
layout: layouts/landing.njk
pagination:
  data: collections.projects
  size: 1
  alias: project
permalink: "/work/{{ project.slug }}/"
eleventyComputed:
  title: "{{ project.title }}"
  metaDescription: "{{ project.abstract | default('no metaDescription defined') }}"
---
