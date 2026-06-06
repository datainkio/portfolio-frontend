/**
 * Slide Atom
 *
 * Translates a target along an axis. Combine with fade for a lift-and-fade effect.
 * Returns an unstarted tween — the caller is responsible for playing it.
 *
 * @example
 * const tween = slideIn(el, { distance: -motion.distance('md') });
 * tl.add(tween, '<');
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion/motion.js";

/**
 * @param {Element|Element[]} target
 * @param {{ axis?: 'y'|'x'|'yPercent'|'xPercent', distance?: number, duration?: number, ease?: string, delay?: number }} [opts]
 * @returns {gsap.core.Tween}
 */
export function slideIn(target, opts = {}) {
  const axis = opts.axis ?? "y";
  const distance = opts.distance ?? -motion.distance("md");
  return gsap.fromTo(
    target,
    { [axis]: distance },
    {
      [axis]: 0,
      duration: opts.duration ?? motion.duration("base") / 1000,
      ease: opts.ease ?? motion.ease("enter"),
      delay: opts.delay ?? 0,
      overwrite: "auto",
    }
  );
}

/**
 * @param {Element|Element[]} target
 * @param {{ axis?: 'y'|'x'|'yPercent'|'xPercent', distance?: number, duration?: number, ease?: string, delay?: number }} [opts]
 * @returns {gsap.core.Tween}
 */
export function slideOut(target, opts = {}) {
  const axis = opts.axis ?? "y";
  const distance = opts.distance ?? -motion.distance("md");
  return gsap.to(target, {
    [axis]: distance,
    duration: opts.duration ?? motion.duration("base") / 1000,
    ease: opts.ease ?? motion.ease("exit"),
    delay: opts.delay ?? 0,
    overwrite: "auto",
  });
}
