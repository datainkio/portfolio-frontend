/** @format */

/**
 * Lightbox
 *
 * Progressive-enhancement controller for the lightbox molecule. Wires a
 * trigger button to a native <dialog> so opening/closing, focus trapping, and
 * Escape-to-close all come from the platform rather than hand-rolled JS.
 * A video in the dialog plays muted on open (skipped under reduced motion)
 * and pauses on every close path. A dialog caption becomes the dialog's
 * accessible description, so screen readers announce it on open.
 */

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
let captionCount = 0;

export class Lightbox {
  constructor(root) {
    this.root = root;
    this.dialog = root.querySelector('[data-lightbox-el="dialog"]');
    this.trigger = root.querySelector('[data-lightbox-el="trigger"]');
    this.closeBtn = root.querySelector('[data-lightbox-el="close"]');
    this.video = this.dialog?.querySelector('[data-lightbox-el="video"]');

    // Ids are assigned here rather than in templates: one place covers both
    // the Nunjucks dialog and the PortableText serializer's hand-built copy.
    const caption = this.dialog?.querySelector(
      '[data-lightbox-el="dialog-caption"]',
    );
    if (caption) {
      caption.id ||= `lightbox-caption-${++captionCount}`;
      this.dialog.setAttribute("aria-describedby", caption.id);
    }

    this.trigger?.addEventListener("click", () => this.open());
    this.closeBtn?.addEventListener("click", () => this.close());
    // Clicking the backdrop area (the dialog element itself, outside its
    // content box) closes it; clicks on the image/caption/button do not
    // bubble to the dialog as their own target.
    this.dialog?.addEventListener("click", (e) => {
      if (e.target === this.dialog) this.close();
    });
    // The `close` event fires for Escape as well as close(), so pausing here
    // covers every dismissal path.
    this.dialog?.addEventListener("close", () => this.video?.pause());
  }

  open() {
    this.dialog?.showModal();
    if (this.video && !window.matchMedia(REDUCED_MOTION).matches) {
      // Muted playback is allowed without further gesture; ignore rejections
      // (e.g. unsupported source) so the dialog still works as a viewer.
      this.video.play()?.catch(() => {});
    }
  }

  close() {
    this.dialog?.close();
  }
}

export function initLightboxes(root = document) {
  root
    .querySelectorAll('[data-lightbox-el="root"]')
    .forEach((el) => new Lightbox(el));
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initLightboxes(), {
      once: true,
    });
  } else {
    initLightboxes();
  }
}
