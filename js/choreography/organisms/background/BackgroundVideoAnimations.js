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
    // inside a clip-path on the grid element, and the intro pops cells into it.
    // The grid element is an ancestor of the video, pixelator and gels.
    this.media = this.view?.querySelector(VIDEO_SELECTORS.media) ?? null;
    this.grid = this.view?.querySelector(VIDEO_SELECTORS.grid) ?? null;
    this._revealed = false;
    this._cellTimes = [];

    // `gel_video`, resolved by BackgroundVideo through the gel manager. This
    // section is the gel's only owner: GelAnimationManager parks it at
    // autoAlpha 0, and the intro snaps it visible inside the clip.
    // State lives here rather than on the controller because the controller's
    // gated paths can run inside its super() call, before its own fields exist.
    this.videoGel = options.videoGel ?? null;
    this._videoGelShown = false;

    this._buildTimeline();
  }

  /**
   * The landing state is the empty clip-path on the grid: nothing of the
   * background section is drawn until the intro pops cells open. Applied here,
   * at construction and outside any gsap.matchMedia context, so a breakpoint
   * revert cannot undo it. The preloader covers the page until `preloader:out`,
   * so this is early enough. Gated paths remove it again (revealAll()).
   */
  _buildLanding() {
    this._applyClip(new Set());
    return gsap.timeline({ id: TIMELINE_IDS.landing });
  }

  /**
   * Snap the video and `gel_video` visible at time 0 (they are clipped away, and
   * this overrides GelAnimationManager's parking of the gel at autoAlpha 0),
   * then pop the grid's cells open in the clip-path: columns right to left,
   * cells in random order within a column (shuffled at build), `cellStagger`
   * apart, each column starting `triggerAfterCells x cellStagger` after the one
   * to its right (BACKGROUND_GRID_REVEAL). The revealed set is derived from the
   * timeline's current time in onUpdate, so a jump is as correct as a play.
   * Without a grid the intro is just the snap, so it still completes. Built at
   * construction, outside any gsap.matchMedia context.
   */
  _buildIntro() {
    const intro = gsap.timeline({ id: TIMELINE_IDS.intro });
    intro.call(() => this._showMedia(), null, 0);
    if (!this.grid) return intro;

    const { columns, rows, cellStagger, triggerAfterCells } =
      BACKGROUND_GRID_REVEAL;
    const columnOffset = triggerAfterCells * cellStagger;
    // Each cell with the time it pops. Columns right to left; the rows of a
    // column in an order fixed at build.
    this._cellTimes = [];
    let lastTime = 0;
    for (let step = 0; step < columns; step += 1) {
      const col = columns - 1 - step;
      const order = gsap.utils.shuffle(Array.from({ length: rows }, (_, r) => r));
      order.forEach((row, k) => {
        const time = step * columnOffset + k * cellStagger;
        this._cellTimes.push({ col, row, time });
        lastTime = Math.max(lastTime, time);
      });
    }
    // Sets the timeline's length (the last cell's time) and settles the clip.
    intro.call(() => this._syncClip(intro), null, lastTime);
    intro.eventCallback("onUpdate", () => this._syncClip(intro));
    return intro;
  }

  /**
   * Write the clip for the intro's current time: fully clipped at 0, the cells
   * whose time has come in between, no clip at the end (which also sets the
   * revealed flag).
   */
  _syncClip(intro) {
    const time = intro.time();
    if (time >= intro.duration()) {
      this._clearClip();
      this._revealed = true;
      return;
    }
    this._revealed = false;
    const shown = new Set();
    if (time > 0) {
      this._cellTimes.forEach(({ col, row, time: at }) => {
        if (at <= time) shown.add(col + row * BACKGROUND_GRID_REVEAL.columns);
      });
    }
    this._applyClip(shown);
  }

  /**
   * One polygon string, in percentages of the grid's own box, for the union of
   * the revealed cells (index = col + row * columns). Per row the revealed cells
   * form runs; a run with the same columns as the run directly above it extends
   * that rectangle, so fewer edges meet. Each rectangle is a clockwise loop
   * reached from and returned to the origin by a zero-width bridge; under the
   * nonzero fill rule the loops union with no seam beyond edge anti-aliasing.
   * Empty set: a degenerate polygon that draws nothing.
   */
  _clipPath(shown) {
    const { columns, rows } = BACKGROUND_GRID_REVEAL;
    const x = (c) => `${+((c / columns) * 100).toFixed(4)}%`;
    const y = (r) => `${+((r / rows) * 100).toFixed(4)}%`;
    const rects = [];
    let open = new Map();
    for (let row = 0; row < rows; row += 1) {
      const next = new Map();
      let col = 0;
      while (col < columns) {
        if (!shown.has(col + row * columns)) {
          col += 1;
          continue;
        }
        const start = col;
        while (col < columns && shown.has(col + row * columns)) col += 1;
        const key = `${start}-${col}`;
        const rect = open.get(key) ?? { c0: start, c1: col, r0: row };
        rect.r1 = row + 1;
        if (!open.has(key)) rects.push(rect);
        next.set(key, rect);
      }
      open = next;
    }
    if (!rects.length) return "polygon(0% 0%, 0% 0%, 0% 0%)";
    const points = ["0% 0%"];
    rects.forEach(({ c0, c1, r0, r1 }) => {
      const a = `${x(c0)} ${y(r0)}`;
      points.push(
        a,
        `${x(c1)} ${y(r0)}`,
        `${x(c1)} ${y(r1)}`,
        `${x(c0)} ${y(r1)}`,
        a,
        "0% 0%",
      );
    });
    return `polygon(${points.join(", ")})`;
  }

  _applyClip(shown) {
    if (this.grid) gsap.set(this.grid, { clipPath: this._clipPath(shown) });
  }

  _clearClip() {
    if (this.grid) gsap.set(this.grid, { clearProps: "clipPath" });
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
   * Remove the clip at once and snap the video and gel visible: gated paths and
   * post-intro re-assertion. No gated path can leave the background clipped away.
   */
  revealAll() {
    this._clearClip();
    this._revealed = true;
    this._showMedia();
  }

  /** True once the intro has finished, or the clip was removed by revealAll(). */
  isRevealed() {
    return this._revealed;
  }

  _buildOutro() {
    return gsap.timeline({ id: TIMELINE_IDS.outro });
  }
}
