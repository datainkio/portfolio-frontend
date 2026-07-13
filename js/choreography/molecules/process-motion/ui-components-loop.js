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

// Uniform slot pitch (SVG user units): itemWidth 520 + 40 gap. TUNING KNOB —
// controls the neighbor gap from the chrome frame. HERO renders ON TOP of CHROME
// (it is the last group), so the peeking neighbors must sit clear of the chrome
// edges; keep P >= ~555 or a neighbor overlaps the frame. Larger P pushes
// neighbors further out into the peek margins.
const ITEM_PITCH = 560;

// Distance (SVG user units) from focus over which an item fades 1 → 0. TUNING
// KNOB — at the focus (d=0) opacity is 1; one FADE_RANGE away it reaches 0. Set
// to the pitch so a neighbor is fully transparent at its own slot centre and only
// its inner edge ghosts in as it approaches. Larger = neighbors stay visible
// longer / fade more gently.
const FADE_RANGE = ITEM_PITCH;

// Position-driven tent: full at focus, linearly to 0 at ±FADE_RANGE. Drives the
// fade-in-from-right / dwell-full / fade-out-left effect straight from the item's
// on-screen centre, so it stays exact regardless of dwell/index timing.
const fadeOpacity = (screenCenterX, focusX) =>
  gsap.utils.clamp(0, 1, 1 - Math.abs(screenCenterX - focusX) / FADE_RANGE);

