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
import { getActiveBreakpoint } from "./breakpoints.js";
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
  // translateY: -motion.distance("md"),
  // translateX: -motion.distance("md"),
  overwrite: "auto",
};

export const THROW_OUT_ANIMATION = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slow")),
  xPercent: -100,
  yPercent: -125,
  rotation: -12,
  overwrite: "auto",
  transformOrigin: "50% 66%",
};

export const THROW_IN_ANIMATION = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slow")),
  xPercent: 100,
  yPercent: 125,
  rotation: 12,
  overwrite: "auto",
  transformOrigin: "50% 66%",
};

/**
 * Hero Section Animation Defaults
 *
 * Specific overrides for the Hero section animations.
 */
export const HERO_LANDING = {
  from: {
    ...ANIMATION_DEFAULTS,
    autoAlpha: 0,
    yPercent: 1,
  },
  to: {
    ...ANIMATION_DEFAULTS,
    autoAlpha: 1,
    yPercent: 0,
  },
};

export const HERO_INTRO = {
  ...ANIMATION_DEFAULTS,
  top: "100%",
  height: "100%",
};

export const HERO_OUTRO = {
  ...ANIMATION_DEFAULTS,
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

/**
 * Breakpoint Motion Profiles
 *
 * Defines timeline and trigger capabilities per breakpoint tier.
 * `reduced` always takes precedence over breakpoint profiles.
 *
 * timeline channel:
 *   enabled       - gates timeline playback and scroll trigger binding for sections
 *   durationScale - multiplier for animation durations (reserved for future use)
 *   staggerScale  - multiplier for stagger values (reserved for future use)
 *   distanceScale - multiplier for translate distances (reserved for future use)
 *   easePreset    - named ease from motionTokens (reserved for future use)
 *
 * trigger channel:
 *   enabled            - gates ScrollTrigger binding for sections
 *   scrub              - capability flag; used by composeScrollTrigger
 *   pin                - capability flag; used by composeScrollTrigger
 *   once               - fire trigger once vs. on every enter
 *   invalidateOnRefresh - recalculate trigger on resize/refresh
 */
export const MOTION_PROFILES = Object.freeze({
  reduced: {
    timeline: {
      enabled: false,
      durationScale: 1,
      staggerScale: 1,
      distanceScale: 1,
      easePreset: "standard",
    },
    trigger: {
      enabled: false,
      scrub: false,
      pin: false,
      once: true,
      invalidateOnRefresh: true,
    },
  },
  base: {
    timeline: {
      enabled: true,
      durationScale: 1,
      staggerScale: 1,
      distanceScale: 1,
      easePreset: "standard",
    },
    trigger: {
      enabled: true,
      scrub: false,
      pin: false,
      once: true,
      invalidateOnRefresh: true,
    },
  },
  sm: {
    timeline: {
      enabled: true,
      durationScale: 1,
      staggerScale: 1,
      distanceScale: 1,
      easePreset: "standard",
    },
    trigger: {
      enabled: true,
      scrub: false,
      pin: false,
      once: true,
      invalidateOnRefresh: true,
    },
  },
  md: {
    timeline: {
      enabled: true,
      durationScale: 1,
      staggerScale: 1,
      distanceScale: 1,
      easePreset: "standard",
    },
    trigger: {
      enabled: true,
      scrub: false,
      pin: false,
      once: true,
      invalidateOnRefresh: true,
    },
  },
  lg: {
    timeline: {
      enabled: true,
      durationScale: 1,
      staggerScale: 1,
      distanceScale: 1,
      easePreset: "standard",
    },
    trigger: {
      enabled: true,
      scrub: true,
      pin: true,
      once: false,
      invalidateOnRefresh: true,
    },
  },
  xl: {
    timeline: {
      enabled: true,
      durationScale: 1,
      staggerScale: 1,
      distanceScale: 1,
      easePreset: "standard",
    },
    trigger: {
      enabled: true,
      scrub: true,
      pin: true,
      once: false,
      invalidateOnRefresh: true,
    },
  },
});

/**
 * Section-Specific Motion Overrides
 *
 * Shallow-merged over the matching MOTION_PROFILES entry by resolveSectionMotionProfile.
 * Only include keys that differ from the global profile default.
 *
 * animation channel:
 *   variant - selects which animation implementation to run.
 *             Values are section-defined; Card supports 'clip' and 'fade'.
 */
export const SECTION_OVERRIDES = Object.freeze({
  card: {
    base: { animation: { variant: "clip" } },
    sm: { animation: { variant: "clip" } },
    md: { animation: { variant: "fade" } },
    lg: { animation: { variant: "clip" } },
    xl: { animation: { variant: "clip" } },
  },
});

/**
 * Get the active motion profile key from matchMedia conditions.
 *
 * Reduced motion always overrides the breakpoint profile.
 *
 * @param {Object} conditions - Conditions object from gsap.matchMedia context
 * @returns {string} Profile key: 'reduced' | 'base' | 'sm' | 'md' | 'lg' | 'xl'
 */
export function getActiveMotionProfileKey(conditions = {}) {
  if (conditions.reduceMotion) return "reduced";
  return getActiveBreakpoint(conditions);
}

/**
 * Resolve the motion profile for a section at the current conditions.
 *
 * Merges the global MOTION_PROFILES entry for the active breakpoint with any
 * section-specific overrides from SECTION_OVERRIDES. The merge is shallow —
 * top-level channels (timeline, trigger, animation) in the override replace
 * their counterparts in the base profile.
 *
 * @param {string} sectionKey - Section identifier (e.g. 'hero', 'bio', 'card')
 * @param {Object} conditions  - Conditions object from gsap.matchMedia context
 * @returns {{ timeline: Object, trigger: Object, animation?: Object }} Resolved profile
 */
export function resolveSectionMotionProfile(sectionKey, conditions = {}) {
  const key = getActiveMotionProfileKey(conditions);
  const baseProfile = MOTION_PROFILES[key] ?? MOTION_PROFILES.base;
  const override = SECTION_OVERRIDES[sectionKey]?.[key];
  if (!override) return baseProfile;
  return { ...baseProfile, ...override };
}
