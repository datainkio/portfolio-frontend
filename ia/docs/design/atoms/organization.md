---
title: Organization
description: The name of one organization, rendered as plain text for the homepage organizations list.
type: reference
component: atoms/organization.njk
specimens:
  - title: Organization record
    params: {}
    bind:
      title: collections.organizations.slug=abn-amro-leading-the-way-in-financial-services.title
  - title: Fallback
    params: {}
inContext:
  - { url: /, label: Homepage organizations section }
---

Logos were switched off on 2026-08-23, so the atom renders the title only.
