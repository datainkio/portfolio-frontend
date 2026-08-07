---
id: frontend.js.choreography.organisms.process.processtriggers
role: "Process triggers module — EMPTY PLACEHOLDER inheriting SCROLL_DEFAULTS from AbstractSectionTriggers; no custom scroll trigger config."
status: "placeholder"
surface: internal
scope: frontend
runtime: browser
tags:
  - "#choreography"
  - "#frontend"
  - "#js"
  - "#organism"
  - "#placeholder"
links:
  - "[[AbstractSectionTriggers|AbstractSectionTriggers]]"
  - "[[config/index|config/index]]"
---

# ProcessTriggers

Does not override `_getTriggerDefaults()` — inherits `SCROLL_DEFAULTS` from
the base `AbstractSectionTriggers`, unlike `OrganizationsTriggers` which
supplies a dedicated `ORGANIZATIONS_TRIGGER` config. This is intentional per
the scaffolding spec: no new trigger config is introduced for this
placeholder section. A dedicated `PROCESS_TRIGGER` preset may be added when
the Blockframes migration defines real scroll behavior for this section.
