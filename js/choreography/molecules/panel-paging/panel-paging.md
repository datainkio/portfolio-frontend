---
description: "Panel-Paging factory — one wheel gesture, touch swipe, or paging key tweens the scroll straight to the next or previous full-viewport panel's top; native scroll is held while engaged and released past the last panel. Returns { kill() }."
status: stable
tags:
  - choreography
  - scroll
  - panel-paging
links:
  - "[[system/gsap|system/gsap]]"
  - "[[organisms/hero/HeroTriggers|HeroTriggers]]"
---

`createPanelPaging({ panels, id, duration, ease, reduceMotion })` pages a run of full-viewport panels. Each panel's top is a stop. A gesture tweens a proxy from the current scroll to the next stop in its direction, and the tween's `onUpdate` writes the scroll. Nothing else moves the page while paging is engaged, so a panel only ever comes to rest at the top of the viewport. A ScrollTrigger snap can't do this: it corrects after the scroll has already come to rest somewhere else.

- **Input:** `ScrollTrigger.observe` (the Observer that ships inside ScrollTrigger, no extra plugin) on `wheel,touch` with `preventDefault: true`. `wheelSpeed: -1` makes wheel-down and swipe-up both fire `onUp`, which pages forward. `ArrowDown`, `PageDown`, `Space` page forward; `ArrowUp`, `PageUp`, `Shift+Space` page back. Keys typed into inputs, selects, buttons and editable content keep their native meaning.
- **One gesture, one panel:** a page is refused while a tween runs. A gesture page also waits for the Observer's `onStop` before the next gesture page, so trackpad momentum still arriving after a tween can't page a second time.
- **Engaged range:** a ScrollTrigger (`id`) runs from the first panel's top to the last panel's top. Above the last top, paging is engaged. Landing on the last top releases it, so native scroll carries on past the panels. Scrolling back up across that top re-engages and pages on in the direction of travel.
- **ScrollSmoother:** when one exists, scroll is read and written through `smoother.scrollTop()`, which also cancels the smoother's lag for that frame. Its normalizer (`normalizeScroll: true`) scrolls the page on wheel and touch by itself, so it is disabled while engaged and re-enabled on release, as `ScrollSmoother#paused` does. Without a smoother it uses `window.scrollTo`.
- **Resize:** stops are measured on demand. `onRefresh` puts the resting panel back at the top, since a viewport change moves every stop.
- **Lifecycle:** `kill()` kills the trigger, the tween and the Observer, removes the key listener and re-enables the normalizer.
- **Reduced motion:** returns a no-op handle and leaves native scroll alone. The hero profile already turns hero's triggers off under reduced motion, so this is a second line of defence.

Caller: `HeroTriggers._bindPaging()`, with the hero header and each statement section, and `HERO_PAGING` from [presets/hero.js](../../config/ix/presets/hero.js).

Not handled: tabbing focus into a later panel still scrolls natively.
