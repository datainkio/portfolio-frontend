import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { SCROLL_DEFAULTS } from "../../config/ix/scrolltriggers.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { BIO_OUTRO } from "../../config/ix/motion.js";
import {
  suspendHeadingGelSync,
  resumeHeadingGelSync,
} from "../../molecules/bio-motion/heading-gel.js";
import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
/**
 * Bio Trigger Defaults
 */
export const BIO_TRIGGER = {
  ...SCROLL_DEFAULTS,
  start: "top top",
  end: "bottom bottom",
  // once: true,
  // scrub disabled — evaluating ScrollTrigger scrub impact on motion complexity
  scrub: false,
  // pin disabled — evaluating ScrollTrigger pin impact on motion complexity
  pin: false,
  pinSpacing: false,
  // markers: true,
};

// Separate from BIO_TRIGGER: flipping scrub on the base trigger would hand it
// the *intro* timeline (see bind()) and pin the full section height via
// `end: "bottom bottom"`. The outro pin owns its own short scrub range instead.
export const BIO_OUTRO_PIN_ID = "bio-outro-pin";

export default class BioTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    // Pre-reveal hide — paired with the intro reveal (autoAlpha 0→1). Disabled
    // while the reveal is off; otherwise the section stays hidden with nothing
    // to restore it. Re-enable together with the intro timeline.
    // gsap.set(view, { autoAlpha: 0 });
    this._revealTrigger = null;
    this._hideTrigger = null;
    this._outroPin = null;
  }

  _getTriggerDefaults() {
    return BIO_TRIGGER;
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
    this._bindOutroPin();
  }

  // Pins the section root while the outro timeline (H2 lines fade, gel
  // expands, mission statement + aside travel to center) scrubs to
  // completion, then releases. An empty outro (no lines split yet, or the
  // `reduced` variant) means no motion — skip the pin entirely rather than
  // lock scroll for nothing.
  _bindOutroPin() {
    this._outroPin?.kill();
    this._outroPin = null;
    if (!this.view) return;

    const outroTl = this.section?.animations?.getTimeline?.(TIMELINE_IDS.outro);
    if (!outroTl || !outroTl.getChildren().length) return;

    this._outroPin = ScrollTrigger.create({
      id: BIO_OUTRO_PIN_ID,
      trigger: this.view,
      start: "top top",
      end: () => `+=${window.innerHeight * BIO_OUTRO.pinRatio}`,
      pin: true,
      pinSpacing: true,
      scrub: true,
      animation: outroTl,
      invalidateOnRefresh: true,
      refreshPriority: 1, // measure ahead of the base BIO_TRIGGER
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
          // The band only re-syncs to heading-height on the next scroll tick;
          // force it immediately so a scroll-up exit doesn't leave the gel
          // stuck at full-viewport height until the user scrolls again.
          ScrollTrigger.getById("bio-heading-gel-sync")?.refresh();
        }
      },
    });
  }

  kill() {
    this._outroPin?.kill();
    this._outroPin = null;
    // Guard against a matchMedia teardown mid-pin leaving the gel sync
    // permanently suspended (onToggle's inactive branch would never fire).
    resumeHeadingGelSync(this.view);
    super.kill();
  }
}
