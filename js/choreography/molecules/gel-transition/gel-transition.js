/**
 * Gel-Transition Molecule
 *
 * Wraps GelAnimationManager.applyArrangement() with token-sourced defaults
 * and a stable molecule-layer interface. Used by LandingSequence and any
 * template/organism that needs to transition the background gel composition.
 *
 * @example
 * await createGelTransition(gelManager, GEL_ARRANGEMENTS.hero);
 * await createGelTransition(gelManager, GEL_ARRANGEMENTS.awards, { duration: 1.2 });
 */

import { GEL_ARRANGEMENT_TRANSITION } from "../../config/index/index.js";
import { motion } from "../../config/ix/motion/motion.js";

/**
 * @param {object} gelManager - GelAnimationManager instance (must expose applyArrangement)
 * @param {object} arrangement - Gel arrangement config object from config/displays/arrangements
 * @param {{
 *   duration?: number,
 *   ease?: string
 * }} [opts]
 * @returns {Promise<void>}
 */
export function createGelTransition(gelManager, arrangement, opts = {}) {
  if (!gelManager?.applyArrangement) return Promise.resolve();

  const transitionOpts = {
    duration: opts.duration ?? GEL_ARRANGEMENT_TRANSITION.duration,
    ease: opts.ease ?? GEL_ARRANGEMENT_TRANSITION.ease ?? motion.ease("standard"),
  };

  return gelManager.applyArrangement(arrangement, transitionOpts);
}
