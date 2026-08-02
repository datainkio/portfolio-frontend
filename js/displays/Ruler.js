/**
 * ---
 * aix:
 *   id: frontend.js.displays.ruler
 *   role: Frontend runtime module: js/displays/Ruler.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - displays
 *     - Ruler.js
 * ---
 */
// ruler.js
import { RULER_DEFAULTS } from "../choreography/config/displays/ruler.js";

const GEOMETRY_CSS_VAR = Object.freeze({
  tickHeight: "--ruler-tick-height",
  subtickHeight: "--ruler-subtick-height",
  labelGap: "--ruler-label-gap",
});

function readNumberCssVar(styles, varName, fallback) {
  const raw = styles?.getPropertyValue(varName)?.trim();
  if (!raw) return fallback;

  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readComputedSize(styles, propertyName, fallback) {
  const raw = styles?.getPropertyValue(propertyName)?.trim();
  if (!raw) return fallback;

  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function applyClasses(element, classes) {
  if (!element || !classes) return;
  element.classList.add(...classes.split(/\s+/).filter(Boolean));
}

export class Ruler {
  constructor(container, options = {}) {
    if (!container) throw new Error("Ruler: container is required");

    this.container = container;
    this._optionOverrides = { ...options };

    this.opts = {
      ...RULER_DEFAULTS,
      ...this._optionOverrides,
    };

    applyClasses(this.container, this.opts.rootClasses);

    this.svgNS = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(this.svgNS, "svg");
    applyClasses(this.svg, this.opts.svgClasses);
    this.svg.setAttribute("width", "100%");

    container.appendChild(this.svg);

    this._ro = new ResizeObserver(() => this.render());
    this._ro.observe(container);

    this.render();
  }

  setOptions(next = {}) {
    this._optionOverrides = { ...this._optionOverrides, ...next };
    this.opts = {
      ...RULER_DEFAULTS,
      ...this._optionOverrides,
    };

    if (next.rootClasses) {
      applyClasses(this.container, this.opts.rootClasses);
    }

    if (next.svgClasses) {
      this.svg.className.baseVal = "";
      applyClasses(this.svg, this.opts.svgClasses);
    }

    this.render();
  }

  destroy() {
    this._ro?.disconnect();
    this.svg?.remove();
  }

  render() {
    const { intervals, subticksPerInterval, startAt, step } = this.opts;

    const computed = getComputedStyle(this.container);
    const height = readComputedSize(computed, "height", 48);
    const paddingTop = readComputedSize(computed, "padding-top", 4);
    const paddingBottom = readComputedSize(computed, "padding-bottom", 4);
    const tickHeight = readNumberCssVar(
      computed,
      GEOMETRY_CSS_VAR.tickHeight,
      32,
    );
    const subtickHeight = readNumberCssVar(
      computed,
      GEOMETRY_CSS_VAR.subtickHeight,
      10,
    );
    const labelGap = readNumberCssVar(computed, GEOMETRY_CSS_VAR.labelGap, 2);
    const fontSize = readComputedSize(computed, "font-size", 12);

    const width = this.container.clientWidth;
    if (!width || width <= 0 || height <= 0) return;

    // Clear SVG
    this.svg.replaceChildren();

    this.svg.setAttribute("height", height);
    this.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const baselineY = height - paddingBottom;
    const labelTopY = paddingTop;
    const majorTickTopY = labelTopY + fontSize + labelGap;

    // Baseline
    const baseline = document.createElementNS(this.svgNS, "line");
    applyClasses(baseline, this.opts.baselineClasses);
    baseline.setAttribute("data-ruler-baseline", "true");
    baseline.setAttribute("x1", 0);
    baseline.setAttribute("y1", baselineY);
    baseline.setAttribute("x2", width);
    baseline.setAttribute("y2", baselineY);
    this.svg.appendChild(baseline);

    const majorCount = Math.max(1, Math.floor(intervals));
    const normalizedSubticks = Math.max(2, Math.floor(subticksPerInterval));
    const majorStepPx = width / majorCount;
    const minorStepPx = majorStepPx / normalizedSubticks;

    for (let i = 0; i <= majorCount; i++) {
      const xMajor = i * majorStepPx;

      // --- Major tick ---
      const majorTick = document.createElementNS(this.svgNS, "line");
      applyClasses(majorTick, this.opts.majorTickClasses);
      majorTick.setAttribute("x1", xMajor);
      majorTick.setAttribute("y1", baselineY);
      majorTick.setAttribute(
        "y2",
        Math.max(majorTickTopY, baselineY - tickHeight),
      );
      majorTick.setAttribute("x2", xMajor);
      this.svg.appendChild(majorTick);

      // --- Label ---
      const label = document.createElementNS(this.svgNS, "text");
      applyClasses(label, this.opts.labelClasses);
      label.textContent = String(startAt + i * step);
      label.setAttribute("x", xMajor);
      label.setAttribute("y", labelTopY);
      label.setAttribute("dominant-baseline", "hanging");

      // Edge-aware label anchoring prevents clipping at boundaries.
      if (i === 0) {
        label.setAttribute("text-anchor", "start"); // left edge at tick center
      } else if (i === majorCount) {
        label.setAttribute("text-anchor", "end"); // right edge at tick center
      } else {
        label.setAttribute("text-anchor", "middle"); // centered on tick
      }

      this.svg.appendChild(label);

      // --- Subticks (skip after last major) ---
      if (i === majorCount) continue;

      for (let j = 1; j < normalizedSubticks; j++) {
        const xMinor = xMajor + j * minorStepPx;

        // Height ratios by position within the interval:
        // - middle (1/2): 75%
        // - quarters (1/4, 3/4): 50%
        // - others: 25%
        let ratio = 0.25;

        if (normalizedSubticks % 2 === 0 && j === normalizedSubticks / 2) {
          ratio = 0.75;
        } else if (
          normalizedSubticks % 4 === 0 &&
          (j === normalizedSubticks / 4 || j === (3 * normalizedSubticks) / 4)
        ) {
          ratio = 0.5;
        }

        const h = Math.min(tickHeight, (subtickHeight * ratio) / 0.25);
        const y2 = Math.max(majorTickTopY, baselineY - h);

        const minorTick = document.createElementNS(this.svgNS, "line");
        applyClasses(minorTick, this.opts.minorTickClasses);
        minorTick.classList.add(j % 2 === 0 ? "tick-even" : "tick-odd");
        minorTick.setAttribute("x1", xMinor);
        minorTick.setAttribute("y1", baselineY);
        minorTick.setAttribute("x2", xMinor);
        minorTick.setAttribute("y2", y2);
        this.svg.appendChild(minorTick);
      }
    }
  }
}

// Convenience helper
export function createRuler(container, options) {
  return new Ruler(container, options);
}
