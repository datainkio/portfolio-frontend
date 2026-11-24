import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import {
  initVideoReveal,
  buildVideoIntro,
} from "../../molecules/video-reveal/video-reveal.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import {
  BACKGROUND_ANIMATION_DEFAULTS,
  BACKGROUND_VIDEO_GEL_REVEAL,
  BACKGROUND_PERSPECTIVE,
} from "../../config/ix/presets/background.js";
import { motionTokens } from "../../config/ix/motion.js";
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

    // `gel_video`, resolved by BackgroundVideo through the gel manager. This
    // section is the gel's only owner: GelAnimationManager parks it at
    // autoAlpha 0, and its fade-in is the first step of the intro timeline.
    // State lives here rather than on the controller because the controller's
    // gated paths can run inside its super() call, before its own fields exist.
    this.videoGel = options.videoGel ?? null;
    this._videoGelShown = false;

    this._buildTimeline();
  }

  _buildLanding() {
    return initVideoReveal(this.media);
  }

  /**
   * Gel fade, then video fade, strictly in sequence: the gel is the intro's
   * first child, and the video's fade is shifted to start when it has landed.
   * Built at construction, outside any gsap.matchMedia context, so a
   * breakpoint revert cannot undo it. The fromTo renders the gel's hidden
   * start explicitly.
   */
  _buildIntro() {
    const intro = buildVideoIntro(this.media, {
      duration: this.options.duration,
      ease: this.options.ease.out,
    });
    if (!this.videoGel) return intro;
    const { duration, ease } = BACKGROUND_VIDEO_GEL_REVEAL;
    intro.shiftChildren(duration);
    intro.fromTo(
      this.videoGel,
      { autoAlpha: motionTokens.opacity.zero },
      {
        autoAlpha: motionTokens.opacity.full,
        duration,
        ease,
        onComplete: () => {
          this._videoGelShown = true;
        },
      },
      0,
    );
    return intro;
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
   * Idle timeline for the rest pose on the section ROOT (video, pixelator,
   * gels as one piece; `this.view`, not `this.media`). It is never played:
   * snapPerspective() finishes it, and its progress is the "settled" flag.
   * `immediateRender: false` keeps construction from writing a transform.
   * Transform only.
   */
  _buildIdle() {
    // onComplete re-asserts the pose at the current width, then notifies the
    // section (fires when snapPerspective() finishes the timeline).
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

  /** True once the rest pose has been snapped (idle timeline finished). */
  isPerspectiveSettled() {
    return this.getTimeline(TIMELINE_IDS.idle)?.progress() === 1;
  }

  /**
   * Apply the rest pose statically — construction, breakpoint entry, intro
   * completion, resize. The timeline is finished first so it reads as settled;
   * the set then re-asserts the pose at the current width.
   */
  snapPerspective() {
    if (!this.view) return;
    this.getTimeline(TIMELINE_IDS.idle)?.progress(1);
    gsap.set(this.view, this._restPose());
  }

  /**
   * Back to flat, with no inline transform left behind. Transform only: the
   * video gel is not in the idle timeline, so rewinding it cannot hide the
   * gel.
   */
  clearPerspective() {
    this.getTimeline(TIMELINE_IDS.idle)?.pause(0);
    if (this.view) {
      gsap.set(this.view, { clearProps: "transform,transformOrigin" });
    }
  }

  /**
   * Snap `gel_video` to visible: gated paths (reduced motion, session-gated
   * replay), and breakpoint crossings and resizes after the reveal landed.
   * Idempotent, and nothing in this module ever hides the gel again.
   */
  showVideoGel() {
    if (!this.videoGel) return;
    this._videoGelShown = true;
    gsap.set(this.videoGel, { autoAlpha: motionTokens.opacity.full });
  }

  /** True once the reveal has landed (intro fade) or been snapped. */
  isVideoGelShown() {
    return this._videoGelShown;
  }

  _buildOutro() {
    return gsap.timeline({ id: TIMELINE_IDS.outro });
  }
}
