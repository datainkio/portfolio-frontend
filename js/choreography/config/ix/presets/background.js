import { ANIMATION_DEFAULTS, motion, toSeconds } from "../motion.js";

/**
 * BACKGROUND Section Animation Defaults
 *
 * Specific overrides for the BACKGROUND section animations.
 *
 * `duration` and `ease.out` drive the video's fade-in (the intro). The video is
 * brighter than the preloader's graph paper, so the shared `base` fade (0.46s,
 * `enter`) read as a flash. It now takes 1.5 × the `slower` token on the
 * `standard` ease. `gel_video` fades in just before it
 * (BACKGROUND_VIDEO_GEL_REVEAL).
 */
export const BACKGROUND_ANIMATION_DEFAULTS = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slower") * 1.5),
  ease: { ...ANIMATION_DEFAULTS.ease, out: motion.ease("standard") },
  // translateY: -motion.distance("lg"),
};

/**
 * Background Perspective — two-point tilt after the video reveal
 *
 * Before the video is visible, the section root (video, pixelator, gels) is
 * overscaled by `scale` about `transformOrigin`, so the right edge stays flush.
 * Once the video has faded in, it turns into two-point perspective — rotation
 * only — and rests there for the rest of the page.
 * Negative `rotationY` about the right edge makes the LEFT side recede while
 * the right edge stays fixed. At a 1920px viewport the rest pose equals
 * `transform-origin: 100% 50%; transform: perspective(2400px) rotateY(-15deg)
 * scale(1.35)`.
 *
 * `perspectiveRatio` × viewport width = perspective distance (px). Keeping it
 * proportional to width is what lets one `scale` cover the viewport everywhere:
 * with perspective ∝ width, scale ≥ ~1.32 closes the wedge the turn exposes at
 * any width and landscape aspect (a fixed 2400px would need ~1.45 at 2560px).
 * Because it depends on width, BackgroundVideo re-applies the pose on resize.
 *
 * `duration` is 1.5 × the `slower` token (seconds) — cinematic, unhurried.
 * `ease` is the `standard` token (GSAP `power1.out`, via motion.ease()). It
 * was `power2.inOut` until 2026-11-12, when hardcoded GSAP names moved onto the
 * motion tokens; no token maps to a symmetric inOut curve.
 *
 * See specs/animation/background-video-perspective-spec.md.
 */
export const BACKGROUND_PERSPECTIVE = {
  rotationY: -15, // degrees
  perspectiveRatio: 1.25, // × window.innerWidth → px (1920 → 2400)
  transformOrigin: "100% 50%",
  scale: 1.35,
  duration: toSeconds(motion.duration("slower") * 1.5),
  ease: motion.ease("standard"),
};

/**
 * Video Gel Reveal — `gel_video` fading in before the video
 *
 * The background section owns `gel_video`'s visibility. The gel fades 0 → 1 as
 * the first step of the video's intro, and only when it has landed does the
 * video fade in, so the video is already darkened when it appears. It has its
 * own values: it does not follow the tilt or the video's fade.
 */
export const BACKGROUND_VIDEO_GEL_REVEAL = {
  duration: toSeconds(motion.duration("slow")),
  ease: motion.ease("standard"),
};
