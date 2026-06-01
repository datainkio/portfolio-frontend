/**
 * Scale Atom
 *
 * Collapses or reveals a target by scaling along Y (or X).
 * Defaults to top-center origin — suited for gel/background collapse effects.
 * Returns an unstarted tween — the caller is responsible for playing it.
 *
 * @example
 * const tween = scaleCollapse(gel.view, { transformOrigin: 'top center' });
 * tl.add(tween, 0);
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion/motion.js";

/**
 * @param {Element|Element[]} target
 * @param {{ axis?: 'scaleY'|'scaleX'|'scale', transformOrigin?: string, duration?: number, ease?: string, delay?: number }} [opts]
 * @returns {gsap.core.Tween}
 */
export function scaleCollapse(target, opts = {}) {
  const axis = opts.axis ?? "scaleY";
  return gsap.to(target, {
    [axis]: 0,
    transformOrigin: opts.transformOrigin ?? "top center",
    duration: opts.duration ?? motion.duration("base") / 1000,
    ease: opts.ease ?? "none",
    delay: opts.delay ?? 0,
    overwrite: "auto",
  });
}

/**
 * @param {Element|Element[]} target
 * @param {{ axis?: 'scaleY'|'scaleX'|'scale', transformOrigin?: string, duration?: number, ease?: string, delay?: number }} [opts]
 * @returns {gsap.core.Tween}
 */
export function scaleReveal(target, opts = {}) {
  const axis = opts.axis ?? "scaleY";
  return gsap.fromTo(
    target,
    { [axis]: 0, transformOrigin: opts.transformOrigin ?? "top center" },
    {
      [axis]: 1,
      transformOrigin: opts.transformOrigin ?? "top center",
      duration: opts.duration ?? motion.duration("base") / 1000,
      ease: opts.ease ?? motion.ease("enter"),
      delay: opts.delay ?? 0,
      overwrite: "auto",
    }
  );
}
