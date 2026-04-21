/**
 * ---
 * aix:
 *   id: frontend.js.choreography.config.motion
 *   role: Shared motion tokens for frontend choreography and motion tooling.
 *   status: stable
 *   surface: internal
 *   owner: Frontend
 *   tags:
 *     - motion
 *     - tokens
 *     - animation
 *   scope: frontend
 *   runtime: shared
 *   perf:
 *     readPriority: low
 *     cacheSafe: true
 *     critical: false
 * ---
 */
const toSeconds = (value) => (typeof value === "number" ? value / 1000 : value);
export const motionTokens = {
  duration: {
    instant: 80,
    fast: 150,
    base: 220,
    slow: 320,
    slower: 480,
  },

  ease: {
    standard: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    enter: "cubic-bezier(0.0, 0.0, 0.2, 1)",
    exit: "cubic-bezier(0.4, 0.0, 1, 1)",
    emphasis: "cubic-bezier(0.3, 0.0, 0.2, 1.1)",
    springy: "cubic-bezier(0.2, 0.8, 0.2, 1.4)",
  },

  distance: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40,
  },

  stagger: {
    none: 0,
    tight: 0.05,
    base: 0.1,
    loose: 0.12,
  },
};

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
  translateY: -motion.distance("md"),
  translateX: -motion.distance("md"),
};

/**
 * Hero Section Animation Defaults
 *
 * Specific overrides for the Hero section animations.
 */
export const HERO_ANIMATION_DEFAULTS = {
  ...ANIMATION_DEFAULTS,
  // translateY: -motion.distance("lg"),
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
 * Awards Section Animation Defaults
 *
 * Includes per-item reveal behavior tuned for viewport-threshold entry.
 */
export const AWARDS_ANIMATION_DEFAULTS = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slower")),
  translateY: -motion.distance("lg"),
  itemTranslateY: -motion.distance("md"),
  itemRevealViewportRatio: 0.5, // Reveal items when they are 50% visible in the viewport
  ease: {
    in: motion.ease("exit"),
    out: motion.ease("enter"),
  },
};
