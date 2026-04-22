/**
 * ---
 * aix:
 *   id: frontend.js.choreography.managers.linemanager
 *   role: Frontend runtime module: js/choreography/managers/LineManager.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - managers
 * ---
 */
/** @format */

import { Lumberjack } from "/assets/js/utils/lumberjack/index.js";
import {
  SECTION_LEAD_LINE_POINTS,
  SECTION_LEAD_LINE_STYLES,
  SECTION_LEAD_LINE_THEME,
} from "../config/displays/section-lead-lines.js";

const DEFAULT_SHOW_EFFECT = "draw";
const DEFAULT_SHOW_ANIM_OPTIONS = Object.freeze({
  duration: 500,
  timing: [0.58, 0, 0.42, 1],
});

export default class LineManager {
  constructor(options = {}) {
    this.logger = Lumberjack.createScoped("LineManager", {
      prefix: "",
      color: "#0A9396",
    });

    this.root = options.root || document;
    this.points = Array.isArray(options.points)
      ? options.points
      : SECTION_LEAD_LINE_POINTS;
    this.styles = options.styles || SECTION_LEAD_LINE_STYLES;
    this.theme = options.theme || SECTION_LEAD_LINE_THEME;

    this._lines = [];
    this._linePositionRaf = null;
    this._handleLinePositionUpdate = () => {
      if (this._linePositionRaf !== null) return;
      this._linePositionRaf = window.requestAnimationFrame(() => {
        this._linePositionRaf = null;
        this.positionLines();
      });
    };
  }

  initialize() {
    this._destroyLines();

    const LeaderLine = window.LeaderLine;
    if (!LeaderLine || typeof LeaderLine.pointAnchor !== "function") {
      this.logger.trace("LeaderLine unavailable; skipping section lead lines");
      return;
    }

    if (this.points.length < 2) {
      this.logger.trace("No section lead line points configured");
      return;
    }

    if (this.points.length % 2 !== 0) {
      this.logger.trace(
        "Odd number of section lead line points; last point will be ignored",
      );
    }

    const lineStyle = this._getSectionLeadLineStyle();

    for (let i = 0; i < this.points.length - 1; i += 2) {
      const startPoint = this.points[i];
      const endPoint = this.points[i + 1];

      const lineRecord = this._createLineRecord(
        LeaderLine,
        lineStyle,
        i / 2,
        startPoint,
        endPoint,
      );

      if (lineRecord) {
        this._lines.push(lineRecord);
      }
    }

    this.positionLines();
    this._bindPositionListeners();
    this._handleLinePositionUpdate();

    // Give layout a second pass after initial async render work settles.
    setTimeout(() => this.positionLines(), 250);

    this.logger.trace(`Section lead lines initialized: ${this._lines.length}`);
  }

  reset() {
    this.hideAllLines("none");
  }

  destroy() {
    this._unbindPositionListeners();

    if (this._linePositionRaf !== null) {
      window.cancelAnimationFrame(this._linePositionRaf);
      this._linePositionRaf = null;
    }

    this._destroyLines();
  }

  showLine(lineRef, options = {}) {
    const lineRecord = this._findLineRecord(lineRef);
    if (!lineRecord || lineRecord.visible) {
      return false;
    }

    const effect = options.effect || DEFAULT_SHOW_EFFECT;
    const animOptions = options.animOptions || DEFAULT_SHOW_ANIM_OPTIONS;

    try {
      lineRecord.line.show(effect, animOptions);
    } catch {
      lineRecord.line.show();
    }

    lineRecord.visible = true;
    return true;
  }

  showLineByStartSelector(selector, options = {}) {
    const normalized = this._normalizeSelector(selector);
    if (!normalized) {
      return false;
    }

    const exactMatch = this._lines.find(
      (record) => this._normalizeSelector(record.start.element) === normalized,
    );

    if (exactMatch) {
      return this.showLine(exactMatch.id, options);
    }

    const targetStartElement = this.root.querySelector(normalized);
    if (!targetStartElement) {
      return false;
    }

    const lineRecord = this._lines.find(
      (record) => record.startElement === targetStartElement,
    );

    if (!lineRecord) {
      return false;
    }

    return this.showLine(lineRecord.id, options);
  }

  showLineBySection(sectionId, options = {}) {
    const normalizedSection = this._normalizeSectionId(sectionId);
    if (!normalizedSection) {
      return false;
    }

    const candidates = this._lines.filter(
      (record) =>
        this._normalizeSectionId(record.start?.section) === normalizedSection,
    );

    if (!candidates.length) {
      return false;
    }

    const lineRecord =
      candidates.find((record) => !record.visible) || candidates[0];
    return this.showLine(lineRecord.id, options);
  }

