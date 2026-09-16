import AbstractSection from "../../system/AbstractSection.js";
import { SELECTORS, VIDEO_SELECTORS } from "../../config/index/index.js";
import BackgroundVideoAnimations from "./BackgroundVideoAnimations.js";
import BackgroundVideoTriggers from "./BackgroundVideoTriggers.js";

export default class BackgroundVideo extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.video);
    const animations = new BackgroundVideoAnimations(view);
    const triggers = new BackgroundVideoTriggers(view);

    super({
      view,
      animations,
      triggers,
      sectionKey: "video",
      bus,
      reducedMotionHandler,
    });

    this.videoEl = this.view?.querySelector(VIDEO_SELECTORS.media) ?? null;
    this._videoReadyPromise = null;
  }

  /**
   * Resolve once the video can play. The deferred `src` is assigned by the
   * preloader (js/preloader/deferred-videos.js — the single owner of the
   * `data-defer-video` contract) before `preloader:out`, which is the earliest
   * this section can be asked to play. So this only ever waits on buffering.
   */
  async _ensureVideoReady() {
    if (!this.videoEl) return;

    if (this.videoEl.readyState >= 2) return;
    // No source at all (hydration skipped or failed): nothing will ever
    // buffer, so don't hold the landing chain on a `canplay` that can't come.
    if (!this.videoEl.currentSrc && !this.videoEl.src) return;

    if (!this._videoReadyPromise) {
      this._videoReadyPromise = new Promise((resolve) => {
        const complete = () => {
          this.videoEl?.removeEventListener("canplay", complete);
          this.videoEl?.removeEventListener("error", complete);
          resolve();
        };
        this.videoEl.addEventListener("canplay", complete, { once: true });
        this.videoEl.addEventListener("error", complete, { once: true });
      }).finally(() => {
        this._videoReadyPromise = null;
      });
    }

    return this._videoReadyPromise;
  }

  _playVideo() {
    if (!this.videoEl) return;
    const playPromise = this.videoEl.play?.();
    if (playPromise?.catch) playPromise.catch(() => {});
  }

  async playIntro() {
    if (this.isDisabled || !this._isLifecycleMotionEnabled) {
      // Reduced motion (or disabled): don't autoplay the video, but still
      // delegate to super so the base snaps the post-intro state and emits
      // `video.introComplete`.
      this.videoEl?.pause?.();
      return super.playIntro();
    }

    await this._ensureVideoReady();
    this._playVideo();
    return super.playIntro();
  }

  async playOutro() {
    this.videoEl?.pause?.();
    return super.playOutro();
  }

  _onEnter() {}
  _onLeave() {}
  _onEnterBack() {}
  _onLeaveBack() {}
}
