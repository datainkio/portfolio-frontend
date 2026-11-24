import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { SCROLL_DEFAULTS } from "../../config/ix/scrolltriggers.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import {
  HERO_OUTRO,
  HERO_BAND_PARALLAX,
} from "../../config/ix/presets/hero.js";
import { HERO_SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { createBandParallax } from "../../molecules/band-motion/parallax.js";
import { ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
/**
 * Hero Trigger Defaults
 */
export const HERO_TRIGGER = {
  ...SCROLL_DEFAULTS,
  start: "top top",
  end: "bottom bottom",
  // Overrides SCROLL_DEFAULTS' `once: true`. Hero's enter/exit pair is a live
  // gate, not a one-shot cue: LandingSequence uses it to pause the background
  // video when Hero leaves and resume it when Hero returns, so the trigger must
  // survive the first pass and keep reporting in both scroll directions.
  // `once: true` killed the trigger after one enter/leave, which meant
  // `onEnterBack` never fired and the video, once paused, stayed paused.
  //
  // Safe because nothing here is scroll-driven: `scrub` is false, so
  // HeroTriggers.bind() passes no `animation` and `toggleActions` has no
  // timeline to play/pause on re-entry; and Hero overrides `_onEnter` /
  // `_onEnterBack` to emit their events WITHOUT calling playIntro, so repeat
  // firing cannot restart the reveal.
  once: false,
  // scrub disabled — evaluating ScrollTrigger scrub impact on motion complexity
  scrub: false,
  // pin disabled — evaluating ScrollTrigger pin impact on motion complexity
  pin: false,
  pinSpacing: false,
  // markers: true,
};

// Separate from HERO_TRIGGER: flipping scrub on the base trigger would hand it
// the *intro* timeline (see bind()) and pin the full section height via
// `end: "bottom bottom"`. The outro pin owns its own short scrub range instead.
export const HERO_OUTRO_PIN_ID = "hero-outro-pin";

// One per band (id suffixed with its index): scrubs the band's image while the
// band crosses the viewport.
export const HERO_BAND_PARALLAX_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: "hero-band-parallax",
  once: false,
  start: "top bottom",
  end: "bottom top",
  scrub: true,
  pin: false,
  pinSpacing: false,
  invalidateOnRefresh: true,
};

// One per statement figure (id suffixed with the statement's index): fires the
// statement's SVG reveal when the figure's bottom reaches the bottom of the
// viewport, so the whole figure is in view. The trigger element is the figure,
// not the statement section (it was the section, at `top 60%`, until
// 2026-11-24). No pin: the statement scrolls with the page.
export const HERO_STATEMENT_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: "hero-statement",
  once: false,
  start: "bottom bottom",
  end: "bottom top",
  pin: false,
  pinSpacing: false,
  invalidateOnRefresh: true,
};

export default class HeroTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    // Pre-reveal hide — paired with the intro reveal (autoAlpha 0→1). Disabled
    // while the reveal is off; otherwise the section stays hidden with nothing
    // to restore it. Re-enable together with the intro timeline.
    // gsap.set(view, { autoAlpha: 0 });
    this._revealTrigger = null;
    this._hideTrigger = null;
    this._outroPin = null;
    this._bandParallax = [];
    this._statementTriggers = [];
  }

  _getTriggerDefaults() {
    return HERO_TRIGGER;
  }

  bind(options = {}) {
    // Hand the intro timeline to the ScrollTrigger ONLY when scrubbed; otherwise
    // the lifecycle (playIntro via onEnter) owns the reveal. Passing it while
    // unscrubbed double-drives the same timeline. See AbstractSection.playIntro.
    const scrubbed = Boolean(this._getTriggerDefaults().scrub);
    const introTl = scrubbed
      ? this.section?.animations?.getTimeline?.(TIMELINE_IDS.intro)
      : null;
    super.bind({ ...options, ...(introTl ? { animation: introTl } : {}) });
    this._bindStatementTriggers();
    this._bindOutroPin();
    this._bindBandParallax();
  }

  // One trigger per statement that holds a prepared SVG, to play its reveal.
  // The trigger element is the SVG's <figure>. Statements without one get no
  // trigger. Nothing is pinned. The header is left out.
  _bindStatementTriggers() {
    this._killStatementTriggers();
    if (!this.view) return;

    const attr = HERO_SELECTORS.elementAttribute;
    const panels = this.view.querySelectorAll(
      `[${attr}="${HERO_SELECTORS.missionStatement}"]`,
    );
    this._statementTriggers = Array.from(panels, (panel, index) => {
      const svg = panel.querySelector(
        `[${attr}="${HERO_SELECTORS.statementSvg}"]`,
      );
      if (!svg) return null;
      return ScrollTrigger.create({
        ...HERO_STATEMENT_TRIGGER,
        id: `${HERO_STATEMENT_TRIGGER.id}-${index}`,
        trigger: svg.closest("figure") ?? svg,
        // The statement's intro: when the figure's bottom reaches the bottom
        // of the viewport, its SVG reveals group by group. Plays once;
        // HeroAnimations ignores repeat calls. A load or fast scroll past the
        // figure still fires onEnter (then onLeave), so passed art is never
        // left hidden.
        onEnter: () => this.section?.animations?.playStatementSvg?.(panel),
      });
    }).filter(Boolean);
  }

  _killStatementTriggers() {
    this._statementTriggers.forEach((trigger) => trigger.kill());
    this._statementTriggers = [];
  }

  // Image parallax for every band that holds an image (see band-motion).
  _bindBandParallax() {
    this._killBandParallax();
    if (!this.view) return;

    const attr = HERO_SELECTORS.elementAttribute;
    const bands = this.view.querySelectorAll(
      `[${attr}="${HERO_SELECTORS.band}"]`,
    );
    this._bandParallax = Array.from(bands, (band, index) =>
      createBandParallax({
        band,
        image: band.querySelector(`[${attr}="${HERO_SELECTORS.bandImage}"]`),
        trigger: HERO_BAND_PARALLAX_TRIGGER,
        yPercent: HERO_BAND_PARALLAX.yPercent,
        index,
      }),
    );
  }

  _killBandParallax() {
    this._bandParallax.forEach((parallax) => parallax.kill());
    this._bandParallax = [];
  }

  // Pins the section root while the outro timeline (H2 lines fade) scrubs to completion, then releases.
  // An empty outro (no lines split yet, or the
  // `reduced` variant) means no motion — skip the pin entirely rather than
  // lock scroll for nothing.
  _bindOutroPin() {
    this._outroPin?.kill();
    this._outroPin = null;
    if (!this.view) return;

    const outroTl = this.section?.animations?.getTimeline?.(TIMELINE_IDS.outro);
    if (!outroTl || !outroTl.getChildren().length) return;

    this._outroPin = ScrollTrigger.create({
      id: HERO_OUTRO_PIN_ID,
      trigger: this.view,
      start: "top top",
      end: () => `+=${window.innerHeight * HERO_OUTRO.pinRatio}`,
      pin: true,
      pinSpacing: true,
      scrub: true,
      animation: outroTl,
      invalidateOnRefresh: true,
      refreshPriority: 1, // measure ahead of the base HERO_TRIGGER
      snap: {
        snapTo: "labelsDirectional",
        duration: { min: 0.2, max: 0.6 },
        delay: 0.05,
        ease: "power1.inOut",
      },
    });
  }

  kill() {
    this._killStatementTriggers();
    this._outroPin?.kill();
    this._outroPin = null;
    this._killBandParallax();
    super.kill();
  }
}
