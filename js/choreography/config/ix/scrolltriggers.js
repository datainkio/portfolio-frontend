/**
 * ScrollTrigger Default Configuration
 *
 * Base settings for GSAP ScrollTrigger instances.
 */
import { SELECTORS } from "../contracts/selectors.js";
export const SCROLL_DEFAULTS = {
  start: "bottom 99%",
  end: "top 1%",
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
  toggleActions: "play none none none",
  markers: false,
};

/**
 * Hero Trigger Defaults
 */
export const HERO_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.hero,
};

/**
 * Bio Trigger Defaults
 */
export const BIO_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.bio,
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
 * Projects Trigger Defaults
 */
export const PROJECTS_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.projects,
};

/**
 * Background Trigger Defaults
 */
export const BACKGROUND_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.background,
};
