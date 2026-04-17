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
  once: false,
  scrub: false,
  snap: false,
  pin: false,
  anticipatePin: 0,
  invalidateOnRefresh: true,
  fastScrollEnd: true,
  toggleActions: "play reverse play reverse",
  markers: false,
};

/**
 * Hero Trigger Defaults
 */
export const HERO_TRIGGER = {
  id: SELECTORS.hero,
  // start: "top 5", // Assumes that the hero section is the first section in the page.
  // end: "bottom 85%",
  // toggleActions: "none reverse play play",
};

/**
 * Bio Trigger Defaults
 */
export const BIO_TRIGGER = {
  id: SELECTORS.bio,
  markers: false,
};

/**
 * Awards Trigger Defaults
 */
export const AWARDS_TRIGGER = {
  id: SELECTORS.awards,
  markers: false,
};
