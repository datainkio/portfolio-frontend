/** @format */

import { gsap } from "/assets/js/choreography/vendor/gsap.js";
import { CARD_FIGURE_CLIP_TRIGGER } from "../config/index.js";

const CARD_EL_ATTR = "data-card-el";

const selectCardEl = (root, name) =>
  root?.querySelector(`[${CARD_EL_ATTR}="${name}"]`) ?? null;

export default class Card {
  constructor(root, { index = 0 } = {}) {
    this.root = root;
    this.figure = selectCardEl(root, "figure");
    this.body = selectCardEl(root, "body");
    this._tl = null;
    this._index = index;

    if (this.figure && this.body) {
      this._init();
    }
  }

  _init() {
    // Promote both elements to compositor layers — clip-path and transform
    // are handled entirely by the GPU with no layout or paint cost.
    this.figure.style.willChange = "clip-path";
    this.body.style.willChange = "transform";

    gsap.set(this.figure, { clipPath: "inset(0 0 0% 0)" });

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
    this._tl.to(this.figure, { clipPath: "inset(0 0 100% 0)", ease: "none" }, 0);
    this._tl.to(this.body, { y: () => -window.innerHeight, ease: "none" }, 0);
  }

  kill() {
    this._tl?.scrollTrigger?.kill();
    this._tl?.kill();
    this._tl = null;
    if (this.figure) {
      gsap.set(this.figure, { clearProps: "clipPath,willChange" });
    }
    if (this.body) {
      gsap.set(this.body, { clearProps: "y,willChange" });
    }
  }
}