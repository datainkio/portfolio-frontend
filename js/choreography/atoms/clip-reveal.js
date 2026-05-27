/**
 * Clip-Reveal Atom
 *
 * Reveals or conceals a target using CSS clip-path inset.
 * GPU-composited — no layout thrashing. Suitable for card figures and fullscreen panels.
 * Returns an unstarted tween — the caller is responsible for playing it.
 *
 * Clip direction (clipEdge) controls which edge the wipe travels from:
 *   'bottom' — reveals top-down (default, suits upward-scroll reveals)
 *   'top'    — reveals bottom-up
 *   'right'  — reveals left-to-right
 *   'left'   — reveals right-to-left
 *
 * @example
 * const tween = clipRevealIn(figureEl, { clipEdge: 'bottom' });
 * tl.add(tween, '>');
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../config/ix/motion/motion.js";

const CLIP_HIDDEN = {
  bottom: "inset(0 0 100% 0)",
  top: "inset(100% 0 0 0)",
  right: "inset(0 100% 0 0)",
  left: "inset(0 0 0 100%)",
};
const CLIP_VISIBLE = "inset(0 0 0% 0)";

/**
 * @param {Element|Element[]} target
 * @param {{ clipEdge?: 'bottom'|'top'|'right'|'left', duration?: number, ease?: string, delay?: number }} [opts]
 * @returns {gsap.core.Tween}
 */
export function clipRevealIn(target, opts = {}) {
  const edge = opts.clipEdge ?? "bottom";
  return gsap.fromTo(
    target,
    { clipPath: CLIP_HIDDEN[edge] },
    {
      clipPath: CLIP_VISIBLE,
      duration: opts.duration ?? motion.duration("slow") / 1000,
      ease: opts.ease ?? motion.ease("enter"),
      delay: opts.delay ?? 0,
      overwrite: "auto",
    }
  );
}

/**
 * @param {Element|Element[]} target
 * @param {{ clipEdge?: 'bottom'|'top'|'right'|'left', duration?: number, ease?: string, delay?: number }} [opts]
 * @returns {gsap.core.Tween}
 */
export function clipRevealOut(target, opts = {}) {
  const edge = opts.clipEdge ?? "bottom";
  return gsap.to(target, {
    clipPath: CLIP_HIDDEN[edge],
    duration: opts.duration ?? motion.duration("slow") / 1000,
    ease: opts.ease ?? motion.ease("exit"),
    delay: opts.delay ?? 0,
    overwrite: "auto",
  });
}
