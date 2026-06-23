---
id: frontend.cms.client
role: "Resolves CMS config and creates the Sanity client for build-time fetches."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Sanity client"
tags:
  - client
  - cms
links:
  - "[[README.sanity]]"
---

# Sanity client

Resolves CMS configuration and creates the Sanity client used for all build-time fetches.

| Export | Purpose |
| --- | --- |
| `resolveSanityConfig()` | merge `site.cms` defaults with env overrides (`projectId`, `dataset`, `apiVersion`, `useCdn`) |

The single place the client is configured — every query goes through the instance created here.

## Source

- Path: `data/sanity/client/index.js`
