---
description: "{{ manifestpayload | safe }}"
layout: null
permalink: /manifest.json
eleventyComputed:
  manifest_payload: "{{ (site.manifest or {}) | dump | safe }}"
eleventyExcludeFromCollections: true
templateEngineOverride: njk
---

{{ manifest_payload | safe }}
