---
description: Hidden anti-spam field for the contact form.
type: template
---

# Honeypot

Renders a hidden text input named `botField`. People don't see it and it is out of the tab order, so bots that fill every field reveal themselves.

## Params

| Param       | Type   | Description                                                               |
| ----------- | ------ | ------------------------------------------------------------------------- |
| `sectionId` | string | Prefix for the input id (`{sectionId}-bot-field`). Defaults to `contact`. |

Fixed design: takes no styling params.
