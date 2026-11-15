import { ANIMATION_DEFAULTS, motion, toSeconds } from "../motion.js";

/**
 * Organizations Section Animation Defaults
 *
 * Includes per-item reveal behavior tuned for viewport-threshold entry.
 */
export const ORGANIZATIONS_ANIMATION_DEFAULTS = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slow")),
  stagger: motion.stagger("loose"),
  translateY: -motion.distance("md"),
  itemTranslateY: -motion.distance("md"),
  itemRevealViewportRatio: 0.5,
  ease: {
    in: motion.ease("exit"),
    out: motion.ease("enter"),
  },
  // Logo marquee (idle timeline). Speed is constant per pixel, so rows of
  // different lengths drift at the same visual pace.
  marquee: {
    pixelsPerSecond: 32,
  },
};
