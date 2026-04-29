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
import {
  BIO_SUB_SECTION_LINE_DEFAULTS,
  LINE_STYLES,
} from "../../config/displays/leader-lines.js";
import LineManager from "../../managers/LineManager.js";
import { add as addPrinterMarks } from "../../../displays/PrinterMarks.js";
import BioAnimations from "./BioAnimations.js";
import BioTriggers from "./BioTriggers.js";

export default class Bio extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.bio);

    if (view && !view.querySelector(".printmarks")) {
      addPrinterMarks(view);
    }

    const animations = new BioAnimations(view);
    const triggers = new BioTriggers(view);

    super({
      view,
      animations,
      triggers,
      sectionKey: "bio",
      bus,
      reducedMotionHandler,
    });

    this.lineManager = null;
    this._subSectionLineKeys = [];
    this._connectedLineIds = new Set();

    if (!this.isDisabled) {
      this._initializeSubSectionLines();
      this.animations?.setOnSubSectionRevealComplete?.((item, itemIndex) => {
        this._connectLineForSubSectionIndex(itemIndex);
      });
    }
  }

  _onUpdate(trigger) {
    this.animations?.updateSubSectionReveal?.(trigger);
  }

  _onRefresh(trigger) {
    this.animations?.updateSubSectionReveal?.(trigger);
  }

  _onLeave() {
    super._onLeave();
    this.animations?.setStickySubheadingFaded?.(false, { immediate: true });
  }

  _onLeaveBack() {
    super._onLeaveBack();
    this.animations?.setStickySubheadingFaded?.(false, { immediate: true });
  }

  _applyPostIntroState() {
    super._applyPostIntroState();
    this.animations?.showAllSubSections?.();
    this._showAllSubSectionLines();
  }

  destroy() {
    this.animations?.setOnSubSectionRevealComplete?.(null);
    this.lineManager?.destroy();
    this.lineManager = null;
    this._subSectionLineKeys = [];
    this._connectedLineIds.clear();
    super.destroy();
  }

  _initializeSubSectionLines() {
    const subSections = Array.from(
      this.view?.querySelectorAll(BIO_SELECTORS.subSectionSelector) ?? [],
    );

    if (subSections.length < 2) {
      return;
    }

    const sockets = this._buildSubSectionSockets(subSections);
    this.lineManager = new LineManager({
      root: this.view,
      sockets,
      styles: LINE_STYLES,
    });
    this.lineManager.initialize();
  }

  _showAllSubSectionLines() {
    for (let i = 0; i < this._subSectionLineKeys.length - 1; i += 1) {
      this._connectLineForSubSectionIndex(i);
    }
  }

  _connectLineForSubSectionIndex(itemIndex) {
    if (
      !this.lineManager ||
      itemIndex < 0 ||
      itemIndex >= this._subSectionLineKeys.length - 1
    ) {
      return;
    }

    const originKey = this._subSectionLineKeys[itemIndex];
    const terminusKey = this._subSectionLineKeys[itemIndex + 1];
    if (!originKey || !terminusKey) {
      return;
    }

    const lineId = `${originKey}->${terminusKey}`;
    if (this._connectedLineIds.has(lineId)) {
      return;
    }

    const connected = this.lineManager.connect(originKey, terminusKey, {
      effect: BIO_SUB_SECTION_LINE_DEFAULTS.showEffect,
      animOptions: BIO_SUB_SECTION_LINE_DEFAULTS.showAnimOptions,
    });

    if (connected) {
      this._connectedLineIds.add(lineId);
    }
  }

  _buildSubSectionSockets(subSections) {
    const sockets = {};

    subSections.forEach((subSection, index) => {
      const key = `bio-sub-section-${index}`;
      const attribute = BIO_SELECTORS.subSectionLineKeyAttribute;
      subSection.setAttribute(attribute, key);
      this._subSectionLineKeys.push(key);

      const elementSelector = `[${attribute}="${key}"]`;
      sockets[key] = {
        origin: {
          element: elementSelector,
          x: BIO_SUB_SECTION_LINE_DEFAULTS.origin.x,
          y: BIO_SUB_SECTION_LINE_DEFAULTS.origin.y,
          scope: this.view,
        },
        terminus: {
          element: elementSelector,
          x: BIO_SUB_SECTION_LINE_DEFAULTS.terminus.x,
          y: BIO_SUB_SECTION_LINE_DEFAULTS.terminus.y,
          scope: this.view,
        },
      };
    });

    return sockets;
  }
}
