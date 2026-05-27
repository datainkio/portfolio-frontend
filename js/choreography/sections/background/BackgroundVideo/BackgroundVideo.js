import AbstractSection from "../../abstract-section/AbstractSection/AbstractSection.js";
import { SELECTORS } from "../../../config/index/index.js";
import BackgroundVideoAnimations from "../BackgroundVideoAnimations/BackgroundVideoAnimations.js";
import BackgroundVideoTriggers from "../BackgroundVideoTriggers/BackgroundVideoTriggers.js";

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

    this.videoEl = this.view?.querySelector("video") ?? null;
    this._videoReadyPromise = null;
  }

  async _ensureVideoReady() {
    if (!this.videoEl) return;

    if (this.videoEl.dataset.deferVideo && this.videoEl.dataset.src) {
      const shouldLoadDeferredSource =
        this.videoEl.src !== this.videoEl.dataset.src;
      if (shouldLoadDeferredSource) {
        this.logger?.trace?.("Loading deferred background video");
        this.videoEl.src = this.videoEl.dataset.src;
        this.videoEl.load();
      }
    }

    if (this.videoEl.readyState >= 2) {
      return;
    }

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
      this.videoEl?.pause?.();
      return Promise.resolve();
    }

    await this._ensureVideoReady();
    this._playVideo();
    return super.playIntro();
  }

  async playOutro() {
    this.videoEl?.pause?.();
    return super.playOutro();
  }

  _onEnter() {
    // do nothing - allow video to continue playing when scrolling back up into section;
  }

  _onLeave() {
    //
  }

  _onEnterBack() {
    // do nothing - allow video to continue playing when scrolling back up into section;
  }

  _onLeaveBack() {
    // do nothing - allow video to continue playing when scrolling back up into section;
  }
}
