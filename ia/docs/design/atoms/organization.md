---
title: Organization
description: The name of one organization, rendered as text where a logo will go once logos are enabled.
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

The logo branch is commented out in the macro, so only the title renders today.
