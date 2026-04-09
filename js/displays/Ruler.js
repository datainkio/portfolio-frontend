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
import { RULER_DEFAULTS } from "../choreography/config/ruler.js";

export class Ruler {
  constructor(container, options = {}) {
    if (!container) throw new Error("Ruler: container is required");

    this.container = container;

    this.opts = {
      ...RULER_DEFAULTS,
      ...options,
    };

    this.svgNS = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(this.svgNS, "svg");
    this.svg.setAttribute("width", "100%");
    this.svg.style.display = "block";
    this.svg.style.userSelect = "none";

    container.appendChild(this.svg);

    this._ro = new ResizeObserver(() => this.render());
    this._ro.observe(container);

    this.render();
  }

  setOptions(next = {}) {
    this.opts = { ...this.opts, ...next };
    this.render();
  }

  destroy() {
    this._ro?.disconnect();
    this.svg?.remove();
  }

  render() {
    const {
      intervals,
      subticksPerInterval,
      height,
      paddingTop,
      paddingBottom,
      tickHeight,
      subtickHeight,
      labelGap,
      startAt,
      step,
      strokeWidth,
      fontSize,
      fontFamily,
      color,
    } = this.opts;

    const width = this.container.clientWidth;
    if (!width || width <= 0) return;

    // Clear SVG
    this.svg.replaceChildren();

    this.svg.setAttribute("height", height);
    this.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const baselineY = height - paddingBottom;
    const labelTopY = paddingTop;
    const majorTickTopY = labelTopY + fontSize + labelGap;
    const minorTickTopY = baselineY - subtickHeight;

    // Baseline
    const baseline = document.createElementNS(this.svgNS, "line");
    baseline.setAttribute("x1", 0);
    baseline.setAttribute("y1", baselineY);
    baseline.setAttribute("x2", width);
    baseline.setAttribute("y2", baselineY);
    baseline.setAttribute("stroke", color);
    baseline.setAttribute("stroke-width", strokeWidth);
    this.svg.appendChild(baseline);

    const majorCount = Math.max(1, Math.floor(intervals));
    const majorStepPx = width / majorCount;
    const minorStepPx = majorStepPx / subticksPerInterval;

    for (let i = 0; i <= majorCount; i++) {
      const xMajor = i * majorStepPx;

      // --- Major tick ---
      const majorTick = document.createElementNS(this.svgNS, "line");
      majorTick.setAttribute("x1", xMajor);
      majorTick.setAttribute("y1", baselineY);
      majorTick.setAttribute(
        "y2",
        Math.max(majorTickTopY, baselineY - tickHeight),
      );
      majorTick.setAttribute("x2", xMajor);
      majorTick.setAttribute("stroke", color);
      majorTick.setAttribute("stroke-width", strokeWidth);
      this.svg.appendChild(majorTick);

      // --- Label ---
      // --- Label ---
      const label = document.createElementNS(this.svgNS, "text");
      label.textContent = String(startAt + i * step);
      label.setAttribute("x", xMajor);
      label.setAttribute("y", labelTopY);
      label.setAttribute("fill", color);
      label.setAttribute("font-size", fontSize);
      label.setAttribute("font-family", fontFamily);
      label.setAttribute("dominant-baseline", "hanging");

      // NEW: edge-aware anchoring
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

      for (let j = 1; j < subticksPerInterval; j++) {
        const xMinor = xMajor + j * minorStepPx;

        // Height ratios by position within the interval:
        // - middle (1/2): 75%
        // - quarters (1/4, 3/4): 50%
        // - others: 25%
        let ratio = 0.25;

        if (subticksPerInterval % 2 === 0 && j === subticksPerInterval / 2) {
          ratio = 0.75;
        } else if (
          subticksPerInterval % 4 === 0 &&
          (j === subticksPerInterval / 4 || j === (3 * subticksPerInterval) / 4)
        ) {
          ratio = 0.5;
        }

        const h = tickHeight * ratio;
        const y2 = Math.max(majorTickTopY, baselineY - h);

        const minorTick = document.createElementNS(this.svgNS, "line");
        minorTick.setAttribute("x1", xMinor);
        minorTick.setAttribute("y1", baselineY);
        minorTick.setAttribute("x2", xMinor);
        minorTick.setAttribute("y2", y2);
        minorTick.setAttribute("stroke", color);
        minorTick.setAttribute("stroke-width", strokeWidth);
        minorTick.setAttribute("opacity", "0.6");
        this.svg.appendChild(minorTick);
      }
    }
  }
}

// Convenience helper
export function createRuler(container, options) {
  return new Ruler(container, options);
}
