/**
 * Motion Config
 *
 * Global motion surface: the motion tokens (defined in tokens/motion/ and
 * re-exported here), the `motion` token accessor, `toSeconds`, and
 * ANIMATION_DEFAULTS. Section motion presets live in ./presets/ — one file per
 * consumer area — and import from here.
 */
export { motionTokens } from "../../tokens/motion/motion.js";
import { motionTokens } from "../../tokens/motion/motion.js";
export const toSeconds = (value) =>
  typeof value === "number" ? value / 1000 : value;

export const motion = {
  duration(name = "base") {
    return motionTokens.duration[name] ?? motionTokens.duration.base;
  },
  ease(name = "standard") {
    return motionTokens.ease[name] ?? motionTokens.ease.standard;
  },
  distance(name = "md") {
    return motionTokens.distance[name] ?? motionTokens.distance.md;
  },
  stagger(name = "base") {
    return motionTokens.stagger[name] ?? motionTokens.stagger.base;
  },
};

/**
 * Animation Default Settings
 *
 * Base timing and easing values used across all sections.
 */
export const ANIMATION_DEFAULTS = {
  duration: toSeconds(motion.duration("base")),
  stagger: motion.stagger("base"),
  ease: {
    in: motion.ease("enter"),
    out: motion.ease("exit"),
    inOut: motion.ease("standard"),
  },
  // translateY: -motion.distance("md"),
  // translateX: -motion.distance("md"),
  overwrite: "auto",
};
