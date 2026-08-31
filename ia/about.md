---
description: "Route definition for /about/, rendering the Sanity About singleton through the article template."
layout: templates/article.njk
permalink: "/about/"
eleventyNavigation:
  key: about
  title: About
  order: 30
eleventyComputed:
  title: "{{ cms.about[0].pageTitle}}"
  abstract: "{{ cms.about[0].pageAbstract }}"
  body: "{{ cms.about[0].bodyHtml | safe }}"
metaDescription: "Something else to add to the about page. :)"
canonicalUrl: "https://dataink.io/about/"
---
