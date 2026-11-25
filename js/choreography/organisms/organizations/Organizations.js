import AbstractSection from "../../system/AbstractSection.js";
import { SELECTORS } from "../../config/index/index.js";
import OrganizationsAnimations from "./OrganizationsAnimations.js";
import OrganizationsTriggers from "./OrganizationsTriggers.js";

export default class Organizations extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.organizations);
    const anim = new OrganizationsAnimations(view);
    const triggers = new OrganizationsTriggers(view);

    super({
      view,
      animations: anim,
      triggers,
      sectionKey: "organizations",
      bus,
      reducedMotionHandler,
    });
  }

  // Runs on every reduced-motion or breakpoint change (gsap.matchMedia), so
  // the marquee is rebuilt and re-measured, or torn down to the static grid.
  // Keyed on the resolved profile, not only _isReducedMotionMode: the
  // `reduced` profile (OS setting or the testReducedMotion dev flag) turns
  // triggers off, and without enter/leave the marquee can't pause off screen.
  _applyResponsiveLifecycle(conditions = {}) {
    super._applyResponsiveLifecycle(conditions);

    const isMotionAllowed =
      !this._isReducedMotionMode &&
      this._motionProfile?.trigger?.enabled !== false;
    if (!isMotionAllowed) {
      this.triggers?.killMarquee?.();
      this.animations?.disableMarquee?.();
      return;
    }
    this.animations?.enableMarquee?.();
    // Visibility comes from a dedicated trigger: the section trigger is
    // `once: true`, so its enter/leave stop after the first pass.
    this.triggers?.bindMarquee?.((isVisible) =>
      this.animations?.setMarqueeVisible?.(isVisible),
    );
  }

  // playIntro() pauses every other phase, idle included, so resume the
  // marquee after the section's own enter and intro handling.
  _onEnter() {
    super._onEnter();
    this.animations?.resumeMarquee?.();
  }

  _onEnterBack() {
    super._onEnterBack();
    this.animations?.resumeMarquee?.();
  }

  _onIntroComplete() {
    super._onIntroComplete();
    this.animations?.resumeMarquee?.();
  }

  _onUpdate(trigger) {
    this.animations?.revealGroup?.update?.();
  }

  _onRefresh(trigger) {
    this.animations?.revealGroup?.update?.();
  }

  _applyPostIntroState() {
    super._applyPostIntroState();
    this.animations?.revealGroup?.showAll?.();
  }
}
