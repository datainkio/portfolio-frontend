---
description: "Route definition for the /case-studies/ landing page, driven by the Sanity projectsLanding singleton."
layout: pages/projects/projects.njk
permalink: "/case-studies/"
eleventyNavigation:
  key: case-studies
  title: Case Studies
  order: 20
eleventyComputed:
  title: "{{ cms.projectsLanding[0].pageTitle }}"
  body: "{{ cms.projectsLanding[0].pageBodyHtml | safe }}"
metaDescription: "no metaDescription defined"
metaKeywords: "user experience, eleventy, sanity, tailwind"
canonicalUrl: "https://dataink.io/case-studies/"
skipLinks:
  - main
enableChoreography: true
---
