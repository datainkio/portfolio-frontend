import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion.js";
import { BUILD_INFO_SELECTORS as SEL } from "../../config/contracts/selectors/selectors.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

const ATTR = SEL.elementAttribute;
const FPS_SAMPLE_INTERVAL_MS = 500;

/**
 * BuildInfoManager — click-driven disclosure for the section-cap build info.
 *
 * State machine:
 *   closed → click <toggle> OR anywhere in the build-info region → open
 *   open   → click <toggle> OR <close> → closed
 *
 * Motion: the list is a drawer anchored to the header's bottom edge
 * (`top-full` in build-info.njk). Closed = translated up by its own height
 * (yPercent: -100), so its bottom edge sits flush with the header's bottom
 * edge; open = yPercent: 0, sliding fully into view. Transform-only, mirrors
 * GlobalHeaderManager's hide/show shape. No-ops gracefully when the markup
 * is absent.
 *
 * FPS: while open, samples frame rate via requestAnimationFrame and writes a
 * rounded value into `[data-current-fps-build]` every ~500ms (throttled —
 * writing every frame would be wasted layout work for a value nobody reads
 * that fast). The loop starts on open() and is cancelled on close()/kill() so
 * it never runs while the drawer is hidden.
 */
export default class BuildInfoManager {
  constructor({ reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped("BuildInfoManager", {
      color: "#22D3EE",
      enabled: true,
    });

    this._reducedMotionHandler = reducedMotionHandler;
    this._root = document.querySelector(`[${ATTR}="${SEL.root}"]`);

    if (!this._root) {
      this.logger.trace("root not found; BuildInfoManager disabled");
      return;
    }

    this._toggle = this._root.querySelector(`[${ATTR}="${SEL.toggle}"]`);
    this._list = this._root.querySelector(`[${ATTR}="${SEL.list}"]`);
    // Cap <ul> ancestor: carries the open-state attribute that drives item basis.
    this._cap = this._root.closest(`[${ATTR}="${SEL.cap}"]`);

    if (!this._toggle || !this._list) {
      this.logger.trace("toggle/list not found; BuildInfoManager disabled");
      return;
    }

    this._fpsEl = document.querySelector("[data-current-fps-build]");
    this._fpsRafId = null;
    this._fpsFrameCount = 0;
    this._fpsLastSampleTime = 0;
    this._onFpsFrame = (now) => this._sampleFps(now);

    this._open = false;
    this._onClick = (event) => this._handleClick(event);

    this._init();
  }

  _init() {
    gsap.set(this._list, { yPercent: -100 });
    this._root.addEventListener("click", this._onClick);
    this.logger.trace("initialized");
  }

  _startFpsLoop() {
    if (!this._fpsEl || this._fpsRafId) return;
    this._fpsFrameCount = 0;
    this._fpsLastSampleTime = performance.now();
    this._fpsRafId = requestAnimationFrame(this._onFpsFrame);
  }

  _stopFpsLoop() {
    if (this._fpsRafId) cancelAnimationFrame(this._fpsRafId);
    this._fpsRafId = null;
  }

  _sampleFps(now) {
    this._fpsFrameCount += 1;
    const elapsed = now - this._fpsLastSampleTime;
    if (elapsed >= FPS_SAMPLE_INTERVAL_MS) {
      const fps = Math.round((this._fpsFrameCount * 1000) / elapsed);
      this._fpsEl.textContent = `${fps}`;
      this._fpsFrameCount = 0;
      this._fpsLastSampleTime = now;
    }
    this._fpsRafId = requestAnimationFrame(this._onFpsFrame);
  }

  _handleClick(event) {
    if (event.target.closest(`[${ATTR}="${SEL.close}"]`)) {
      this.close();
      return;
    }
    if (event.target.closest(`[${ATTR}="${SEL.toggle}"]`)) {
      this.toggle();
    }
  }

  toggle() {
    if (this._open) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this._open) return;
    this._open = true;
    this._toggle.setAttribute("aria-expanded", "true");
    this._list.setAttribute("aria-hidden", "false");
    this._cap?.setAttribute(SEL.openAttribute, "");
    this._startFpsLoop();

    const reduced = this._reducedMotionHandler?.isReducedMotion?.() ?? false;
    if (reduced) {
      gsap.set(this._list, { yPercent: 0 });
      return;
    }
    gsap.to(this._list, {
      yPercent: 0,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("enter"),
      overwrite: true,
    });
  }

  close() {
    if (!this._open) return;
    this._open = false;
    this._toggle.setAttribute("aria-expanded", "false");
    this._list.setAttribute("aria-hidden", "true");
    this._cap?.removeAttribute(SEL.openAttribute);
    this._stopFpsLoop();

    const reduced = this._reducedMotionHandler?.isReducedMotion?.() ?? false;
    if (reduced) {
      gsap.set(this._list, { yPercent: -100 });
      return;
    }
    gsap.to(this._list, {
      yPercent: -100,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("exit"),
      overwrite: true,
    });
  }

  kill() {
    this._root?.removeEventListener("click", this._onClick);
    this._stopFpsLoop();
    if (this._list) gsap.killTweensOf(this._list);
    this.logger.trace("destroyed");
  }
}
