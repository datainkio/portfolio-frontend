import {
  gsap,
  ScrollTrigger,
  ScrollSmoother,
} from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion.js";
import {
  SELECTORS,
  BADGE_SELECTORS as SEL,
} from "../../config/contracts/selectors/selectors.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

const ATTR = SEL.elementAttribute;
const SCROLL_THRESHOLD_PX = 80;

export default class BadgeManager {
  constructor({ bus, reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped("BadgeManager", {
      color: "#8B5CF6",
      enabled: true,
    });

    this._el = document.querySelector(`[${ATTR}="${SEL.toggle}"]`);
    this._dialog = document.querySelector(`[${ATTR}="${SEL.dialog}"]`);
    this._close = this._dialog?.querySelector(`[${ATTR}="${SEL.close}"]`);
    this._bus = bus;
    this._reducedMotionHandler = reducedMotionHandler;
    this._offCue = null;
    this._revealed = false;
    this._trigger = null;
    this._isHidden = false;
    this._listeners = new AbortController();

    if (!this._el || !this._dialog) {
      this.logger.trace("badge or dialog not found; BadgeManager disabled");
      return;
    }

    this._init();
  }

  _init() {
    if (this._el.dataset.badgeInit) return;
    this._el.dataset.badgeInit = "1";

    // The native <dialog> traps focus, closes on Escape and returns focus to
    // the badge. Its `close` event fires on every dismissal path, so it also
    // resumes the smoother that _open() paused.
    const { signal } = this._listeners;
    this._el.addEventListener("click", () => this._open(), { signal });
    this._close?.addEventListener("click", () => this._dialog.close(), {
      signal,
    });
    // A link to a hash on the page already showing (a Work industry link, from
    // the site map opened on /work/) doesn't unload it, so the dialog would
    // stay open over the target. Close it; the native hash navigation follows.
    this._dialog.addEventListener(
      "click",
      (event) => {
        const link = event.target.closest?.("a[href]");
        if (!link || !this._dialog.contains(link)) return;
        const url = new URL(link.href, window.location.href);
        if (
          url.origin === window.location.origin &&
          url.hash &&
          url.pathname === window.location.pathname
        ) {
          this._dialog.close();
        }
      },
      { signal },
    );
    this._dialog.addEventListener(
      "close",
      () => {
        this._el.setAttribute("aria-expanded", "false");
        ScrollSmoother.get()?.paused(false);
      },
      { signal },
    );

    // The markup ships `hidden`. On home (bus + hero section), the reveal is
    // the last beat of the landing chain — it waits for the hero intro, so the
    // badge enters once the page content has settled. Everywhere else it
    // reveals immediately: landing pages without a hero (work, contact) load
    // the Director too, and would otherwise wait on a cue that never fires.
    if (this._bus && document.getElementById(SELECTORS.hero)) {
      this._offCue = this._bus.on(EVENTS.hero.introComplete, () =>
        this._reveal(),
      );
    } else {
      this._reveal();
    }

    this.logger.trace("initialized");
  }

  _isReduced() {
    return this._reducedMotionHandler?.isReducedMotion?.() ?? false;
  }

  _open() {
    // normalizeScroll swallows wheel and touch on the whole document, so the
    // dialog couldn't scroll. A paused smoother drops the normalizer and
    // blocks page scroll while letting nested scrollers (the dialog) through.
    ScrollSmoother.get()?.paused(true);
    this._dialog.showModal();
    this._el.setAttribute("aria-expanded", "true");
    if (!this._close) return;

    // opacity, not autoAlpha: showModal() has already autofocused the close
    // button, and visibility:hidden would make the browser drop that focus.
    const shown = { opacity: 1, rotation: 0 };
    if (this._isReduced()) {
      gsap.set(this._close, shown);
      return;
    }
    gsap.fromTo(
      this._close,
      { opacity: 0, rotation: -90 },
      {
        ...shown,
        // fromTo renders the from-state at once, so the button stays
        // invisible (but focused) through the delay.
        delay: motion.duration("slower") / 1000,
        duration: motion.duration("base") / 1000,
        ease: motion.ease("enter"),
        overwrite: true,
      },
    );
  }

  _reveal() {
    if (this._revealed) return;
    this._revealed = true;
    this._offCue?.();
    this._offCue = null;

    const reduced = this._isReduced();
    // Only a home reveal is choreographed; elsewhere the badge is page chrome.
    const animate = !reduced && Boolean(this._bus);

    this._bus?.emit(EVENTS.header.introStart);
    this._el.classList.remove("hidden");

    // Scroll auto-hide is armed only after the intro, so it can never fire first.
    const onComplete = () => {
      this._trigger = ScrollTrigger.create({
        onUpdate: (self) => this._onScrollUpdate(self, reduced),
      });
      this._bus?.emit(EVENTS.header.introComplete);
    };

    if (!animate) {
      gsap.set(this._el, { yPercent: 0 });
      onComplete();
      return;
    }

    gsap.fromTo(
      this._el,
      { yPercent: -100 },
      {
        yPercent: 0,
        duration: motion.duration("base") / 1000,
        ease: motion.ease("enter"),
        onComplete,
      },
    );
  }

  _onScrollUpdate(self, reduced) {
    // Auto-hide pauses while the site map is open.
    if (this._dialog.open) return;
    if (self.scroll() < SCROLL_THRESHOLD_PX) {
      this._show(reduced);
      return;
    }
    if (self.direction === 1) {
      this._hide(reduced);
    } else {
      this._show(reduced);
    }
  }

  _hide(reduced) {
    if (this._isHidden) return;
    this._isHidden = true;
    if (reduced) {
      gsap.set(this._el, { yPercent: -100 });
      return;
    }
    gsap.to(this._el, {
      yPercent: -100,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("exit"),
      overwrite: true,
    });
  }

  _show(reduced) {
    if (!this._isHidden) return;
    this._isHidden = false;
    if (reduced) {
      gsap.set(this._el, { yPercent: 0 });
      return;
    }
    gsap.to(this._el, {
      yPercent: 0,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("enter"),
      overwrite: true,
    });
  }

  kill() {
    this._offCue?.();
    this._offCue = null;
    this._trigger?.kill();
    this._trigger = null;
    // Aborting the listeners drops the close handler that resumes the smoother.
    if (this._dialog?.open) ScrollSmoother.get()?.paused(false);
    this._listeners.abort();
    if (this._el) gsap.killTweensOf(this._el);
    if (this._close) gsap.killTweensOf(this._close);
    this.logger.trace("destroyed");
  }
}
