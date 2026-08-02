/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.bio.bio
 *   role: Frontend runtime module: js/choreography/sections/bio/Bio.js
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
/** @format */
/**
 * Organizations Section Controller
 *
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import AbstractSection from "../abstract-section/AbstractSection.js";
import { SELECTORS } from "../../config/index.js";
import { BIO_SELECTORS } from "../../config/contracts/selectors.js";
// import LineManager from "../../managers/LineManager.js";
// import { add as addPrinterMarks } from "../../../displays/PrinterMarks.js";
import BioAnimations from "./BioAnimations.js";
import BioTriggers from "./BioTriggers.js";

export default class Bio extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.bio);

    const animations = new BioAnimations(view);
    const triggers = new BioTriggers(view);
    // JS-implementation of printer marks deprecated in favor of embedded SVGs.
    // if (view && !view.querySelector(".printmarks")) {
    //   addPrinterMarks(view);
    // }

    super({
      view,
      animations,
      triggers,
      sectionKey: SELECTORS.bio,
      bus,
      reducedMotionHandler,
    });
  }
}
