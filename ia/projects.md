---
description: "Route definition for the /work/ landing page, driven by the Sanity projectsLanding singleton."
layout: pages/projects/projects.njk
permalink: "/work/"
eleventyNavigation:
  key: work
  title: Work
  order: 20
eleventyComputed:
  title: "{{ cms.projectsLanding[0].pageTitle }}"
  body: "{{ cms.projectsLanding[0].pageBodyHtml | safe }}"
metaDescription: "no metaDescription defined"
metaKeywords: "user experience, eleventy, sanity, tailwind"
canonicalUrl: "https://dataink.io/work/"
skipLinks:
  - main
enableChoreography: true
---
