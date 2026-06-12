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
import { ACCESSIBILITY_SETTINGS } from "../accessibility/accessibility.js";
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
 *             Values are section-defined; Card supports 'clip', 'fade', 'parallax', 'throw' and 'deal'.
 */
export const SECTION_OVERRIDES = Object.freeze({
  hero: {
    base: { animation: { variant: "shutter" } },
    sm: { animation: { variant: "shutter" } },
    md: { animation: { variant: "shutter" } },
    lg: { animation: { variant: "shutter" } },
    xl: { animation: { variant: "shutter" } },
    // Reduced motion: run the same `shutter` UX as the breakpoint profiles.
    // The shutter is driven by the lifecycle landing (timeline) and the gel
    // scrub trigger (HeroTriggers._gelTrigger), so BOTH channels must be
    // enabled — the global `reduced` profile disables both. This override
    // fully replaces those channels via the shallow merge in
    // resolveSectionMotionProfile. NOTE: this intentionally forgoes a reduced
    // experience for hero — see the a11y caveat in the handoff.
    reduced: {
      animation: { variant: "shutter" },
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
  },
  card: {
    base: { animation: { variant: "clip" } },
    sm: { animation: { variant: "clip" } },
    md: { animation: { variant: "fade-n-lift" } },
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
  awards: {
    base: { animation: { variant: "slide" } },
    sm: { animation: { variant: "slide" } },
    md: { animation: { variant: "slide" } },
    lg: { animation: { variant: "slide" } },
    xl: { animation: { variant: "slide" } },
    reduced: {
      animation: { variant: "reduced" },
    },
  },
});

/**
 * Get the active motion profile key from matchMedia conditions.
 *
 * Reduced motion always overrides the breakpoint profile. The dev override
 * ACCESSIBILITY_SETTINGS.testReducedMotion forces the `reduced` profile on
 * regardless of the OS `prefers-reduced-motion` condition — this is the single
 * chokepoint every section and card resolves through, so honoring it here makes
 * the flag effective everywhere (see ReducedMotionHandler for OS-path authority).
 *
 * @param {Object} conditions - Conditions object from gsap.matchMedia context
 * @returns {string} Profile key: 'reduced' | 'base' | 'sm' | 'md' | 'lg' | 'xl'
 */
export function getActiveMotionProfileKey(conditions = {}) {
  if (ACCESSIBILITY_SETTINGS.testReducedMotion === true) return "reduced";
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
