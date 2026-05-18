/** @format */

import { gsap } from "/assets/js/choreography/vendor/gsap.js";
import {
  BREAKPOINT_MATCH_MEDIA_CONDITIONS,
  CARD_FIGURE_CLIP_TRIGGER,
  resolveSectionMotionProfile,
} from "../config/index.js";

const CARD_EL_ATTR = "data-card-el";

const selectCardEl = (root, name) =>
  root?.querySelector(`[${CARD_EL_ATTR}="${name}"]`) ?? null;

export default class Card {
  constructor(root, { index = 0 } = {}) {
    this.root = root;
    this.figure = selectCardEl(root, "figure");
    this.body = selectCardEl(root, "body");
    this._tl = null;
    this._mm = null;
    this._index = index;

    if (this.figure && this.body) {
      this._setupResponsiveMotion();
    }
  }

  /**
   * Wire up breakpoint- and reduced-motion-aware scroll animation for this card.
   *
   * Called once from the constructor after confirming both `figure` and `body`
   * elements are present. It is not intended to be called again; to tear down
   * and reset, use `destroy()`.
   *
   * Registers a `gsap.matchMedia` context that re-evaluates whenever the
   * viewport crosses a breakpoint boundary or the user's reduced-motion
   * preference changes. On each evaluation it delegates to
   * `resolveSectionMotionProfile` to get the current motion policy, then
   * either initializes the scrubbed clip-path timeline (`_init`) or collapses
   * to a static end state (`_applyStaticState`).
   */
  _setupResponsiveMotion() {
    // Fallback path: gsap.matchMedia isn't available (very old browsers).
    // Manually read the two conditions we care about — reduced motion preference
    // and viewport size — then resolve the motion profile from them directly.
    if (typeof gsap?.matchMedia !== "function") {
      const isReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      // Treat as base breakpoint since we can't determine the real breakpoint
      // without matchMedia. base: true is enough for the resolver to pick the
      // correct profile key.
      const profile = resolveSectionMotionProfile("card", {
        base: true,
        reduceMotion: isReducedMotion,
      });

      // trigger.enabled is false only when the resolved profile is 'reduced'.
      // All other profiles (base through xl) enable the scroll-driven animation.
      if (profile.trigger.enabled) {
        this._init();
      } else {
        this._applyStaticState();
      }
      return;
    }

    // Standard path: register a gsap.matchMedia context scoped to this card's
    // root element. GSAP evaluates all conditions simultaneously so there are
    // no race conditions between breakpoint and reduced-motion checks, and it
    // automatically cleans up when the context is reverted on destroy().
    this._mm = gsap.matchMedia(this.root);
    this._mm.add(BREAKPOINT_MATCH_MEDIA_CONDITIONS, (context = {}) => {
      const conditions = context.conditions ?? {};

      // Ask the central motion profile resolver whether this breakpoint/motion
      // combination should run scroll-driven animation. The resolver returns
      // 'reduced' (trigger.enabled = false) when prefers-reduced-motion is
      // active, and an enabled profile for all other breakpoints (base → xl).
      const profile = resolveSectionMotionProfile("card", conditions);

      if (!profile.trigger.enabled) {
        // Tear down any existing timeline and ScrollTrigger before applying the
        // static end state, so we don't leave orphaned scroll listeners behind
        // when transitioning into reduced-motion mode at runtime.
        this.kill();
        this._applyStaticState();
        return;
      }

      // Profile permits animation — (re)initialize the scrubbed clip timeline.
      // _init() calls kill() first, so rapid breakpoint transitions won't
      // accumulate duplicate ScrollTrigger instances.
      this._init();
    });
  }

  _init() {
    this.kill();

    // Promote both elements to compositor layers — clip-path and transform
    // are handled entirely by the GPU with no layout or paint cost.
    this.figure.style.willChange = "clip-path";
    this.body.style.willChange = "transform";

    gsap.set(this.figure, { clipPath: "inset(0 0 0% 0)" });
    gsap.set(this.body, { y: 0 });

    // A single scrubbed timeline drives both tweens in lockstep:
    // - figure clips from bottom to top over one viewport height of scroll
    // - body translates up by the same distance, so it always sits at the clip boundary
    this._tl = gsap.timeline({
      scrollTrigger: {
        ...CARD_FIGURE_CLIP_TRIGGER,
        id: `${CARD_FIGURE_CLIP_TRIGGER.id}-${this._index}`,
        trigger: this.root,
        // Figure is h-dvh — one full viewport height of scroll fully clips it
        end: () => `+=${window.innerHeight}`,
      },
    });

    // Both tweens start at position 0 in the timeline so they run in perfect sync
    this._tl.to(
      this.figure,
      { clipPath: "inset(0 0 100% 0)", ease: "none" },
      0,
    );
    this._tl.to(this.body, { y: () => -window.innerHeight, ease: "none" }, 0);
  }

  _applyStaticState() {
    if (this.figure) {
      gsap.set(this.figure, {
        clipPath: "inset(0 0 0% 0)",
        clearProps: "willChange",
      });
    }
    if (this.body) {
      gsap.set(this.body, {
        y: 0,
        clearProps: "willChange",
      });
    }
  }

  // Note: kill() and destroy() are separate methods to allow for different cleanup
  // semantics. kill() is for tearing down motion and scroll triggers, while
  // destroy() also reverts matchMedia contexts and resets to static state.
  kill() {
    this._tl?.scrollTrigger?.kill();
    this._tl?.kill();
    this._tl = null;
  }

  destroy() {
    this._mm?.revert?.();
    this._mm = null;
    this.kill();
    this._applyStaticState();
  }
}
