/**
 * ScrollTrigger Default Configuration
 *
 * Base settings for GSAP ScrollTrigger instances.
 */
import { SELECTORS } from "../contracts/selectors/selectors.js";
export const SCROLL_DEFAULTS = {
  start: "top center",
  end: "bottom center",
  pinSpacing: false,
  once: true,
  scrub: false,
  snap: false,
  pin: false,
  anticipatePin: 0,
  invalidateOnRefresh: true,
  fastScrollEnd: true,
  toggleActions: "play pause pause pause",
  markers: false,
};

/**
 * Organizations Trigger Defaults
 */
export const ORGANIZATIONS_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.organizations,
};

/**
 * Background Trigger Defaults
 */
export const BACKGROUND_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.background,
};

/**
 * Compose a ScrollTrigger config from a base config and a resolved motion profile.
 *
 * Applies the profile's trigger channel capability flags (scrub, pin, once,
 * invalidateOnRefresh) over the base config. Geometry values (start, end, trigger,
 * id) remain from the base config and are never overridden.
 *
 * This is an opt-in utility. Existing trigger consts are unchanged; call this
 * where you want profile-aware composition at the section trigger level.
 *
 * @param {Object} baseTriggerConfig - Section-specific base trigger config
 * @param {Object} motionProfile     - Resolved profile from resolveSectionMotionProfile
 * @returns {Object} Composed ScrollTrigger config
 */
export function composeScrollTrigger(baseTriggerConfig, motionProfile) {
  const { scrub, pin, once, invalidateOnRefresh } =
    motionProfile?.trigger ?? {};
  return {
    ...baseTriggerConfig,
    ...(scrub !== undefined && { scrub }),
    ...(pin !== undefined && { pin }),
    ...(once !== undefined && { once }),
    ...(invalidateOnRefresh !== undefined && { invalidateOnRefresh }),
  };
}
