import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import {
  initVideoReveal,
  buildVideoIntro,
} from "../../molecules/video-reveal/video-reveal.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import {
  BACKGROUND_ANIMATION_DEFAULTS,
  BACKGROUND_HEADING_GEL_REVEAL,
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

    // `gel_hero`, resolved by BackgroundVideo through the gel manager. This
    // section is the gel's only visibility owner: GelAnimationManager parks it
    // at autoAlpha 0, and nothing shows it until the video's intro completes.
    // Its geometry stays with hero (molecules/hero-motion/heading-gel.js).
    // State lives here rather than on the controller because the controller's
    // gated paths can run inside its super() call, before its own fields exist.
    this.headingGel = options.headingGel ?? null;
    this._headingGelFade = null;
    this._headingGelShown = false;

    this._buildTimeline();
  }

  _buildLanding() {
    return initVideoReveal(this.media);
  }

  _buildIntro() {
    return buildVideoIntro(this.media, {
      duration: this.options.duration,
      ease: this.options.ease.out,
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
   * The pre-tilt pose: overscaled about the right edge but not yet turned.
   * Applied before the video is visible, so the tilt itself is rotation only —
   * scaling during the turn made the right edge appear to advance. Scaling
   * about `100% 50%` keeps the right edge flush with the viewport; the excess
   * falls off the left, top and bottom.
   */
  _primePose() {
    return { ...this._restPose(), rotationY: 0 };
  }

  /**
   * The rest pose after the reveal: the section ROOT (video, pixelator, gels as
   * one piece) turns into two-point perspective about its right edge. The
   * overscale that covers the wedge the turn exposes is already in place
   * (primePerspective). Unlike the reveal, this targets `this.view`, not
   * `this.media`.
   *
   * `immediateRender: false` keeps construction from writing a transform; the
   * function-based perspective is read when the tween first renders, not at
   * build time. Origin, scale and perspective sit in both ends so only the
   * angle moves. Transform only.
   */
  _buildIdle() {
    // onComplete re-asserts the pose at the current width (the perspective
    // function is read once, at first render, and the resize handler skips
    // while the tilt is mid-tween), then tells the section the tilt has
    // settled — that is what releases `video:intro:complete`.
    const idle = gsap.timeline({
      id: TIMELINE_IDS.idle,
      onComplete: () => {
        if (this.view) gsap.set(this.view, this._restPose());
        this.onPerspectiveSettled?.();
      },
    });
    const { rotationY, transformOrigin, scale, duration, ease } =
      BACKGROUND_PERSPECTIVE;
    const transformPerspective = () => this._perspectivePx();

    idle.fromTo(
      this.view,
      { rotationY: 0, scale, transformPerspective, transformOrigin },
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

  /** Overscale, unturned — the wide tier's state before the tilt has played. */
  primePerspective() {
    if (!this.view) return;
    gsap.set(this.view, this._primePose());
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

  /**
   * Back to flat, with no inline transform left behind. Transform only: the
   * heading gel is not in the idle timeline, so rewinding it cannot hide the
   * gel.
   */
  clearPerspective() {
    this.getTimeline(TIMELINE_IDS.idle)?.pause(0);
    if (this.view) {
      gsap.set(this.view, { clearProps: "transform,transformOrigin" });
    }
  }

  /**
   * Played path: fade `gel_hero` 0 → 1 with the move to idle. A standalone
   * tween rather than a child of the idle timeline, so it also runs on flat
   * tiers (where idle never plays) and so clearPerspective()'s rewind of idle
   * cannot take the gel with it. Started on the same tick as the tilt with
   * the same duration and ease, so the two land together; the controller
   * still calls showHeadingGel() before it releases `video:intro:complete`,
   * which guarantees the gel is fully visible by then.
   *
   * Created from a timeline callback, outside any gsap.matchMedia context, so
   * no breakpoint revert can undo it. No-op once the gel has been shown.
   */
  fadeInHeadingGel() {
    if (!this.headingGel || this._headingGelShown) return;
    this._headingGelShown = true;
    const { duration, ease } = BACKGROUND_HEADING_GEL_REVEAL;
    this._headingGelFade = gsap.fromTo(
      this.headingGel,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration,
        ease,
        onComplete: () => {
          this._headingGelFade = null;
        },
      },
    );
  }

  /**
   * Snap `gel_hero` to visible: gated paths (reduced motion, session-gated
   * replay), breakpoint crossings and resizes after the reveal was earned, and
   * the release of the held `video:intro:complete`. Finishes a fade in flight.
   * Idempotent, and nothing in this module ever hides the gel again.
   */
  showHeadingGel() {
    if (!this.headingGel) return;
    this._headingGelShown = true;
    const fade = this._headingGelFade;
    this._headingGelFade = null;
    fade?.progress(1)?.kill();
    gsap.set(this.headingGel, { autoAlpha: 1 });
  }

  /** True once the reveal has started (fade) or landed (snap). */
  isHeadingGelShown() {
    return this._headingGelShown;
  }

  /** True while the played-path fade is still running. */
  isHeadingGelFading() {
    return Boolean(this._headingGelFade?.isActive());
  }

  kill() {
    this._headingGelFade?.kill();
    this._headingGelFade = null;
    super.kill();
  }

  _buildOutro() {
    return gsap.timeline({ id: TIMELINE_IDS.outro });
  }
}
