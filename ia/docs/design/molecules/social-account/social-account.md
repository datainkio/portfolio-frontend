---
title: Social account
description: One social account as an external profile link, shown as an icon or as its title. Use the text format where there is no logo.
type: reference
component: molecules/social-account/social-account.njk
specimens:
  - title: Text format
    params:
      format: text
      account: { title: GitHub, url: "https://github.com/" }
    surface: paper
  - title: Icon from the contact record
    note: The default format draws the account's logo, falling back to its title.
    bind:
      account: "cms.contact.0.socialAccounts.0"
inContext:
  - { url: /contact/, label: Contact page }
---

The link opens in a new tab, and its accessible name is the account title.
