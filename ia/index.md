---
layout: pages/home.njk
permalink: /
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
  title: "{{ cms.landing[0].pageTitle }}"
  hero:
    tagline: "{{ cms.landing[0].tagline }}"
    videoSrc: "{{ cms.landing[0].videoSrc }}"
    videoPoster: "{{ cms.landing[0].videoPoster }}"
---
