---
description: "Inline, synchronous pre-paint script — on a repeat visit this session it sets `hidden` on [data-preloader] before first paint so the splash never flashes; mirrors SessionManager's storage key and the preloader's root selector by hand."
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

Included by `head.njk`. Must stay a classic (non-module) inline script:
module scripts are deferred and would run after first paint, which is exactly
the flash this prevents.

It sets `hidden`, not `data-preloader-state="exit"`: the CSS outro fades from
full opacity, so `exit` on a never-shown root would flash the splash. Once
hidden, `Preloader.js` skips the outro and goes straight to `preloader:out`.

The three literals it hard-codes (`"dataink_session"`, `visited`,
`[data-preloader]`) each have a source of truth elsewhere — see the comment at
the top of the template.

Session gating is switched by `SESSION_GATING_ENABLED` in `SessionManager.js`
(currently `false`). This script needs no mirror of it: while gating is off
`visited` is never persisted and any stale value is cleared on the next
`SessionManager` construction, so the check here simply never matches. (The one
exception is the first load after flipping the flag off with a stale `visited`
already in storage — that single load still skips the splash.)

## Role in preloader strategy
- Check if session gating is enabled ^849da1
- 📍Hide the preloader root before paint (intended; currently never reached) ^204f8f
- Is this the first visit to the page this session? ^e36dca