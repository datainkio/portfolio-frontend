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
import { SOCKETS, LINE_STYLES } from "../config/displays/leader-lines.js";

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
    this.sockets =
      options.sockets && typeof options.sockets === "object"
        ? options.sockets
        : options.lines && typeof options.lines === "object"
          ? options.lines
          : SOCKETS;
    this.styles = options.styles || LINE_STYLES;

    this._lines = [];
    this._leaderLineCtor = null;
    this._lineOptions = null;
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
      this.logger.trace("LeaderLine unavailable; skipping leader lines");
      return;
    }

    const socketEntries = Object.entries(this.sockets || {});
    if (!socketEntries.length) {
      this.logger.trace("No leader lines configured");
      return;
    }

    this._leaderLineCtor = LeaderLine;
    this._lineOptions = this._getLeaderLineOptions();

    this._bindPositionListeners();
    this._handleLinePositionUpdate();
    this.logger.trace("Leader lines initialized");
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

  connect(originSocketKey, terminusSocketKey, options = {}) {
    const originKey = this._normalizeSocketKey(originSocketKey);
    const terminusKey = this._normalizeSocketKey(terminusSocketKey);
    if (!originKey || !terminusKey) {
      return false;
    }

    const lineId = `${originKey}->${terminusKey}`;
    let lineRecord = this._findLineRecord(lineId);

    if (!lineRecord) {
      lineRecord = this._createLineRecord(
        this._leaderLineCtor,
        this._lineOptions,
        originKey,
        terminusKey,
        this._lines.length,
      );

      if (!lineRecord) {
        return false;
      }

      this._lines.push(lineRecord);
      this._handleLinePositionUpdate();
    }

    return this.showLine(lineId, options);
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

  positionLines() {
    this._lines.forEach((lineRecord) => {
      if (lineRecord.line && typeof lineRecord.line.position === "function") {
        lineRecord.line.position();
      }
    });
  }

  _createLineRecord(
    LeaderLine,
    lineOptions,
    originSocketId,
    terminusSocketId,
    index,
  ) {
    if (!LeaderLine || typeof LeaderLine.pointAnchor !== "function") {
      this.logger.trace("LeaderLine unavailable; cannot create line");
      return null;
    }

    const originKey = this._normalizeSocketKey(originSocketId);
    const terminusKey = this._normalizeSocketKey(terminusSocketId);

    const id = `${originKey}->${terminusKey}`;
    if (!originKey || !terminusKey) {
      this.logger.trace(`Skipping line ${index}: missing socket key`);
      return null;
    }

    const originSocket = this.sockets?.[originKey];
    const terminusSocket = this.sockets?.[terminusKey];
    const origin = originSocket?.origin;
    const terminus = terminusSocket?.terminus;

    if (!origin || !terminus) {
      this.logger.trace(
        `Skipping line ${index}: missing origin/terminus socket (${originKey} -> ${terminusKey})`,
      );
      return null;
    }

    const startSelector = this._normalizeSelector(origin?.element);
    const endSelector = this._normalizeSelector(terminus?.element);

    if (!startSelector || !endSelector) {
      this.logger.trace(
        `Skipping line ${index}: missing origin/terminus element selector`,
      );
      return null;
    }

    const startElement = this._resolveSocketElement(origin, startSelector);
    const endElement = this._resolveSocketElement(terminus, endSelector);

    if (!startElement || !endElement) {
      this.logger.trace(
        `Skipping line ${index}: selector not found (${startSelector} -> ${endSelector})`,
      );
      return null;
    }

    const startAnchor = {
      x: origin?.x || "50%",
      y: origin?.y || "50%",
    };
    const endAnchor = {
      x: terminus?.x || "50%",
      y: terminus?.y || "50%",
    };

    const line = new LeaderLine(
      LeaderLine.pointAnchor(startElement, startAnchor),
      LeaderLine.pointAnchor(endElement, endAnchor),
      {
        ...lineOptions,
        hide: true,
      },
    );

    this._applyLineClasses(line, this.styles?.classes);

    return {
      id,
      line,
      visible: false,
    };
  }

  _normalizeSocketKey(socketKey) {
    const normalized = this._normalizeSelector(socketKey);
    if (!normalized) {
      return "";
    }

    if (this.sockets && normalized in this.sockets) {
      return normalized;
    }

    const withoutHash = normalized.startsWith("#")
      ? normalized.slice(1)
      : normalized;

    if (this.sockets && withoutHash in this.sockets) {
      return withoutHash;
    }

    return normalized;
  }

  _resolveSocketElement(socket, elementSelector) {
    const scopes = [];
    const socketScope = socket?.scope;

    if (socketScope && typeof socketScope === "object") {
      scopes.push(socketScope);
    } else if (typeof socketScope === "string") {
      const normalizedScope = this._normalizeSelector(socketScope);
      if (normalizedScope === "document") {
        scopes.push(document);
      } else if (normalizedScope) {
        const scopeElement = document.querySelector(normalizedScope);
        if (scopeElement) {
          scopes.push(scopeElement);
        }
      }
    }

    if (this.root) {
      scopes.push(this.root);
    }

    if (!scopes.includes(document)) {
      scopes.push(document);
    }

    for (const scope of scopes) {
      if (!scope || typeof scope.querySelector !== "function") {
        continue;
      }

      const candidate = scope.querySelector(elementSelector);
      if (candidate) {
        return candidate;
      }
    }

    return null;
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

  _getLeaderLineOptions() {
    const options = { ...this.styles };
    delete options.classes;
    return options;
  }

  _applyLineClasses(line, classNames) {
    if (typeof classNames !== "string" || !classNames.trim()) {
      return;
    }

    const svg = this._resolveLineSvgElement(line);
    if (!svg || !svg.classList) {
      return;
    }

    svg.classList.add(...classNames.split(/\s+/).filter(Boolean));
  }

  _resolveLineSvgElement(line) {
    const directRefs = [line?.svg, line?.element, line?._el];
    for (const ref of directRefs) {
      if (!ref || typeof ref !== "object") {
        continue;
      }

      if (ref instanceof SVGElement) {
        return ref;
      }

      if (typeof ref.querySelector === "function") {
        const nestedSvg = ref.querySelector("svg");
        if (nestedSvg) {
          return nestedSvg;
        }
      }
    }

    if (typeof line?._id === "string" && line._id) {
      const byId = document.getElementById(line._id);
      if (byId instanceof SVGElement) {
        return byId;
      }

      if (byId && typeof byId.querySelector === "function") {
        return byId.querySelector("svg");
      }
    }

    return null;
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
