import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { BIO_GEL_ENTRANCE } from "../../config/ix/motion.js";

/**
 * Bio Heading Gel
 *
 * Holds the `gel_bio` gel as a full-bleed band filling the viewport: `left: 0 /
 * top: 0 / width: 100vw / height: 100vh`.
 *
 * The band is **decoupled from scroll.** It takes no geometry from the bio
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

export const HEADING_GEL_ID = "gel_bio";
const SYNC_ST_ID = "bio-heading-gel-sync";

// The outro pin owns `scaleY` on the gel band during its gel-expand beat, and
// the entrance below owns x/y/rotation. `sync()` would reset those — suspend it
// while either is driving the band.
const suspended = new WeakSet();

export function suspendHeadingGelSync(view) {
  if (view) suspended.add(view);
}

export function resumeHeadingGelSync(view) {
  if (view) suspended.delete(view);
}

export const getHeadingGelEl = (gelManager) =>
  gelManager?.getGel?.(HEADING_GEL_ID)?.view ?? null;

/**
 * @param {HTMLElement|null} view Bio section root.
 * @param {object|null} gelManager GelAnimationManager instance.
 * @returns {ScrollTrigger|null} The resize hook, or null when unavailable.
 */
export function attachHeadingGel(view, gelManager) {
  const gel = gelManager?.getGel?.(HEADING_GEL_ID) ?? null;
  if (!gel?.view || !view) return null;

  const el = gel.view;
  let lastHeight = null;

  const sync = () => {
    if (suspended.has(view)) return;
    const height = window.innerHeight;
    if (!height) return;

    gsap.set(el, {
      left: 0,
      top: 0,
      width: "100vw",
      height,
      // Neutralize any transform left by another variant/arrangement (or by the
      // entrance below) — the band is positioned purely by left/top/width/height.
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

  // Idempotent across rebuilds (matchMedia / resize re-invoke the variant): kill
  // the prior trigger before creating a fresh one so they don't stack.
  ScrollTrigger.getById(SYNC_ST_ID)?.kill();

  sync();

  // Kept solely as a resize hook: ScrollTrigger.refresh() (on resize, and via
  // BioTriggers' explicit getById(...).refresh()) re-runs `sync()` so the band
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
 * Build the gel band's entrance — bio's `landing` phase.
 *
 * The band flies in from fully offscreen (1.2 viewport heights below the fold,
 * offset right by a third of the viewport width, slightly tilted) and resolves
 * to its synced resting geometry. `LandingSequence` awaits this timeline before
 * playing the bio intro, so the entrance gates the reveal.
 *
 * Ordering matters here, and it is why the whole beat lives in one factory:
 *
 * 1. `attachHeadingGel` runs first so the band already holds its resting
 *    geometry — a `gsap.from` reads the *current* values as its end state.
 * 2. `sync()` is then suspended. It rewrites x/y/rotation on every scroll tick
 *    and would stomp the entrance mid-flight. The suspend also survives
 *    `intro()`'s later `attachHeadingGel` call: that re-attach's own initial
 *    `sync()` respects the same gate, so the offscreen start frame is not wiped
 *    between build and play.
 * 3. The `from` renders immediately (GSAP's default), parking the band
 *    offscreen at build time — before the gel is ever on screen.
 * 4. On completion the sync resumes and is force-refreshed, handing the band
 *    back to normal scroll tracking.
 *
 * The completion hook lives on the **tween**, not the timeline: `AbstractSection
 * ._bindCallbacks` owns the landing timeline's `onStart`/`onComplete` callbacks
 * and would overwrite a timeline-level one.
 *
 * @param {HTMLElement|null} view Bio section root.
 * @param {object|null} gelManager GelAnimationManager instance.
 * @returns {gsap.core.Timeline} Landing-tagged timeline; empty when unavailable.
 */
export function buildHeadingGelEntrance(view, gelManager) {
  const tl = gsap.timeline({ id: TIMELINE_IDS.landing });

  attachHeadingGel(view, gelManager);

  const el = getHeadingGelEl(gelManager);
  if (!view || !el) return tl;

  suspendHeadingGelSync(view);

  tl.from(el, {
    // Function-based so a resize between build and play re-measures.
    y: () => window.innerHeight * BIO_GEL_ENTRANCE.yViewportRatio,
    x: () => window.innerWidth * BIO_GEL_ENTRANCE.xViewportRatio,
    rotation: BIO_GEL_ENTRANCE.rotation,
    duration: BIO_GEL_ENTRANCE.duration,
    ease: BIO_GEL_ENTRANCE.ease,
    overwrite: "auto",
    onComplete: () => {
      resumeHeadingGelSync(view);
      ScrollTrigger.getById(SYNC_ST_ID)?.refresh();
    },
  });

  return tl;
}
