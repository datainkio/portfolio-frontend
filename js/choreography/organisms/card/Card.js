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

export default class Card {
  constructor(root, { index = 0 } = {}) {
    this.root = root;
    this.figure = selectCardEl(root, "figure");
    this.body = selectCardEl(root, "body");
    this._clip = null;
    this._mm = null;
    this._index = index;
    this._profile = null;

    if (this.figure && this.body) {
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

    if (variant === "motionpath") {
      this._clip = createCardMotionPath({
        article: this.root,
        figure: this.figure,
        body: this.body,
        index: this._index,
        triggerEl: this.root,
      });
    } else if (variant === "parallax") {
      this._clip = createCardParallax({
        figure: this.figure,
        body: this.body,
        index: this._index,
        triggerEl: this.root,
      });
    } else if (variant === "fade") {
      this._clip = createCardScrollFade({
        figure: this.figure,
        triggerEl: this.root,
      });
    } else {
      this._clip = createCardScrollClip({
        figure: this.figure,
        body: this.body,
        index: this._index,
        triggerEl: this.root,
      });
    }
  }

  _applyStaticState() {
    const variant = this._profile?.animation?.variant ?? "clip";

    if (variant === "motionpath") {
      gsap.set(this.root,   { clearProps: "willChange,x,rotation" });
      if (this.figure) gsap.set(this.figure, { clearProps: "willChange,yPercent" });
      if (this.body)   gsap.set(this.body,   { clearProps: "willChange,yPercent" });
    } else if (variant === "parallax") {
      if (this.figure) {
        gsap.set(this.figure, { yPercent: 0, clearProps: "willChange" });
      }
      if (this.body) {
        gsap.set(this.body, { yPercent: 0, clearProps: "willChange" });
      }
    } else if (variant === "fade") {
      if (this.figure) {
        gsap.set(this.figure, { autoAlpha: 1, y: 0, clearProps: "willChange" });
      }
    } else {
      if (this.figure) {
        gsap.set(this.figure, {
          clipPath: "inset(0 0 0% 0)",
          clearProps: "willChange",
        });
      }
      if (this.body) {
        gsap.set(this.body, { y: 0, clearProps: "willChange" });
      }
    }
  }

  kill() {
    this._clip?.kill();
    this._clip = null;
  }

  destroy() {
    this._mm?.revert?.();
    this._mm = null;
    this.kill();
    this._applyStaticState();
  }
}
