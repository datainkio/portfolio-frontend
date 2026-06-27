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
 * SectionCapManager — scrollspy for the display indicating the current main/section element.
 *
 * Observes the sections on the site's homepage and reflects the one currently
 * in view onto its title and position indicator. Broadcasts the active id on the bus so
 * later breakpoint surfaces (rail, disclosure) can react without re-deriving
 * scroll state. See specs/animation/work-section-navigation.animation-spec.md.
 */
export default class SectionCapManager {
  constructor({ bus } = {}) {
    this.logger = lumberjack.createScoped("SectionCapManager", {
      color: "#A855F7",
      enabled: true,
    });

    this._bus = bus ?? null;
    this._observer = null;
    this._activeId = null;

    // const workSection = document.getElementById(SELECTORS.work);
    // const links = Array.from(
    //   workSection?.querySelectorAll(`[${WORK_EL_ATTR}="${LINK_VALUE}"]`) ?? [],
    // );
    this._title = document.querySelector("[data-current-section-title]");
    this._sections = document
      .getElementById("page-main")
      ?.querySelectorAll("main > section");

    // Map shared `industry-{slug}` id → its jumplink. Link href hash and group
    // aria-labelledby both resolve to the heading id.
    // this._linkById = new Map();
    // links.forEach((link) => {
    //   const id = link.getAttribute("href")?.replace(/^#/, "");
    //   if (id) this._linkById.set(id    , link);
    // });

    if (!this._sections?.length) {
      this.logger.trace("no sections found; disabled");
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
    this._sections.forEach((section) => this._observer.observe(section));
    this.logger.trace("initialized");
  }

  _onIntersect(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) this._visible.add(entry.target);
      else this._visible.delete(entry.target);
    });

    // Active = lowest visible section in document order (current reading position).
    let active = null;
    for (const section of this._sections) {
      if (this._visible.has(section)) active = section;
    }
    if (!active) return;

    const id = active.getAttribute("aria-labelledby");
    if (id) this._setActive(id);
  }

  _setActive(id) {
    // this.logger.trace(`active section changed to ${id}`);
    this._title.textContent = id;
    if (id === this._activeId) return;
    this._activeId = id;
    // this._bus?.emit(EVENTS.sectionCap.activeChange, { id });
  }

  kill() {
    this._observer?.disconnect();
    this._observer = null;
    this._activeId = null;
    this.logger.trace("destroyed");
  }
}
