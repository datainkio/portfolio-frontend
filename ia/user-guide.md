---
description: "Route definition for /user-guide/, rendering the Sanity userGuide singleton through the article template."
layout: templates/article.njk
permalink: "/user-guide/"
eleventyNavigation:
  key: user-guide
  title: User Guide
  order: 30
eleventyComputed:
  title: "{{ cms.userGuide[0].pageTitle}}"
  abstract: "{{ cms.userGuide[0].pageAbstract }}"
  body: "{{ cms.userGuide[0].bodyHtml | safe }}"
metaDescription: "Something else to add to the user guide.:)"
canonicalUrl: "https://dataink.io/user-guide/"
---
