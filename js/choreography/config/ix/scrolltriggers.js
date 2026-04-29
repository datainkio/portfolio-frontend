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
  onEnter: () => {},
  onLeave: () => {},
  onEnterBack: () => {},
  onLeaveBack: () => {},
  onRefresh: () => {},
  onUpdate: () => {},
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
  end: "+=300",
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
