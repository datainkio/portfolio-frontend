/**
 * Video-Reveal Molecule
 *
 * Fade reveal for the fullscreen background video element.
 * Returns a pre-built, unpaused timeline so the caller (BackgroundVideoAnimations)
 * can register it with AbstractSectionAnimations._registerTimeline, which pauses it.
 *
 * @example
 * const { intro } = createVideoReveal(videoEl, {
 *   duration: this.options.duration,
 * });
 * this._registerTimeline(TIMELINE_IDS.intro, intro);
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion/motion.js";

/**
 * @param {Element|Element[]} target - Video element(s) to reveal
 * @param {{
 *   duration?: number,
 *   ease?: string
 * }} [opts]
 * @returns {{ intro: gsap.core.Timeline }}
 */
export function createVideoReveal(target, opts = {}) {
  const targets = Array.isArray(target) ? target.filter(Boolean) : [target].filter(Boolean);
  const duration = opts.duration ?? motion.duration("base") / 1000;

  const intro = gsap.timeline();

  if (targets.length) {
    intro
      .fromTo(targets, { autoAlpha: 0 }, { autoAlpha: 1, duration })
      .to(targets, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration,
      });
  }

  return { intro };
}
