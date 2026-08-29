import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { BIO_SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { BIO_MISSION_REVEAL } from "../../config/ix/motion.js";
import { isReducedMotion } from "../../managers/ReducedMotionHandler/ReducedMotionHandler.js";
import {
  attachOverviewGel,
  getOverviewGelEl,
  suspendOverviewGelSync,
  resumeOverviewGelSync,
  OVERVIEW_SYNC_ST_ID,
} from "./overview-gel.js";

/**
 * Bio Mission Statement — gel-led arrival
 *
 * The section's turn: the <h1> states the philosophy, this states what it means.
 * Three overlapping beats — the `gel_subheading` band wipes in from the left,
 * the overview <h2> rides in behind its tail, then the body copy staggers up.
 *
 * **Why this has its own ScrollTrigger rather than living on bio's intro
 * timeline:** the mission statement sits a full `h-dvh` below the header, so it
 * is off-screen when the intro plays (that intro is cued by the landing chain,
 * not by scroll). Sequenced there, the whole reveal would play unseen. This
 * attaches alongside the gels in `split.js` — a standing behaviour, not a phase
 * of the header's reveal.
 *
 * The band leads deliberately: it rhymes with the heading gel's arrival
 * (see heading-gel.js) so the two headings read as one gesture at two scales.
 */

const BIO_EL_ATTR = BIO_SELECTORS.elementAttribute;
const MISSION_EL = "mission-statement";
const OVERVIEW_EL = "overview";
const REVEAL_ST_ID = "bio-mission-reveal";

const selectBioEl = (view, name) =>
  view?.querySelector(`[${BIO_EL_ATTR}="${name}"]`) ?? null;

// Whether this view's reveal has already been asked to play. A breakpoint
// crossing re-runs `split.js`'s `intro()`, which calls back in here — without
// this, the rebuild would re-hide copy the reader has already read and re-arm a
// trigger they have already passed, leaving the statement blank for good.
const revealed = new WeakSet();

/**
 * @param {HTMLElement|null} view Bio section root.
 * @param {object|null} gelManager GelAnimationManager instance.
 * @returns {ScrollTrigger|null} The reveal trigger, or null when unavailable.
 */
export function attachMissionStatement(view, gelManager) {
  const mission = selectBioEl(view, MISSION_EL);
  if (!view || !mission) return null;

  const overview = selectBioEl(view, OVERVIEW_EL);
  // `:scope >` so only the statement's own paragraphs are targets — the body is
  // arbitrary Sanity rich text and may nest markup of its own.
  const paragraphs = Array.from(mission.querySelectorAll(":scope > p"));

  // Position the band first: the wipe below scales it, so it needs its resting
  // geometry (and its mask) resolved before anything animates. This also re-runs
  // on every rebuild, which is what re-measures the band at the new viewport.
  attachOverviewGel(view, gelManager);
  const gelEl = getOverviewGelEl(gelManager);

  // Already played (a rebuild, not a first attach): the band has just been
  // re-measured above, so all that is left is to make sure nothing stays hidden
  // or suspended. Clear the reveal's inline start-frame props and hand the band
  // back to its own sync — do NOT rebuild the timeline or re-arm the trigger.
  if (revealed.has(view)) {
    resumeOverviewGelSync(view);
    const targets = [overview, ...paragraphs].filter(Boolean);
    if (targets.length) {
      gsap.set(targets, { clearProps: "opacity,visibility,transform" });
    }
    return null;
  }

  // Reduced motion: everything rests at its natural state. Nothing is hidden, so
  // there is no start frame to undo and no trigger to bind — `attachOverviewGel`
  // has already revealed the band. (In practice the profile system swaps bio to
  // the `reduced` variant, which never reaches this file; this is the belt to
  // that braces.)
  if (isReducedMotion()) return null;

  // The wipe owns scaleX/autoAlpha on the band. Freeze the gel's own scroll sync
  // so it cannot reset either mid-flight, and park the band hidden — the `from`
  // tweens below hide the copy the same way, at build time.
  suspendOverviewGelSync(view);
  if (gelEl) gsap.set(gelEl, { autoAlpha: 0 });

  const tl = gsap.timeline({ paused: true });

  if (gelEl) {
    tl.fromTo(
      gelEl,
      { scaleX: 0, transformOrigin: "left center", autoAlpha: 1 },
      {
        scaleX: 1,
        duration: BIO_MISSION_REVEAL.gelDuration,
        ease: BIO_MISSION_REVEAL.ease,
        overwrite: "auto",
        onComplete: () => {
          // Hand the band back to its own sync, which owns the resting geometry
          // (and resets transformOrigin to center) from here on.
          resumeOverviewGelSync(view);
          ScrollTrigger.getById(OVERVIEW_SYNC_ST_ID)?.refresh();
        },
      },
      0,
    );
  }

  const textStart = gelEl
    ? `>-=${BIO_MISSION_REVEAL.gelDuration * BIO_MISSION_REVEAL.overlap}`
    : 0;

  if (overview) {
    tl.from(
      overview,
      {
        autoAlpha: 0,
        y: BIO_MISSION_REVEAL.distance,
        duration: BIO_MISSION_REVEAL.duration,
        ease: BIO_MISSION_REVEAL.ease,
        overwrite: "auto",
      },
      textStart,
    );
  }

  if (paragraphs.length) {
    tl.from(
      paragraphs,
      {
        autoAlpha: 0,
        y: BIO_MISSION_REVEAL.distance,
        duration: BIO_MISSION_REVEAL.duration,
        ease: BIO_MISSION_REVEAL.ease,
        overwrite: "auto",
        // `amount` (a total), not `each` — see BIO_MISSION_REVEAL.
        stagger: { amount: BIO_MISSION_REVEAL.staggerAmount, from: "start" },
      },
      overview ? "<0.2" : textStart,
    );
  }

  // Idempotent across rebuilds (matchMedia / resize re-invoke the variant): kill
  // the prior trigger before creating a fresh one so they don't stack.
  ScrollTrigger.getById(REVEAL_ST_ID)?.kill();

  return ScrollTrigger.create({
    id: REVEAL_ST_ID,
    trigger: mission,
    start: BIO_MISSION_REVEAL.start,
    once: true,
    onEnter: () => {
      // Marked on request, not on completion — a rebuild mid-play must also take
      // the "already revealed" path rather than restarting from hidden.
      revealed.add(view);
      tl.play();
    },
  });
}
