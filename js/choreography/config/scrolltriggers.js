/**
 * ScrollTrigger Default Configuration
 *
 * Base settings for GSAP ScrollTrigger instances.
 */
export const SCROLL_DEFAULTS = {
  start: "top top",
  end: "bottom 85%",
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
  // markers: true,
  // scrub: true,
  // toggleActions: "none reverse play play",
};

/**
 * Bio Reveal Trigger Defaults
 */
export const BIO_TRIGGER = {
  id: "bio",
  markers: false,
};
