---
layout: null
permalink: /manifest.webmanifest
eleventyExcludeFromCollections: true
templateEngineOverride: njk
eleventyComputed:
  manifest_payload: "{{ (site.manifest or {}) | dump | safe }}"
---

{{ manifest_payload | safe }}
