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

// Reading line sits at the top fifth of the viewport. The lowest group whose
// top has crossed it is the one the user is reading. The band observer's
// margin puts its bottom edge on that line, so it fires whenever a group's
// top crosses it.
const READING_LINE = 0.2;
const ACTIVE_BAND_ROOT_MARGIN = `0px 0px -${(1 - READING_LINE) * 100}% 0px`;
export default class WorkNavManager {
  constructor({ bus } = {}) {
    this.logger = lumberjack.createScoped("WorkNavManager", {
      color: "#A855F7",
      enabled: true,
    });

    this._bus = bus ?? null;
    this._bandObserver = null;
    this._viewportObserver = null;
    // _activeId owns aria-current. null = no group is current.
    this._activeId = null;

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
    // The observers only signal that the answer may have changed: the band
    // observer when a group's top crosses the reading line, the viewport
    // observer when a group enters or leaves the viewport. _update() then
    // derives the state from geometry, so the same scroll position always
    // yields the same current link.
    const update = () => this._update();
    this._bandObserver = new IntersectionObserver(update, {
      rootMargin: ACTIVE_BAND_ROOT_MARGIN,
      threshold: 0,
    });
    this._viewportObserver = new IntersectionObserver(update, { threshold: 0 });
    this._groups.forEach((group) => {
      this._bandObserver.observe(group);
      this._viewportObserver.observe(group);
    });

    this.logger.trace("initialized");
  }

  _update() {
    // Current = lowest group whose top has crossed the reading line, provided
    // some group is still in the viewport. Groups are spaced wider than the
    // band, so a group stays current through the gap after it; above the
    // first group, or once every group has scrolled away, nothing is.
    const viewportHeight = window.innerHeight;
    const line = viewportHeight * READING_LINE;
    let anyVisible = false;
    let active = null;
    for (const group of this._groups) {
      const { top, bottom } = group.getBoundingClientRect();
      if (bottom > 0 && top < viewportHeight) anyVisible = true;
      if (top < line) active = group;
    }
    this._setActive(
      anyVisible && active ? active.getAttribute("aria-labelledby") : null,
    );
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
    this.logger.trace("destroyed");
  }
}
