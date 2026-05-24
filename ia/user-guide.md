---
layout: pages/user-guide.njk
permalink: "/user-guide/"
metaDescription: "Something else to add to the user guide.:)"
canonicalUrl: "https://dataink.io/user-guide/"
eleventyNavigation:
  key: user-guide
  title: User Guide
  order: 30
eleventyComputed:
  title: "{{ cms.userGuide[0].pageTitle}}"
  abstract: "{{ cms.userGuide[0].pageAbstract }}"
  body: "{{ cms.userGuide[0].bodyHtml | safe }}"
---
