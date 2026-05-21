/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.animator
 *   role: Frontend runtime module: js/displays/blockframes/Animator.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - displays
 *     - blockframes
 * ---
 */
/**
 * @fileoverview Animator - GSAP animation presets for blockframes
 *
 * CRITICAL: This module provides animation presets for blockframes elements.
 * All animations use GSAP timelines for fine-grained control.
 *
 * GSAP DEPENDENCY:
 * - Imports GSAP core library (named export pattern)
 * - Uses gsap.timeline() for animation sequencing
 * - Returns timeline objects for external control (play, pause, reverse, etc.)
 *
 * CURRENT ANIMATIONS:
 * - wipe(): Horizontal marquee/wipe effect with infinite loop
 *
 * EXTENDING:
 * Add new animation functions following this pattern:
 * 1. Calculate dimensions/positions from block and parent
 * 2. Create gsap.timeline() with options
 * 3. Add animation tweens (from, to, fromTo)
 * 4. Return timeline for external control
 *
 * @example
 * import * as Animator from './Animator.js';
 *
 * const block = document.querySelector('.Card');
 * const timeline = Animator.wipe(block);
 * // Timeline auto-starts, or control manually:
 * // timeline.pause();
 * // timeline.play();
 */

import { gsap } from "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js";

/**
 * Creates a horizontal wipe/marquee animation for a block element
 *
 * ANIMATION BEHAVIOR:
 * - Block starts off-screen right (x = parent width)
 * - Block is fully transparent (opacity: 0)
 * - Animates to off-screen left (x = -block width)
 * - Fades to fully opaque (opacity: 1) during movement
 * - Repeats infinitely (repeat: -1)
 * - Duration: 2 seconds per cycle
 *
 * COORDINATE SYSTEM:
 * Uses parent SVG's bounding rect as reference frame.
 * Positions are calculated relative to viewport, not SVG coordinates.
 *
 * WARNING: Animation loops infinitely by default. To stop:
 * - const timeline = Animator.wipe(block);
 * - timeline.pause(); // Stop
 * - timeline.kill();  // Destroy completely
 *
 * BUG NOTE: Parent height calculation uses width (typo on line ph).
 * This doesn't affect horizontal wipe but would break vertical animations.
 *
 * @param {SVGElement} block - The SVG element to animate
 *
 * @returns {gsap.core.Timeline|undefined} GSAP timeline (currently commented out)
 *
 * @example
 * const card = blockframes.getBlock('.Card');
 * const timeline = Animator.wipe(card);
 *
 * // Stop after 5 seconds
 * setTimeout(() => timeline.pause(), 5000);
 *
 * @example
 * // Reverse animation direction
 * const timeline = Animator.wipe(card);
 * timeline.timeScale(-1); // Play backwards
 */
export function wipe(block) {
  const parent = block.ownerSVGElement;
  const pw = parent.getBoundingClientRect().width;
  const ph = parent.getBoundingClientRect().width; // BUG: Should be .height for vertical animations
  const w = block.getBoundingClientRect().width;
  const tl = gsap.timeline({});
  tl.fromTo(
    block,
    { opacity: 0, x: pw },
    { opacity: 1, x: 0 - w, duration: 2, repeat: -1 },
  );
  // tl.to(block, { duration: 2, opacity: 0, yoyo: true, repeat: -1 }); // Alternative: fade animation
  // return tl; // TODO: Uncomment to enable external timeline control
}
