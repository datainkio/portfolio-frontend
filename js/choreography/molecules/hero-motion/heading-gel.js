import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";

/**
 * Hero Heading Gel
 *
 * Holds the `gel_hero` gel as a full-bleed band filling the viewport: `left: 0 /
 * top: 0 / width: 100vw / height: 100vh`.
 *
 * The band is **decoupled from scroll.** It takes no geometry from the hero
 * header (or any other element) and does not track anything as the page moves —
 * it is a standing background plane, re-measured only when the viewport itself
 * resizes. Earlier revisions re-read the header's `getBoundingClientRect()` on
 * every scroll tick and rewrote `top` to follow it; that coupling is gone, and
 * with it the per-tick layout read.
 *
 * The gel lives in `#sizzle-background` (`fixed inset-0`), so an absolutely
 * positioned child already resolves against the viewport — filling that
 * container is all "full-bleed" requires, and no scroll offset is ever added.
 * The gel is never ScrollTrigger-pinned: a pin would be redundant on an element
 * that cannot scroll.
 *
 * GelAnimationManager parks every gel at autoAlpha 0 on init, so making this one
 * visible is an explicit step here.
 */

export const HEADING_GEL_ID = "gel_hero";
const SYNC_ST_ID = "hero-heading-gel-sync";

// The outro pin owns `scaleY` on the gel band during its gel-expand beat.
// `sync()` would reset it — suspend it while the pin is driving the band.
//
// Suspension DEFERS, it does not discard. A suspended `sync()` records that one
// was owed (`pending`) and `resume` runs it immediately, so a resize during a
// suspend window is applied when the window closes rather than lost.
const suspended = new WeakSet();
const pending = new WeakSet();
// view -> the live `sync` closure, so `resume` can run the owed sync without the
// caller having to know which trigger to poke.
const syncs = new WeakMap();

export function suspendHeadingGelSync(view) {
  if (view) suspended.add(view);
}

export function resumeHeadingGelSync(view) {
  if (!view) return;
  suspended.delete(view);
  if (!pending.has(view)) return;
  pending.delete(view);
  syncs.get(view)?.();
}

export const getHeadingGelEl = (gelManager) =>
  gelManager?.getGel?.(HEADING_GEL_ID)?.view ?? null;

/**
 * @param {HTMLElement|null} view Hero section root.
 * @param {object|null} gelManager GelAnimationManager instance.
 * @returns {ScrollTrigger|null} The resize hook, or null when unavailable.
 */
export function attachHeadingGel(view, gelManager) {
  const gel = gelManager?.getGel?.(HEADING_GEL_ID) ?? null;
  if (!gel?.view || !view) return null;

  const el = gel.view;
  let lastHeight = null;

  const sync = () => {
    if (suspended.has(view)) {
      // Owed, not dropped — `resumeHeadingGelSync` will run it.
      pending.add(view);
      return;
    }
    const height = window.innerHeight;
    if (!height) return;

    gsap.set(el, {
      left: 0,
      top: 0,
      width: "100vw",
      height,
      // Neutralize any transform left by another variant/arrangement — the band is positioned purely by left/top/width/height.
      x: 0,
      y: 0,
      rotation: 0,
      xPercent: 0,
      yPercent: 0,
      scaleX: 1,
      scaleY: 1,
      transformOrigin: "center center",
      autoAlpha: 1,
    });

    // The SVG mask is measured from the element box, so it only needs rebuilding
    // when the box actually resizes.
    if (height !== lastHeight) {
      lastHeight = height;
      gel.refresh();
    }
  };

  // Register before the first call so a suspended sync has somewhere to be owed.
  syncs.set(view, sync);

  // Idempotent across rebuilds (matchMedia / resize re-invoke the variant): kill
  // the prior trigger before creating a fresh one so they don't stack.
  ScrollTrigger.getById(SYNC_ST_ID)?.kill();

  sync();

  // Kept solely as a resize hook: ScrollTrigger.refresh() (on resize, and via
  // HeroTriggers' explicit getById(...).refresh()) re-runs `sync()` so the band
  // re-fills a changed viewport. Deliberately no `onUpdate`/`onToggle` — the
  // band no longer tracks scroll, so there is nothing to do per tick.
  return ScrollTrigger.create({
    id: SYNC_ST_ID,
    trigger: view,
    start: "top bottom",
    end: "bottom top",
    onRefresh: sync,
  });
}

/**
 * Hero's `landing` phase: park the gel band at its full-bleed resting geometry.
 *
 * There is no entrance — the band is placed at rest when the timelines build,
 * so it is already in position when the landing chain reaches hero. The empty
 * landing-tagged timeline keeps the phase contract intact for
 * `AbstractSection` (settle/progress calls find a timeline, not a warning).
 *
 * @param {HTMLElement|null} view Hero section root.
 * @param {object|null} gelManager GelAnimationManager instance.
 * @returns {gsap.core.Timeline} Empty landing-tagged timeline.
 */
export function buildHeadingGelRest(view, gelManager) {
  attachHeadingGel(view, gelManager);
  return gsap.timeline({ id: TIMELINE_IDS.landing });
}
