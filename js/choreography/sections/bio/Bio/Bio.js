/** @format */
/**
 * Organizations Section Controller
 *
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import AbstractSection from "../../abstract-section/AbstractSection/AbstractSection.js";
import { SELECTORS } from "../../../config/index/index.js";
import { BIO_SELECTORS } from "../../../config/contracts/selectors/selectors.js";
// import LineManager from "../../../managers/LineManager/LineManager.js";
// import { add as addPrinterMarks } from "../../../displays/PrinterMarks.js";
import BioAnimations from "../BioAnimations/BioAnimations.js";
import BioTriggers from "../BioTriggers/BioTriggers.js";

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
