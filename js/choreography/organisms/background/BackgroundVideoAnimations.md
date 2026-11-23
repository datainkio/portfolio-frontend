---
description: Background video animations module — builds the hidden landing and fade-in intro timelines for the <video>, the idle timeline whose progress marks the static two-point perspective rest pose of the section root, and the gel_hero fade-in / snap.
status: stable
tags:
  - choreography
links:
  - "[[AbstractSectionAnimations|AbstractSectionAnimations]]"
  - "[[video-reveal|video-reveal]]"
  - "[[pane-contract|pane-contract]]"
  - "[[system/gsap|system/gsap]]"
  - "[[dataink.io/frontend/ia/docs/design/tokens/motion|motion]]"
  - "[[timelines|timelines]]"
  - "[[background|presets/background]]"
---

# BackgroundVideoAnimations

- `landing` — the hidden resting state of the `<video>` (`this.media`), via [[video-reveal|video-reveal]]. The sheet and panes stay hidden (`invisible` in the markup) until staged.
- `intro` — when `this.panes` (`VIDEO_SELECTORS.pane`) exist, one composed timeline carrying `TIMELINE_IDS.intro`, all positions absolute from 0: `set`s at 0 putting the sheet and panes at `autoAlpha: 1` (so the first frame is right even if `stagePanes()` never ran), the video fade at 0 (`buildVideoIntro` with `id: null`), the sheet wipe at 0 (`buildSheetWipe`), and the pane contraction at `BACKGROUND_PANES.contract.stagger` (`buildPaneContract`), so the first colour pane starts when the sheet is half gone. There is no veil and no gel callback: staging shows the gel. At the end the sheet and panes are hidden and the video visible. The sheet is `this.sheet`, a document-level lookup (`VIDEO_SELECTORS.sheet`), because it sits outside the section root; if it is missing the sheet step is empty. Options come from `BACKGROUND_PANES` and [[pane-contract|pane-contract]]. With no panes it is the video fade alone.
- `stagePanes()` / `unstagePanes()` / `arePanesStaged()` — put the sheet and panes at `autoAlpha: 1` (panes at `scaleX: 1`) and show `gel_hero` under them, or hide them again. The writes run outside any active gsap context (`_outsideContext`), so a `gsap.matchMedia` revert cannot hide them mid-intro. State (`_panesStaged`) lives here because the first pass runs inside the controller's `super()`.
- `isIntroPristine()` — the intro is paused, idle and at progress 0 (not started, not jumped to its end).
- `idle` — the two-point perspective rest pose, from `BACKGROUND_PERSPECTIVE`, on the section root (`this.view`). It is never played: nothing animates into the pose. `snapPerspective()` finishes it, and its progress is the "settled" flag. `immediateRender: false`, so building it writes nothing. Its `onComplete` re-sets the pose at the current width, then calls `onPerspectiveSettled`, which is inert now that nothing holds `video:intro:complete`.
- `snapPerspective()` — applies the rest pose statically: finishes the idle timeline and re-sets the pose at the current width (construction, breakpoint entry, intro completion, resize).
- `clearPerspective()` — idle back to 0 and `clearProps` transform/origin (narrow tiers). Transform only; it never touches the heading gel.
- `isPerspectiveSettled()` — idle progress is 1.
- `fadeInHeadingGel()` — the played-path reveal when there are no panes (with panes the intro has already shown the gel, so this is a no-op) of `gel_hero` (`options.headingGel`, resolved by BackgroundVideo): a standalone `autoAlpha` 0 → 1 tween with `BACKGROUND_HEADING_GEL_REVEAL`. Standalone rather than inside idle, so it also runs on flat tiers and survives `clearPerspective()`. No-op once shown.
- `showHeadingGel()` — snap to `autoAlpha: 1`, finishing a fade in flight. Idempotent.
- `isHeadingGelShown()` / `isHeadingGelFading()` — the reveal has started or landed / the fade is still running.
- `kill()` — also kills the gel fade.

The gel's reveal state lives here, not on the controller, because BackgroundVideo's gated path can run inside its `super()` call, before the controller's own fields exist.

`BackgroundVideo` decides when each runs; this module only builds them.

## Reduced motion

Reduced motion takes the gated path. The rest pose is static on every path (`snapPerspective()`), and on the gated path `showHeadingGel()` snaps `gel_hero` visible rather than fading it in. The gated path jumps the intro timeline to its end, where the panes are hidden and the video visible; no separate tween exists for it.
