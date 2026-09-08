---
title: "Contact"
description: "Route definition for /contact/ — static contact page on the base layout."
layout: pages/contact/contact.njk
permalink: "/contact/"
eleventyNavigation:
  key: contact
  title: Contact
  order: 30
eleventyComputed:
  title: "{{ cms.contact[0].pageTitle | safe }}"
  abstract: "{{ cms.contact[0].pageBodyHtml | safe }}"
metaDescription: "Get in touch"
canonicalUrl: "https://dataink.io/contact/"
enableChoreography: true
---
