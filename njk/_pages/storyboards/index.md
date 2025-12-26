---
permalink: /storyboards/
title: Storyboards
layout: templates/storyboards.njk
eleventyNavigation:
  key: Storyboards
---

## Storyboard Index

{% set items = collections.storyboard | default([]) %}
{% if items.length === 0 %}
_No storyboards yet. Add Markdown files under `njk/_pages/storyboards/` with `tags: ["storyboard"]`._
{% else %}

<ul>
  {%- for p in items | reverse -%}
    <li>
      <a href="{{ p.url }}">{{ p.data.title or p.fileSlug | title }}</a>
      <small> — {{ p.date | postDate }}</small>
    </li>
  {%- endfor -%}
</ul>
{% endif %}
