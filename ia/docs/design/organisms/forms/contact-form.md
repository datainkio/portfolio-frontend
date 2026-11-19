---
title: Contact form
description: The browser-write contact form on a drafting-sheet surface, with email and message fields, a honeypot, and a status line.
type: reference
component: organisms/forms/contact-form.njk
specimens:
  - title: Contact form
    note: The Sanity config params are left out, so this specimen doesn't submit. The real page passes the project, dataset, API version, and write token from the environment.
    params:
      sectionId: specimen-contact
      docNo: "03"
      docTitle: Contact
      sourcePage: /docs/design/
    frame: grid grid-cols-12 p-4
inContext:
  - { url: /contact/, label: Contact page }
---

The macro loads `ContactForm.js` itself. Never bind `env` values into a specimen, because the write token lands in the page markup.
