---
title: Social accounts list
description: A list of external profile links, rendered as text. It shows a fallback message when there are no accounts.
type: reference
component: molecules/list/social-accounts-list.njk
specimens:
  - title: From the contact record
    bind:
      accounts: "cms.contact.0.socialAccounts"
    params:
      classes: grid grid-cols-3 text-primary-400
  - title: Empty
    note: With no accounts, the fallback paragraph renders.
    params:
      accounts: []
inContext:
  - { url: /contact/, label: Contact page }
---
