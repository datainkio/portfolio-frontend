import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { SCROLL_DEFAULTS } from "../../config/ix/scrolltriggers.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import {
  HERO_OUTRO,
  HERO_BAND_PARALLAX,
  HERO_GEL_SOLID,
} from "../../config/ix/presets/hero.js";
import { HERO_SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { createBandParallax } from "../../molecules/band-motion/parallax.js";
import {
  suspendHeadingGelSync,
  resumeHeadingGelSync,
  getHeadingGelEl,
} from "../../molecules/hero-motion/heading-gel.js";
import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
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

// One per statement section (id suffixed with its index): pins the statement
// at the viewport top and holds it there for 300px of
// scroll before it moves on.
export const HERO_PANEL_PIN_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: "hero-panel-pin",
  once: false,
  start: "top top",
  end: "+=300",
  pin: true,
  pinSpacing: true,
  invalidateOnRefresh: true,
  // Pin spacing pushes down everything below each panel, so measure ahead of
  // HERO_TRIGGER and the band parallax triggers.
  refreshPriority: 1,
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
    this._panelPins = [];
    this._gelSolid = null;
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
    this._bindPanelPins();
    this._bindOutroPin();
    this._bindBandParallax();
  }

  // Holds each statement section at the viewport top for
  // HERO_PANEL_PIN_TRIGGER's range. The header is left out.
  _bindPanelPins() {
    this._killPanelPins();
    if (!this.view) return;

    const attr = HERO_SELECTORS.elementAttribute;
    const panels = this.view.querySelectorAll(
      `[${attr}="${HERO_SELECTORS.missionStatement}"]`,
    );
    this._gelSolid = this._buildGelSolid();
    this._panelPins = Array.from(panels, (panel, index) =>
      ScrollTrigger.create({
        ...HERO_PANEL_PIN_TRIGGER,
        id: `${HERO_PANEL_PIN_TRIGGER.id}-${index}`,
        trigger: panel,
        // The statement's intro: as it pins, its prepared SVG (if any) reveals
        // group by group. Plays once; HeroAnimations ignores repeat calls. A
        // load or fast scroll past the pin still fires onEnter (then onLeave),
        // so passed art is never left hidden.
        onEnter: () => this.section?.animations?.playStatementSvg?.(panel),
        // The first statement's pin also turns gel_hero solid: play as it
        // reaches the top, reverse when scrolled back above it.
        ...(index === 0 && this._gelSolid
          ? {
              animation: this._gelSolid.tween,
              toggleActions: "play none none reverse",
            }
          : {}),
      }),
    );
  }

  // Paused tween of gel_hero's end opacity to HERO_GEL_SOLID.alphaEnd. Its
  // start is whatever the markup's gel-opacity-end-<n> class sets. The class
  // computes to `calc(<n> * 1%)`, which GSAP reads as 0, so the number is read
  // here and passed as an explicit start.
  _buildGelSolid() {
    const el = getHeadingGelEl(this.section?.animations?.gelManager);
    if (!el) return null;
    const computed = getComputedStyle(el).getPropertyValue("--gel-alpha-end");
    const start = `${parseFloat(computed.match(/-?[\d.]+/)?.[0] ?? 0)}%`;
    const tween = gsap.fromTo(
      el,
      { "--gel-alpha-end": start },
      {
        "--gel-alpha-end": HERO_GEL_SOLID.alphaEnd,
        duration: HERO_GEL_SOLID.duration,
        ease: HERO_GEL_SOLID.ease,
        paused: true,
      },
    );
    return { el, tween };
  }

  _killPanelPins() {
    // kill(true) reverts each pin, removing its pin-spacer.
    this._panelPins.forEach((pin) => pin.kill(true));
    this._panelPins = [];
    if (this._gelSolid) {
      this._gelSolid.tween.kill();
      // Hand the end opacity back to the markup's class.
      gsap.set(this._gelSolid.el, { clearProps: "--gel-alpha-end" });
      this._gelSolid = null;
    }
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

  // Pins the section root while the outro timeline (H2 lines fade, gel
  // expands to fill the viewport) scrubs to completion, then releases.
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
      onToggle: (self) => {
        if (self.isActive) {
          suspendHeadingGelSync(this.view);
        } else {
          resumeHeadingGelSync(this.view);
          // The band's sync is a resize hook only (it no longer tracks scroll),
          // so nothing would restore its resting geometry on its own after the
          // pin released. Force it here so a scroll-up exit doesn't leave the
          // gel stuck at the scaleY the outro drove it to.
          ScrollTrigger.getById("hero-heading-gel-sync")?.refresh();
        }
      },
    });
  }

  kill() {
    this._killPanelPins();
    this._outroPin?.kill();
    this._outroPin = null;
    this._killBandParallax();
    // Guard against a matchMedia teardown mid-pin leaving the gel sync
    // permanently suspended (onToggle's inactive branch would never fire).
    resumeHeadingGelSync(this.view);
    super.kill();
  }
}
