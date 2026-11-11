import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import {
  initVideoReveal,
  buildVideoIntro,
} from "../../molecules/video-reveal/video-reveal.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import {
  BACKGROUND_ANIMATION_DEFAULTS,
  BACKGROUND_PERSPECTIVE,
} from "../../config/ix/presets/background.js";
import { VIDEO_SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";

export default class BackgroundVideoAnimations extends AbstractSectionAnimations {
  constructor(view, options = {}) {
    super(view);
    this.options = {
      duration: options.duration ?? BACKGROUND_ANIMATION_DEFAULTS.duration,
      stagger: options.stagger ?? BACKGROUND_ANIMATION_DEFAULTS.stagger,
      translateY:
        options.translateY ?? BACKGROUND_ANIMATION_DEFAULTS.translateY,
      ease: {
        in: options.ease?.in ?? BACKGROUND_ANIMATION_DEFAULTS.ease.in,
        out: options.ease?.out ?? BACKGROUND_ANIMATION_DEFAULTS.ease.out,
      },
    };

    // The reveal animates the <video> only — the section root also holds the
    // gels and the pixelator, which have their own lifecycles.
    this.media = this.view?.querySelector(VIDEO_SELECTORS.media) ?? null;

    this._buildTimeline();
  }

  _buildLanding() {
    return initVideoReveal(this.media);
  }

  _buildIntro() {
    return buildVideoIntro(this.media, {
      duration: this.options.duration,
      ease: this.options.ease.in,
    });
  }

  /**
   * Perspective distance in px, proportional to viewport width so the
   * overscale covers the viewport at any width (the section root is
   * `fixed inset-0`, so its width is the viewport's). Read fresh on every call.
   */
  _perspectivePx() {
    return BACKGROUND_PERSPECTIVE.perspectiveRatio * window.innerWidth;
  }

  /** The rest pose as GSAP vars, with perspective at the current width. */
  _restPose() {
    const { rotationY, scale, transformOrigin } = BACKGROUND_PERSPECTIVE;
    return {
      rotationY,
      scale,
      transformOrigin,
      transformPerspective: this._perspectivePx(),
    };
  }

  /**
   * The rest pose after the reveal: the section ROOT (video, pixelator, gels as
   * one piece) tilts into two-point perspective about its right edge and
   * overscales to cover the wedge the turn exposes. Unlike the reveal, this
   * targets `this.view`, not `this.media`.
   *
   * `immediateRender: false` keeps construction from writing a transform; the
   * function-based perspective is read when the tween first renders, not at
   * build time. Origin and perspective sit in both ends so the axis never moves
   * mid-turn (the start is visually flat). Transform only.
   */
  _buildIdle() {
    // onComplete re-asserts the pose at the current width: the perspective
    // function is read once, at first render, and the resize handler skips
    // while the tilt is mid-tween — so a resize during it would leave a stale
    // perspective (and an exposed wedge) without this.
    const idle = gsap.timeline({
      id: TIMELINE_IDS.idle,
      onComplete: () => gsap.set(this.view, this._restPose()),
    });
    const { rotationY, transformOrigin, scale, duration, ease } =
      BACKGROUND_PERSPECTIVE;
    const transformPerspective = () => this._perspectivePx();

    idle.fromTo(
      this.view,
      { rotationY: 0, scale: 1, transformPerspective, transformOrigin },
      {
        rotationY,
        scale,
        transformPerspective,
        transformOrigin,
        duration,
        ease,
        immediateRender: false,
      },
    );

    return idle;
  }

  /** True once the tilt has played or been snapped to its rest pose. */
  isPerspectiveSettled() {
    return this.getTimeline(TIMELINE_IDS.idle)?.progress() === 1;
  }

  /**
   * Jump straight to the rest pose — reduced motion, gated replay, breakpoint
   * entry, resize. The timeline is finished first so it reads as settled (and
   * never replays); the set then re-asserts the pose at the current width.
   */
  snapPerspective() {
    if (!this.view) return;
    this.getTimeline(TIMELINE_IDS.idle)?.progress(1);
    gsap.set(this.view, this._restPose());
  }

  /** Back to flat, with no inline transform left behind. */
  clearPerspective() {
    this.getTimeline(TIMELINE_IDS.idle)?.pause(0);
    if (this.view) {
      gsap.set(this.view, { clearProps: "transform,transformOrigin" });
    }
  }

  _buildOutro() {
    return gsap.timeline({ id: TIMELINE_IDS.outro });
  }
}
