/**
 * Section-Header-Intro Molecule
 *
 * Animates a standard section header cluster (context, heading, body, list)
 * into and out of view. Used by Awards, Organizations, and any section that
 * follows the same [context → heading → body → list] layout pattern.
 *
 * Returns a pair of pre-built, paused timelines. The caller adds them to the
 * section's AbstractSectionAnimations._timelines registry (or plays them directly).
 *
 * @example
 * const { intro, outro } = createSectionHeaderIntro(
 *   [contextEl, headingEl, bodyEl, listEl],
 *   { duration: motion.duration('slower') / 1000, stagger: motion.stagger('loose') }
 * );
 * // Register with AbstractSectionAnimations:
 * this._registerTimeline(TIMELINE_IDS.intro, intro);
 * this._registerTimeline(TIMELINE_IDS.outro, outro);
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../config/ix/motion/motion.js";

/**
 * @param {Element[]} elements - Array of elements to animate (falsy values filtered out)
 * @param {{
 *   duration?: number,
 *   stagger?: number,
 *   ease?: { in?: string, out?: string },
 *   translateY?: number,
 *   timelineId?: string
 * }} [opts]
 * @returns {{ intro: gsap.core.Timeline, outro: gsap.core.Timeline }}
 */
export function createSectionHeaderIntro(elements, opts = {}) {
  const targets = elements.filter(Boolean);
  const duration = opts.duration ?? motion.duration("base") / 1000;
  const stagger = opts.stagger ?? motion.stagger("base");
  const translateY = opts.translateY ?? -motion.distance("md");
  const easeIn = opts.ease?.in ?? motion.ease("enter");
  const easeOut = opts.ease?.out ?? motion.ease("exit");

  const intro = gsap.timeline();
  const outro = gsap.timeline();

  if (targets.length) {
    gsap.set(targets, { autoAlpha: 0, y: translateY });

    intro
      .to(targets, {
        autoAlpha: 1,
        y: 0,
        duration,
        stagger,
        ease: easeIn,
      })
      .addPause();

    outro
      .to(targets, {
        autoAlpha: 0,
        y: translateY,
        duration,
        stagger,
        ease: easeOut,
      })
      .addPause();
  }

  return { intro, outro };
}
