---
title: "Awards + Recognition"
# Keep Nunjucks-only rendering here so Markdown does not inject empty <p></p>
# wrappers around the awards section's inline HTML output.
templateEngineOverride: njk
eleventyComputed:
  title: "{{ title }}"
  recognition:
    heading: "{{ cms.home[0].recognitionHeading }}"
    body: "{{ cms.home[0].recognitionBody }}"
---

{% import "organisms/section/awards.njk" as AwardsSection %}
{% set awardsPreviewParams = {
  id: "recognition",
  copy: recognition,
  awards: collections.awards,
  order: "2/5",
  classes: sharedClasses,
  buildDate: buildDate
} %}
{{ AwardsSection.render(awardsPreviewParams) }}
