import { motionTokens } from "../motion.js";

/**
 * Text Split Reveal Defaults
 *
 * Default from/to vars for the text-split-reveal atom (formerly HERO_LANDING).
 */
export const TEXT_SPLIT_REVEAL = {
  from: {
    autoAlpha: 0,
    yPercent: 1,
  },
  to: {
    autoAlpha: 1,
    yPercent: 0,
    stagger: motionTokens.stagger.base,
  },
};
