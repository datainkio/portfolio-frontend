/**
 * ---
 * aix:
 *   id: frontend.js.utils.current-section-indicator
 *   role: Frontend runtime module: js/utils/current-section-indicator.js
 *   status: draft
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - utils
 *     - current-section-indicator
 *     - landing ux
 * ---
 */

/**
 * Current section indicator runtime.
 *
 * Behavior summary:
 * - Tracks sections that follow the marker in DOM order.
 * - Uses a top-of-viewport threshold to determine active section.
 * - Keeps the marker hidden until the first following sibling crosses threshold.
 * - Animates visibility changes with an opacity transition.
 *
 * Runtime overrides are read from marker data attributes:
 * - data-threshold-ratio
 * - data-visibility-transition-duration-ms
 */

/**
 * Baseline configuration for the controller.
 * Values can be overridden via init options and marker data attributes.
 */
const DEFAULTS = {
  thresholdRatio: 0.12,
  visibilityTransitionDurationMs: 180,
  selectorMain: "#page-main",
  selectorMarker: "#current-section-marker",
  selectorPrefix: "#current-section-prefix",
  selectorCount: "#current-section-count",
  selectorSeparator: "#current-section-separator",
  selectorTitle: "#current-section-title",
  prefixText: "section",
  separatorText: ":",
  fallbackTitle: "none",
};

function parseThresholdRatio(value, fallback) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) return fallback;
  return parsed;
}

function parseDurationMs(value, fallback) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.round(parsed);
}

function getFollowingSiblings(marker) {
  const siblings = [];
  let current = marker?.nextElementSibling ?? null;

  while (current) {
    siblings.push(current);
    current = current.nextElementSibling;
  }

  return siblings;
}

function getTrackedSections(siblings) {
  return siblings.filter(
    (element) =>
      element?.tagName === "SECTION" &&
      typeof element.id === "string" &&
      element.id.trim().length > 0,
  );
}

function resolveActiveIndex(sections, thresholdPx) {
  if (!sections.length) return -1;

  let activeIndex = 0;
  for (let i = 0; i < sections.length; i += 1) {
    const top = sections[i].getBoundingClientRect().top;
    if (top <= thresholdPx) {
      activeIndex = i;
    }
  }

  return activeIndex;
}

function setNodeText(node, value) {
  if (!node) return;
  if (node.textContent === value) return;
  node.textContent = value;
}

/**
 * Orchestrates current-section marker state and rendering.
 */
class CurrentSectionIndicatorController {
  constructor(options = {}) {
    this.config = { ...DEFAULTS, ...options };
    this.main = null;
    this.marker = null;
    this.prefix = null;
    this.count = null;
    this.separator = null;
    this.title = null;

    this.followingSiblings = [];
    this.sections = [];
    this.totalCount = 0;

    this.activePosition = 0;
    this.activeTitle = this.config.fallbackTitle;
    this.isVisible = null;
    this.defaultAriaLive = "polite";
    this.thresholdRatio = parseThresholdRatio(
      this.config.thresholdRatio,
      DEFAULTS.thresholdRatio,
    );
    this.visibilityTransitionDurationMs = parseDurationMs(
      this.config.visibilityTransitionDurationMs,
      DEFAULTS.visibilityTransitionDurationMs,
    );

    this._rafId = 0;
    this._initialized = false;
    this._visibilityTimer = null;

    this._boundOnScroll = this._onScroll.bind(this);
    this._boundOnResize = this._onResize.bind(this);
  }

  /**
   * Resolve DOM references and start event listeners.
   * Safe to call multiple times; subsequent calls are no-ops.
   * @returns {CurrentSectionIndicatorController}
   */
  init() {
    if (this._initialized) return this;

    this.main = document.querySelector(this.config.selectorMain);
    this.marker = document.querySelector(this.config.selectorMarker);

    if (!this.main || !this.marker) {
      return this;
    }

    this.prefix = this.marker.querySelector(this.config.selectorPrefix);
    this.count = this.marker.querySelector(this.config.selectorCount);
    this.separator = this.marker.querySelector(this.config.selectorSeparator);
    this.title = this.marker.querySelector(this.config.selectorTitle);
    this.defaultAriaLive = this.marker.getAttribute("aria-live") || "polite";

    this._syncConfigFromDataset();
    this._setupVisibilityTransition();

    this._initialized = true;
    this.refresh();

    window.addEventListener("scroll", this._boundOnScroll, { passive: true });
    window.addEventListener("resize", this._boundOnResize);
    window.addEventListener("orientationchange", this._boundOnResize);

    return this;
  }

  /**
   * Rebuild section catalog and trigger a forced update.
   * Use after DOM changes that affect sibling ordering.
   */
  refresh() {
    if (!this._initialized) return;

    this._syncConfigFromDataset();
    this.followingSiblings = getFollowingSiblings(this.marker);
    this.sections = getTrackedSections(this.followingSiblings);
    this.totalCount = this.followingSiblings.length;

    this._scheduleUpdate(true);
  }

  /**
   * Remove listeners and pending timers/frames.
   * The instance can be re-initialized later via init().
   */
  destroy() {
    if (!this._initialized) return;

    window.removeEventListener("scroll", this._boundOnScroll);
    window.removeEventListener("resize", this._boundOnResize);
    window.removeEventListener("orientationchange", this._boundOnResize);

    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = 0;
    }

