import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion.js";
import { TAILWIND_BREAKPOINTS } from "../../config/ix/breakpoints.js";
import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

const WORK_EL_ATTR = "data-projects-el";
const LINK = `[${WORK_EL_ATTR}="industry-link"]`;
const TOGGLE = `[${WORK_EL_ATTR}="drawer-toggle"]`;

// Drive switches at md. Below md the header rests off-canvas as a drawer
// behind a persistent handle button; at md and up it rests open, fixed flush
// to the viewport's left edge as a vertical rail.
const MD_REM = parseFloat(TAILWIND_BREAKPOINTS.md);
const MEDIA = Object.freeze({
  drawerMode: `(max-width: ${(MD_REM - 0.001).toFixed(3)}rem)`,
  railMode: `(min-width: ${TAILWIND_BREAKPOINTS.md})`,
});

export default class WorkHeaderManager {
  constructor({ reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped("WorkHeaderManager", {
      color: "#F59E0B",
      enabled: true,
    });

    const workSection = document.getElementById(SELECTORS.work);
    // The header is the fixed/positioned box (left-0) that slides as the
    // drawer; the nav inside it is unpositioned and just carries the id that
    // the toggle's aria-controls points at.
    this._header =
      workSection?.querySelector(`[${WORK_EL_ATTR}="header"]`) ?? null;
    this._toggle = this._header?.querySelector(TOGGLE) ?? null;
    this._reduced = reducedMotionHandler?.isReducedMotion?.() ?? false;
    this._isOpen = false;
    this._drawerMode = false;
    this._mm = null;
    this._onToggleClick = null;
    this._onListClick = null;
    this._onKeydown = null;
    this._onOutsideClick = null;

    if (!this._header || !this._toggle) {
      this.logger.trace(
        "header/toggle not found; WorkHeaderManager disabled",
      );
      return;
    }

    this._bind();
  }

  _bind() {
    this._mm = gsap.matchMedia();

    // Below md: non-modal drawer. Handle toggles; a link click navigates and
    // closes the drawer out of the way; Escape closes and returns focus to
    // the handle; a click outside closes. No focus trap, no inert — this is
    // an index, not a dialog.
    this._mm.add(MEDIA.drawerMode, () => {
      this._drawerMode = true;
      this._isOpen = false;
      gsap.set(this._header, { xPercent: -100 });
      this._toggle.setAttribute("aria-expanded", "false");

      this._onToggleClick = () => this._toggleDrawer();
      this._onListClick = (e) => this._onLinkClick(e);
      this._onKeydown = (e) => this._onKeyDown(e);
      this._onOutsideClick = (e) => this._onOutside(e);
      this._toggle.addEventListener("click", this._onToggleClick);
      this._header.addEventListener("click", this._onListClick);
      document.addEventListener("keydown", this._onKeydown);
      document.addEventListener("click", this._onOutsideClick, true);

      return () => {
        this._drawerMode = false;
        this._toggle.removeEventListener("click", this._onToggleClick);
        this._header.removeEventListener("click", this._onListClick);
        document.removeEventListener("keydown", this._onKeydown);
        document.removeEventListener("click", this._onOutsideClick, true);
        this._onToggleClick = null;
        this._onListClick = null;
        this._onKeydown = null;
        this._onOutsideClick = null;
      };
    });

    // md and up: rests open, flush to the viewport's left edge; no toggle,
    // no listeners.
    this._mm.add(MEDIA.railMode, () => {
      this._isOpen = true;
      this._toggle.setAttribute("aria-expanded", "true");
      gsap.set(this._header, { clearProps: "transform" });

      return () => {};
    });

    this.logger.trace("initialized (drawer <md, rail md+)");
  }

  _toggleDrawer() {
    if (this._isOpen) this._close(this._reduced);
    else this._open(this._reduced);
  }

  _onLinkClick(e) {
    if (!e.target.closest(LINK)) return;
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
      gsap.set(this._header, { xPercent: 0 });
      return;
    }
    gsap.to(this._header, {
      xPercent: 0,
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
      gsap.set(this._header, { xPercent: -100 });
      return;
    }
    gsap.to(this._header, {
      xPercent: -100,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("exit"),
      overwrite: true,
    });
  }

  kill() {
    this._mm?.kill();
    this._mm = null;
    if (this._header) {
      gsap.killTweensOf(this._header);
      gsap.set(this._header, { clearProps: "transform" });
    }
    this.logger.trace("destroyed");
  }
}
