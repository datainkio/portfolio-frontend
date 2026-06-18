import { gsap } from "/assets/js/choreography/system/gsap.js";
import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import {
  HOME_NAV_REVEAL,
  HOME_HERO_HOLD,
  HOME_HERO_OUTRO,
  HOME_HERO_BUILD,
} from "../../config/ix/motion.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

/**
 * Seam motion tokens.
 *
 * The loader-state motion is CSS (it must run before GSAP parses — the
 * preloading FCP strategy). Its timing lives in CSS custom properties on
 * `[data-preloader]` (see `styles/components/hanko.css`). The GSAP nav reveal,
 * which runs AFTER the CSS→GSAP handoff, must share that timing rather than
 * fork it. So the CSS custom property is the single token authority; JS reads
 * it once at arm time (post-`preloader:out`, so no FCP cost) — never inlines a
 * second copy of the value.
 */
const SEAM_TOKENS = Object.freeze({
  navRevealDuration: {
    cssVar: "--hanko-enter-duration",
    fallbackSeconds: 0.75,
  },
});

/**
 * Max pointer travel (px) between pointerdown and pointerup that still counts as
 * a tap for the drawer toggle. Beyond it the gesture is a scroll/drag of the
 * expanded drawer (`overflow-auto`) and must not toggle.
 */
const TAP_MOVE_TOLERANCE_PX = 10;

/**
 * Parse a CSS time token to seconds. Handles `s` and `ms`; returns NaN for an
 * empty/unparseable value so the caller can fail loudly rather than silently
 * coerce.
 *
 * @param {string} raw
 * @returns {number}
 */
function parseCssSeconds(raw) {
  const value = (raw ?? "").trim();
  if (!value) return NaN;
  const n = parseFloat(value);
  if (Number.isNaN(n)) return NaN;
  return /ms$/i.test(value) ? n / 1000 : n;
}

