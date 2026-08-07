import AbstractSection from "../../system/AbstractSection.js";
import {
  SELECTORS,
  resolveSectionMotionProfile,
} from "../../config/index/index.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import BioAnimations from "./BioAnimations.js";
import BioTriggers from "./BioTriggers.js";

export default class Bio extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler, gelManager = null } = {}) {
    const view = document.getElementById(SELECTORS.bio);
    const animations = new BioAnimations(view, { gelManager });
    const triggers = new BioTriggers(view);

    super({
      view,
      animations,
      triggers,
      sectionKey: "bio",
      bus,
      reducedMotionHandler,
    });

    // Any resize settles the reveal to its end state — matchMedia only fires on
    // breakpoint crossings, so a plain resize needs its own listener.
    this._onWindowResize = () => this._settleRevealToEnd();
    window.addEventListener("resize", this._onWindowResize);
  }

  // Bio's reveal is time-based: it fires once off the home header intro, not on
  // scroll. Track that the reveal has been requested so a resize can re-assert it.
  playIntro() {
    this._introRequested = true;
    return super.playIntro();
  }

  // Scroll must not drive Bio playback. Override the ScrollTrigger enter
  // callbacks to still emit their events (cross-section side effects such as
  // the background-video pause depend on them) but never (re)play the reveal —
  // the base class would call playIntro here, which restarts the animation
  // mid-scroll.
  _onEnter() {
    if (this._isInView) return;
    this._isInView = true;
    this._emit(this.events.enter, { element: this.view });
  }

  _onEnterBack() {
    if (this._isInView) return;
    this._isInView = true;
    this._emit(this.events.onEnterBack, { element: this.view });
  }

  // Jump the reveal to its finished state and stop. Idempotent: once at the end
  // it no-ops, so repeated resize events are cheap.
  _settleRevealToEnd() {
    if (!this._introRequested) return;
    const intro = this.animations?.getTimeline?.(TIMELINE_IDS.intro);
    if (!intro || intro.progress() >= 1) return;
    intro.progress(1, false).pause();
  }

  _applyResponsiveLifecycle(conditions = {}) {
    // A breakpoint-crossing resize makes matchMedia revert (and kill) the prior
    // context's tweens, stripping bio's revealed inline styles. Rebuild the
    // timelines, then settle the reveal to its end so the section stays visible
    // (the reveal itself only fires once, off the header intro).
    const revealRequested = this._introRequested === true;

    const profile = resolveSectionMotionProfile("bio", conditions);
    this.animations?.rebuild?.(profile.animation?.variant ?? "sweep");
    super._applyResponsiveLifecycle(conditions);

    if (revealRequested) this._settleRevealToEnd();
  }

  destroy() {
    window.removeEventListener("resize", this._onWindowResize);
    super.destroy();
  }
}
