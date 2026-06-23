import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

const WORK_EL_ATTR = "data-projects-el";
const LINK_VALUE = "industry-link";
const GROUP_VALUE = "industry-group";

// Active band sits in the top fifth of the viewport. The lowest group whose
// top has crossed into this band is the one the user is reading.
const ACTIVE_BAND_ROOT_MARGIN = "0px 0px -80% 0px";

/**
 * WorkNavManager — scrollspy for the work section local in-page nav.
 *
 * Observes the industry groups and reflects the one currently in view onto its
 * jumplink via `aria-current="true"`. Broadcasts the active id on the bus so
 * later breakpoint surfaces (rail, disclosure) can react without re-deriving
 * scroll state. Native anchors keep working with no JS; this only adds the
 * active hint. See specs/animation/work-section-navigation.animation-spec.md.
 */
export default class WorkNavManager {
  constructor({ bus } = {}) {
    this.logger = lumberjack.createScoped("WorkNavManager", {
      color: "#A855F7",
      enabled: true,
    });

    this._bus = bus ?? null;
    this._observer = null;
    this._activeId = null;

    const workSection = document.getElementById(SELECTORS.work);
    const links = Array.from(
      workSection?.querySelectorAll(`[${WORK_EL_ATTR}="${LINK_VALUE}"]`) ?? [],
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
    this._observer = new IntersectionObserver(
      (entries) => this._onIntersect(entries),
      { rootMargin: ACTIVE_BAND_ROOT_MARGIN, threshold: 0 },
    );
    this._visible = new Set();
    this._groups.forEach((group) => this._observer.observe(group));
    this.logger.trace("initialized");
  }

  _onIntersect(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) this._visible.add(entry.target);
      else this._visible.delete(entry.target);
    });

    // Active = lowest visible group in document order (current reading position).
    let active = null;
    for (const group of this._groups) {
      if (this._visible.has(group)) active = group;
    }
    if (!active) return;

    const id = active.getAttribute("aria-labelledby");
    if (id) this._setActive(id);
  }

  _setActive(id) {
    if (id === this._activeId) return;
    const link = this._linkById.get(id);
    if (!link) return;

    if (this._activeId) {
      this._linkById.get(this._activeId)?.removeAttribute("aria-current");
    }
    link.setAttribute("aria-current", "true");
    this._activeId = id;

    this._bus?.emit(EVENTS.workNav.activeChange, { id });
  }

  kill() {
    this._observer?.disconnect();
    this._observer = null;
    this._linkById.forEach((link) => link.removeAttribute("aria-current"));
    this._activeId = null;
    this.logger.trace("destroyed");
  }
}
