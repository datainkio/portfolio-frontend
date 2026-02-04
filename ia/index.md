---
layout: pages/home.njk
permalink: /
fallbackTitle: "Yo yo yo"
subtitle: "The online studio for Russ Lebo"
metaDescription: "no metaDescription defined"
metaKeywords: "user experience, eleventy, sanity, tailwind"
canonicalUrl: "https://dataink.io"
bodyClasses: "bg-neutral-900"
contentClasses: ""
skipLinks:
  - hero
  - bio
  - awards
  - projects
enableChoreography: true
eleventyComputed:
  title: "{{ (collections.landing and collections.landing[0] and collections.landing[0].tagline) or fallbackTitle }}"
---
