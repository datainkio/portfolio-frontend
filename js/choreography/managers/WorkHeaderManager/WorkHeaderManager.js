import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion.js";
import { TAILWIND_BREAKPOINTS } from "../../config/ix/breakpoints.js";
import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

const WORK_EL_ATTR = "data-projects-el";
const LINK = `[${WORK_EL_ATTR}="industry-link"]`;
const TOGGLE = `[${WORK_EL_ATTR}="drawer-toggle"]`;
const NAV = `[${WORK_EL_ATTR}="jumplinks"]`;
const HANDLE = `[${WORK_EL_ATTR}="drawer-handle"]`;
const TITLE = `[${WORK_EL_ATTR}="drawer-title"]`;

// Drive switches at md. Below md the header rests fixed to the bottom edge as
// a bottom-sheet drawer: the whole <nav> (handle bar + industry list + footer)
// slides as one unit, and when closed it sits translated down so only the
// handle bar peeks above the viewport's bottom edge. At md and up it rests
// open, fixed flush to the viewport's left edge as a vertical rail.
const MD_REM = parseFloat(TAILWIND_BREAKPOINTS.md);
const MEDIA = Object.freeze({
  drawerMode: `(max-width: ${(MD_REM - 0.001).toFixed(3)}rem)`,
  railMode: `(min-width: ${TAILWIND_BREAKPOINTS.md})`,
});

