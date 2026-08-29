---
description: "Registers core 11ty plugins (navigation, HTML base) and the production HTML-minify transform."
status: stable
tags:
  - plugin
aliases:
  - Plugins
links:
  - "[[README.eleventy]]"
---

# Plugins

Registers the 11ty plugin set and build transforms.

| Plugin / transform          | Role                                           |
| --------------------------- | ---------------------------------------------- |
| `@11ty/eleventy-navigation` | `eleventyNavigation` frontmatter + nav helpers |
| `EleventyHtmlBasePlugin`    | rewrite paths against the site base href       |
| `htmlmin` transform         | minify `.html` output (`html-minifier`)        |

> [!note] Ordering
> The (currently disabled) `UpgradeHelper` is intentionally added **last**; keep any new
> plugins above it.

## Source

- Path: `eleventy/plugins/plugins.js`
