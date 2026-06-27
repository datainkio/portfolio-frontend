import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion.js";
import { TAILWIND_BREAKPOINTS } from "../../config/ix/breakpoints.js";
import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

const WORK_EL_ATTR = "data-projects-el";

// Drive mechanism switches at md: below md the icon button toggles the nav;
// md and up the nav collapses/expands on scroll direction (original behavior).
const MEDIA = Object.freeze({
  clickMode: "(max-width: 47.999rem)",
  scrollMode: `(min-width: ${TAILWIND_BREAKPOINTS.lg})`,
});

export default class WorkHeaderManager {
  constructor({ reducedMotionHandler, bus } = {}) {
    this.logger = lumberjack.createScoped("WorkHeaderManager", {
      color: "#F59E0B",
      enabled: true,
    });

    const workSection = document.getElementById(SELECTORS.work);
    // jumplinks + toggle live in a <nav> that is a sibling of the header, not a
    // child — scope these to the section, not the header. The collapsing region
    // is the industry-links <ul> only; the toggle button is its sibling inside
    // the nav and must stay visible to reopen the collapsed list.
    this._jumplinks =
      workSection?.querySelector(`[${WORK_EL_ATTR}="industry-links"]`) ?? null;
    this._toggleBtn =
      workSection?.querySelector(`[${WORK_EL_ATTR}="nav-toggle"]`) ?? null;
    this._toggleLabel =
      this._toggleBtn?.querySelector(`[${WORK_EL_ATTR}="nav-toggle-label"]`) ??
      null;
    this._workSection = workSection;
    this._bus = bus ?? null;
    this._defaultLabel = this._toggleLabel?.textContent.trim() ?? "Industries";
    this._unsubActive = null;
    this._reducedMotionHandler = reducedMotionHandler;
    this._reduced = reducedMotionHandler?.isReducedMotion?.() ?? false;
    this._isCollapsed = false;
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

    // Below md: jumplinks rest closed; the icon button toggles them. The work
    // section sits below the fold at boot, so the initial collapse is not
    // perceived. Natural heights are measured while the jumplinks are visible.
    this._mm.add(MEDIA.clickMode, () => {
      this._collapse(true);
      this._setButtonState(false);
      const onClick = () => this._toggle();
      this._toggleBtn?.addEventListener("click", onClick);
      return () => {
        this._toggleBtn?.removeEventListener("click", onClick);
        // Hand off to scroll mode with the nav open.
        this._expand(true);
      };
    });

    // md and up: jumplinks rest open; collapse/expand follows scroll direction
    // within the work section. The icon button is hidden at this breakpoint.
    this._mm.add(MEDIA.scrollMode, () => {
      // this._expand(true);
      // this._setButtonState(true);
      // const trigger = ScrollTrigger.create({
      //   trigger: this._workSection,
      //   start: "top top",
      //   end: "bottom bottom",
      //   onUpdate: (self) => {
      //     if (self.direction === 1) this._collapse(this._reduced);
      //     else this._expand(this._reduced);
      //   },
      // });
      return () => trigger?.kill();
    });

    // Reflect the in-view industry (WorkNavManager scrollspy) onto the toggle
    // label, so the collapsed nav names the section currently being read. The
    // event payload carries the shared `industry-{slug}` id; the matching
    // jumplink holds the clean title text (no label-index prefix).
    if (this._bus && this._toggleLabel) {
      this._unsubActive = this._bus.on(
        EVENTS.workNav.activeChange,
        ({ id } = {}) => this._syncLabel(id),
      );
    }

    this.logger.trace("initialized (click <md, scroll md+)");
  }

  _syncLabel(id) {
    if (!this._toggleLabel) return;
    const link = id ? this._jumplinks?.querySelector(`[href="#${id}"]`) : null;
    this._toggleLabel.textContent =
      link?.textContent.trim() || this._defaultLabel;
  }

  _toggle() {
    if (this._isCollapsed) {
      this._expand(this._reduced);
      this._setButtonState(true);
    } else {
      this._collapse(this._reduced);
      this._setButtonState(false);
    }
  }

  _setButtonState(expanded) {
    this._toggleBtn?.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  _collapse(reduced) {
    if (this._isCollapsed) return;
    this._isCollapsed = true;
    this._naturalHeight = this._jumplinks.offsetHeight;

    if (reduced) {
      gsap.set(this._jumplinks, { autoAlpha: 0, y: -8, height: 0 });
      return;
    }

    gsap.to(this._jumplinks, {
      autoAlpha: 0,
      y: -8,
      height: 0,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("exit"),
      overwrite: true,
    });
  }

  _expand(reduced) {
    if (!this._isCollapsed) return;
    this._isCollapsed = false;

    if (reduced) {
      gsap.set(this._jumplinks, { autoAlpha: 1, y: 0, height: "auto" });
      return;
    }

    gsap.to(this._jumplinks, {
      autoAlpha: 1,
      y: 0,
      height: this._naturalHeight,
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
      gsap.set(this._jumplinks, { clearProps: "height,overflow,autoAlpha,y" });
    }
    this.logger.trace("destroyed");
  }
}
