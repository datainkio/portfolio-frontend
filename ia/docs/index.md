---
description: "Route definition for the /docs/ landing page, driven by the Sanity documentation_landing singleton (cms.documentationLanding)."
layout: "layouts/landing.njk"
permalink: "/docs/"
docNo: "3.14"
# Supplies the header label ("DOC 3.14 / Docs"). Hidden from page lists: the
# site map already has a Docs column, built from the pages whose parent is "Docs".
eleventyNavigation:
  key: docs-landing
  title: Docs
  hide: true
eleventyComputed:
  title: "{{ (cms.documentationLanding[0].seo.title or cms.documentationLanding[0].pageTitle or 'Docs') | safe }}"
  abstract: "{{ cms.documentationLanding[0].pageBodyHtml | safe }}"
  metaDescription: "{{ (cms.documentationLanding[0].seo.description or 'Documentation for dataink.io: design strategy, frontend, backend and content models.') | safe }}"
  noIndex: "{{ 'true' if cms.documentationLanding[0].seo.noIndex else '' }}"
canonicalUrl: "https://dataink.io/docs/"
skipLinks:
  - main
enableChoreography: true
---
