import { gsap } from "/assets/js/choreography/system/gsap.js";
import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import { HOME_HERO_HOLD, HOME_HERO_OUTRO } from "../../config/ix/motion.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

/**
 * HomeHeaderManager
 *
 * Owns the home landing header's role state machine. The header has three roles,
 * expressed as `data-header-role` on the element:
 *
 *   1. `loader`    — initial state; the header is the preloader/loading view. The
 *      preloader runtime (pure CSS, via `data-preloader-state`) owns the visuals
 *      here and ends by dispatching `preloader:out`.
 *   2. `hero`      — idle state; the header is a hero design element. Entered when
 *      the manager arms on `preloader:out` (the CSS -> GSAP ownership seam).
 *   3. `dismissed` — the hero has played and cleared. The header is `hidden` (CSS
 *      owns that off the attribute) and takes no further part in the page.
 *
 * `preloader:out` is the seam where motion/IX ownership hands off from CSS to
 * GSAP; this manager arms only then — before it, the header is `position: fixed`
 * and CSS-owned, so touching it early would fight the loader outro.
 *
 * Trigger (hero -> dismissed): TIME, and nothing else. On arm the header enters
 * `hero` and a `gsap.delayedCall` runs for HOME_HERO_HOLD seconds (zeroed under
 * reduced motion; overridable via `?heroHold=<seconds>` for DX). When it fires,
 * the hero panel slides off-stage and `home:outro:complete` emits. Scroll and tap
 * are inert by design — an earlier scroll-gated swap hid content behind an
 * interaction gate with no cue.
 *
 * `home:outro:complete` is load-bearing: `LandingSequence` cues the background
 * video's intro off it, which in turn cues the gel entrance and the bio intro.
 * The header opens the landing; the rest of the page carries it from there.
 *
 * The role swap itself is CSS-owned: the template declares each role's layout as
 * Tailwind data-variants keyed on `data-header-role`, so JS only flips the one
 * attribute and never couples to utility-class names. On top of that instant CSS
 * swap this manager plays the one piece of behavioural motion it owns: the hero's
 * exit. The header's resting position is CSS-owned (a fixed overlay); this
 * manager does no positioning.
 */
export default class HomeHeaderManager {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped("HomeHeaderManager", {
      color: "#EC4899",
      enabled: true,
    });

    this._bus = bus;
    this._events = EVENTS.home;
    this._el = document.querySelector(SELECTORS.homeHeader);
    this._reducedMotionHandler = reducedMotionHandler;
    // The hero-hold timer (gsap.delayedCall) and the outro timeline. Both stored
    // so they are killable and the timeline stays seekable.
    this._holdCall = null;
    this._master = null;
    this._dismissed = false;
    this._onPreloaderOut = null;

    if (!this._el) {
      this.logger.trace("element not found; HomeHeaderManager disabled");
      return;
    }

