import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { AWARDS_INTRO } from "../../config/ix/motion/motion.js";
import { AWARD_SELECTORS } from "../../config/contracts/selectors/selectors.js";

/**
 * Award Slide Motion
 * This defines the "sheet of paper sliding across a surface" motion for the awards section.
 * It assumes:
 * - Two gels: a backing sheet and a tint sheet, which together create the reveal effect.
 * - Content elements (context, header, subheading) that ride in on the sheets.
 * The slide-in motion has momentum in and friction out, with overlapping action for a natural feel.
 *
 */

const AWARD_EL_ATTR = AWARD_SELECTORS.elementAttribute;

const selectAwardEl = (view, name) =>
  view?.querySelector(`[${AWARD_EL_ATTR}="${name}"]`) ?? null;

export function init(view, gelManager) {
  const gel_backing = gelManager?.getGel?.("gel_awards_backing") ?? null;
  const gel_tint = gelManager?.getGel?.("gel_awards_tint") ?? null;
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  gsap.set(view, { mixBlendMode: "multiply" });
  if (gel_backing?.view) {
    // SET INITIAL STATES OF THE GELS
    // Build the mask polygon once, at full size. GelGeometry.refresh() reads
    // getBoundingClientRect(), so it must run at scaleY:1 to measure correct
    // geometry; we then collapse to scaleY:0 as the reveal's start state. This
    // keeps all geometry work out of the scrubbed intro tween (see createSlideIn).
    gsap.set(gel_backing.view, {
      transformOrigin: "top center",
      rotation: -25,
      width: view.getBoundingClientRect().width + "px",
      left: view.getBoundingClientRect().left + "px",
      mixBlendMode: "normal", // default value is "multiply", but we want to start with a solid block for the reveal
    });
    gel_backing.refresh();
    gsap.set(gel_backing.view, {
      x: 144,
      y: gel_backing.view.getBoundingClientRect().height,
    });
  }
  if (gel_tint?.view) {
    gsap.set(gel_tint.view, {
      transformOrigin: "top center",
      rotation: -25,
      width: view.getBoundingClientRect().width + "px",
      left: view.getBoundingClientRect().left + "px",
    });

    gel_tint.refresh();
    gsap.set(gel_tint.view, {
      x: 144,
      y: gel_tint.view.getBoundingClientRect().height,
    });
  }
}

export function createSlideIn(view, gelManager) {
  const gel_backing = gelManager?.getGel?.("gel_awards_backing") ?? null;
  const gel_tint = gelManager?.getGel?.("gel_awards_tint") ?? null;
  const content = [
    selectAwardEl(view, "context"),
    selectAwardEl(view, "header"),
    selectAwardEl(view, "subheading"),
    selectAwardEl(view, "list"),
  ].filter(Boolean);

  const DUR = AWARDS_INTRO.duration;
  const STAGGER = AWARDS_INTRO.stagger;

  const tl = gsap.timeline({ id: TIMELINE_IDS.intro });

  // BACKING SHEET ANIMATION
  const tlBacking = gsap.timeline();
  if (gel_backing?.view) {
    // Backing sheet glides in and settles flat (rotation 0).
    tlBacking.to(gel_backing.view, { x: 0, y: 24, ease: "power3.out" }, 0);
    tlBacking.to(gel_backing.view, { rotation: 0, ease: "power2.out" }, 0);
  }

  // TINT SHEET ANIMATION
  const tlTint = gsap.timeline();
  if (gel_tint?.view) {
    // Tint sheet trails like a second sheet pushed across after the first,
    tlTint.to(gel_tint.view, { x: -12, y: 24, ease: "power3.out" }, 0);
    tlTint.to(gel_tint.view, { rotation: -2, ease: "power2.out" }, 0);
  }

  // CONTENT ANIMATION
  // Each child rides in from an offscreen, slightly-rotated state to its
  // natural layout position. Using `from` means we never compute destinations:
  // GSAP captures each child's current laid-out position as the end state — and
  // re-reads it on refresh (invalidateOnRefresh) — so it adapts to the section's
  // fluid dimensions. The children are not the trigger element, so there is no
  // pin/trigger-measurement feedback (the problem that made `view` jitter).
  const tlContent = gsap.timeline();
  if (content.length) {
    tlContent.from(content, {
      x: 144,
      y: () => window.innerHeight, // start a full viewport below natural — tune for taste
      rotation: 12,
      ease: "power3.out",
      duration: DUR,
      stagger: STAGGER,
    });
  }

  tl.add(tlBacking);
  tl.add(tlTint);
  tl.add(tlContent);
  tl.duration(DUR);
  tl.stagger = STAGGER;
  return tl;
}

export function createSlideOut(view, gelManager) {
  const header = selectAwardEl(view, "header");
  const gel_backing = gelManager?.getGel?.("gel_awards_backing") ?? null;
  const tl = gsap.timeline({ id: TIMELINE_IDS.outro });
  tl.addLabel("outro");
  if (gel_backing?.view) {
    tl.to(gel_backing.view, { scaleY: 0, duration: AWARDS_INTRO.duration });
  }
  return tl;
}
