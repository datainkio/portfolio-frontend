/**
 * ScrollTrigger Default Configuration
 *
 * Base settings for GSAP ScrollTrigger instances.
 */
export const SCROLL_DEFAULTS = {
  start: "top 1%",
  end: "bottom 99%",
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
  id: "hero",
  // start: "top 5", // Assumes that the hero section is the first section in the page.
  // end: "bottom 85%",
  // toggleActions: "none reverse play play",
};

/**
 * Bio Reveal Trigger Defaults
 */
export const BIO_TRIGGER = {
  id: "bio",
  markers: false,
};
