import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import {
  buildPaneContract,
  buildSheetWipe,
} from "../../molecules/video-reveal/pane-contract.js";
import {
  initVideoReveal,
  buildVideoIntro,
} from "../../molecules/video-reveal/video-reveal.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motionTokens } from "../../config/ix/motion.js";
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
    // Hidden by markup; staged before the preloader hides, contracted by the
    // intro timeline.
    this.panes = Array.from(
      this.view?.querySelectorAll(VIDEO_SELECTORS.pane) ?? [],
    );

    // The graph-paper sheet over the panes. Document-level lookup because it is
    // a sibling of the section root (kept flat, outside the tilted root).
    this.sheet = document.querySelector(VIDEO_SELECTORS.sheet);
    this._panesStaged = false;

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

    // One timeline, all positions absolute from 0: the video fades in from the
    // start, the sheet is clipped away, and the panes contract once the sheet
    // is half gone (the same overlap they have with each other). The sets at 0
    // make the first frame correct even if stagePanes() never ran. The video's
    // own timeline is nested unnamed so only this outer timeline carries
    // TIMELINE_IDS.intro.
    const { contract, sheet } = BACKGROUND_PANES;
    const intro = gsap.timeline({ id: TIMELINE_IDS.intro });
    if (this.sheet) {
      intro.set(this.sheet, { autoAlpha: motionTokens.opacity.full }, 0);
    }
    intro
      .set(
        this.panes,
        {
          autoAlpha: motionTokens.opacity.full,
          scaleX: 1,
          transformOrigin: contract.transformOrigin,
        },
        0,
      )
      .add(buildVideoIntro(this.media, { ...video, id: null }), 0)
      .add(buildSheetWipe(this.sheet, sheet), 0)
      .add(buildPaneContract(this.panes, contract), contract.stagger);
    return intro;
  }

  /**
   * Run `write` outside any active gsap context. The controller stages from
   * inside its gsap.matchMedia callback, and a context reverts the sets made in
   * it on its next pass, which would hide the sheet and panes mid-intro.
   */
  _outsideContext(write) {
    const ctx = gsap.context?.();
    if (ctx?.ignore) ctx.ignore(write);
    else write();
  }

  /**
   * Put the sheet and panes in place, fully covering the page, and show
   * `gel_hero` under them so it never visibly pops. Called by BackgroundVideo
   * before the preloader hides. No-op when there are no panes.
   */
  stagePanes() {
    if (!this.panes.length) return;
    this._panesStaged = true;
    this._outsideContext(() => {
      if (this.sheet) {
        gsap.set(this.sheet, {
          autoAlpha: motionTokens.opacity.full,
          clearProps: "clipPath",
        });
      }
      gsap.set(this.panes, {
        autoAlpha: motionTokens.opacity.full,
        scaleX: 1,
        transformOrigin: BACKGROUND_PANES.contract.transformOrigin,
      });
    });
    this.showHeadingGel();
  }

  /** Hide the sheet and panes again (a gated state arrived before the intro). */
  unstagePanes() {
    this._panesStaged = false;
    this._outsideContext(() => {
      const targets = [this.sheet, ...this.panes].filter(Boolean);
      if (targets.length) {
        gsap.set(targets, { autoAlpha: motionTokens.opacity.zero });
      }
    });
  }

  arePanesStaged() {
    return this._panesStaged;
  }

  /** True while the intro has neither started nor been jumped to its end. */
  isIntroPristine() {
    const intro = this.getTimeline(TIMELINE_IDS.intro);
    return Boolean(
      intro && intro.paused() && !intro.isActive() && intro.progress() === 0,
    );
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
