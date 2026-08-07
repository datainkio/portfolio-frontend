import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { buildBlockframesReveal } from "./blockframes.js";
import { fillBlockframesGrid } from "./blockframes-grid.js";
import { attachSectionGel } from "./section-gel.js";

// Blockframes reveal for the Process section. buildBlockframesReveal creates its
// own scroll-triggered timeline (self-driving); fillBlockframesGrid is a
// fire-and-forget async that only touches invisible cells. Preserve this order
// (matches the prior bio-motion behavior). Returns an empty intro timeline so
// AbstractSection.playIntro has something to bind but the reveal stays scroll-owned.
export function intro(view, gelManager) {
  buildBlockframesReveal(view);
  fillBlockframesGrid(view).catch((err) =>
    console.warn("[process] blockframes grid fill skipped:", err),
  );
  // Full-bleed gel band behind the entire section. Positioned outside the
  // timeline: it is a standing background state, not a phase of the reveal.
  attachSectionGel(view, gelManager);
  return gsap.timeline({ id: TIMELINE_IDS.intro });
}
