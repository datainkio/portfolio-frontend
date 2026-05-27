/**
 * Parallax Atom
 *
 * Applies a scroll-scrubbed parallax translation to a target element.
 * This atom owns a ScrollTrigger because scrub is intrinsic to the effect —
 * unlike other atoms, the returned tween carries an embedded ScrollTrigger.
 *
 * Kill the returned tween to also kill its ScrollTrigger.
 *
 * @example
 * const tween = parallaxScrub(headerImageEl, {
 *   yPercent: -15,
 *   trigger: headerEl,
 * });
 * // on destroy: tween.kill();
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";

/**
 * @param {Element} target
 * @param {{
 *   yPercent?: number,
 *   xPercent?: number,
 *   ease?: string,
 *   trigger?: Element|string,
 *   start?: string,
 *   end?: string,
 *   scrub?: boolean|number,
 *   invalidateOnRefresh?: boolean
 * }} [opts]
 * @returns {gsap.core.Tween}
 */
export function parallaxScrub(target, opts = {}) {
  return gsap.to(target, {
    yPercent: opts.yPercent ?? -15,
    xPercent: opts.xPercent ?? 0,
    ease: opts.ease ?? "none",
    scrollTrigger: {
      trigger: opts.trigger ?? target,
      start: opts.start ?? "top top",
      end: opts.end ?? "bottom top",
      scrub: opts.scrub ?? true,
      invalidateOnRefresh: opts.invalidateOnRefresh ?? true,
    },
  });
}
