---
title: "Apply two-point perspective to background video"
description: "The visual design strategy calls for a persistent full-bleed video background as a core component of the homepage experience. This introduces challenges for legibility and attention. Legibility benefits from contrast between foreground (text) and background (flavor). Attention benefits from clear framing and focus. A background in motion cannot stay in motion without the application of a few tricky bits. That is what this spec is about: outlining a strategy that maintains the punch of the background without compromising accessibility."
type: spec
---

The role of the homepage initialization sequence is to deliver a seamless, cinematic transition from empty page to a fully populated, animated, designed home page.

The full-bleed background video is a visually dominant element in support of the content strategy, and its persistence contributes to the feeling of cinematic seamlessness as the user explores through the page.

This spec defines intent for MTP - Minimum Testable Product.

## The default sequence

The steps below describe the states and events from the user's perspective immediately following the completion of step 05 in [[homepage-initialization.animation]]. Assume a 16:9 aspect ratio.

00: The video is full-bleed and playing.
01: The video animates to display two-point perspective, appearing to turn slightly to the user's left. The left side of the video recedes as the right side remains fixed.
02: The video rests at its destination.
03: Return to step 06. The video will not retilt.

## Nice to haves

1. Reinforce the sense of depth with a dark gradient running left to right. This will create an illusion of increasingly deep shadow as the edge recedes from the viewer. More critically, it will introduce greater contrast between foreground and background without compromising the design intention.
2. Consider the axis of rotation. The current state calls for the right edge as the axis. There may be benefit from moving it towards the left.

## Viewport scope

The tilt applies at `lg` (64rem) and wider. Below `lg` the video stays flat and full-bleed, with no transform. The gate is width, not orientation, so a portrait viewport 1024px or wider still tilts. Crossing the breakpoint clears or re-applies the pose.

## Covering the viewport

The turn exposes a wedge of page background at the left, top and bottom. The video is overscaled 1.35× about its right edge to close it. The overscale is applied before the video is visible, so step 00 already shows the video at that scale, flush with the right edge and cropped on the left, top and bottom. Step 01 is then rotation only. Scaling during the turn made the right side appear to move toward the viewer.

Perspective distance is 1.25 × viewport width, not a fixed length. That keeps one overscale sufficient at any width, and the pose is re-applied on resize.

## Sequencing

The hero intro (step 07 in [[homepage-initialization.animation]]) does not begin until the background announces that its intro is complete. On wide viewports that announcement (`video:intro:complete`) waits for step 02. Sequencing is by event, never by matching durations. `HERO_INTRO_HOLD` remains as a beat after the event.

### Reduced motion

When the browser is set to reduced motion:

- No tween. The video snaps to its resting pose at step 02, because the resting pose is what gives the legibility benefit.
- The video itself stays paused, as before (see [[homepage-initialization.animation]]).
- `video:intro:complete` is emitted at once, so the hero chain is unchanged.

## Implementation

Values: `BACKGROUND_PERSPECTIVE` in `js/choreography/config/ix/presets/background.js` (−15°, origin `100% 50%`, scale 1.35, 1.5 s). Breakpoint gate: `SECTION_OVERRIDES.video` in `config/ix/profiles.js`. Behaviour: `organisms/background/BackgroundVideo.js` and `BackgroundVideoAnimations.js`. Their sidecars hold the per-path detail.
