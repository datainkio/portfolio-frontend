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
    this._observer = null;
    // _activeId owns aria-current and is sticky (the rail keeps the last
    // position). _confirmed is false while that id is only the boot seed or
    // the reader has scrolled out of every group, so the next real sighting
    // of the same id still emits.
    this._activeId = null;
    this._confirmed = false;

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
    this._observer = new IntersectionObserver(
      (entries) => this._onIntersect(entries),
      { rootMargin: ACTIVE_BAND_ROOT_MARGIN, threshold: 0 },
    );
    this._visible = new Set();
    this._groups.forEach((group) => this._observer.observe(group));

    // Seed a default active link so the nav never renders all-inactive before
    // the first IntersectionObserver callback. Default = first group in
    // document order (top of the work section, the entry reading position).
    // Tagged `seeded` so subscribers can tell it apart from a real reading
    // position derived from scroll.
    const defaultId = this._groups[0]?.getAttribute("aria-labelledby");
    if (defaultId) this._setActive(defaultId, { seeded: true });

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
    if (!active) {
      this._leaveGroups();
      return;
    }

    const id = active.getAttribute("aria-labelledby");
    if (id) this._setActive(id);
  }

  // No group in the band: aria-current stays put, but subscribers learn the
  // reader is outside every group.
  _leaveGroups() {
    if (!this._confirmed) return;
    this._confirmed = false;
    this._bus?.emit(EVENTS.workNav.activeChange, { id: null, seeded: false });
  }

  _setActive(id, { seeded = false } = {}) {
    if (id === this._activeId && this._confirmed) return;
    const link = this._linkById.get(id);
    if (!link) return;

    if (this._activeId && this._activeId !== id) {
      this._linkById.get(this._activeId)?.removeAttribute("aria-current");
    }
    link.setAttribute("aria-current", "true");
    this._activeId = id;
    this._confirmed = !seeded;

    this._bus?.emit(EVENTS.workNav.activeChange, { id, seeded });
  }

  kill() {
    this._observer?.disconnect();
    this._observer = null;
    this._linkById.forEach((link) => link.removeAttribute("aria-current"));
    this._activeId = null;
    this._confirmed = false;
    this.logger.trace("destroyed");
  }
}
