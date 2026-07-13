import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { PROCESS_SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { motion } from "../../config/ix/motion.js";

const PROCESS_EL_ATTR = PROCESS_SELECTORS.elementAttribute;

// Stable id so rebuilds (matchMedia / resize re-invoke the variant) kill the
// prior instance instead of stacking duplicate triggers.
const LOOP_ST_ID = "process-uicomponents-loop";
// Marks the runtime-appended bridge clone so a rebuild can drop it before
// re-measuring (idempotency — mirrors blockframes.js dropping its overlay).
const CLONE_ATTR = "data-uicomponents-clone";

const toSeconds = (ms) => (typeof ms === "number" ? ms / 1000 : ms);

/**
 * Resolve the scene's hooks and measure its geometry once.
 *
 * The artwork is a real UI-components mockup: `uicomponents-track` (the HERO
 * group) holds items positioned at fixed, non-uniform x across a wide canvas,
 * plus an invisible `uicomponents-hero-start` marker whose x is the dwell
 * destination. We align each item under hero-start by translating the track to
 * `heroStartX - itemX`, so items need no uniform slot pitch.
 *
 * Items are ordered by ascending x (left→right on the canvas). That makes the
 * per-item track target `heroStartX - itemX` strictly DECREASING, i.e. the track
 * only ever moves left and every item enters from the right — the spec's
 * "items move right→left, no direction change". (DOM order is spatially
 * non-monotonic in this artwork and would reverse direction between items.)
 *
 * @param {HTMLElement|null} view Section root.
 * @returns {null | {
 *   svg: SVGElement, track: SVGGElement, items: SVGGElement[],
 *   targets: number[], heroStartX: number, cycle: number, firstTarget: number
 * }}
 */
function measure(view) {
  const svg = view?.querySelector(`[${PROCESS_EL_ATTR}="uicomponents"]`) ?? null;
  const track =
    svg?.querySelector(`[${PROCESS_EL_ATTR}="uicomponents-track"]`) ?? null;
  const heroStart =
    track?.querySelector(`[${PROCESS_EL_ATTR}="uicomponents-hero-start"]`) ??
    null;
  if (!svg || !track || !heroStart) return null;

  // Drop any prior bridge clone so measurement reflects only the originals.
  track.querySelectorAll(`[${CLONE_ATTR}]`).forEach((node) => node.remove());

  // Destination x — read once (hero-start rides the track invisibly thereafter).
  const heroStartX = heroStart.getBBox().x;

  // Items sorted by their authored x (SVG user units, resize-invariant).
  const items = [
    ...track.querySelectorAll(`[${PROCESS_EL_ATTR}="uicomponents-item"]`),
  ]
    .map((el) => ({ el, x: el.getBBox().x }))
    .sort((a, b) => a.x - b.x);
  if (items.length < 2) return null;

  const xs = items.map((it) => it.x);
  const targets = xs.map((x) => heroStartX - x); // track.x that lands each item
  const span = xs[xs.length - 1] - xs[0];
  const firstGap = xs[1] - xs[0];
  // Bridge clone sits one CYCLE right of the first item, so continuing to
  // translate left past the last item lands the clone under hero-start with the
  // same wrap pitch as a normal advance. `span` keeps the clone off-crop during
  // normal play; `+firstGap` makes the wrap dwell spacing match the first step.
  const cycle = span + firstGap;

  return {
    svg,
    track,
    items: items.map((it) => it.el),
    targets,
    heroStartX,
    cycle,
    firstTarget: targets[0],
  };
}

/**
 * Restore the canonical initial state: first item under hero-start, loop parked
 * at time 0. Used on leave (both scroll directions).
 *
 * @param {gsap.core.Timeline} tl
 * @param {SVGElement} track
 * @param {number} firstTarget track.x that pins the first item at hero-start
 */
function resetToInitial(tl, track, firstTarget) {
  tl.pause(0);
  gsap.set(track, { x: firstTarget });
}

/**
 * Looping horizontal index-and-dwell scene for the Process section's real
 * UI-components artwork. Self-driving: owns one repeating timeline plus one
 * ScrollTrigger, so it plays only while the section is in view and resets to
 * the first item on leave (mirrors the self-contained blockframes reveal).
 *
 * Each item advances by translating the track to `heroStartX - itemX`, so the
 * item aligns under the invisible hero-start marker. Items are ordered by
 * ascending x → the track translates monotonically left → every item enters
 * from the right (no direction change).
 *
 * Seamless wrap: a clone of the first item is appended one CYCLE to the right.
 * The final tween lands that clone under hero-start — pixel-identical to the
 * first item at time 0 — so `repeat: -1` snapping back to `firstTarget` shows no
 * jump, gap, overlap, or direction change.
 *
 * Transform-only (`x` on the track). Durations/ease come from motion tokens.
 * Reduced motion is handled upstream by the `reduced` variant swap (this scene
 * is never built), so no reduced branch belongs here.
 *
 * Idempotent across rebuilds: the prior trigger is killed by id and the prior
 * clone removed before re-measuring.
 *
 * @param {HTMLElement|null} view Section root.
 * @returns {gsap.core.Timeline|null} The paused loop timeline, or null when hooks are absent.
 */
export function buildUiComponentsLoop(view) {
  // Idempotent rebuild: drop the prior trigger before re-measuring/re-cloning.
  ScrollTrigger.getById(LOOP_ST_ID)?.kill();

  const geo = measure(view);
  if (!geo) return null;
  const { track, items, targets, cycle, firstTarget } = geo;

  // Bridge clone: the first item, one CYCLE to the right. It stays off-crop
  // during normal play and only reaches hero-start at the wrap. Strip ids so the
  // document stays id-unique.
  const clone = items[0].cloneNode(true);
  clone.setAttribute(CLONE_ATTR, "");
  clone.removeAttribute("id");
  clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
  clone.setAttribute("transform", `translate(${cycle}, 0)`);
  track.appendChild(clone);
  // track.x that lands the clone (authored at xFirst + cycle) under hero-start.
  const bridgeTarget = firstTarget - cycle;

  const indexDuration = toSeconds(motion.duration("base")); // one advance
  const dwellDuration = toSeconds(motion.duration("slow")); // hold in highlight
  const ease = motion.ease("standard");

  // First item parked under hero-start; timeline paused at time 0.
  gsap.set(track, { x: firstTarget });

  const tl = gsap.timeline({ repeat: -1, paused: true });
  // Advance through each subsequent item; `+=dwell` inserts the dwell before the
  // move, so the item currently at hero-start holds first, then slides out.
  for (let k = 1; k < targets.length; k += 1) {
    tl.to(
      track,
      { x: targets[k], duration: indexDuration, ease },
      `+=${dwellDuration}`,
    );
  }
  // Bridge to the clone (visually the first item) → seamless with the repeat's
  // return to firstTarget. The dwell here holds the last real item.
  tl.to(
    track,
    { x: bridgeTarget, duration: indexDuration, ease },
    `+=${dwellDuration}`,
  );

  ScrollTrigger.create({
    id: LOOP_ST_ID,
    trigger: view,
    start: "top bottom", // active whenever any part of the section is visible
    end: "bottom top",
    onEnter: () => tl.play(),
    onEnterBack: () => tl.play(),
    onLeave: () => resetToInitial(tl, track, firstTarget),
    onLeaveBack: () => resetToInitial(tl, track, firstTarget),
  });

  return tl;
}

/**
 * Variant `buildIntro` entry point. Builds the self-driving loop and returns an
 * empty intro timeline so `AbstractSection.playIntro` has something to bind
 * while the loop stays scroll-owned (same shape as the blockframes `intro`).
 *
 * @param {HTMLElement|null} view Section root.
 * @returns {gsap.core.Timeline}
 */
export function intro(view) {
  buildUiComponentsLoop(view);
  return gsap.timeline({ id: TIMELINE_IDS.intro });
}

/**
 * Reduced-motion / static builder. Creates no loop and no ScrollTrigger; it only
 * `gsap.set()`s the track so the FIRST item (smallest x) aligns under
 * hero-start. Owns the resting state explicitly rather than relying on SVG
 * default markup or the shared empty `reduced` factory. Safe no-op when hooks
 * are absent.
 *
 * @param {HTMLElement|null} view Section root.
 * @returns {void}
 */
export function buildUiComponentsReduced(view) {
  ScrollTrigger.getById(LOOP_ST_ID)?.kill();
  const geo = measure(view);
  if (!geo) return;
  gsap.set(geo.track, { x: geo.firstTarget });
}

/**
 * Reduced-motion variant `buildIntro` entry point. Pins the static resting state
 * (first item under hero-start, no loop) and returns an empty intro timeline so
 * `AbstractSection.playIntro` has something to bind — same shape as `intro`.
 *
 * @param {HTMLElement|null} view Section root.
 * @returns {gsap.core.Timeline}
 */
export function introReduced(view) {
  buildUiComponentsReduced(view);
  return gsap.timeline({ id: TIMELINE_IDS.intro });
}
