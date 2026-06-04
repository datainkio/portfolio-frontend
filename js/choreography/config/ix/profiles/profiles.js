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
import { getActiveBreakpoint } from "../breakpoints/breakpoints.js";
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
 *             Values are section-defined; Card supports 'clip', 'fade', and 'parallax'.
 */
export const SECTION_OVERRIDES = Object.freeze({
  card: {
    base: { animation: { variant: "throw" } },
    sm: { animation: { variant: "throw" } },
    md: { animation: { variant: "throw" } },
    lg: { animation: { variant: "throw" } },
    xl: { animation: { variant: "throw" } },
  },
  bio: {
    base: { animation: { variant: "sweep" } },
    sm: { animation: { variant: "sweep" } },
    md: { animation: { variant: "sweep" } },
    lg: { animation: { variant: "sweep" } },
    xl: { animation: { variant: "sweep" } },
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
