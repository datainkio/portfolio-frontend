import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion.js";
import { TAILWIND_BREAKPOINTS } from "../../config/ix/breakpoints.js";
import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

const WORK_EL_ATTR = "data-projects-el";

// Sticky-top offset for industry headings, published on the work section so the
// headings (sticky top-[var(--work-header-h)]) stay flush under the header as it
// collapses/expands. Replaces the deprecated IndustryHeaderManager.
const HEADER_OFFSET_VAR = "--work-header-h";

// Drive mechanism switches at md: below md the icon button toggles the nav;
// md and up the nav collapses/expands on scroll direction (original behavior).
const MEDIA = Object.freeze({
  clickMode: "(max-width: 47.999rem)",
  scrollMode: `(min-width: ${TAILWIND_BREAKPOINTS.md})`,
});

export default class WorkHeaderManager {
  constructor({ reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped("WorkHeaderManager", {
      color: "#F59E0B",
      enabled: true,
    });

    const workSection = document.getElementById(SELECTORS.work);
    const workHeader = workSection?.querySelector(`[${WORK_EL_ATTR}="header"]`);
    this._jumplinks =
      workHeader?.querySelector(`[${WORK_EL_ATTR}="jumplinks"]`) ?? null;
    this._toggleBtn =
      workHeader?.querySelector(`[${WORK_EL_ATTR}="nav-toggle"]`) ?? null;
    this._workSection = workSection;
    this._workHeader = workHeader;
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

    // Seed the heading offset to the natural header height before either drive
    // forces a resting state (scroll mode boots expanded and short-circuits
    // _expand, so it never publishes on its own).
    this._syncOffset();

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
      this._expand(true);
      this._setButtonState(true);
      const trigger = ScrollTrigger.create({
        trigger: this._workSection,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (self.direction === 1) this._collapse(this._reduced);
          else this._expand(this._reduced);
        },
      });
      return () => trigger.kill();
    });

    this.logger.trace("initialized (click <md, scroll md+)");
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
    this._naturalHeaderHeight = this._workHeader.offsetHeight;
    const collapsedHeaderHeight =
      this._naturalHeaderHeight - this._naturalHeight;

    this._publishOffset(collapsedHeaderHeight, reduced);

    if (reduced) {
      gsap.set(this._jumplinks, { autoAlpha: 0, y: -8, height: 0 });
      gsap.set(this._workHeader, { height: collapsedHeaderHeight });
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
    gsap.to(this._workHeader, {
      height: collapsedHeaderHeight,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("exit"),
      overwrite: true,
    });
  }

  _expand(reduced) {
    if (!this._isCollapsed) return;
    this._isCollapsed = false;

    this._publishOffset(this._naturalHeaderHeight, reduced);

    if (reduced) {
      gsap.set(this._jumplinks, { autoAlpha: 1, y: 0, height: "auto" });
      gsap.set(this._workHeader, { clearProps: "height,maxHeight" });
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
    gsap.to(this._workHeader, {
      height: this._naturalHeaderHeight,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("enter"),
      overwrite: true,
      onComplete: () => {
        gsap.set(this._workHeader, { clearProps: "height,maxHeight" });
      },
    });
  }

  // Instant snapshot of the current header height into the offset var. Used to
  // seed a resting state that _expand/_collapse would otherwise skip.
  _syncOffset() {
    if (!this._workSection || !this._workHeader) return;
    gsap.set(this._workSection, {
      [HEADER_OFFSET_VAR]: `${this._workHeader.offsetHeight}px`,
    });
  }

  // Drive the heading sticky-top offset in lockstep with the header-height
  // tween (same duration/ease), so headings track the header edge frame for
  // frame. _isCollapsed already reflects the target state when called.
  _publishOffset(px, reduced) {
    if (!this._workSection) return;
    if (reduced) {
      gsap.set(this._workSection, { [HEADER_OFFSET_VAR]: `${px}px` });
      return;
    }
    gsap.to(this._workSection, {
      [HEADER_OFFSET_VAR]: `${px}px`,
      duration: motion.duration("base") / 1000,
      ease: motion.ease(this._isCollapsed ? "exit" : "enter"),
      overwrite: true,
    });
  }

  kill() {
    this._mm?.kill();
    this._mm = null;
    if (this._workSection) {
      gsap.killTweensOf(this._workSection);
      this._workSection.style.removeProperty(HEADER_OFFSET_VAR);
    }
    if (this._jumplinks) {
      gsap.killTweensOf(this._jumplinks);
      gsap.set(this._jumplinks, { clearProps: "height,overflow,autoAlpha,y" });
    }
    if (this._workHeader) {
      gsap.killTweensOf(this._workHeader);
      gsap.set(this._workHeader, { clearProps: "height,maxHeight" });
    }
    this.logger.trace("destroyed");
  }
}
