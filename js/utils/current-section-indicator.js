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
 * - Keeps the marker non-visible until the first following sibling crosses threshold.
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
  selectorMarker: "#current-section-marker", // the container
  selectorSiblingAnchor: "#section-cap-anchor", // the element used to find siblings; defaults to marker if not found
  fallbackTitle: "none",
};

const SELECTOR_PREFIX = "#current-section-prefix";
const SELECTOR_COUNT = "#current-section-count";
const SELECTOR_SEPARATOR = "#current-section-separator";
const SELECTOR_TITLE = "#current-section-title";
const PREFIX_TEXT = "section";
const SEPARATOR_TEXT = ":";

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

function safeQuerySelector(root, selector) {
  if (!root || !selector) return null;
  try {
    return root.querySelector(selector);
  } catch {
    return null;
  }
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

  // Reverse scan exits early for lower viewport ranges.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    if (sections[i].getBoundingClientRect().top <= thresholdPx) {
      return i;
    }
  }

  return 0;
}

function setNodeText(node, value) {
  if (!node) return;
  if (node.textContent === value) return;
  node.textContent = value;
}

function setNodeAttribute(node, name, value) {
  if (!node) return;
  if (node.getAttribute(name) === value) return;
  node.setAttribute(name, value);
}

/**
 * Orchestrates current-section marker state and rendering.
 */
class CurrentSectionIndicatorController {
  constructor(options = {}) {
    this.config = { ...DEFAULTS, ...options };
    this.marker = null;
    this.siblingAnchor = null;
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
    this._forceNextUpdate = false;

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

    this.marker = safeQuerySelector(document, this.config.selectorMarker);
    this.siblingAnchor = safeQuerySelector(
      document,
      this.config.selectorSiblingAnchor,
    );

    if (!this.marker) {
      return this;
    }

    if (!this.siblingAnchor) {
      this.siblingAnchor = this.marker;
    }

    this.prefix = safeQuerySelector(this.marker, SELECTOR_PREFIX);
    this.count = safeQuerySelector(this.marker, SELECTOR_COUNT);
    this.separator = safeQuerySelector(this.marker, SELECTOR_SEPARATOR);
    this.title = safeQuerySelector(this.marker, SELECTOR_TITLE);
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

    // Re-resolve anchor in case DOM changed since init.
    this.siblingAnchor =
      safeQuerySelector(document, this.config.selectorSiblingAnchor) ||
      this.marker;

    this.followingSiblings = getFollowingSiblings(this.siblingAnchor);
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

    this.isVisible = isVisible;

    setNodeAttribute(this.marker, "aria-hidden", String(!isVisible));
    setNodeAttribute(
      this.marker,
      "aria-live",
      isVisible ? this.defaultAriaLive : "off",
    );

    this.marker.style.opacity = isVisible ? "1" : "0";

    return true;
  }

  _render({ position, total, title, force }) {
    const hasChanged =
      force || this.activePosition !== position || this.activeTitle !== title;

    if (!hasChanged) return;

    this.activePosition = position;
    this.activeTitle = title;

    setNodeText(this.prefix, PREFIX_TEXT);
    setNodeText(this.count, `${position} of ${total}`);
    setNodeText(this.separator, SEPARATOR_TEXT);
    setNodeText(this.title, title);

    // Keep an explicit sentence on the status node for assistive technologies.
    setNodeAttribute(
      this.marker,
      "aria-label",
      `${PREFIX_TEXT} ${position} of ${total} ${SEPARATOR_TEXT} ${title}`,
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

export const CURRENT_SECTION_INDICATOR_DEFAULTS = DEFAULTS;
