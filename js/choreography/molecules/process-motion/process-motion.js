import { intro as introBlockframes } from "./reveal.js";
import {
  intro as introUiComponentsLoop,
  introReduced as introUiComponentsReduced,
} from "./ui-components-loop.js";

export const PROCESS_VARIANT_FACTORIES = Object.freeze({
  blockframes: { buildIntro: introBlockframes },
  // Composed variant: builds BOTH live Process visuals. The blockframes reveal
  // (self-driving ScrollTrigger id "process-blockframes-reveal" + grid fill) is
  // built fire-and-forget — its empty intro timeline is discarded — then the
  // looping horizontal index-and-dwell UI-components scene (own ScrollTrigger
  // id "process-uicomponents-loop") supplies the intro timeline the section
  // binds. Both builders are idempotent (kill-by-id) so matchMedia/resize
  // rebuilds don't stack triggers. Selected per breakpoint by the process
  // SECTION_OVERRIDES variant.
  "ui-components-loop": {
    buildIntro: (view, gelManager) => {
      introBlockframes(view, gelManager);
      return introUiComponentsLoop(view);
    },
  },
  // reduced: the scene's own static builder — gsap.set()s the first item under
  // the highlight (no loop, no ScrollTrigger). Owns the resting state rather
  // than relying on an empty intro or SVG default markup.
  reduced: { buildIntro: introUiComponentsReduced },
});
