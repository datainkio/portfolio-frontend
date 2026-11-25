---
title: "Contact"
description: "Route definition for /contact/ — static contact page on the base layout."
layout: templates/contact/contact.njk
permalink: "/contact/"
docNo: "03"
eleventyNavigation:
  key: contact
  title: Contact
  order: 10
eleventyComputed:
  title: "{{ cms.contact[0].pageTitle | safe }}"
  pageBody: "{{ cms.contact[0].pageBodyHtml | safe }}"
  mailto: "{{cms.contact[0].mailto | safe }}"
  location: "{{ cms.contact[0].location | safe }}"
metaDescription: "Get in touch"
canonicalUrl: "https://dataink.io/contact/"
enableChoreography: true
---
