---
description: "Runtime manager — reveals the badge (cued by hero:intro:complete on home, immediately elsewhere), hides and shows it on scroll direction change, and opens its site-map dialog."
status: stable
tags:
  - choreography
  - manager
links:
  - "[[system/gsap|system/gsap]]"
  - "[[config/ix/motion/motion|config/ix/motion]]"
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[config/contracts/events/events|config/contracts/events]]"
---

# BadgeManager

Owns the badge from [[badge.njk]]: the toggle button (`data-badge-el="toggle"`,
shipped `hidden`), its `<dialog>` (`data-badge-el="dialog"`) and the dialog's
close button (`data-badge-el="close"`), all resolved through
`BADGE_SELECTORS`. Disabled when the toggle or dialog is missing.

Renamed from `GlobalHeaderManager` when the badge replaced the global header
(2026-11-17). The reveal and scroll logic are unchanged.

## Reveal

- **With a bus and a hero section** (home, via AnimationDirector): waits for `hero:intro:complete` — the last beat of the landing chain — then removes `hidden` and slides the badge in (`yPercent: -100 → 0`, `motion` base/enter). Nothing waits on it; `header:intro:complete` is the chain's terminal event.
- **Otherwise**: removes `hidden` immediately, no tween. Covers standalone pages (`js/layouts/badge.js`, no bus) and landing pages without a hero (work, contact). Whichever module runs first claims the badge via `data-badge-init`.

Emits `header:intro:start` and `header:intro:complete` (bus only) in every mode. The event namespace keeps its `header` name.

## Scroll auto-hide

The ScrollTrigger is created only after the reveal completes, so hide/show can never fire before the intro. Past `SCROLL_THRESHOLD_PX` (80), scrolling down hides the badge and scrolling up shows it. Auto-hide is paused while the dialog is open.

The badge is `position: fixed`, so neither the reveal nor auto-hide reflows the page (no CLS).

## Site-map dialog

The same native-dialog pattern as [[Lightbox.js]]: a click on the badge calls
`showModal()` and sets `aria-expanded="true"`. The platform supplies the focus
trap, Escape, the top layer and focus return to the badge. The dialog's
`close` event, which fires on every dismissal path, resets `aria-expanded`.
The close button calls `dialog.close()`. A delegated click listener on the dialog also closes it when the clicked link targets a hash on the current pathname (the site map's Work industry links, opened on /work/); native hash navigation then scrolls to the section. Cross-page links need nothing.

On open the close button animates in after a `motion` slower (1s) delay:
`opacity 0 → 1`, `rotation -90 → 0`, `motion` base/enter. `fromTo` renders
the from-state immediately, so the button stays invisible through the delay. It
animates `opacity`, not `autoAlpha`: the button is autofocused on open, and
`visibility: hidden` would make the browser drop that focus.

Page scroll is locked by CSS while the dialog is open
(`html:has(dialog[data-badge-el][open])` in `styles/base.css`).

On pages with a ScrollSmoother (home, work, contact), its
`normalizeScroll: true` intercepts wheel and touch on the whole document, so
the dialog's own `overflow-y-auto` couldn't scroll. `_open()` calls
`ScrollSmoother.get()?.paused(true)`: a paused smoother disables the
normalizer and installs an observer that blocks page scroll but lets events
inside a nested scroller through. The `close` event calls `paused(false)`.
`ScrollSmoother.get()` is GSAP's own accessor and returns nothing on pages
without a smoother, where the CSS lock alone applies.

## Reduced motion

- **Reveal:** removes `hidden` and sets the final state, no tween.
- **Scroll auto-hide:** `gsap.set` replaces the tweens.
- **Site-map close button:** the final state is set at once with `gsap.set`.

## Lifecycle

`kill()` removes the cue, the ScrollTrigger and the click/close listeners
(one `AbortController`), and kills tweens on the badge and close button. If the
dialog is open, it resumes the smoother first, since the close handler that
would have resumed it is gone.
