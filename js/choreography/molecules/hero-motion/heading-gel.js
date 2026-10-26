import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { HERO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

/**
 * Hero Heading Gel
 *
 * Holds the `gel_hero` gel as a full-width band behind the hero h1: `left: 0 /
 * width: 100vw`, with the h1's own height and vertical position.
 *
 * The gel lives in `#sizzle-background` (`fixed inset-0`), but the h1 scrolls.
 * So the h1 box is measured only on refresh (resize), as a document-relative
 * `top`, and scroll is followed with a `y` transform taken from the scroll
 * position — no layout read per tick. The band scrolls away with the heading;
 * it is no longer a standing background plane for the rest of the page. The
 * gel is never ScrollTrigger-pinned.
 *
 * `scaleX` is not geometry and `sync()` never touches it: the landing phase
 * parks it at 0 and the intro wipes it 0 → 1 from the left edge.
 *
 * GelAnimationManager parks every gel at autoAlpha 0 on init, so making this one
 * visible is an explicit step here.
 */

export const HEADING_GEL_ID = "gel_hero";
const SYNC_ST_ID = "hero-heading-gel-sync";

const selectTitle = (view) =>
  view?.querySelector(
    `[${HERO_SELECTORS.elementAttribute}="${HERO_SELECTORS.title}"]`,
  ) ?? null;

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

// Re-measure on demand — the intro calls this after SplitText has re-flowed
// the h1, since the split can change its height.
export const syncHeadingGel = (view) => syncs.get(view)?.();

/**
 * @param {HTMLElement|null} view Hero section root.
 * @param {object|null} gelManager GelAnimationManager instance.
 * @returns {ScrollTrigger|null} The resize/scroll hook, or null when unavailable.
 */
export function attachHeadingGel(view, gelManager) {
  const gel = gelManager?.getGel?.(HEADING_GEL_ID) ?? null;
  const title = selectTitle(view);
  if (!gel?.view || !title) return null;

  const el = gel.view;
  const setY = gsap.quickSetter(el, "y", "px");
  let lastHeight = null;

  const sync = () => {
    if (suspended.has(view)) {
      // Owed, not dropped — `resumeHeadingGelSync` will run it.
      pending.add(view);
      return;
    }
    const rect = title.getBoundingClientRect();
    const height = rect.height;
    if (!height) return;

    gsap.set(el, {
      left: 0,
      top: rect.top + window.scrollY,
      width: "100vw",
      height,
      // Neutralize any transform left by another variant/arrangement. scaleX
      // is deliberately absent — the landing park and the intro wipe own it.
      x: 0,
      y: -window.scrollY,
      rotation: 0,
      xPercent: 0,
      yPercent: 0,
      scaleY: 1,
      transformOrigin: "left center",
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

  // `onRefresh` (on resize, and via HeroTriggers' explicit
  // getById(...).refresh()) re-measures the h1. `onUpdate` follows scroll with
  // the transform only — `self.scroll()` is not a layout read.
  return ScrollTrigger.create({
    id: SYNC_ST_ID,
    trigger: view,
    start: "top bottom",
    end: "bottom top",
    onRefresh: sync,
    onUpdate: (self) => {
      if (!suspended.has(view)) setY(-self.scroll());
    },
  });
}

/**
 * Hero's `landing` phase: place the gel band on the h1 and park it collapsed
 * (`scaleX: 0`) at the viewport's left edge, ready for the intro's wipe.
 *
 * The empty landing-tagged timeline keeps the phase contract intact for
 * `AbstractSection` (settle/progress calls find a timeline, not a warning).
 *
 * @param {HTMLElement|null} view Hero section root.
 * @param {object|null} gelManager GelAnimationManager instance.
 * @returns {gsap.core.Timeline} Empty landing-tagged timeline.
 */
export function buildHeadingGelRest(view, gelManager) {
  attachHeadingGel(view, gelManager);
  const el = getHeadingGelEl(gelManager);
  if (el) gsap.set(el, { scaleX: 0 });
  return gsap.timeline({ id: TIMELINE_IDS.landing });
}
