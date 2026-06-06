/**
 * Stagger-Reveal Atom
 *
 * Animates a list of targets from hidden (autoAlpha 0, y offset) to visible,
 * staggered across items. Used as the tween half of scroll-threshold reveal
 * patterns — the viewport-gate logic lives in molecules/scroll-reveal-group.
 *
 * Returns an unstarted tween — the caller is responsible for playing it.
 *
 * @example
 * const tween = staggerReveal(items, { stagger: motion.stagger('loose') });
 * gsap.add(tween);
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion/motion.js";

/**
 * @param {Element[]} targets
 * @param {{
 *   y?: number,
 *   duration?: number,
 *   ease?: string,
 *   stagger?: number,
 *   delay?: number
 * }} [opts]
 * @returns {gsap.core.Tween}
 */
export function staggerReveal(targets, opts = {}) {
  return gsap.to(targets, {
    autoAlpha: 1,
    y: 0,
    duration: opts.duration ?? motion.duration("base") / 1000,
    ease: opts.ease ?? motion.ease("enter"),
    stagger: opts.stagger ?? motion.stagger("base"),
    delay: opts.delay ?? 0,
    overwrite: "auto",
  });
}
