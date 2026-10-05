/**
 * ScrollTrigger Default Configuration
 *
 * Base settings for GSAP ScrollTrigger instances. Section trigger configs
 * (HERO_TRIGGER, AWARDS_TRIGGER, ORGANIZATIONS_TRIGGER, …) spread this and live
 * in each organism's *Triggers.js.
 */
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