export default class WorkHeaderManager {
  constructor({ bus, reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped("WorkHeaderManager", {
      color: "#F59E0B",
      enabled: true,
    });

    const workSection = document.getElementById(SELECTORS.work);
    // The <header> is the fixed/positioned box (bottom-0 below md, left-0/
    // top-0 rail at md+). The <nav> inside it slides as one unit; its first
    // child is the handle bar (heading rendered as the toggle <button>),
    // whose height sets how far the closed nav peeks above the viewport edge.
    this._header =
      workSection?.querySelector(`[${WORK_EL_ATTR}="header"]`) ?? null;
    this._nav = this._header?.querySelector(NAV) ?? null;
    this._handle = this._nav?.querySelector(HANDLE) ?? null;
    this._toggle = this._handle?.querySelector(TOGGLE) ?? null;
    this._title = this._toggle?.querySelector(TITLE) ?? null;
    this._reduced = reducedMotionHandler?.isReducedMotion?.() ?? false;
    this._bus = bus ?? null;
    this._unsubActive = null;
    this._activeTitle = null;
    this._isOpen = false;
    this._drawerMode = false;
    this._mm = null;
    this._onToggleClick = null;
    this._onListClick = null;
    this._onKeydown = null;
    this._onOutsideClick = null;
    this._onResize = null;

    if (
      !this._header ||
      !this._nav ||
      !this._handle ||
      !this._toggle ||
      !this._title
    ) {
      this.logger.trace(
        "header/nav/handle/toggle/title not found; WorkHeaderManager disabled",
      );
      return;
    }

    this._bind();
  }

  // Below md the handle doubles as a "you are here" readout: its title span
  // mirrors the industry group WorkNavManager's scrollspy reports as in view,
  // and empties again when the reader is outside every group (id: null). The
  // boot seed is skipped so the title stays empty until the reader has
  // actually reached a group. At md+ the rail's aria-current already shows
  // this, so the title span stays empty.
  _onActiveChange({ id, seeded } = {}) {
    if (seeded) return;
    if (!id) {
      this._setLabel(null);
      return;
    }
    const title = document.getElementById(id)?.textContent?.trim();
    if (title) this._setLabel(title);
  }

  _setLabel(title) {
    this._activeTitle = title;
    if (this._drawerMode) this._renderLabel();
  }

  _renderLabel() {
    this._title.textContent =
      this._drawerMode && this._activeTitle ? this._activeTitle : "";
  }

  _bind() {
    this._unsubActive =
      this._bus?.on(EVENTS.workNav.activeChange, (payload) =>
        this._onActiveChange(payload),
      ) ?? null;
    this._mm = gsap.matchMedia();

    // Below md: non-modal drawer. Handle toggles; a link click navigates and
    // closes the drawer out of the way; Escape closes and returns focus to
    // the handle; a click outside the header closes it. No focus trap, no
    // inert — this is an index, not a dialog.
    this._mm.add(MEDIA.drawerMode, () => {
      this._drawerMode = true;
      this._isOpen = false;
      gsap.set(this._nav, this._closedVars());
      this._toggle.setAttribute("aria-expanded", "false");
      this._renderLabel();

      this._onToggleClick = () => this._toggleDrawer();
      this._onListClick = (e) => this._onLinkClick(e);
      this._onKeydown = (e) => this._onKeyDown(e);
      this._onOutsideClick = (e) => this._onOutside(e);
      // Handle-bar height can change on reflow (heading wraps); re-seat the
      // closed offset so the bar stays flush with the viewport's bottom edge.
      this._onResize = () => {
        if (!this._isOpen) gsap.set(this._nav, this._closedVars());
      };
      this._toggle.addEventListener("click", this._onToggleClick);
      this._header.addEventListener("click", this._onListClick);
      document.addEventListener("keydown", this._onKeydown);
      document.addEventListener("click", this._onOutsideClick, true);
      window.addEventListener("resize", this._onResize);

      return () => {
        this._drawerMode = false;
        this._toggle.removeEventListener("click", this._onToggleClick);
        this._header.removeEventListener("click", this._onListClick);
        document.removeEventListener("keydown", this._onKeydown);
        document.removeEventListener("click", this._onOutsideClick, true);
        window.removeEventListener("resize", this._onResize);
        this._onToggleClick = null;
        this._onListClick = null;
        this._onKeydown = null;
        this._onOutsideClick = null;
        this._onResize = null;
      };
    });

    // md and up: rests open, flush to the viewport's left edge; no toggle,
    // no listeners.
    this._mm.add(MEDIA.railMode, () => {
      this._isOpen = true;
      this._toggle.setAttribute("aria-expanded", "true");
      gsap.set(this._nav, { clearProps: "transform" });
      this._renderLabel();

      return () => {};
    });

    this.logger.trace("initialized (bottom-sheet <md, rail md+)");
  }

  // yPercent: 100 pushes the whole nav below the viewport; y pulls it back up
  // by the handle bar's height so the bar's bottom edge sits on the viewport's.
  _closedVars() {
    return { yPercent: 100, y: -this._handle.offsetHeight };
  }

  _toggleDrawer() {
    if (this._isOpen) this._close(this._reduced);
    else this._open(this._reduced);
  }

  _onLinkClick(e) {
    const link = e.target.closest(LINK);
    if (!link) return;
    // Set from the link now rather than waiting on the scrollspy: the anchor
    // still navigates, but a short final group may never enter the active
    // band, so the readout would otherwise lag the reader's intent.
    this._setLabel(link.textContent.trim());
    if (this._drawerMode) this._close(this._reduced);
  }

  _onKeyDown(e) {
    if (e.key !== "Escape" || !this._isOpen) return;
    this._close(this._reduced);
    this._toggle.focus();
  }

  _onOutside(e) {
    if (!this._isOpen || !this._drawerMode) return;
    if (this._header.contains(e.target)) return;
    this._close(this._reduced);
  }

  _open(reduced) {
    if (this._isOpen) return;
    this._isOpen = true;
    this._toggle.setAttribute("aria-expanded", "true");

    if (reduced) {
      gsap.set(this._nav, { yPercent: 0, y: 0 });
      return;
    }
    gsap.to(this._nav, {
      yPercent: 0,
      y: 0,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("enter"),
      overwrite: true,
    });
  }

  _close(reduced) {
    if (!this._isOpen) return;
    this._isOpen = false;
    this._toggle.setAttribute("aria-expanded", "false");

    if (reduced) {
      gsap.set(this._nav, this._closedVars());
      return;
    }
    gsap.to(this._nav, {
      ...this._closedVars(),
      duration: motion.duration("base") / 1000,
      ease: motion.ease("exit"),
      overwrite: true,
    });
  }

  kill() {
    this._unsubActive?.();
    this._unsubActive = null;
    this._mm?.kill();
    this._mm = null;
    if (this._nav) {
      gsap.killTweensOf(this._nav);
      gsap.set(this._nav, { clearProps: "transform" });
    }
    this.logger.trace("destroyed");
  }
}
