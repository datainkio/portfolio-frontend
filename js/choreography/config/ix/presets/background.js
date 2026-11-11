import { ANIMATION_DEFAULTS, motion, toSeconds } from "../motion.js";

/**
 * BACKGROUND Section Animation Defaults
 *
 * Specific overrides for the BACKGROUND section animations.
 */
export const BACKGROUND_ANIMATION_DEFAULTS = {
  ...ANIMATION_DEFAULTS,
  // translateY: -motion.distance("lg"),
};

/**
 * Background Perspective — two-point tilt after the video reveal
 *
 * Once the video has faded in, the whole section root (video, pixelator, gels)
 * turns into two-point perspective and rests there for the rest of the page.
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
 * `ease` is a GSAP name, as in HERO_GEL_SOLID: the cubic-bezier strings in the
 * motion tokens don't parse in GSAP without CustomEase.
 *
 * See specs/animation/background-video-perspective-spec.md.
 */
export const BACKGROUND_PERSPECTIVE = {
  rotationY: -15, // degrees
  perspectiveRatio: 1.25, // × window.innerWidth → px (1920 → 2400)
  transformOrigin: "100% 50%",
  scale: 1.35,
  duration: toSeconds(motion.duration("slower") * 1.5),
  ease: "power2.inOut",
};
