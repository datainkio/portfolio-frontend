---
title: "Work"
eleventyNavigation:
  key: docs-design-organisms-section-work
  parent: docs-design
  order: 30
# Keep Nunjucks-only rendering here so Markdown does not inject empty <p></p>
# wrappers around the awards section's inline HTML output.
templateEngineOverride: njk
eleventyComputed:
  title: "{{ title }}"
  recognition:
    heading: "{{ cms.home[0].workHeading }}"
    body: "{{ cms.home[0].workBody }}"
---

{% import "organisms/section/work.njk" as WorkSection %}
{% set workPreviewParams = {
  id: "work",
  copy: work,
  projects: cms.home[0].featuredProjects,
  order: "2/5",
  classes: sharedClasses,
  buildDate: buildDate
} %}
{{ WorkSection.render(workPreviewParams) }}
