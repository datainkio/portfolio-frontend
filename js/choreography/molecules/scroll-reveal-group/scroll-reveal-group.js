/**
 * Scroll-Reveal-Group Molecule
 *
 * Encapsulates the viewport-threshold item reveal pattern used by Awards
 * and Organizations sections. Tracks which items have already been revealed
 * and fires a staggered tween for newly in-range items on each update().
 *
 * Usage:
 *   const group = createScrollRevealGroup(items, { viewportRatio: 0.5, ... });
 *   // Call group.update() on each scroll event or requestAnimationFrame tick.
 *   // Call group.showAll() to instantly reveal all items (e.g., when reduced-motion
 *   // is active or when the section animation sequence completes early).
 *
 * @example
 * const group = createScrollRevealGroup(awardItems, {
 *   duration: motion.duration('slow') / 1000,
 *   ease: motion.ease('enter'),
 *   y: -motion.distance('md'),
 * });
 * scrollTrigger.onUpdate = () => group.update();
 */

import { gsap } from "/assets/js/choreography/system/gsap.js";
import { staggerReveal } from "../../atoms/stagger-reveal/stagger-reveal.js";
import { motion } from "../../config/ix/motion/motion.js";

/**
 * @param {Element[]} items
 * @param {{
 *   viewportRatio?: number,
 *   duration?: number,
 *   ease?: string,
 *   stagger?: number,
 *   y?: number,
 * }} [opts]
 * @returns {{ update(): void, showAll(): void }}
 */
export function createScrollRevealGroup(items, opts = {}) {
  if (!Array.isArray(items) || items.length === 0) {
    return { update() {}, showAll() {} };
  }

  const revealed = new WeakSet();
  const viewportRatio = opts.viewportRatio ?? 0.5;
  const clampedRatio = Math.min(0.95, Math.max(0.05, viewportRatio));
  const tweenOpts = {
    duration: opts.duration ?? motion.duration("base") / 1000,
    ease: opts.ease ?? motion.ease("enter"),
    stagger: opts.stagger ?? motion.stagger("base"),
  };

  // Set initial hidden state for all items.
  gsap.set(items, { autoAlpha: 0, y: opts.y ?? -motion.distance("md") });

  return {
    /**
     * Reveal any items that have scrolled into the threshold. Call this
     * on scroll events or within a ScrollTrigger onUpdate callback.
     */
    update() {
      const viewportHeight =
        window.innerHeight || document.documentElement?.clientHeight || 0;
      if (!viewportHeight) return;

      const threshold = viewportHeight * clampedRatio;

      items.forEach((item) => {
        if (revealed.has(item)) return;
        const itemTop = item.getBoundingClientRect().top;
        if (itemTop > threshold) return;

        revealed.add(item);
        staggerReveal([item], tweenOpts);
      });
    },

    /** Instantly reveal all items, bypassing the threshold check. */
    showAll() {
      items.forEach((item) => revealed.add(item));
      gsap.set(items, { autoAlpha: 1, y: 0 });
    },
  };
}
