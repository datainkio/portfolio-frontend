/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.background.backgroundvideo
 *   role: Frontend runtime module: js/choreography/sections/background/BackgroundVideo.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - sections
 * ---
 */
import AbstractSection from "../abstract-section/AbstractSection.js";
import { SELECTORS } from "../../config/index.js";
import BackgroundVideoAnimations from "./BackgroundVideoAnimations.js";
import BackgroundVideoTriggers from "./BackgroundVideoTriggers.js";

export default class BackgroundVideo extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.video);
    const animations = new BackgroundVideoAnimations(view);
    const triggers = new BackgroundVideoTriggers(view);

    super({
      view,
      animations,
      triggers,
      sectionKey: "video",
      bus,
      reducedMotionHandler,
    });
  }
}
