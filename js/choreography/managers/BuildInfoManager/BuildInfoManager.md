---
description: "Singleton manager for the section-cap build-info disclosure — a click-driven toggle that reveals/hides the build details (build-info.njk) beside the always-visible build <time>."
type: script
tags:
  - choreography
  - manager
  - interaction
---

# BuildInfoManager

Singleton manager for the section-cap **build-info disclosure** — a click-driven toggle that reveals/hides the build details ([[build-info.njk]]) beside the always-visible build `<time>`.

## State machine

```
[closed]  time visible, list translated off (yPercent: -100)
   │ click toggle (<time>)
   ▼
[open]    list slid into view, close button visible
   │ click toggle OR click close button
   ▼
[closed]  list slides back off
```

A single delegated click listener on `data-buildinfo-el="root"` routes by target: a click inside the `close` button closes; a click inside the `toggle` is a real toggle (opens if closed, closes if open) — both converge on the same `open()`/`close()` methods.

## DOM contract

Resolves via `BUILD_INFO_SELECTORS` (`config/contracts/selectors/selectors.js`), `data-buildinfo-el` attribute — never CSS classes:

- `root` — wrapper (`display: contents`), owns the delegated listener
- `toggle` — the `<button>` wrapping `<time>`; carries `aria-expanded`
- `list` — the `<ul>` of build items; carries `aria-hidden`, `display: none` when closed
- `close` — the `<button>` (icon, [[icon.njk]] `close`) after the list; closes the disclosure
- `cap` — the section-cap `<ul>` ancestor; the manager toggles the `data-open` presence attribute on it. Tailwind `group-data-[open]/cap` variants redistribute item `basis` (1/3·1/3·1/3 → 1/6·1/6·2/3) — layout lives in [[section-cap.njk]], JS only flips the flag.

## FPS

While open, samples frame rate via `requestAnimationFrame` and writes a rounded value (e.g. `"60"`) into `[data-current-fps-build]` every ~500ms — throttled, since writing every frame is wasted work for a value nobody reads that fast. Loop starts in `open()`, is cancelled in `close()` and `kill()`, so it never runs while the drawer is hidden. Plain attribute query (like `[data-current-section-title]` in [[SectionCapManager.js]]), not part of the `BUILD_INFO_SELECTORS` contract — it's a value display hook, not an interaction hook.

## Motion

Drawer slide, transform-only, mirrors [[GlobalHeaderManager.js]]'s hide/show shape. `list` is anchored `top-full` under the header ([[build-info.njk]]); closed = `yPercent: -100` (list translated up by its own height so its bottom edge sits flush with the header's bottom edge), open = `yPercent: 0`. `open()` tweens to `0` with `motion.ease("enter")`, `close()` tweens to `-100` with `motion.ease("exit")`, both at `motion.duration("base")`. `reducedMotionHandler` (injected the same way as every other manager) gates a `gsap.set()` jump instead of a tween when reduced motion is active. `kill()` clears tweens via `gsap.killTweensOf`.

## Lifecycle

- Instantiated once by [[AnimationDirector.js]] with `{ reducedMotionHandler: this.stage?.reducedMotion }`, alongside the other managers.
- No-ops gracefully (`disabled`) when `root`/`toggle`/`list` are absent — pages without the cap don't error.
- `kill()` removes the listener; called from the Director `destroy()`.

## Notes for future maintenance

- The list is fixed-height (`h-12`) and position: absolute — it overlays rather than reflowing the section-cap, so the earlier layout-thrash concern that removed motion no longer applies. If the list's content grows dynamic-height, re-check this before reintroducing anything beyond the transform-only slide.
- If the disclosure needs to coordinate with other sections, promote the local state to `AnimationBus` events (`EVENTS`) rather than calling across managers.
- Accessibility: the toggle is a real `<button>` (keyboard opens _and_ closes); `aria-expanded`/`aria-hidden` track state. Preserve these if the markup is restructured.
