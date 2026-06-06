---
layout: pages/projects/projects.njk
permalink: "/case-studies/"
metaDescription: "no metaDescription defined"
metaKeywords: "user experience, eleventy, sanity, tailwind"
canonicalUrl: "https://dataink.io/case-studies/"
enableChoreography: true
skipLinks:
  - main
eleventyNavigation:
  key: case-studies
  title: Case Studies
  order: 20
eleventyComputed:
  title: "{{ cms.projectsLanding[0].pageTitle }}"
  body: "{{ cms.projectsLanding[0].pageBodyHtml | safe }}"
---
