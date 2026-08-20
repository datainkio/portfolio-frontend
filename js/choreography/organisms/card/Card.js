import { gsap } from "/assets/js/choreography/system/gsap.js";
import {
  BREAKPOINT_MATCH_MEDIA_CONDITIONS,
  resolveSectionMotionProfile,
} from "../../config/index/index.js";
import {
  createCardScrollClip,
  createCardScrollFade,
  createCardParallax,
  createThrowTimeline,
  createCardSticky,
} from "../../molecules/card-motion/card-motion.js";

const CARD_EL_ATTR = "data-card-el";

const selectCardEl = (root, name) =>
  root?.querySelector(`[${CARD_EL_ATTR}="${name}"]`) ?? null;

const VARIANT_FACTORIES = {
  throw: (card) =>
    createThrowTimeline({
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
  sticky: (card) =>
    createCardSticky({
      article: card.root,
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

// Shared reset for the no-motion states (a11y `reduced` and dev `static`):
// clear every GSAP-authored inline prop so the card renders from CSS alone.
const resetCardToCss = (card) => {
  const els = [
    card.root,
    card.figure,
    card.body,
    card.figure?.querySelector('[data-card-el="image"]'),
  ].filter(Boolean);
  if (els.length) gsap.set(els, { clearProps: "all" });
};

const VARIANT_RESET = {
  throw: (card) => {
    gsap.set(card.root, { clearProps: "willChange,x,rotation" });
    if (card.figure)
      gsap.set(card.figure, { clearProps: "willChange,yPercent" });
    if (card.body) gsap.set(card.body, { clearProps: "willChange,yPercent" });
  },
  parallax: (card) => {
    if (card.figure)
      gsap.set(card.figure, { yPercent: 0, clearProps: "willChange" });
    if (card.body)
      gsap.set(card.body, { yPercent: 0, clearProps: "willChange" });
  },
  fade: (card) => {
    if (card.figure)
      gsap.set(card.figure, { autoAlpha: 1, y: 0, clearProps: "willChange" });
  },
  sticky: (card) => {
    if (card.figure) gsap.set(card.figure, { clearProps: "y,willChange" });
  },
  clip: (card) => {
    if (card.figure)
      gsap.set(card.figure, {
        clipPath: "inset(0 0 0% 0)",
        clearProps: "willChange",
      });
    if (card.body) gsap.set(card.body, { y: 0, clearProps: "willChange" });
  },
  // Reduced motion (a11y) and `static` (dev baseline, motion intentionally off)
  // both present the card exactly as its CSS defines it — as if no JS ran. Strip
  // every inline prop any prior active variant may have left so nothing
  // GSAP-authored lingers; apply nothing of our own.
  reduced: resetCardToCss,
  static: resetCardToCss,
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
        this._profile = profile;
        this._applyStaticState(profile);
      }
      return;
    }

    this._mm = gsap.matchMedia(this.root);
    this._mm.add(BREAKPOINT_MATCH_MEDIA_CONDITIONS, (context = {}) => {
      const conditions = context.conditions ?? {};
      const profile = resolveSectionMotionProfile("card", conditions);

      if (!profile.trigger.enabled) {
        this.kill();
        this._profile = profile;
        this._applyStaticState(profile);
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
    // Commenting out the  line below will disable the card motion without breaking things, but the proper way is to do it through the profile config.
    this._motion = factory(this);
  }

  _applyStaticState(profile = this._profile) {
    const variant = profile?.animation?.variant ?? "clip";
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
