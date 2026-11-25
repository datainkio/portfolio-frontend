---
description: "Bootstrap partial — sets window.__enableChoreography, dispatches director:ready on DOMContentLoaded when choreography is off, loads AnimationDirector (bundle or raw ESM with an import map), and starts the preloader; included by home, contact, and the landing layout."
type: template
tags:
  - preloader
  - choreography
  - partial
links:
  - "[[home|home.njk]]"
  - "[[contact|contact.njk]]"
  - "[[landing|landing.njk]]"
  - "[[Preloader|preloader/Preloader]]"
  - "[[AnimationDirector|AnimationDirector]]"
---

Order matters: the flag script is classic and runs first; the Director and
preloader are both `type="module"` and therefore deferred, so neither can
observe `document.readyState === "loading"`. The preloader listens for
`director:ready` before awaiting anything, so it is safe whichever module
evaluates first — and it bounds that wait, so a failed Director load still
releases the page.

`runtime.bundleJs` selects the pre-built bundle (with a fallback to the raw
entry); otherwise an import map resolves `@datainkio/lumberjack` for raw ESM.