  hideAllLines(effect = "none") {
    this._lines.forEach((lineRecord) => {
      if (!lineRecord.line || typeof lineRecord.line.hide !== "function") {
        return;
      }

      try {
        lineRecord.line.hide(effect);
      } catch {
        lineRecord.line.hide();
      }

      lineRecord.visible = false;
    });
  }

  showAllLines(options = {}) {
    this._lines.forEach((lineRecord) => {
      this.showLine(lineRecord.id, options);
    });
  }

  positionLines() {
    this._lines.forEach((lineRecord) => {
      if (lineRecord.line && typeof lineRecord.line.position === "function") {
        lineRecord.line.position();
      }
    });
  }

  _createLineRecord(LeaderLine, lineStyle, index, startPoint, endPoint) {
    const startSelector = this._normalizeSelector(startPoint?.element);
    const endSelector = this._normalizeSelector(endPoint?.element);

    if (!startSelector || !endSelector) {
      this.logger.trace(
        `Skipping line ${index}: missing start or end selector`,
      );
      return null;
    }

    const startElement = this.root.querySelector(startSelector);
    const endElement = this.root.querySelector(endSelector);

    if (!startElement || !endElement) {
      this.logger.trace(
        `Skipping line ${index}: selector not found (${startSelector} -> ${endSelector})`,
      );
      return null;
    }

    const startAnchor = {
      x: startPoint?.x || "50%",
      y: startPoint?.y || "50%",
    };
    const endAnchor = {
      x: endPoint?.x || "50%",
      y: endPoint?.y || "50%",
    };

    const line = new LeaderLine(
      LeaderLine.pointAnchor(startElement, startAnchor),
      LeaderLine.pointAnchor(endElement, endAnchor),
      {
        ...lineStyle,
        hide: true,
      },
    );

    const id = this._buildLineId(index, startPoint, endPoint);

    return {
      id,
      index,
      line,
      visible: false,
      start: startPoint,
      end: endPoint,
      startElement,
      endElement,
    };
  }

  _buildLineId(index, startPoint, endPoint) {
    const startId =
      startPoint?.id || this._normalizeSelector(startPoint?.element);
    const endId = endPoint?.id || this._normalizeSelector(endPoint?.element);
    return `line-${index}:${startId}->${endId}`;
  }

  _findLineRecord(lineRef) {
    if (typeof lineRef === "number") {
      return this._lines[lineRef] || null;
    }

    if (typeof lineRef === "string") {
      return this._lines.find((record) => record.id === lineRef) || null;
    }

    return null;
  }

  _normalizeSelector(selector) {
    if (typeof selector !== "string") {
      return "";
    }

    const trimmed = selector.trim();
    if (!trimmed) {
      return "";
    }

    return trimmed;
  }

  _normalizeSectionId(sectionId) {
    if (typeof sectionId !== "string") {
      return "";
    }

    const trimmed = sectionId.trim();
    if (!trimmed) {
      return "";
    }

    return trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
  }

  _resolveTailwindColor(variableName, fallback) {
    const value = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();

    return value || fallback;
  }

  _getSectionLeadLineStyle() {
    const main = this.root.querySelector("main");
    const mainColor = main ? window.getComputedStyle(main).color : "#E6E7E7";

    const accentColor = this._resolveTailwindColor(
      this.theme.stroke.variableName,
      mainColor,
    );
    const outlineColor = this._resolveTailwindColor(
      this.theme.outline.variableName,
      this.theme.outline.fallback,
    );

    return {
      ...this.styles,
      color: accentColor,
      endPlugColor: accentColor,
      startPlugColor: accentColor,
      outlineColor,
    };
  }

  _bindPositionListeners() {
    this._unbindPositionListeners();

    window.addEventListener("resize", this._handleLinePositionUpdate, {
      passive: true,
    });
    window.addEventListener("scroll", this._handleLinePositionUpdate, {
      passive: true,
    });
    window.addEventListener("load", this._handleLinePositionUpdate, {
      once: true,
    });
  }

  _unbindPositionListeners() {
    window.removeEventListener("resize", this._handleLinePositionUpdate);
    window.removeEventListener("scroll", this._handleLinePositionUpdate);
    window.removeEventListener("load", this._handleLinePositionUpdate);
  }

  _destroyLines() {
    this._lines.forEach((lineRecord) => {
      if (lineRecord.line && typeof lineRecord.line.remove === "function") {
        lineRecord.line.remove();
      }
    });

    this._lines = [];
  }
}
