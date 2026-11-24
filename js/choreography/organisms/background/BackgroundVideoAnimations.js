import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import {
  BACKGROUND_ANIMATION_DEFAULTS,
  BACKGROUND_GRID_REVEAL,
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

    // The video and its gel are never tweened: they sit at full visibility
    // under an opaque cell grid, and the intro hides the cells. The section
    // root also holds the pixelator, which has its own lifecycle.
    this.media = this.view?.querySelector(VIDEO_SELECTORS.media) ?? null;
    this.grid = this.view?.querySelector(VIDEO_SELECTORS.grid) ?? null;
    this._gridHidden = false;

    // `gel_video`, resolved by BackgroundVideo through the gel manager. This
    // section is the gel's only owner: GelAnimationManager parks it at
    // autoAlpha 0, and the intro snaps it visible under the grid.
    // State lives here rather than on the controller because the controller's
    // gated paths can run inside its super() call, before its own fields exist.
    this.videoGel = options.videoGel ?? null;
    this._videoGelShown = false;

    this._buildTimeline();
  }

  /**
   * Nothing to hide: the opaque grid (CSS, from first paint) covers the video
   * and gels, so the landing state is the cells themselves.
   */
  _buildLanding() {
    return gsap.timeline({ id: TIMELINE_IDS.landing });
  }

  /**
   * Snap the video and `gel_video` visible at time 0 (under the cells,
   * overriding GelAnimationManager's parking at autoAlpha 0), then fade the
   * cells out: columns right to left, cells in random order within a column,
   * each column starting once the one before it has hidden its first two
   * (BACKGROUND_GRID_REVEAL). Without a grid the intro is just the snap, so it
   * still completes. Built at construction, outside any gsap.matchMedia
   * context, so a breakpoint revert cannot undo it.
   */
  _buildIntro() {
    const intro = gsap.timeline({ id: TIMELINE_IDS.intro });
    intro.call(() => this._showMedia(), null, 0);

    const cells = this.grid ? Array.from(this.grid.children) : [];
    if (cells.length) {
      const { columns, cellDuration, cellStagger, triggerAfterCells, ease } =
        BACKGROUND_GRID_REVEAL;
      // A column starts when the one to its right has finished hiding
      // `triggerAfterCells` cells.
      const columnOffset =
        (triggerAfterCells - 1) * cellStagger + cellDuration;
      for (let step = 0; step < columns; step += 1) {
        const col = columns - 1 - step;
        // Row-major cells: this column, in a random order fixed at build.
        const column = gsap.utils.shuffle(
          cells.filter((_, i) => i % columns === col),
        );
        intro.to(
          column,
          {
            autoAlpha: motionTokens.opacity.zero,
            duration: cellDuration,
            ease,
            stagger: cellStagger,
          },
          step * columnOffset,
        );
      }
    }
    intro.call(() => {
      this._gridHidden = true;
    });
    return intro;
  }

  /** Video and gel to full visibility. Idempotent. */
  _showMedia() {
    if (this.media)
      gsap.set(this.media, { autoAlpha: motionTokens.opacity.full });
    this.showVideoGel();
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
   * Snap `gel_video` to visible: the intro's first step, gated paths (reduced
   * motion, session-gated replay), and breakpoint crossings and resizes.
   * Idempotent, and nothing in this module ever hides the gel again.
   */
  showVideoGel() {
    if (!this.videoGel) return;
    this._videoGelShown = true;
    gsap.set(this.videoGel, { autoAlpha: motionTokens.opacity.full });
  }

  /** True once the gel has been made visible (intro start or snapped). */
  isVideoGelShown() {
    return this._videoGelShown;
  }

  /**
   * Snap the whole grid hidden: gated paths and post-intro re-assertion. The
   * video and gel are snapped visible with it, so no gated path can leave the
   * background covered.
   */
  hideGrid() {
    if (this.grid)
      gsap.set(this.grid, { autoAlpha: motionTokens.opacity.zero });
    this._gridHidden = true;
    this._showMedia();
  }

  /** True once the intro has hidden the cells, or the grid was snapped hidden. */
  isGridHidden() {
    return this._gridHidden;
  }

  _buildOutro() {
    return gsap.timeline({ id: TIMELINE_IDS.outro });
  }
}