/**
 * HomeHeaderManager
 *
 * Owns the home landing header's role state machine. The header has three roles,
 * expressed as `data-header-role` on the element:
 *
 *   1. `loader` — initial state; the header is the preloader/loading view. The
 *      preloader runtime (pure CSS, via `data-preloader-state`) owns the visuals
 *      here and ends by dispatching `preloader:out`.
 *   2. `hero`   — idle state; the header is a hero design element. Entered when
 *      the manager arms on `preloader:out` (the CSS -> GSAP ownership seam).
 *   3. `menu`   — the header acts as a navigation menu. Entered automatically a
 *      tunable hold after `hero`, driven by a timer — never by scroll or tap.
 *
 * `preloader:out` is the seam where motion/IX ownership hands off from CSS to
 * GSAP; this manager arms only then — before it, the header is `position: fixed`
 * and CSS-owned, so touching it early would fight the loader outro.
 *
 * Trigger (hero -> menu): TIME, not interaction. On arm the header enters `hero`
 * and a `gsap.delayedCall` runs for HOME_HERO_HOLD seconds (zeroed under reduced
 * motion; overridable at runtime via `?heroHold=<seconds>` for DX). When it
 * fires, the deconstruct -> build transition plays. Scroll and tap are inert by
 * design — the previous scroll-gated swap hid content behind an interaction gate
 * with no cue. See specs/animation/home-header-hero-to-menu-transition.animation-spec.md.
 *
 * The role swap itself is CSS-owned: the template declares each role's layout —
 * and the hgroup's full-vs-abbreviated brand text — as Tailwind data-variants
 * keyed on `data-header-role`, so JS only flips the one attribute and never
 * couples to utility-class names. On top of that instant CSS swap, this manager
 * plays the one piece of behavioural motion it owns: revealing the nav. The
 * header's resting position is CSS-owned (a fixed overlay); this manager does no
 * positioning.
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
    this._nav = document.querySelector(SELECTORS.homeNav);
    // The nav's list items are the stagger targets for the menu reveal.
    this._navItems = this._nav
      ? this._nav.querySelectorAll(SELECTORS.pageNavItem)
      : null;
    this._reducedMotionHandler = reducedMotionHandler;
    // The hero-hold timer (gsap.delayedCall) and the deconstruct->build master
    // timeline. Both stored so they are killable and the timeline stays seekable.
    this._holdCall = null;
    this._master = null;
    this._inMenuRole = false;
    this._onPreloaderOut = null;
    this._onHeaderPointerDown = null;
    this._onHeaderPointerUp = null;
    this._onHeaderPointerCancel = null;
    // Pointerdown coords, used to reject scroll/drag in the pointerup handler.
    this._tapOrigin = null;
    // Resolved once at arm time from the seam's CSS custom properties.
    this._seam = null;
    // The nav-reveal timeline, stored so a larger sequence can nest/await it.
    this._navReveal = null;

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
    if (this._holdCall || this._master || this._inMenuRole) return;

    // GSAP is loaded now (post-`preloader:out`), so reading computed style here
    // costs no FCP. Resolve the shared seam timing once — the CSS custom prop is
    // the authority; this never inlines a second copy.
    this._seam = this._readSeamTokens();

    // The preloader (loader role) has finished, so the header now rests as the
    // hero. This is the loader -> hero transition.
    this._enterHeroRole();

    // Time is the sole trigger. `gsap.delayedCall` (not setTimeout) so the timer
    // is ticker-synced, pausable and killable. Reduced motion zeroes the hold and
    // the transition resolves instantly.
    const reduced = this._reducedMotionHandler?.isReducedMotion?.() ?? false;
    const hold = this._resolveHold(reduced);
    this._holdCall = gsap.delayedCall(hold, () => this._runTransition(reduced));

    this.logger.trace(`armed; hero holds ${hold}s then auto-transitions`);
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
   * Play the hero -> menu transition: deconstruct the hero (outro) -> flip the
   * role at the seam (CSS resets to the rail rest) -> build the menu (intro).
   *
   * The role flip is the instant midpoint: it happens while the hero panel is
   * slid fully off-stage, so the progressive transform-only GSAP slide never
   * fights the instant CSS role-rest swap (the width change is invisible
   * off-screen). Under reduced motion there is no slide — the role flips and the
   * nav resolves instantly, with both event pairs emitted so any coordinating
   * sequence is not left waiting.
   *
   * @param {boolean} reduced
   */
  _runTransition(reduced) {
    this._holdCall = null;
    if (this._inMenuRole) return;

    if (reduced) {
      this._emit(this._events?.outroStart);
      this._emit(this._events?.outroComplete);
      this._enterMenuRole();
      this._showNav(); // emits intro:start/complete instantly under reduced motion
      return;
    }

    // One master timeline, two labeled phases, stored so it stays seekable and
    // killable.
    this._master = gsap.timeline();
    this._master
      .add(this._buildDeconstruct(), "deconstruct")
      .call(() => this._enterMenuRole(), null, "build")
      .add(this._buildMenuIn(), "build");
  }

  /**
   * Deconstruct (outro): the hero panel slides off-stage left, revealing page
   * content beneath. Transform-only (compositor-safe) — never width/layout. The
   * lockup rides the header off, so the hero reads as exiting. Emits the outro
   * pair on the bus.
   *
   * @returns {import("gsap").core.Timeline}
   */
  _buildDeconstruct() {
    const tl = gsap.timeline({
      onStart: () => this._emit(this._events?.outroStart),
      onComplete: () => this._emit(this._events?.outroComplete),
    });
    tl.to(this._el, {
      xPercent: HOME_HERO_OUTRO.xPercent,
      duration: HOME_HERO_OUTRO.duration,
      ease: HOME_HERO_OUTRO.ease,
    });
    return tl;
  }

  /**
   * Build (intro): the header — flipped to the narrow `menu` rail at the seam
   * while off-stage — slides back to its resting left edge, and the nav items
   * reveal in sequence (the nav stagger is the build's tail). The slide clears
   * its transform on completion so the CSS role-rest owns the final position.
   *
   * @returns {import("gsap").core.Timeline}
   */
  _buildMenuIn() {
    const tl = gsap.timeline();
    tl.to(this._el, {
      xPercent: HOME_HERO_BUILD.xPercent,
      duration: HOME_HERO_BUILD.duration,
      ease: HOME_HERO_BUILD.ease,
      clearProps: "transform",
    });
    const nav = this._showNav();
    if (nav) tl.add(nav, "<"); // reveal the nav as the rail slides in
    return tl;
  }

  /**
   * Read the seam's shared motion tokens from the header's CSS custom
   * properties — the single source of truth shared with the loader-state CSS.
   * Reads once (called from `_arm`). A missing/unparseable token is a real
   * misconfiguration (build dropped the var, or wrong element), so it warns
   * loudly and falls back to the named safety value rather than silently
   * forking the timing.
   *
   * @returns {{ navRevealDuration: number }}
   */
  _readSeamTokens() {
    const styles = getComputedStyle(this._el);
    const resolve = ({ cssVar, fallbackSeconds }) => {
      const seconds = parseCssSeconds(styles.getPropertyValue(cssVar));
      if (Number.isNaN(seconds)) {
        console.warn(
          `[HomeHeaderManager] seam token ${cssVar} missing or unparseable; ` +
            `falling back to ${fallbackSeconds}s. Define it in styles/components/hanko.css.`,
        );
        return fallbackSeconds;
      }
      return seconds;
    };

    return {
      navRevealDuration: resolve(SEAM_TOKENS.navRevealDuration),
    };
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

  _enterMenuRole() {
    // Guard first: `_arm()` can reach this via both `onEnter` and the immediate
    // `isActive` check, and at scroll 0 both fire. Returning early here keeps the
    // effect (and any logging) exactly-once.
    if (this._inMenuRole) return;
    this._inMenuRole = true;

    // Position is CSS-owned: the template keeps the header `fixed left-0 h-dvh`
    // and `hanko.css` no longer returns it to flow on `data-preloader-state="exit"`,
    // so it persists as a fixed overlay with content scrolling underneath.
    // ScrollSmoother does not run on home (no `#page-main-content`), so native
    // `fixed` holds without a pin. This manager does no positioning.

    // hero -> menu. The layout swap is CSS-owned: the template flips the header
    // `grid -> block` and the nav `display:none -> block` off this attribute via
    // Tailwind data-variants (`data-[header-role=menu]:` and
    // `group-data-[header-role=menu]:`). JS only flips the one attribute, so it
    // never couples to utility-class names (see the choreography decoupling rule).
    this._el.dataset.headerRole = "menu";

    // The hgroup persists into the menu rail; CSS collapses its lockup to the
    // abbreviated brand off the same role attribute, so the text swap needs no
    // JS. (The hgroup stays visible because its CSS intro holds the end frame via
    // `both` fill — nothing here hides it.)
    //
    // The nav reveal is NOT fired here. `_runTransition` orchestrates it as the
    // tail of the build phase (so it sequences after the role flip) — or, under
    // reduced motion, calls `_showNav` directly. This method only flips state.

    // Side-drawer toggle (base–md only; CSS gates the width to `max-lg:`). The
    // menu role rests collapsed (a `w-12` left rail); a tap anywhere in the
    // header — including on a page-nav link — expands it to full-screen and the
    // next tap collapses it. JS only flips `data-drawer`; CSS owns the width and
    // the nav's visibility off that attribute (`data-[drawer=open]` /
    // `group-data-[drawer=open]`). At lg+ the attribute is inert: the menu role
    // is a static `w-48` rail and the `max-lg:` width override never matches.
    //
    // Pointer events, not `click`: iOS WebKit does not reliably dispatch a
    // `click` on a non-interactive element (the `<header>` / its empty area),
    // even with `cursor: pointer`, so a click-based toggle silently no-ops on
    // iPhone/iPad. `pointerup` fires on a tap regardless of element type. A tap
    // is a pointerdown→pointerup with little travel; a larger move is a scroll of
    // the expanded drawer (`overflow-auto`) and must NOT toggle (the
    // `TAP_MOVE_TOLERANCE_PX` guard). A tap on a nav `<a>` still toggles here AND
    // navigates via the link's own click — closing the drawer as it jumps.
    this._onHeaderPointerDown = (e) => {
      this._tapOrigin = { x: e.clientX, y: e.clientY };
    };
    this._onHeaderPointerUp = (e) => {
      const origin = this._tapOrigin;
      this._tapOrigin = null;
      if (!origin) return;
      const moved = Math.hypot(e.clientX - origin.x, e.clientY - origin.y);
      if (moved > TAP_MOVE_TOLERANCE_PX) return;
      this._toggleDrawer();
    };
    this._onHeaderPointerCancel = () => {
      this._tapOrigin = null;
    };
    this._el.addEventListener("pointerdown", this._onHeaderPointerDown);
    this._el.addEventListener("pointerup", this._onHeaderPointerUp);
    this._el.addEventListener("pointercancel", this._onHeaderPointerCancel);

    this.logger.trace("entered menu role");
  }

  /**
   * Toggle the side drawer between collapsed (the `w-12` rail) and expanded
   * (full-screen). Collapsed is the absence of `data-drawer`, so the menu role
   * rests collapsed with no attribute set. Layout/visibility are CSS-owned off
   * this attribute; this only flips it.
   */
  _toggleDrawer() {
    if (this._el.dataset.drawer === "open") {
      delete this._el.dataset.drawer;
    } else {
      this._el.dataset.drawer = "open";
    }
  }

  /**
   * Reveal the page nav as the header takes on its menu-role layout.
   *
   * Display is CSS-owned: the template hides the nav with `hidden` and reveals it
   * with `group-data-[header-role=menu]:block`, so flipping `data-header-role` on
   * the header (in `_enterMenuRole`) has already rendered the nav by the time we
   * get here. This method only adds the GSAP motion: the nav's list items
   * fade-in-and-up in sequence (a staggered `autoAlpha 0->1` + `y 24->0`).
   *
   * `gsap.from` with `immediateRender` pins each item at its hidden start frame
   * the moment the tween is created — so even though the nav is now `display:block`
   * there is no flash of the items before they animate.
   */
  _showNav() {
    if (!this._navItems || !this._navItems.length) return null;

    // Under reduced motion the CSS attribute flip is the entire reveal — the items
    // are already visible at their resting position, so there is nothing to animate.
    // Still emit start+complete (instantly) so a larger sequence coordinating off
    // this reveal isn't left waiting.
    const reduced = this._reducedMotionHandler?.isReducedMotion?.() ?? false;
    if (reduced) {
      this._emit(this._events?.introStart);
      this._emit(this._events?.introComplete);
      return null;
    }

    // Timing is the seam token resolved once at arm time — shared with the
    // loader-state CSS, never re-read or re-defaulted here. Distance/stagger/ease
    // are GSAP-only, named in config/ix/motion.js (HOME_NAV_REVEAL).
    const duration =
      this._seam?.navRevealDuration ?? this._readSeamTokens().navRevealDuration;

    // A stored timeline (not a loose tween) so a parent sequence can nest or
    // await it; bus events mark the reveal boundaries for the same reason.
    this._navReveal = gsap.timeline({
      onStart: () => this._emit(this._events?.introStart),
      onComplete: () => this._emit(this._events?.introComplete),
    });
    this._navReveal.from(this._navItems, {
      autoAlpha: 0,
      y: HOME_NAV_REVEAL.distance,
      duration,
      ease: HOME_NAV_REVEAL.ease,
      stagger: HOME_NAV_REVEAL.stagger,
    });

    return this._navReveal;
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
    if (this._el) {
      if (this._onHeaderPointerDown)
        this._el.removeEventListener("pointerdown", this._onHeaderPointerDown);
      if (this._onHeaderPointerUp)
        this._el.removeEventListener("pointerup", this._onHeaderPointerUp);
      if (this._onHeaderPointerCancel)
        this._el.removeEventListener(
          "pointercancel",
          this._onHeaderPointerCancel,
        );
    }
    this._onHeaderPointerDown = null;
    this._onHeaderPointerUp = null;
    this._onHeaderPointerCancel = null;
    this._tapOrigin = null;

    this._holdCall?.kill();
    this._holdCall = null;

    this._master?.kill();
    this._master = null;

    this._navReveal?.kill();
    this._navReveal = null;

    // Reset to the hero role. The header/nav layout (and the nav's hidden state)
    // are CSS-owned off this attribute, so restoring it hands ownership back to
    // CSS — no class bookkeeping needed. (`loader` is a one-time boot phase that
    // can't be meaningfully re-entered, so `hero` is the idle resting fallback.)
    // Clearing the transform releases the slide so CSS owns the resting position.
    if (this._el) {
      this._el.dataset.headerRole = "hero";
      delete this._el.dataset.drawer;
      gsap.set(this._el, { clearProps: "transform" });
    }

    if (this._navItems && this._navItems.length) {
      gsap.killTweensOf(this._navItems);
      // The reveal staggers the items' fade-up, so clear what it set.
      gsap.set(this._navItems, { clearProps: "opacity,visibility,transform" });
    }
    this.logger.trace("destroyed");
  }
}
