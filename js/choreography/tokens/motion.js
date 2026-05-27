/**
 * Motion Design Tokens
 *
 * Primitive motion values for the choreography system.
 * All higher-level constants and profiles in config/ix/motion/motion.js derive from these.
 *
 * Units:
 *   duration  — milliseconds (converted to seconds by consumer helpers)
 *   distance  — pixels
 *   blur      — pixels
 *   stagger   — seconds (GSAP native)
 *   opacity   — 0–1
 */

export const motionTokens = {
  duration: {
    instant: 80,
    fast: 150,
    base: 220,
    slow: 320,
    slower: 480,
  },

  ease: {
    standard: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    enter: "cubic-bezier(0.0, 0.0, 0.2, 1)",
    exit: "cubic-bezier(0.4, 0.0, 1, 1)",
    emphasis: "cubic-bezier(0.3, 0.0, 0.2, 1.1)",
    springy: "cubic-bezier(0.2, 0.8, 0.2, 1.4)",
  },

  distance: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40,
  },

  stagger: {
    none: 0,
    tight: 0.05,
    base: 0.1,
    loose: 0.12,
  },

  opacity: {
    zero: 0,
    subtle: 0.05,
    low: 0.15,
    mid: 0.5,
    high: 0.85,
    full: 1,
  },

  blur: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 16,
    xl: 32,
  },

  zLayer: {
    base: 0,
    content: 10,
    overlay: 20,
    modal: 30,
    toast: 40,
  },
};
