import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

/**
 * WorkNavManager — scrollspy for the work section local in-page nav.
 *
 * Observes the industry groups and reflects the one currently in view onto its
 * jumplink via `aria-current="true"`. Broadcasts the active id on the bus so
 * later breakpoint surfaces (rail, disclosure) can react without re-deriving
 * scroll state. Native anchors keep working with no JS; this only adds the
 * active hint. See specs/animation/work-section-navigation.animation-spec.md.
 */

const WORK_EL_ATTR = "data-projects-el";
const LINK_VALUE = "industry-link";
const GROUP_VALUE = "industry-group";

// Active band sits in the top fifth of the viewport. The lowest group whose
// top has crossed into this band is the one the user is reading.
const ACTIVE_BAND_ROOT_MARGIN = "0px 0px -80% 0px";
export default class WorkNavManager {
  constructor({ bus } = {}) {
    this.logger = lumberjack.createScoped("WorkNavManager", {
      color: "#A855F7",
      enabled: true,
    });

    this._bus = bus ?? null;
    this._bandObserver = null;
    this._viewportObserver = null;
    // _activeId owns aria-current. null = no group in the viewport, so no
    // link is current.
    this._activeId = null;
    this._inBand = new Set();
    this._inViewport = new Set();

    // The industry groups live inside the work section. The jumplinks do not:
    // their fixed <header> renders outside #page-main-content (base.njk
    // `afterMain`) so ScrollSmoother's transform on <main> can't displace it,
    // so they're resolved document-wide.
    const workSection = document.getElementById(SELECTORS.work);
    const links = Array.from(
      document.querySelectorAll(`[${WORK_EL_ATTR}="${LINK_VALUE}"]`),
    );
    this._groups = Array.from(
      workSection?.querySelectorAll(`[${WORK_EL_ATTR}="${GROUP_VALUE}"]`) ?? [],
    );

    // Map shared `industry-{slug}` id → its jumplink. Link href hash and group
    // aria-labelledby both resolve to the heading id.
    this._linkById = new Map();
    links.forEach((link) => {
      const id = link.getAttribute("href")?.replace(/^#/, "");
      if (id) this._linkById.set(id, link);
    });

    if (!this._groups.length || !this._linkById.size) {
      this.logger.trace("no work nav groups/links found; disabled");
      return;
    }

    this._init();
  }

  _init() {
    // Two observers: the band picks WHICH group is current; the viewport
    // decides WHETHER any is. Groups are spaced wider than the band, so
    // clearing on an empty band alone would blink the nav off between groups.
    const track = (set) => (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) set.add(entry.target);
        else set.delete(entry.target);
      });
      this._update();
    };
    this._bandObserver = new IntersectionObserver(track(this._inBand), {
      rootMargin: ACTIVE_BAND_ROOT_MARGIN,
      threshold: 0,
    });
    this._viewportObserver = new IntersectionObserver(track(this._inViewport), {
      threshold: 0,
    });
    this._groups.forEach((group) => {
      this._bandObserver.observe(group);
      this._viewportObserver.observe(group);
    });

    this.logger.trace("initialized");
  }

  _update() {
    // No group in the viewport: nothing is current.
    if (!this._inViewport.size) {
      this._setActive(null);
      return;
    }

    // Active = lowest group in the band, in document order (reading position).
    // Band empty but a group still visible (between groups, or a group only
    // partly scrolled in): keep the current link.
    let active = null;
    for (const group of this._groups) {
      if (this._inBand.has(group)) active = group;
    }
    if (active) this._setActive(active.getAttribute("aria-labelledby"));
  }

  _setActive(id) {
    if (id === this._activeId) return;
    if (id && !this._linkById.has(id)) return;

    this._linkById.get(this._activeId)?.removeAttribute("aria-current");
    this._linkById.get(id)?.setAttribute("aria-current", "true");
    this._activeId = id;

    this._bus?.emit(EVENTS.workNav.activeChange, { id });
  }

  kill() {
    this._bandObserver?.disconnect();
    this._viewportObserver?.disconnect();
    this._bandObserver = null;
    this._viewportObserver = null;
    this._linkById.forEach((link) => link.removeAttribute("aria-current"));
    this._activeId = null;
    this._inBand.clear();
    this._inViewport.clear();
    this.logger.trace("destroyed");
  }
}
