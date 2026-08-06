import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";

/**
 * Process Section Gel
 *
 * Anchors the `gel_process` gel behind the entire process section as a
 * full-bleed band: viewport width, the section's own height, at the section's
 * viewport y. Mirrors bio-motion/heading-gel.js's strategy, scoped to the whole
 * section root instead of a single heading element.
 *
 * The gel lives in `#sizzle-background` (`fixed inset-0`), so an absolutely
 * positioned child resolves against the viewport — `top` is the section's raw
 * getBoundingClientRect().top, with no scroll offset added. The fixed container
 * already holds the gel in the viewport, so the gel is never ScrollTrigger-
 * pinned — a pin would be redundant on an element that cannot scroll. The
 * ScrollTrigger below only re-syncs `top` as the section moves past it.
 *
 * GelAnimationManager parks every gel at autoAlpha 0 on init, so making this one
 * visible is an explicit step here.
 */

const SECTION_GEL_ID = "gel_process";
const SYNC_ST_ID = "process-section-gel-sync";

/**
 * @param {HTMLElement|null} view Process section root.
 * @param {object|null} gelManager GelAnimationManager instance.
 * @returns {ScrollTrigger|null} The sync trigger, or null when unavailable.
 */
export function attachSectionGel(view, gelManager) {
  const gel = gelManager?.getGel?.(SECTION_GEL_ID) ?? null;
  if (!gel?.view || !view) return null;

  const el = gel.view;
  let lastHeight = null;

  const sync = () => {
    const rect = view.getBoundingClientRect();
    if (!rect.height) return;

    gsap.set(el, {
      left: 0,
      top: rect.top,
      width: "100vw",
      height: rect.height,
      // Neutralize any transform left by another variant/arrangement — the band
      // is positioned purely by left/top/width/height.
      x: 0,
      y: 0,
      xPercent: 0,
      yPercent: 0,
      scaleX: 1,
      scaleY: 1,
      transformOrigin: "center center",
      autoAlpha: 1,
    });

    // The SVG mask is measured from the element box, so it only needs rebuilding
    // when the box actually resizes — not on every scroll tick.
    if (rect.height !== lastHeight) {
      lastHeight = rect.height;
      gel.refresh();
    }
  };

  // Idempotent across rebuilds (matchMedia / resize re-invoke the variant): kill
  // the prior trigger before creating a fresh one so they don't stack.
  ScrollTrigger.getById(SYNC_ST_ID)?.kill();

  sync();

  return ScrollTrigger.create({
    id: SYNC_ST_ID,
    trigger: view,
    start: "top bottom",
    end: "bottom top",
    onUpdate: sync,
    onRefresh: sync,
    onToggle: sync,
  });
}