/**
 * Resolve the scene's hooks, re-pack the items to a UNIFORM pitch, and measure
 * geometry once.
 *
 * The artwork is a real UI-components mockup: `uicomponents-track` (the HERO
 * group) holds items authored at fixed, NON-uniform x scattered across a wide
 * canvas — so their neighbors sit thousands of units off-crop and never peek in.
 * To get the coverflow peek (preceding + following item visible in the margins
 * OUTSIDE the chrome window) we re-pack every item to a uniform pitch `P` with a
 * one-time transform: item k (0-based, sorted by authored x) is translated so its
 * bbox x becomes `heroStartX + k*P`. Neighbors are then exactly `P` apart and the
 * widened viewBox reveals them beyond the chrome edges.
 *
 * `uicomponents-hero-start` marks the dwell/focus destination x (read once). After
 * repack, item k lands under hero-start at track.x = `-k*P` — strictly DECREASING,
 * so the track only ever moves left and every item enters from the right (the
 * spec's "items move right→left, no direction change").
 *
 * Idempotency: prior bridge clones are removed and any prior repack transform is
 * stripped from each item BEFORE `getBBox()`, so measurement always reads authored
 * coords across matchMedia/resize rebuilds. The item groups carry no authored
 * transform, so clearing `transform` is safe.
 *
 * @param {HTMLElement|null} view Section root.
 * @returns {null | {
 *   svg: SVGElement, track: SVGGElement, items: SVGGElement[],
 *   targets: number[], heroStartX: number, firstItemAuthoredX: number,
 *   pitch: number, cycle: number, firstTarget: number
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

  // Strip any prior repack transform so getBBox() reads authored coords
  // (idempotent across rebuilds). Item groups have no authored transform.
  track
    .querySelectorAll(`[${PROCESS_EL_ATTR}="uicomponents-item"]`)
    .forEach((node) => node.removeAttribute("transform"));

  // Destination — read once (hero-start rides the track invisibly thereafter).
  // heroStartX = repack anchor; focusX = its centre = the opacity-fade peak.
  const hsBox = heroStart.getBBox();
  const heroStartX = hsBox.x;
  const focusX = hsBox.x + hsBox.width / 2;

  // Items sorted by their authored x (SVG user units, resize-invariant). Width is
  // kept so each item's post-repack centre can drive its position-based opacity.
  const items = [
    ...track.querySelectorAll(`[${PROCESS_EL_ATTR}="uicomponents-item"]`),
  ]
    .map((el) => {
      const b = el.getBBox();
      return { el, x: b.x, w: b.width };
    })
    .sort((a, b) => a.x - b.x);
  if (items.length < 2) return null;

  // Re-pack: item k gets a one-time translate so its bbox x becomes
  // heroStartX + k*P → neighbors are exactly P apart and peek in beyond chrome.
  items.forEach((it, k) => {
    const dx = heroStartX + k * ITEM_PITCH - it.x;
    it.el.setAttribute("transform", `translate(${dx}, 0)`);
  });

  const n = items.length;
  // track.x that lands item k under hero-start: -k*P. Monotonically decreasing →
  // every item enters from the right, no direction change. firstTarget = 0.
  const targets = items.map((_, k) => -k * ITEM_PITCH);
  // Post-repack centre of item k (local, track-relative): heroStartX + k*P + w/2.
  // On-screen centre = track.x + centre; feeds the position-driven opacity fade.
  const centers = items.map((it, k) => heroStartX + k * ITEM_PITCH + it.w / 2);
  // Bridge clone sits one full CYCLE (N slots) right of item 0, so translating
  // left past the last item lands it under hero-start with the uniform wrap pitch.
  const cycle = n * ITEM_PITCH;

  return {
    svg,
    track,
    items: items.map((it) => it.el),
    targets,
    centers,
    focusX,
    heroStartX,
    firstItemAuthoredX: items[0].x,
    pitch: ITEM_PITCH,
    cycle,
    firstTarget: 0,
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
 * Items are re-packed to a UNIFORM pitch `P` (see `measure`) so the preceding and
 * following items peek in beyond the chrome edges (coverflow). Each advance
 * translates the track to `-k*P`, aligning item k under the invisible hero-start
 * marker; targets decrease monotonically → every item enters from the right (no
 * direction change).
 *
 * Seamless wrap: a clone of the first item is appended one CYCLE to the right.
 * The final tween lands that clone under hero-start — pixel-identical to the
 * first item at time 0 — so `repeat: -1` snapping back to `firstTarget` shows no
 * jump, gap, overlap, or direction change.
 *
 * Transform (`x` on the track) + position-driven opacity (each item/clone fades
 * with its distance from focus) — both compositor-friendly. Durations/ease come
 * from motion tokens. Reduced motion is handled upstream by the `reduced` variant
 * swap (this scene is never built), so no reduced branch belongs here.
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
  const {
    track,
    items,
    targets,
    centers,
    focusX,
    cycle,
    firstTarget,
    heroStartX,
    firstItemAuthoredX,
  } = geo;

  // Bridge clone: the first item, re-packed to slot N (one CYCLE right of item 0).
  // It stays off-crop during normal play and only reaches hero-start at the wrap.
  // Strip ids so the document stays id-unique.
  const clone = items[0].cloneNode(true);
  clone.setAttribute(CLONE_ATTR, "");
  clone.removeAttribute("id");
  clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
  // bbox x = heroStartX + N*P → same repack offset as item 0, plus one cycle.
  const cloneDx = heroStartX - firstItemAuthoredX + cycle;
  clone.setAttribute("transform", `translate(${cloneDx}, 0)`);
  track.appendChild(clone);
  // track.x that lands the clone (at heroStartX + N*P) under hero-start = -N*P.
  const bridgeTarget = firstTarget - cycle;

  // Position-driven opacity: each real item plus the bridge clone fades with its
  // distance from focus (0 at the edges → 1 at the centre). The clone's centre is
  // item 0's centre shifted one CYCLE right, so it fades in on the wrap exactly
  // like a real item instead of popping. One quickSetter per element (created
  // once); applied every tick from the loop's onUpdate.
  const faders = [
    ...items.map((el, k) => ({
      set: gsap.quickSetter(el, "opacity"),
      center: centers[k],
    })),
    { set: gsap.quickSetter(clone, "opacity"), center: centers[0] + cycle },
  ];
  const applyOpacity = () => {
    const x = gsap.getProperty(track, "x");
    faders.forEach((f) => f.set(fadeOpacity(x + f.center, focusX)));
  };

  const indexDuration = toSeconds(motion.duration("base")); // one advance
  const dwellDuration = toSeconds(motion.duration("slow")); // hold in highlight
  const ease = motion.ease("standard");

  // First item parked under hero-start; timeline paused at time 0. Seed the
  // opacities for that resting frame (onUpdate hasn't fired while paused).
  gsap.set(track, { x: firstTarget });
  applyOpacity();

  const tl = gsap.timeline({ repeat: -1, paused: true, onUpdate: applyOpacity });
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
  // Same position-driven fade, applied once (no loop, no clone): item 0 sits at
  // focus (opacity 1) with its neighbors statically dimmed in the peek margins.
  geo.items.forEach((el, k) =>
    gsap.set(el, {
      opacity: fadeOpacity(geo.firstTarget + geo.centers[k], geo.focusX),
    }),
  );
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
