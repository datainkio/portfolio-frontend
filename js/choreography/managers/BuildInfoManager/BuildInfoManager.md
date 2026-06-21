---
title: "BuildInfoManager"
template: "[[BuildInfoManager.js]]"
templatePath: "js/choreography/managers/BuildInfoManager/BuildInfoManager.js"
system: "Choreography"
type: "module"
templateRole: "manager"
status: "active"
tags:
  - choreography
  - manager
  - interaction
---
# BuildInfoManager

Singleton manager for the section-cap **build-info disclosure** — a click-driven toggle that reveals/hides the build details ([[build-info.njk]]) beside the always-visible build `<time>`.

## State machine

```
[closed]  time visible, list hidden (display: none)
   │ click toggle (<time>)
   ▼
[open]    list shown, close button visible
   │ click close button
   ▼
[closed]  list hidden
```

A single delegated click listener on `data-buildinfo-el="root"` routes by target: a click inside the `close` button closes; a click inside the `toggle` opens. Nothing else in the region toggles state — open and close are driven by their own dedicated buttons.

## DOM contract

Resolves via `BUILD_INFO_SELECTORS` (`config/contracts/selectors/selectors.js`), `data-buildinfo-el` attribute — never CSS classes:

- `root` — wrapper (`display: contents`), owns the delegated listener
- `toggle` — the `<button>` wrapping `<time>`; carries `aria-expanded`
- `list` — the `<ul>` of build items; carries `aria-hidden`, `display: none` when closed
- `close` — the `<button>` (icon, [[icon.njk]] `close`) after the list; closes the disclosure
- `cap` — the section-cap `<ul>` ancestor; the manager toggles the `data-open` presence attribute on it. Tailwind `group-data-[open]/cap` variants redistribute item `basis` (1/3·1/3·1/3 → 1/6·1/6·2/3) — layout lives in [[section-cap.njk]], JS only flips the flag.

## Motion

None. The list toggles in/out of view via inline `display` (`none` ↔ `""`), which wins over the Tailwind `flex` utility. No GSAP, no reduced-motion branch — instant for everyone.

## Lifecycle

- Instantiated once by [[AnimationDirector.js]] (no args), alongside the other managers.
- No-ops gracefully (`disabled`) when `root`/`toggle`/`list` are absent — pages without the cap don't error.
- `kill()` removes the listener; called from the Director `destroy()`.

## Notes for future maintenance

- Animation was intentionally removed to address how the list's size change impacts the section-cap layout. Resolve the layout behavior first; reintroduce motion (if any) only after placement is settled.
- If the disclosure needs to coordinate with other sections, promote the local state to `AnimationBus` events (`EVENTS`) rather than calling across managers.
- Accessibility: the toggle is a real `<button>` (keyboard opens *and* closes); `aria-expanded`/`aria-hidden` track state. Preserve these if the markup is restructured.
