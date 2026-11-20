---
description: "Paginated route generating /posts/<slug>/ for every entry in collections.postPages."
layout: templates/post/post.njk
permalink: "/posts/{{ post.slug }}/"
eleventyComputed:
  # `| safe`: see ia/project.md.
  title: "{{ (post.seo.title or post.title) | safe }}"
  metaDescription: "{{ (post.seo.description or post.abstract | default('no metaDescription defined')) | safe }}"
  ogImage: "{{ (post.seo.ogImage or post.featuredImage.asset.url) | safe }}"
  noIndex: "{{ 'true' if post.seo.noIndex else '' }}"
pagination:
  data: collections.postPages
  size: 1
  alias: post
enableChoreography: true
# Target of the pager's "All" link on every post page.
postIndex:
  href: "/posts/"
  label: "All"
---
