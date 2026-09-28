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
  //
  // Landing is tracked separately from intro because they can be requested at
  // different moments — a resize in the gap must settle the landing without
  // asserting an intro that has not been asked for yet. LandingSequence does not
  // currently call playLanding (the heading gel has no entrance; it is parked
  // at rest when the timelines build), so this stays dormant until a landing
  // phase returns.
  playLanding() {
    this._landingRequested = true;
    return super.playLanding();
  }

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

  // Jump the played phases to their finished state and stop. Idempotent: once at
  // the end each no-ops, so repeated resize events are cheap.
  //
  // Landing is settled as well as intro: a breakpoint-crossing resize rebuilds
  // both timelines, and a played landing must not be left at its start frame.
  // (The current landing is an empty timeline — the heading gel is parked at
  // rest on build — so today only the intro needs settling.)
  _settleRevealToEnd() {
    const phases = [
      [TIMELINE_IDS.landing, this._landingRequested],
      [TIMELINE_IDS.intro, this._introRequested],
    ];
    phases.forEach(([timelineId, requested]) => {
      if (!requested) return;
      const timeline = this.animations?.getTimeline?.(timelineId);
      if (!timeline || timeline.progress() >= 1) return;
      timeline.progress(1, false).pause();
    });
  }

  _applyResponsiveLifecycle(conditions = {}) {
    // A breakpoint-crossing resize makes matchMedia revert (and kill) the prior
    // context's tweens, stripping bio's revealed inline styles. Rebuild the
    // timelines, then settle the played phases to their end so the section stays
    // visible (they only fire once, off the landing chain).
    const revealRequested =
      this._introRequested === true || this._landingRequested === true;

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
