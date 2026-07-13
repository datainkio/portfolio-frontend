import { intro as introBlockframes } from "./reveal.js";
import {
  intro as introUiComponentsLoop,
  introReduced as introUiComponentsReduced,
} from "./ui-components-loop.js";

export const PROCESS_VARIANT_FACTORIES = Object.freeze({
  blockframes: { buildIntro: introBlockframes },
  // Looping horizontal index-and-dwell UI-components scene (self-driving via its
  // own ScrollTrigger). Selected per breakpoint by the process SECTION_OVERRIDES
  // variant; renders the atoms/svg/ui-components-loop.njk hooks in the section.
  "ui-components-loop": { buildIntro: introUiComponentsLoop },
  // reduced: the scene's own static builder — gsap.set()s the first item under
  // the highlight (no loop, no ScrollTrigger). Owns the resting state rather
  // than relying on an empty intro or SVG default markup.
  reduced: { buildIntro: introUiComponentsReduced },
});
