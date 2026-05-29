import { gsap } from "/assets/js/choreography/system/gsap.js";
import {
  BREAKPOINT_MATCH_MEDIA_CONDITIONS,
  resolveSectionMotionProfile,
} from "../../config/index/index.js";
import {
  createCardScrollClip,
  createCardScrollFade,
  createCardParallax,
  createCardMotionPath,
} from "../../molecules/card-motion.js";

const CARD_EL_ATTR = "data-card-el";

const selectCardEl = (root, name) =>
  root?.querySelector(`[${CARD_EL_ATTR}="${name}"]`) ?? null;

const VARIANT_FACTORIES = {
  motionpath: (card) =>
    createCardMotionPath({
      article: card.root,
      figure: card.figure,
      body: card.body,
      index: card._index,
      triggerEl: card.root,
    }),
  parallax: (card) =>
    createCardParallax({
      figure: card.figure,
      body: card.body,
      index: card._index,
      triggerEl: card.root,
    }),
  fade: (card) =>
    createCardScrollFade({
      figure: card.figure,
      index: card._index,
      triggerEl: card.root,
    }),
  clip: (card) =>
    createCardScrollClip({
      figure: card.figure,
      body: card.body,
      index: card._index,
      triggerEl: card.root,
    }),
};

const VARIANT_RESET = {
  motionpath: (card) => {
    gsap.set(card.root, { clearProps: "willChange,x,rotation" });
    if (card.figure) gsap.set(card.figure, { clearProps: "willChange,yPercent" });
    if (card.body) gsap.set(card.body, { clearProps: "willChange,yPercent" });
  },
  parallax: (card) => {
    if (card.figure) gsap.set(card.figure, { yPercent: 0, clearProps: "willChange" });
    if (card.body) gsap.set(card.body, { yPercent: 0, clearProps: "willChange" });
  },
  fade: (card) => {
    if (card.figure) gsap.set(card.figure, { autoAlpha: 1, y: 0, clearProps: "willChange" });
  },
  clip: (card) => {
    if (card.figure) gsap.set(card.figure, { clipPath: "inset(0 0 0% 0)", clearProps: "willChange" });
    if (card.body) gsap.set(card.body, { y: 0, clearProps: "willChange" });
  },
};

export default class Card {
  constructor(root, { index = 0 } = {}) {
    this.root = root;
    this.figure = selectCardEl(root, "figure");
    this.body = selectCardEl(root, "body");
    this._motion = null;
    this._mm = null;
    this._index = index;
    this._profile = null;

    if (this.figure) {
      this._setupResponsiveMotion();
    }
  }

  _setupResponsiveMotion() {
    if (typeof gsap?.matchMedia !== "function") {
      const isReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const profile = resolveSectionMotionProfile("card", {
        base: true,
        reduceMotion: isReducedMotion,
      });

      if (profile.trigger.enabled) {
        this._init(profile);
      } else {
        this._applyStaticState();
      }
      return;
    }

    this._mm = gsap.matchMedia(this.root);
    this._mm.add(BREAKPOINT_MATCH_MEDIA_CONDITIONS, (context = {}) => {
      const conditions = context.conditions ?? {};
      const profile = resolveSectionMotionProfile("card", conditions);

      if (!profile.trigger.enabled) {
        this.kill();
        this._applyStaticState();
        return;
      }

      this._init(profile);
    });
  }

  _init(profile = {}) {
    this.kill();
    this._profile = profile;
    const variant = profile.animation?.variant ?? "clip";
    const factory = VARIANT_FACTORIES[variant] ?? VARIANT_FACTORIES.clip;
    this._motion = factory(this);
  }

  _applyStaticState() {
    const variant = this._profile?.animation?.variant ?? "clip";
    const reset = VARIANT_RESET[variant] ?? VARIANT_RESET.clip;
    reset(this);
  }

  kill() {
    this._motion?.kill();
    this._motion = null;
  }

  destroy() {
    this._mm?.revert?.();
    this._mm = null;
    this.kill();
    this._applyStaticState();
  }
}
