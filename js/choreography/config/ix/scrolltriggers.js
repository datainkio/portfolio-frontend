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
