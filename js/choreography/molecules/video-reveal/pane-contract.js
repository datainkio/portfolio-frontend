/**
 * Pane-Contract Molecule
 *
 * The landing cover for the background video: a sheet clipped away right to
 * left, and colour panes that each shrink toward their transform origin (the
 * left edge) and are left hidden. Both factories return UNSTARTED timelines for
 * the caller to compose; both return an empty timeline when there is nothing to
 * animate. Nothing here shows the sheet or panes: the caller stages them.
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motionTokens } from "../../config/ix/motion.js";

const toTargets = (target) =>
  (Array.isArray(target) ? target : [target]).filter(Boolean);

/**
 * Clip the sheet away right to left, then hide it. The right inset grows, so the
 * visible part shrinks toward the left edge and its right edge travels right to
 * left. Clip-path, not scaleX: scaling would squash the graph-paper pattern.
 * `immediateRender: false`, so building never touches the sheet.
 *
 * @param {Element|null} sheet
 * @param {{ duration: number, ease: string }} opts
 * @returns {gsap.core.Timeline}
 */
export function buildSheetWipe(sheet, { duration, ease } = {}) {
  const wipe = gsap.timeline();

  if (sheet) {
    wipe.fromTo(
      sheet,
      { clipPath: "inset(0% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 100% 0% 0%)",
        duration,
        ease,
        immediateRender: false,
      },
    );
    wipe.set(sheet, {
      autoAlpha: motionTokens.opacity.zero,
      clearProps: "clipPath",
    });
  }

  return wipe;
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
