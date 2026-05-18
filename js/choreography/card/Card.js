/** @format */

import { gsap } from "/assets/js/choreography/vendor/gsap.js";
import {
  BREAKPOINT_MATCH_MEDIA_CONDITIONS,
  CARD_FIGURE_CLIP_TRIGGER,
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

  _setupResponsiveMotion() {
    if (typeof gsap?.matchMedia !== "function") {
      const isBase = window.matchMedia("(max-width: 39.999rem)").matches;
      const isReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (isBase && !isReducedMotion) {
        this._init();
      } else {
        this._applyStaticState();
      }
      return;
    }

    this._mm = gsap.matchMedia(this.root);
    this._mm.add(BREAKPOINT_MATCH_MEDIA_CONDITIONS, (context = {}) => {
      const conditions = context.conditions ?? {};
      const shouldEnableMotion =
        Boolean(conditions.base) && !Boolean(conditions.reduceMotion);

      if (!shouldEnableMotion) {
        this.kill();
        this._applyStaticState();
        return;
      }

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