    this._clearVisibilityTimer();

    this._initialized = false;
  }

  _setupVisibilityTransition() {
    if (!this.marker) return;
    this.marker.style.transitionProperty = "opacity";
    this.marker.style.transitionTimingFunction = "ease";
    this.marker.style.transitionDuration = `${this.visibilityTransitionDurationMs}ms`;
  }

  _syncConfigFromDataset() {
    if (!this.marker) return;

    this.thresholdRatio = parseThresholdRatio(
      this.marker.dataset.thresholdRatio,
      this.thresholdRatio,
    );

    const durationMs = parseDurationMs(
      this.marker.dataset.visibilityTransitionDurationMs,
      this.visibilityTransitionDurationMs,
    );

    if (durationMs !== this.visibilityTransitionDurationMs) {
      this.visibilityTransitionDurationMs = durationMs;
      this._setupVisibilityTransition();
    }
  }

  _clearVisibilityTimer() {
    if (!this._visibilityTimer) return;
    clearTimeout(this._visibilityTimer);
    this._visibilityTimer = null;
  }

  _onScroll() {
    this._scheduleUpdate(false);
  }

  _onResize() {
    this._scheduleUpdate(true);
  }

  _scheduleUpdate(force) {
    if (!this._initialized) return;

    if (force) {
      this._forceNextUpdate = true;
    }

    if (this._rafId) return;

    this._rafId = requestAnimationFrame(() => {
      this._rafId = 0;
      this._update(Boolean(this._forceNextUpdate));
      this._forceNextUpdate = false;
    });
  }

  _update(force) {
    if (!this._initialized) return;

    // The first following sibling acts as the visibility gate.
    const thresholdPx = window.innerHeight * this.thresholdRatio;
    const firstSibling = this.followingSiblings[0] ?? null;
    const isVisible = Boolean(
      firstSibling && firstSibling.getBoundingClientRect().top <= thresholdPx,
    );
    const visibilityChanged = this._setVisibility(isVisible);

    if (!isVisible) {
      if (force || visibilityChanged) {
        this._render({
          position: 0,
          total: 0,
          title: this.config.fallbackTitle,
          force: true,
        });
      }
      return;
    }

    if (!this.sections.length) {
      this._render({
        position: 0,
        total: 0,
        title: this.config.fallbackTitle,
        force: force || visibilityChanged,
      });
      return;
    }

    const activeIndex = resolveActiveIndex(this.sections, thresholdPx);
    const activePosition = activeIndex + 1;
    const activeSection = this.sections[activeIndex] ?? null;
    const activeTitle = activeSection?.id ?? this.config.fallbackTitle;

    this._render({
      position: activePosition,
      total: this.totalCount,
      title: activeTitle,
      force: force || visibilityChanged,
    });
  }

  _setVisibility(isVisible) {
    if (!this.marker) return false;
    if (this.isVisible === isVisible) return false;

    this._clearVisibilityTimer();
    this.isVisible = isVisible;

    this.marker.setAttribute("aria-hidden", String(!isVisible));
    this.marker.setAttribute(
      "aria-live",
      isVisible ? this.defaultAriaLive : "off",
    );

    if (isVisible) {
      this.marker.hidden = false;
      this.marker.style.visibility = "visible";
      this.marker.style.opacity = "0";

      requestAnimationFrame(() => {
        if (!this.marker || !this.isVisible) return;
        this.marker.style.opacity = "1";
      });
      return true;
    }

    this.marker.hidden = false;
    this.marker.style.visibility = "visible";
    this.marker.style.opacity = "0";

    if (this.visibilityTransitionDurationMs === 0) {
      this.marker.style.visibility = "hidden";
      this.marker.hidden = true;
      return true;
    }

    this._visibilityTimer = setTimeout(() => {
      if (!this.marker || this.isVisible) return;
      this.marker.style.visibility = "hidden";
      this.marker.hidden = true;
      this._visibilityTimer = null;
    }, this.visibilityTransitionDurationMs);

    return true;
  }

  _render({ position, total, title, force }) {
    const hasChanged =
      force || this.activePosition !== position || this.activeTitle !== title;

    if (!hasChanged) return;

    this.activePosition = position;
    this.activeTitle = title;

    setNodeText(this.prefix, this.config.prefixText);
    setNodeText(this.count, `${position} of ${total}`);
    setNodeText(this.separator, this.config.separatorText);
    setNodeText(this.title, title);

    // Keep an explicit sentence on the status node for assistive technologies.
    this.marker.setAttribute(
      "aria-label",
      `${this.config.prefixText} ${position} of ${total} ${this.config.separatorText} ${title}`,
    );
  }
}

let singleton = null;

/**
 * Initialize a shared current-section indicator controller.
 * Returns the existing singleton if already initialized.
 * @param {Partial<typeof DEFAULTS>} [options]
 * @returns {CurrentSectionIndicatorController}
 */
export function initCurrentSectionIndicator(options = {}) {
  if (singleton) return singleton;

  singleton = new CurrentSectionIndicatorController(options);
  singleton.init();
  return singleton;
}

/**
 * Access the shared controller instance if one exists.
 * @returns {CurrentSectionIndicatorController | null}
 */
export function getCurrentSectionIndicator() {
  return singleton;
}
