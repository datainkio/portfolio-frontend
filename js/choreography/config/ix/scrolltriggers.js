/**
 * ScrollTrigger Default Configuration
 *
 * Base settings for GSAP ScrollTrigger instances.
 */
import { SELECTORS } from "../contracts/selectors.js";
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
 * Hero Trigger Defaults
 */
export const HERO_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.hero,
  once: false,
  start: "top top",
  end: "bottom top",
  pinSpacing: false,
  pin: true,
  scrub: true,
  fastScrollEnd: false,
  toggleActions: "none none none none",
};

/**
 * Bio Trigger Defaults
 */
export const BIO_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.bio,
  once: false,
  start: "top top",
  end: "bottom center",
  pinSpacing: false,
  pin: true,
  scrub: true,
  fastScrollEnd: false,
  toggleActions: "none none none none",
};

/**
 * Awards Trigger Defaults
 */
export const AWARDS_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.awards,
};

/**
 * Organizations Trigger Defaults
 */
export const ORGANIZATIONS_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.organizations,
};

/**
 * Work Trigger Defaults
 */
export const WORK_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.work,
};

/**
 * Work Industry Header Pin Defaults
 *
 * Controls stacked pinning for industry headers beneath the pinned Work header.
 */
export const WORK_INDUSTRY_HEADER_PIN = {
  ...SCROLL_DEFAULTS,
  id: `${SELECTORS.work}-industry-header-pin`,
  pin: true,
  pinSpacing: false,
  // Extra space beneath the pinned Work header.
  offsetPx: 24,
};

/**
 * @deprecated Use WORK_TRIGGER instead.
 */
export const PROJECTS_TRIGGER = WORK_TRIGGER;

/**
 * Background Trigger Defaults
 */
export const BACKGROUND_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.background,
};

/**
 * Card Figure Clip Trigger Defaults
 *
 * Drives a clip-path scrub on the card figure element.
 * The figure stays in document flow; clip-path handles the visual reveal.
 * GPU-composited — no layout or paint work during scroll.
 */
export const CARD_FIGURE_CLIP_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: "card-figure-clip",
  // once: false overrides SCROLL_DEFAULTS so the clip reverses on scroll-back
  pin: true,
  pinSpacing: true,
  once: false,
  start: "top top",
  scrub: true,
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
