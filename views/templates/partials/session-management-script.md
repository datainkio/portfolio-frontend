---
description: "Inline, synchronous pre-paint script — on a repeat visit this session it sets data-preloader-state=\"exit\" on the landing header before first paint so the hanko loading pulse never flashes; mirrors SessionManager's storage key and the preloader's state attribute by hand."
type: template
tags:
  - preloader
  - partial
links:
  - "[[home-landing|home-landing.njk]]"
  - "[[SessionManager|SessionManager]]"
  - "[[Preloader|preloader/Preloader]]"
---
# session-management-script.njk

Included by `home-landing.njk` immediately after the `<header data-preloader>`.
Must stay a classic (non-module) inline script: module scripts are deferred
and would run after first paint, which is exactly the flash this prevents.

`Preloader.js` re-asserts the same attribute on return visits, so either one
running is sufficient; this one exists purely to beat first paint.

The three literals it hard-codes (`"dataink_session"`, `visited`,
`data-preloader-state="exit"`) each have a source of truth elsewhere — see the
comment at the top of the template.

Session gating is switched by `SESSION_GATING_ENABLED` in `SessionManager.js`
(currently `false`). This script needs no mirror of it: while gating is off
`visited` is never persisted and any stale value is cleared on the next
`SessionManager` construction, so the check here simply never matches. (The one
exception is the first load after flipping the flag off with a stale `visited`
already in storage — that single load still skips the splash.)

## Role in preloader strategy
- Check if session gating is enabled ^849da1
- Set data-preloader-state to exit before paint ^204f8f
- Is this the first visit to the page this session? ^e36dca