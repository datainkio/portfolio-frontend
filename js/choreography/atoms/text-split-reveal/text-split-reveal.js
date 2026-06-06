/**
 * Text Split-Reveal Atom
 *
 * Splits an element's text into words using GSAP SplitText, then animates
 * each word in as a staggered fromTo. Returns both the timeline and the split
 * instance so the caller can revert the DOM split on cleanup.
 *
 * The returned timeline is paused at 0 — the caller must play it.
 *
 * @example
 * const { timeline, split } = splitWordReveal(taglineEl, {
 *   wordsClass: 'block w-full',
 * });
 * tl.add(timeline, '>');
 * // on destroy: split.revert();
 */

import { gsap, SplitText } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion/motion.js";
import { HERO_LANDING } from "../../config/ix/motion/motion.js";

/**
 * @param {Element} target - Single element whose text will be split
 * @param {{
 *   wordsClass?: string,
 *   from?: object,
 *   to?: object,
 *   duration?: number,
 *   ease?: string,
 *   stagger?: number
 * }} [opts]
 * @returns {{ timeline: gsap.core.Timeline, split: SplitText }}
 */
export function splitWordReveal(target, opts = {}) {
  const split = new SplitText(target, {
    type: "words",
    wordsClass: opts.wordsClass ?? "block w-full",
  });

  const fromVars = opts.from ?? { ...HERO_LANDING.from };
  const toVars = {
    ...HERO_LANDING.to,
    duration: opts.duration ?? motion.duration("base") / 1000,
    ease: opts.ease ?? motion.ease("enter"),
    stagger: opts.stagger ?? motion.stagger("base"),
    ...opts.to,
  };

  const timeline = gsap.timeline().fromTo(split.words, fromVars, toVars);
  timeline.pause(0);

  return { timeline, split };
}
