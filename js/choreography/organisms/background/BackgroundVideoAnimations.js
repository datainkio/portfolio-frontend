import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import {
  buildPaneContract,
  buildPaneVeil,
} from "../../molecules/video-reveal/pane-contract.js";
import {
  initVideoReveal,
  buildVideoIntro,
} from "../../molecules/video-reveal/video-reveal.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import {
  BACKGROUND_ANIMATION_DEFAULTS,
  BACKGROUND_HEADING_GEL_REVEAL,
  BACKGROUND_PANES,
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

    // The transient landing panes, in DOM order (slate, yellow, orange-red).
    // Hidden by markup; only the intro timeline shows and contracts them.
    this.panes = Array.from(
      this.view?.querySelectorAll(VIDEO_SELECTORS.pane) ?? [],
    );

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
    const video = {
      duration: this.options.duration,
      ease: this.options.ease.out,
    };
    if (!this.panes.length) return buildVideoIntro(this.media, video);

    // Veil, heading gel under the veil, video fade, contraction: one after
    // another. The video's own timeline is nested unnamed so only this outer
    // timeline carries TIMELINE_IDS.intro.
    const { veil, contract } = BACKGROUND_PANES;
    return gsap
      .timeline({ id: TIMELINE_IDS.intro })
      .add(
        buildPaneVeil(this.panes, {
          ...veil,
          transformOrigin: contract.transformOrigin,
        }),
      )
      .call(() => this.showHeadingGel())
      .add(buildVideoIntro(this.media, { ...video, id: null }))
      .add(buildPaneContract(this.panes, contract));
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
   * Played path: fade `gel_hero` 0 → 1 when the intro completes. A standalone
   * tween rather than a child of the idle timeline, so it also runs on flat
   * tiers and clearPerspective()'s rewind of idle cannot take the gel with it.
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
   * replay), and breakpoint crossings and resizes after the reveal was earned. Finishes a fade in flight.
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
