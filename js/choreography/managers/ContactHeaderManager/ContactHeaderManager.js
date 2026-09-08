import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion.js";
import { TAILWIND_BREAKPOINTS } from "../../config/ix/breakpoints.js";
import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

const WORK_EL_ATTR = "data-projects-el";
const LINK = `[${WORK_EL_ATTR}="industry-link"]`;

// Drive switches at lg. Below lg the industry list rests collapsed to its current
// (first) item, which doubles as the disclosure control. At lg and up the list
// rests open as a horizontal jumplink bar with no toggle.
const MEDIA = Object.freeze({
  clickMode: "(max-width: 63.999rem)",
  scrollMode: `(min-width: ${TAILWIND_BREAKPOINTS.lg})`,
});

export default class WorkHeaderManager {
  constructor({ reducedMotionHandler, bus } = {}) {
    this.logger = lumberjack.createScoped("WorkHeaderManager", {
      color: "#F59E0B",
      enabled: true,
    });

    const workSection = document.getElementById(SELECTORS.work);
    this._jumplinks =
      workSection?.querySelector(`[${WORK_EL_ATTR}="industry-links"]`) ?? null;
    this._region = this._jumplinks?.closest("nav") ?? null;
    this._links = Array.from(this._jumplinks?.querySelectorAll(LINK) ?? []);
    this._bus = bus ?? null;
    this._reduced = reducedMotionHandler?.isReducedMotion?.() ?? false;
    this._isCollapsed = false;
    this._clickMode = false;
    this._unsubActive = null;
    this._onClick = null;
    this._mm = null;

    if (!this._jumplinks) {
      this.logger.trace(
        "jumplinks element not found; WorkHeaderManager disabled",
      );
      return;
    }

    this._bind();
  }

  _bind() {
    this._mm = gsap.matchMedia();

    // Below lg: rest collapsed to the current (first) item; tapping it expands
    // the rest. Boot collapse is instant (section is below the fold).
    this._mm.add(MEDIA.clickMode, () => {
      this._clickMode = true;
      this._collapse(true);
      this._onClick = (e) => this._onListClick(e);
      this._jumplinks.addEventListener("click", this._onClick);

      return () => {
        this._clickMode = false;
        this._jumplinks.removeEventListener("click", this._onClick);
        this._onClick = null;
        this._setControl(false);
        this._expand(true); // hand off to scroll mode open
      };
    });

    // lg and up: rests open as a horizontal bar; no toggle.
    this._mm.add(MEDIA.scrollMode, () => () => {});

    // The disclosure control follows the in-view link as the user scrolls.
    if (this._bus) {
      this._unsubActive = this._bus.on(EVENTS.workNav.activeChange, () => {
        if (this._clickMode) this._setControl(true);
      });
    }

    this.logger.trace("initialized (collapse <lg, open lg+)");
  }

  _onListClick(e) {
    const link = e.target.closest(LINK);
    if (!link || !this._jumplinks.contains(link)) return;

    // Collapsed: only the current (first) item is reachable; its tap opens the
    // list. Expanded: the current item is the close toggle; others navigate.
    if (this._isCollapsed) {
      e.preventDefault();
      this._expand(this._reduced);
    } else if (link.getAttribute("aria-current") === "true") {
      e.preventDefault();
      this._collapse(this._reduced);
    }
  }

  // Disclosure semantics live on the in-view link (aria-current). Identity moves
  // with the scrollspy, so clear every link then mark the current one.
  _setControl(on) {
    this._links.forEach((l) => {
      l.removeAttribute("role");
      l.removeAttribute("aria-controls");
      l.removeAttribute("aria-expanded");
    });
    if (!on) return;
    const link = this._jumplinks.querySelector('[aria-current="true"]');
    if (!link) return;
    link.setAttribute("role", "button");
    if (this._region?.id) link.setAttribute("aria-controls", this._region.id);
    link.setAttribute("aria-expanded", this._isCollapsed ? "false" : "true");
  }

  _collapse(reduced) {
    if (this._isCollapsed) return;
    this._isCollapsed = true;
    if (this._clickMode) this._setControl(true);

    const firstItem = this._jumplinks.querySelector("li");
    const height = firstItem ? firstItem.offsetHeight : 0;
    if (reduced) {
      gsap.set(this._jumplinks, { height });
      return;
    }
    gsap.to(this._jumplinks, {
      height,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("exit"),
      overwrite: true,
    });
  }

  _expand(reduced) {
    if (!this._isCollapsed) return;
    this._isCollapsed = false;
    if (this._clickMode) this._setControl(true);

    if (reduced) {
      gsap.set(this._jumplinks, { height: "auto" });
      return;
    }
    gsap.to(this._jumplinks, {
      height: this._jumplinks.scrollHeight,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("enter"),
      overwrite: true,
      onComplete: () => gsap.set(this._jumplinks, { height: "auto" }),
    });
  }

  kill() {
    this._unsubActive?.();
    this._unsubActive = null;
    this._mm?.kill();
    this._mm = null;
    if (this._jumplinks) {
      gsap.killTweensOf(this._jumplinks);
      gsap.set(this._jumplinks, { clearProps: "height" });
    }
    this._setControl(false);
    this.logger.trace("destroyed");
  }
}
