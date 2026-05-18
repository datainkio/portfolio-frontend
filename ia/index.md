---
layout: pages/home.njk
permalink: /
metaDescription: "no metaDescription defined"
metaKeywords: "user experience, eleventy, sanity, tailwind"
canonicalUrl: "https://dataink.io"
skipLinks:
  - hero
  - bio
  - awards
  - projects
enableChoreography: true
eleventyNavigation:
  key: home
  title: data:ink:io
eleventyComputed:
  title: "{{ cms.home[0].pageTitle }}"
  hero:
    tagline: "{{ cms.home[0].tagline }}"
    videoSrc: "{{ cms.home[0].videoSrc }}"
    videoPoster: "{{ cms.home[0].videoPoster }}"
  value:
    heading: "{{ cms.home[0].valuePropHeading }}"
    subheading: "{{ cms.home[0].valuePropSubHeading }}"
    body: "{{ cms.home[0].valuePropBodyHtml | safe }}"
  recognition:
    heading: "{{ cms.home[0].recognitionHeading }}"
    body: "{{ cms.home[0].recognitionBody }}"
  work:
    heading: "{{ cms.home[0].workHeading }}"
    body: "{{ cms.home[0].workBody }}"
---
