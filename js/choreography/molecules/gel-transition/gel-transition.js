/**
 * Gel-Transition Molecule
 *
 * Wraps GelAnimationManager.applyArrangement() with token-sourced defaults
 * and a stable molecule-layer interface. Used by LandingSequence and any
 * template/organism that needs to transition the background gel composition.
 *
 * @example
 * await createGelTransition(gelManager, arrangement);
 * await createGelTransition(gelManager, arrangement, { duration: 1.2 });
 */

import { motion } from "../../config/ix/motion/motion.js";

/**
 * @param {object} gelManager - GelAnimationManager instance (must expose applyArrangement)
 * @param {object} arrangement - Gel arrangement config object ({ id, gels: Record<string, rect> })
 * @param {{
 *   duration?: number,
 *   ease?: string
 * }} [opts]
 * @returns {Promise<void>}
 */
export function createGelTransition(gelManager, arrangement, opts = {}) {
  if (!gelManager?.applyArrangement) return Promise.resolve();

  const transitionOpts = {
    duration: opts.duration ?? 0.8,
    ease: opts.ease ?? motion.ease("standard"),
  };

  return gelManager.applyArrangement(arrangement, transitionOpts);
}
