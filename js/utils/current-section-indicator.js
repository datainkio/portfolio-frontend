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
 * - Supports multiple marker instances on the page.
 * - Treats each marker's parent section as its data source.
 * - Computes position/total using sibling sections under the parent's parent.
 * - Keeps content deterministic and free of scroll-coupled visibility transitions.
 *
 * Runtime overrides are read from marker data attributes:
 * - data-tracked-sections-selector
 */

const DEFAULTS = {
  selectorMarker: "[data-current-section-marker]",
  selectorTrackedSections: "section[id]:not(#hero)",
  fallbackTitle: "none",
};

const SELECTOR_PREFIX = "[data-current-section-prefix]";
const SELECTOR_COUNT = "[data-current-section-count]";
const SELECTOR_SEPARATOR = "[data-current-section-separator]";
const SELECTOR_TITLE = "[data-current-section-title]";
const PREFIX_TEXT = "section";
const SEPARATOR_TEXT = ":";

function isSectionElement(node) {
  return node?.tagName === "SECTION";
}

function sectionMatchesSelector(section, selector) {
  if (!isSectionElement(section) || typeof section.matches !== "function") {
    return false;
  }

  try {
    return section.matches(selector);
  } catch {
    return false;
  }
}

function getParentSection(marker) {
  if (!marker) return null;

  const directParent = marker.parentElement;
  if (isSectionElement(directParent)) {
    return directParent;
  }

  return marker.closest("section");
}

function getTrackedSections(parentSection, selector) {
  const sectionContainer = parentSection?.parentElement;
  if (!sectionContainer) return [];

  return Array.from(sectionContainer.children).filter((child) =>
    sectionMatchesSelector(child, selector),
  );
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

class CurrentSectionTitleInstance {
  constructor(marker, options = {}) {
    this.marker = marker;
    this.config = { ...DEFAULTS, ...options };

    this.prefix = this.marker.querySelector(SELECTOR_PREFIX);
    this.count = this.marker.querySelector(SELECTOR_COUNT);
    this.separator = this.marker.querySelector(SELECTOR_SEPARATOR);
    this.title = this.marker.querySelector(SELECTOR_TITLE);

    this.parentSection = null;
    this.trackedSections = [];
  }

  _resolveTrackedSelector() {
    const selectorFromDataset = this.marker.dataset.trackedSectionsSelector;
    if (typeof selectorFromDataset === "string" && selectorFromDataset.trim()) {
      return selectorFromDataset.trim();
    }

    return this.config.selectorTrackedSections;
  }

  refresh() {
    this.parentSection = getParentSection(this.marker);
    const trackedSelector = this._resolveTrackedSelector();
    this.trackedSections = getTrackedSections(
      this.parentSection,
      trackedSelector,
    );

    const total = this.trackedSections.length;
    const position =
      this.parentSection && total
        ? this.trackedSections.indexOf(this.parentSection) + 1
        : 0;
    const title = this.parentSection?.id || this.config.fallbackTitle;

    const isTrackedSection = position > 0;

    setNodeAttribute(this.marker, "aria-hidden", String(!isTrackedSection));
    setNodeAttribute(
      this.marker,
      "aria-live",
      isTrackedSection ? "polite" : "off",
    );
    this.marker.style.opacity = isTrackedSection ? "1" : "0";

    setNodeText(this.prefix, PREFIX_TEXT);
    setNodeText(this.count, `${position} of ${total}`);
    setNodeText(this.separator, SEPARATOR_TEXT);
    setNodeText(this.title, title);

    setNodeAttribute(
      this.marker,
      "aria-label",
      `${PREFIX_TEXT} ${position} of ${total} ${SEPARATOR_TEXT} ${title}`,
    );
  }
}

class CurrentSectionIndicatorController {
  constructor(options = {}) {
    this.config = { ...DEFAULTS, ...options };
    this.instances = [];
    this._initialized = false;
    this._boundOnResize = this._onResize.bind(this);
  }

  _findMarkers() {
    return Array.from(document.querySelectorAll(this.config.selectorMarker));
  }

  _buildInstances() {
    this.instances = this._findMarkers().map(
      (marker) => new CurrentSectionTitleInstance(marker, this.config),
    );
  }

  init() {
    if (this._initialized) return this;

    this._buildInstances();
    this.refresh();

    window.addEventListener("resize", this._boundOnResize);
    window.addEventListener("orientationchange", this._boundOnResize);

    this._initialized = true;
    return this;
  }

  refresh() {
    if (!this.instances.length) {
      this._buildInstances();
    }

    this.instances.forEach((instance) => instance.refresh());
  }

  destroy() {
    if (!this._initialized) return;

    window.removeEventListener("resize", this._boundOnResize);
    window.removeEventListener("orientationchange", this._boundOnResize);

    this.instances = [];
    this._initialized = false;
  }

  _onResize() {
    this.refresh();
  }
}

let singleton = null;

export function initCurrentSectionIndicator(options = {}) {
  if (singleton) return singleton;

  singleton = new CurrentSectionIndicatorController(options);
  singleton.init();
  return singleton;
}

export function getCurrentSectionIndicator() {
  return singleton;
}

export const CURRENT_SECTION_INDICATOR_DEFAULTS = DEFAULTS;
