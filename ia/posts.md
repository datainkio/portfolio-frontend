---
description: "Route definition for the /posts/ inventory: paginated collections.posts, with page copy from the Sanity postsLanding singleton."
layout: pages/posts/posts.njk
pagination:
  data: collections.posts
  size: 10
  alias: postsPage
  generatePageOnEmptyData: true
permalink: "/posts/{% if pagination.pageNumber %}page/{{ pagination.pageNumber + 1 }}/{% endif %}"
docNo: "04"
eleventyNavigation:
  key: posts
  title: Posts
  order: 25
eleventyComputed:
  # Pages 2+ get a distinct title, and leave collections.all so the nav fallback
  # (collections.all | eleventyNavigation) lists "Posts" once, not once per page.
  title: "{{ (cms.postsLanding[0].pageTitle or 'Posts') ~ (' (page ' ~ (pagination.pageNumber + 1) ~ ')' if pagination.pageNumber else '') }}"
  eleventyExcludeFromCollections: "{{ 'true' if pagination.pageNumber else '' }}"
  abstract: "{{ cms.postsLanding[0].pageBodyHtml | safe }}"
metaDescription: "Writing on design, technology and the work behind it."
canonicalUrl: "https://dataink.io/posts/"
skipLinks:
  - main
enableChoreography: true
---
