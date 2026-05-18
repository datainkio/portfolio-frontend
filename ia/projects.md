---
layout: pages/projects.njk
permalink: "/case-studies/"
metaDescription: "no metaDescription defined"
metaKeywords: "user experience, eleventy, sanity, tailwind"
canonicalUrl: "https://dataink.io/case-studies/"
skipLinks:
  - main
eleventyComputed:
  title: "{{ cms.projectsLanding[0].pageTitle }}"
  body: "{{ cms.projectsLanding[0].pageBodyHtml | safe }}"
---
