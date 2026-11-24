---
title: "Home page initialization sequence"
description: "The homepage's landing sequence from the user's perspective: a preloader covers asset loading and choreography initialization, then the background video, gels, and hero arrive in one cinematic flow."
type: spec
---

Note 2026-11-24: `gel_hero` was replaced by `gel_video`, which fades in before the video rather than after it, and hero no longer animates a full-bleed gel. Steps below that mention `gel_hero` are historical.

Note 2026-11-24: the background intro now starts when the preloader's outro starts (`preloader:exit`) and shows through the fading splash, instead of waiting for `preloader:out`. The hero intro is still gated on `preloader:out`. Steps below that put the background after the preloader exit are historical.

The role of the homepage initialization sequence is to deliver a seamless, cinematic transition from empty page to a fully populated, animated, designed home page.

From a system perspective, the landing experience is defined by loading assets and initializing the choreography for the page. Visual and motion design respond to initialization events by establishing a cinematic flow from one state to another.

This spec defines intent. Where the build differs, see [Drift](#drift).

## The default sequence

The steps below describe the states and events from the user's perspective:

00: The user lands on the page. No HTML elements are visible other than the page background (the `<html>` element's colour and grid). The page load begins.

01: The preloader view enters.
02: The preloader view rests in its idle state as the page load continues.
03: Once the preloader has completed its intro and settled into its idle state, the primary choreography runs its initialization. Initialization is complete once objects have been instantiated, event handling is set up, fonts have loaded, and the background video is ready for playback. Every wait is bounded by a timeout (fonts 2 s, director 8 s, video 4 s), so the preloader always exits. Decided 2026-09-24; see [Reconcile the video playback gate](../../../../goals/Frontend/_tasks/reconcile-the-video-playback-gate.md). Pending: [Decouple LCP from the video playback gate](../../../../goals/Frontend/_tasks/decouple-lcp-from-the-video-playback-gate.md) may change the video gate.
04: The preloader view exits.

05: The background video enters, already playing (step 03). Once it has faded in, the background moves to its resting state: on wide viewports it tilts into two-point perspective (see [[background-video-perspective-spec]]), and `gel_hero` fades in with that move, finishing as the tilt settles. On narrow viewports there is no tilt, and `gel_hero` fades in at the same point with the same timing.
06: Playback of the background video is controlled by scroll events as content enters and/or leaves the view. The strategy is to limit the amount of visual noise onscreen as needed to maintain the user's focus on content.

A pause of one `slow` duration token (`HERO_INTRO_HOLD`) separates the video fade-in from the hero intro.

07: Two gels: `gel_hero` and `gel_tagline`. `gel_hero` is already visible, full-bleed, from step 05: hero places it while the sequence builds behind the preloader, but it stays hidden until the background reveals it. `gel_tagline` starts hidden; its fade-in marks the first beat of the hero intro.

08: The accession label enters.
09: The H1 element enters.

When the letter cascade completes, the keywords "just", "informed", and "engaged" light up in `secondary-600`.

10: The statements sit one screen height below the viewport. Each gets pinned into place when in view, providing conceptual space (visual and temporal) for statement-specific animation and/or interaction.
11: The global header enters. Note: the header is disabled on the homepage (2026-11-09) and may be re-integrated into the design later. Until then, this step does not occur.
12: Initialization complete.

## Edge cases

### Repeat page visits in one session (session gating)

The goal is to preserve the value of the landing experience as an introductory and branding device.

Success looks like the user returning to the homepage and landing directly at step 12.

The strategy is to limit the number of times a user encounters the initialization sequence. Working in our favor: the homepage assets, the largest contributors to load time, are already in the cache, so there is no delay to account for.

The `SESSION_GATING_ENABLED` constant (`managers/SessionManager/SessionManager.js`) eases development by forcing replay of the sequence. Set it to `true` for production.

### Reduced motion

When the browser is set to reduced motion:

- the user lands at step 12, and
- background video playback is paused.

## Drift

Known differences between this spec and the build, as of 2026-11-11:

- **Session gating is off.** `SESSION_GATING_ENABLED` is `false`, so return visitors replay the full sequence.
- **Step 03 runs in parallel in the build.** Choreography initialization doesn't wait for the preloader's intro; the preloader's exit waits for both. The user sees the same result.
- **[LandingSequence.md](../../js/choreography/templates/landing/LandingSequence.md) still ends with the header sliding in.** Deferred while the header is disabled.
- **The title band is deprecated.** [split.md](../../js/choreography/molecules/hero-motion/split.md) describes a band wipe behind the label and H1; `hero.njk` no longer renders the band, and it won't be implemented.
