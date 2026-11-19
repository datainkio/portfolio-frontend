import { ANIMATION_DEFAULTS, motion, toSeconds } from "../motion.js";

/**
 * Work Section Animation Defaults
 *
 * Includes per-item reveal behavior tuned for viewport-threshold entry.
 */
export const WORK_ANIMATION_DEFAULTS = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slow")),
  stagger: motion.stagger("base"),
  translateY: -motion.distance("md"),
  itemTranslateY: -motion.distance("md"),
  itemRevealViewportRatio: 0.5,
  ease: {
    in: motion.ease("exit"),
    out: motion.ease("enter"),
  },
};