    // CSS owns the header until the outro completes; arm only at the handoff.
    this._onPreloaderOut = () => this._arm();
    window.addEventListener(EVENTS.system.preloaderOut, this._onPreloaderOut, {
      once: true,
    });
  }

  _arm() {
    if (this._holdCall || this._master || this._dismissed) return;

    // The preloader (loader role) has finished, so the header now rests as the
    // hero. This is the loader -> hero transition.
    this._enterHeroRole();

    // Time is the sole trigger. `gsap.delayedCall` (not setTimeout) so the timer
    // is ticker-synced, pausable and killable. Reduced motion zeroes the hold and
    // the transition resolves instantly.
    const reduced = this._reducedMotionHandler?.isReducedMotion?.() ?? false;
    const hold = this._resolveHold(reduced);
    this._holdCall = gsap.delayedCall(hold, () => this._runTransition(reduced));

    this.logger.trace(`armed; hero holds ${hold}s then exits`);
  }

  /**
   * Resolve the hero hold in seconds. Reduced motion zeroes it. Otherwise an
   * optional `?heroHold=<seconds>` URL param overrides the HOME_HERO_HOLD token
   * for rebuild-free DX tuning; the token remains the source of truth.
   *
   * @param {boolean} reduced
   * @returns {number}
   */
  _resolveHold(reduced) {
    if (reduced) return 0;
    const override = this._readHoldOverride();
    return Number.isFinite(override) ? override : HOME_HERO_HOLD.delay;
  }

  /**
   * Read a non-negative `?heroHold=<seconds>` override, or NaN when absent or
   * malformed. Wrapped in try/catch so a hostile/locked-down `location` never
   * throws on arm.
   *
   * @returns {number}
   */
  _readHoldOverride() {
    try {
      const raw = new URLSearchParams(window.location.search).get("heroHold");
      if (raw == null) return NaN;
      const n = parseFloat(raw);
      return Number.isFinite(n) && n >= 0 ? n : NaN;
    } catch {
      return NaN;
    }
  }

  /**
   * Play the hero's exit: the panel slides off-stage left, revealing page content
   * beneath, and the header is then dismissed for good.
   *
   * Under reduced motion there is no slide — the outro pair is still emitted, and
   * the header still dismissed, so the sequence downstream is not left waiting.
   *
   * @param {boolean} reduced
   */
  _runTransition(reduced) {
    this._holdCall = null;
    if (this._dismissed) return;

    if (reduced) {
      this._emit(this._events?.outroStart);
      this._dismiss();
      this._emit(this._events?.outroComplete);
      return;
    }

    // Stored so it stays seekable and killable.
    this._master = gsap.timeline();
    this._master.add(this._buildDeconstruct(), "deconstruct");
  }

  /**
   * Deconstruct (outro): the hero panel slides off-stage left, revealing page
   * content beneath. Transform-only (compositor-safe) — never width/layout. The
   * lockup rides the header off, so the hero reads as exiting. Emits the outro
   * pair on the bus, and dismisses the header before announcing completion so no
   * listener can observe a half-gone header.
   *
   * @returns {import("gsap").core.Timeline}
   */
  _buildDeconstruct() {
    const tl = gsap.timeline({
      onStart: () => this._emit(this._events?.outroStart),
      onComplete: () => {
        this._dismiss();
        this._emit(this._events?.outroComplete);
      },
    });
    tl.to(this._el, {
      xPercent: HOME_HERO_OUTRO.xPercent,
      duration: HOME_HERO_OUTRO.duration,
      ease: HOME_HERO_OUTRO.ease,
    });
    return tl;
  }

  /**
   * loader -> hero. The preloader has handed off; the header settles into its
   * idle hero role. The layout is CSS-owned off `data-header-role`, so this only
   * flips the attribute.
   */
  _enterHeroRole() {
    this._el.dataset.headerRole = "hero";
    this.logger.trace("entered hero role");
  }

  /**
   * hero -> dismissed. The hero has said its piece and slid off-stage; retire the
   * header rather than leaving a full-viewport opaque overlay parked just outside
   * the viewport, where it is still in the accessibility tree and can widen the
   * scrollable area on mobile.
   *
   * `display: none` is CSS-owned off the role attribute
   * (`data-[header-role=dismissed]:hidden`), so this flips the one attribute and
   * clears the inline transform the slide left behind — the element is hidden, so
   * the cleared transform is never seen.
   *
   * Idempotent: `_dismissed` guards a second call (reduced-motion path plus a
   * timeline that somehow still completes).
   */
  _dismiss() {
    if (this._dismissed) return;
    this._dismissed = true;
    gsap.set(this._el, { clearProps: "transform" });
    this._el.dataset.headerRole = "dismissed";
    this.logger.trace("dismissed");
  }

  /**
   * Emit on the AnimationBus if both a bus and an event name are present.
   * Mirrors AbstractSection._emit so managers and sections coordinate uniformly.
   */
  _emit(eventName, payload = {}) {
    if (!this._bus || !eventName) return;
    this._bus.emit(eventName, { element: this._el, ...payload });
  }

  kill() {
    if (this._onPreloaderOut) {
      window.removeEventListener(
        EVENTS.system.preloaderOut,
        this._onPreloaderOut,
      );
      this._onPreloaderOut = null;
    }

    this._holdCall?.kill();
    this._holdCall = null;

    this._master?.kill();
    this._master = null;

    this._dismissed = false;

    // Reset to the hero role. The header layout is CSS-owned off this attribute,
    // so restoring it hands ownership back to CSS — no class bookkeeping needed.
    // (`loader` is a one-time boot phase that can't be meaningfully re-entered,
    // so `hero` is the idle resting fallback.) Clearing the transform releases the
    // slide so CSS owns the resting position.
    if (this._el) {
      this._el.dataset.headerRole = "hero";
      gsap.set(this._el, { clearProps: "transform" });
    }

    this.logger.trace("destroyed");
  }
}
