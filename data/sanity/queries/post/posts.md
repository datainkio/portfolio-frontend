---
id: frontend.cms.queries.posts
role: "GROQ query definition registered as an Eleventy collection (Posts)."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Posts query"
tags:
  - "#frontend/cms"
  - "#frontend/cms/queries"
links:
  - "[[README.queries]]"
  - "[[postProjection]]"
---

# Posts query

GROQ query definition fetched by the service layer and registered as the **`posts`** Eleventy
collection.

| Export | Collection id |
| --- | --- |
| `postsQuery` | `posts` |
- Projection: [[postProjection]]

## Source

- Path: `data/sanity/queries/post/posts.js`

Related: [[README.queries]], [[queries]]
