---
layout: layouts/case-study.njk
pagination:
  data: collections.projects
  size: 1
  alias: project
permalink: "/work/{{ project.slug }}/"
eleventyNavigation:
  key: "{{ project.slug }}"
  title: "{{ project.title }}"
  parent: "projects"
eleventyComputed:
  title: "{{ project.title }}"
  metaDescription: "{{ project.abstract | default('no metaDescription defined') }}"
---
