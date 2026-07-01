/**
 * Breakpoint Motion Profiles
 *
 * Defines timeline and trigger capabilities per breakpoint tier.
 * `reduced` always takes precedence over breakpoint profiles.
 *
 * timeline channel:
 *   enabled - gates timeline playback and scroll trigger binding for sections
 *
 * trigger channel:
 *   enabled - gates ScrollTrigger binding for sections (consumed by
 *             AbstractSection._applyResponsiveLifecycle).
 *
 * NOTE: trigger capability flags (scrub/pin/once) are intentionally NOT defined here.
 * They are owned by each section's base trigger config (e.g. BIO_TRIGGER) and are not
 * breakpoint-varying. If per-breakpoint capability is ever needed, merge profile.trigger
 * over _getTriggerDefaults() in AbstractSectionTriggers.bind() and reintroduce them.
 */
import { getActiveBreakpoint } from "./breakpoints.js";
export const ACCESSIBILITY_SETTINGS = {
  testReducedMotion: false, // dev override: force reduced motion on regardless of OS setting (see ReducedMotionHandler._setup)
  // TODO: deprecate the above in favor of a query param override, which would be more flexible and less likely to be accidentally left on in dev
  // Issue URL: https://github.com/datainkio/portfolio-frontend/issues/148
  // reducedMotionDuration: 0.1, // seconds
  // reducedMotionStagger: 0.05, // seconds
  // reducedMotionEase: "none", // no easing for reduced motion
};
export const MOTION_PROFILES = Object.freeze({
  reduced: {
    timeline: { enabled: false },
    trigger: { enabled: false },
  },
  base: {
    timeline: { enabled: true },
    trigger: { enabled: true },
  },
  sm: {
    timeline: { enabled: true },
    trigger: { enabled: true },
  },
  md: {
    timeline: { enabled: true },
    trigger: { enabled: true },
  },
  lg: {
    timeline: { enabled: true },
    trigger: { enabled: true },
  },
  xl: {
    timeline: { enabled: true },
    trigger: { enabled: true },
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
// "static" = card motion intentionally OFF (development baseline), distinct from
// the a11y `reduced` state. Both channels disabled so Card.js takes its
// Issue URL: https://github.com/datainkio/portfolio-frontend/issues/147
// static-reset branch (clearProps:all) for ALL users — not only those with
// prefers-reduced-motion. Pair with the `?cardVariant=` live override in
// resolveSectionMotionProfile to flip a real variant on without editing this file.
const CARD_STATIC = Object.freeze({
  animation: { variant: "static" },
  timeline: { enabled: false },
  trigger: { enabled: false },
});

export const SECTION_OVERRIDES = Object.freeze({
  hero: {
    base: { animation: { variant: "simple" } },
    sm: { animation: { variant: "simple" } },
    md: { animation: { variant: "simple" } },
    lg: { animation: { variant: "simple" } },
    xl: { animation: { variant: "simple" } },
    // Reduced motion: run the same `shutter` UX as the breakpoint profiles.
    // The shutter is driven by the lifecycle landing (timeline) and the gel
    // scrub trigger (HeroTriggers._gelTrigger), so BOTH channels must be
    // enabled — the global `reduced` profile disables both. This override
    // fully replaces those channels via the shallow merge in
    // resolveSectionMotionProfile. NOTE: this intentionally forgoes a reduced
    // experience for hero — see the a11y caveat in the handoff.
    // Issue URL: https://github.com/datainkio/portfolio-frontend/issues/146
    reduced: {
      animation: { variant: "shutter" },
      timeline: { enabled: true },
      trigger: { enabled: true },
    },
  },
  card: {
    reduced: { animation: { variant: "reduced" } },
    base: CARD_STATIC,
    sm: CARD_STATIC,
    md: CARD_STATIC,
    lg: CARD_STATIC,
    xl: CARD_STATIC,
  },
  work: {
    // reduced: { animation: { variant: "reduced" } },
    base: { animation: { variant: "reduced" } },
    sm: { animation: { variant: "reduced" } },
    md: { animation: { variant: "reduced" } },
    lg: { animation: { variant: "reduced" } },
    xl: { animation: { variant: "reduced" } },
  },
  bio: {
    reduced: { animation: { variant: "reduced" } },
    base: { animation: { variant: "split" } },
    sm: { animation: { variant: "split" } },
    md: { animation: { variant: "split" } },
    lg: { animation: { variant: "split" } },
    xl: { animation: { variant: "split" } },
  },
  awards: {
    base: { animation: { variant: "reduced" } },
    sm: { animation: { variant: "reduced" } },
    md: { animation: { variant: "reduced" } },
    lg: { animation: { variant: "reduced" } },
    xl: { animation: { variant: "reduced" } },
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

  // Dev live-override: `?cardVariant=<variant>` forces a card variant on without
  // editing this file or rebuilding — the fast loop for tuning card motion.
  // `?cardVariant=off` (or static/none) forces the static baseline. Card-only so
  // other sections resolving through this chokepoint are untouched.
  if (sectionKey === "card") {
    const forced = getCardVariantOverride();
    if (forced) {
      const off = forced === "off" || forced === "static" || forced === "none";
      return {
        timeline: { enabled: !off },
        trigger: { enabled: !off },
        animation: { variant: off ? "static" : forced },
      };
    }
  }

  const override = SECTION_OVERRIDES[sectionKey]?.[key];
  if (!override) return baseProfile;
  return { ...baseProfile, ...override };
}

/**
 * Read the `?cardVariant=` dev override from the URL, if present.
 * Returns the raw variant string (e.g. 'clip', 'throw', 'off') or null.
 * SSR/build-safe: returns null when there is no window.
 */
function getCardVariantOverride() {
  if (typeof window === "undefined" || !window.location) return null;
  const v = new URLSearchParams(window.location.search).get("cardVariant");
  return v ? v.trim() : null;
}
