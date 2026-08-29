---
description: "{{ manifestpayload | safe }}"
layout: null
permalink: /manifest.webmanifest
eleventyComputed:
  manifest_payload: "{{ (site.manifest or {}) | dump | safe }}"
eleventyExcludeFromCollections: true
templateEngineOverride: njk
---

{{ manifest_payload | safe }}
