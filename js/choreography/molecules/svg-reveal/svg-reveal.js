/**
 * SVG-Reveal Molecule
 *
 * Reveals an inline SVG one top-level `<g>` at a time, in DOM order. Groups
 * are hidden on build; the returned timeline is paused and owned by the caller.
 *
 * Usage:
 *   const reveal = buildSvgReveal(svg);
 *   // Play reveal.timeline from a trigger, or call reveal.showAll() to show
 *   // every group instantly (the reduced-motion path — the caller decides).
 *
 * @example
 * const reveal = buildSvgReveal(svg, { stagger: motion.stagger("slow") });
 * if (reveal) reducedMotion ? reveal.showAll() : reveal.timeline.play();
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";
import { fadeIn } from "../../atoms/fade/fade.js";
import { motion } from "../../config/ix/motion.js";

/**
 * @param {SVGSVGElement|null} svg
 * @param {{ duration?: number, ease?: string, stagger?: number }} [opts]
 * @returns {{ timeline: gsap.core.Timeline, showAll(): void } | null}
 */
export function buildSvgReveal(svg, opts = {}) {
  if (!svg) return null;

  const groups = Array.from(svg.querySelectorAll(":scope > g"));
  if (groups.length === 0) return null;

  const duration = opts.duration ?? motion.duration("base") / 1000;
  const ease = opts.ease ?? motion.ease("enter");
  const stagger = opts.stagger ?? motion.stagger("base");

  // Set initial hidden state for all groups.
  gsap.set(groups, { autoAlpha: 0 });

  const timeline = gsap.timeline({ paused: true });
  groups.forEach((group, index) => {
    timeline.add(fadeIn(group, { duration, ease }), index * stagger);
  });

  return {
    timeline,

    /** Instantly reveal all groups (reduced-motion path). */
    showAll() {
      gsap.set(groups, { autoAlpha: 1 });
    },
  };
}
