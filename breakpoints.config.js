/** @format */
/**
 * Single source of truth for the site's responsive breakpoints. Imported by
 * both tailwind.config.js (CSS layout breakpoints) and
 * js/choreography/config/ix/breakpoints.js (GSAP matchMedia breakpoints) so
 * the two can never drift out of sync — a breakpoint change here propagates
 * to both the Tailwind build and the choreography bundle automatically.
 */
export const SCREENS = Object.freeze({
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
});
