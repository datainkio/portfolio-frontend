/** @format */

/**
 * Lightbox
 *
 * Progressive-enhancement controller for the image lightbox molecule. Wires a
 * trigger button to a native <dialog> so opening/closing, focus trapping, and
 * Escape-to-close all come from the platform rather than hand-rolled JS.
 */

export class Lightbox {
  constructor(root) {
    this.root = root;
    this.dialog = root.querySelector('[data-lightbox-el="dialog"]');
    this.trigger = root.querySelector('[data-lightbox-el="trigger"]');
    this.closeBtn = root.querySelector('[data-lightbox-el="close"]');

    this.trigger?.addEventListener("click", () => this.open());
    this.closeBtn?.addEventListener("click", () => this.close());
    // Clicking the backdrop area (the dialog element itself, outside its
    // content box) closes it; clicks on the image/caption/button do not
    // bubble to the dialog as their own target.
    this.dialog?.addEventListener("click", (e) => {
      if (e.target === this.dialog) this.close();
    });
  }

  open() {
    this.dialog?.showModal();
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
