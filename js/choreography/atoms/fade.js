/**
 * Fade Atom
 *
 * Fade a target in or out using autoAlpha (visibility + opacity combined).
 * Returns an unstarted tween — the caller is responsible for playing it.
 *
 * @example
 * const tween = fadeIn(el, { duration: motion.duration('slow') / 1000 });
 * tl.add(tween, '>');
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../config/ix/motion/motion.js";

/**
 * @param {Element|Element[]} target
 * @param {{ duration?: number, ease?: string, delay?: number, from?: object }} [opts]
 * @returns {gsap.core.Tween}
 */
export function fadeIn(target, opts = {}) {
  return gsap.fromTo(
    target,
    { autoAlpha: 0, ...opts.from },
    {
      autoAlpha: 1,
      duration: opts.duration ?? motion.duration("base") / 1000,
      ease: opts.ease ?? motion.ease("enter"),
      delay: opts.delay ?? 0,
      overwrite: "auto",
    }
  );
}

/**
 * @param {Element|Element[]} target
 * @param {{ duration?: number, ease?: string, delay?: number }} [opts]
 * @returns {gsap.core.Tween}
 */
export function fadeOut(target, opts = {}) {
  return gsap.to(target, {
    autoAlpha: 0,
    duration: opts.duration ?? motion.duration("base") / 1000,
    ease: opts.ease ?? motion.ease("exit"),
    delay: opts.delay ?? 0,
    overwrite: "auto",
  });
}
