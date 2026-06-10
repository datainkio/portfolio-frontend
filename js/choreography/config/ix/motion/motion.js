export { resolveSectionMotionProfile } from "../profiles/profiles.js";
import { SECTION_OVERRIDES } from "../profiles/profiles.js";
export { motionTokens } from "../../../tokens/motion/motion.js";
import { motionTokens } from "../../../tokens/motion/motion.js";
const toSeconds = (value) => (typeof value === "number" ? value / 1000 : value);

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

export const THROW_OUT_ANIMATION = {
  duration: toSeconds(motion.duration("slow")),
  xPercent: -100,
  yPercent: -125,
  rotation: -12,
  transformOrigin: "50% 66%",
};

export const THROW_IN_ANIMATION = {
  duration: toSeconds(motion.duration("slow")),
  xPercent: 100,
  yPercent: 125,
  rotation: 12,
  transformOrigin: "50% 66%",
};

/**
 * Hero Section Animation Defaults
 *
 * Specific overrides for the Hero section animations.
 */
export const HERO_LANDING = {
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

export const HERO_INTRO = {
  yPercent: 100,
};

export const HERO_OUTRO = {
  top: "0%",
  height: "50%",
};

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
 * Bio Section Animation Defaults
 *
 * Specific overrides for the Bio section animations.
 */
export const BIO_ANIMATION_DEFAULTS = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slower")),
  translateY: -motion.distance("lg"),
  itemTranslateY: -motion.distance("md"),
  itemRevealViewportRatio: 0.5,
  subSectionStartDelay: ANIMATION_DEFAULTS.duration,
  stickySubheadingFadeDuration: ANIMATION_DEFAULTS.duration,
  stickyHeaderCollapseDuration: ANIMATION_DEFAULTS.duration,
  stickySubheadingTopThreshold: 1,
};

export const BIO_INTRO = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slow")),
  stagger: motion.stagger("loose"),
  translateY: -motion.distance("lg"),
};

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
};

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

/**
 * Awards Section Animation Defaults
 *
 */

export const AWARDS_ANIMATION_DEFAULTS = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slow")),
  translateY: -motion.distance("lg"),
  itemTranslateY: -motion.distance("md"),
};

export const AWARDS_INTRO = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slow")),
};

/**
 * Project Header Section Animation Defaults
 */
export const PROJECT_HEADER_ANIMATION = {
  yPercent: -15,
  ease: "none",
  scrollTrigger: {
    start: "top top",
    end: "bottom top",
    scrub: true,
    invalidateOnRefresh: true,
  },
};
