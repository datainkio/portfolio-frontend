/**
 * Video-Reveal Molecule
 *
 * Fade reveal for the fullscreen background video element.
 *
 * Two phases, so the video is never visible before its reveal:
 * - `init` builds the LANDING timeline: an instant hidden resting state.
 * - `buildIntro` builds the INTRO timeline: the fade into view.
 *
 * Both are returned unstarted; the caller (BackgroundVideoAnimations) registers
 * them with AbstractSectionAnimations._registerTimeline, which pauses them at 0.
 * That render of the intro's `fromTo` start values also guarantees the hidden
 * state is applied at construction, before the preloader exits.
 *
 * @example
 * const { landing, intro } = createVideoReveal(videoEl, {
 *   duration: this.options.duration,
 *   ease: this.options.ease.in,
 * });
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motion, motionTokens } from "../../config/ix/motion.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";

const toTargets = (target) =>
  (Array.isArray(target) ? target : [target]).filter(Boolean);

/**
 * Hidden resting state — the landing phase.
 *
 * @param {Element|Element[]} target
 * @returns {gsap.core.Timeline}
 */
export function initVideoReveal(target) {
  const targets = toTargets(target);
  const landing = gsap.timeline({ id: TIMELINE_IDS.landing });

  if (targets.length) {
    landing.set(targets, { autoAlpha: motionTokens.opacity.zero });
  }

  return landing;
}

/**
 * Fade into view — the intro phase.
 *
 * @param {Element|Element[]} target
 * @param {{ duration?: number, ease?: string }} [opts]
 * @returns {gsap.core.Timeline}
 */
export function buildVideoIntro(target, opts = {}) {
  const targets = toTargets(target);
  const duration = opts.duration ?? motion.duration("base") / 1000;
  const ease = opts.ease ?? motion.ease("enter");

  const intro = gsap.timeline({ id: TIMELINE_IDS.intro });

  if (targets.length) {
    intro.fromTo(
      targets,
      { autoAlpha: motionTokens.opacity.zero },
      { autoAlpha: motionTokens.opacity.full, duration, ease },
    );
  }

  return intro;
}

/**
 * @param {Element|Element[]} target - Video element(s) to reveal
 * @param {{ duration?: number, ease?: string }} [opts]
 * @returns {{ landing: gsap.core.Timeline, intro: gsap.core.Timeline }}
 */
export function createVideoReveal(target, opts = {}) {
  return {
    landing: initVideoReveal(target),
    intro: buildVideoIntro(target, opts),
  };
}
