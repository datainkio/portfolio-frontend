import { intro as introBlockframes } from "./reveal.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";

// reduced: no blockframes — return an empty intro so the static inlined .Basic
// block is all that shows (the grid fill never runs for reduced-motion users).
const reducedIntro = () => gsap.timeline({ id: TIMELINE_IDS.intro });

export const PROCESS_VARIANT_FACTORIES = Object.freeze({
  blockframes: { buildIntro: introBlockframes },
  reduced: { buildIntro: reducedIntro },
});
