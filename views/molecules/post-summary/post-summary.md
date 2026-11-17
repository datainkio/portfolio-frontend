---
description: "Macro that renders one post inventory entry: title link, date and reading time, abstract."
type: template
tags:
  - component
  - post
links:
  - "[Component API spec](../../../specs/views/component-api.views-spec.md)"
  - "[link](../../atoms/link/link.md)"
  - "[posts](../../pages/posts/posts.md)"
---

# Post summary

One entry in the posts inventory. A plain `<article>` rather than the project `card`: the card is a full-viewport parallax block, too heavy for a list of 50 posts.

## Template

- Source: [[post-summary.njk]]
- Path: `views/molecules/post-summary/post-summary.njk`

## Macro Signature

```njk
{% import "molecules/post-summary/post-summary.njk" as PostSummary %}
{{ PostSummary.render({ post: post, headingLevel: 2 }) }}
```

| Param          | Type                           | Required | Description |
| -------------- | ------------------------------ | -------- | ----------- |
| `post`         | object                         | Yes      | Record from `collections.posts`: `title`, `url`, `abstract`, `publishDate`, `readingMinutes`. |
| `headingLevel` | number                         | No       | Level of the title heading. Defaults to 2. |
| `classes`      | string \| variant map \| array | No       | Appended to the `<article>`. |
| `styles`       | `{ title, meta, abstract }`    | No       | Appended to each part. |

The date and reading-time line, and the abstract, are omitted when their data is missing. Imported posts have neither yet.

## Accessibility

- The title is the only link, so each entry has one tab stop and a descriptive link name.
- The date is a `<time datetime>`; the `·` separator is `aria-hidden`.

## Relationships

- Used by: [[posts.njk|pages/posts/posts.njk]]
- Imports: [[link.njk|atoms/link/link.njk]]
