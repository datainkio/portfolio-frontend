/**
 * Pane-Contract Molecule
 *
 * The landing panes for the background video: a veil that fades them in, and a
 * contraction that shrinks each toward its transform origin (the left edge) and
 * leaves them hidden. Both factories return UNSTARTED timelines for the caller
 * to compose; both return an empty timeline when there are no panes.
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motionTokens } from "../../config/ix/motion.js";

const toTargets = (target) =>
  (Array.isArray(target) ? target : [target]).filter(Boolean);

/**
 * Fade the panes in together, at full width.
 *
 * @param {Element[]} panes
 * @param {{ duration: number, ease: string, transformOrigin?: string }} opts
 * @returns {gsap.core.Timeline}
 */
export function buildPaneVeil(panes, { duration, ease, transformOrigin } = {}) {
  const targets = toTargets(panes);
  const veil = gsap.timeline();

  if (targets.length) {
    veil.fromTo(
      targets,
      {
        autoAlpha: motionTokens.opacity.zero,
        scaleX: 1,
        ...(transformOrigin ? { transformOrigin } : {}),
      },
      { autoAlpha: motionTokens.opacity.full, duration, ease },
    );
  }

  return veil;
}

/**
 * Contract each pane to scaleX 0 in DOM order, then hide them all so nothing
 * is left compositing over the video. scaleX stays at 0.
 *
 * @param {Element[]} panes
 * @param {{ duration: number, ease: string, stagger: number, transformOrigin: string }} opts
 * @returns {gsap.core.Timeline}
 */
export function buildPaneContract(
  panes,
  { duration, ease, stagger, transformOrigin } = {},
) {
  const targets = toTargets(panes);
  const contract = gsap.timeline();

  if (targets.length) {
    contract.fromTo(
      targets,
      { scaleX: 1, transformOrigin },
      {
        scaleX: 0,
        transformOrigin,
        duration,
        ease,
        stagger,
        immediateRender: false,
      },
    );
    contract.set(targets, { autoAlpha: motionTokens.opacity.zero });
  }

  return contract;
}
