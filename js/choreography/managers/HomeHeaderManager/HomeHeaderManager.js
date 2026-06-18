import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { EVENTS } from "../../config/contracts/events/events.js";
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
  navRevealDuration: { cssVar: "--hanko-enter-duration", fallbackSeconds: 0.75 },
});

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
 *   3. `menu`   — the header acts as a navigation menu (hamburger-like). Entered
 *      when the header reaches the top of the viewport.
 *
 * `preloader:out` is the seam where motion/IX ownership hands off from CSS to
 * GSAP; this manager arms only then — before it, the header is `position: fixed`
 * and CSS-owned, so touching it early would fight the loader outro.
 *
 * Trigger (loader -> ... -> menu): the top of the header reaches the top of the
 * viewport (`start: "top top"`). The header is the topmost element, so this is
 * already true at scroll 0 — hence the immediate `isActive` check below in
 * addition to `onEnter`, which only fires on a forward crossing.
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
  constructor({ reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped("HomeHeaderManager", {
      color: "#EC4899",
      enabled: true,
    });

    this._el = document.querySelector(SELECTORS.homeHeader);
    this._nav = document.querySelector(SELECTORS.homeNav);
    // The nav's list items are the stagger targets for the menu reveal.
    this._navItems = this._nav
      ? this._nav.querySelectorAll(SELECTORS.pageNavItem)
      : null;
    this._reducedMotionHandler = reducedMotionHandler;
    this._trigger = null;
    this._inMenuRole = false;
    this._onPreloaderOut = null;
    // Resolved once at arm time from the seam's CSS custom properties.
    this._seam = null;

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
    if (this._trigger || this._inMenuRole) return;

    // GSAP is loaded now (post-`preloader:out`), so reading computed style here
    // costs no FCP. Resolve the shared seam timing once — the CSS custom prop is
    // the authority; this never inlines a second copy.
    this._seam = this._readSeamTokens();

    // The preloader (loader role) has finished, so the header now rests as the
    // hero. This is the loader -> hero transition.
    this._enterHeroRole();

    this._trigger = ScrollTrigger.create({
      trigger: this._el,
      start: "top top",
      onEnter: () => this._enterMenuRole(),
    });

    // The header is the topmost element, so on load its top is already at the
    // viewport top: the trigger is active from scroll 0. A plain (unpinned)
    // ScrollTrigger created while already past its start does NOT fire `onEnter`,
    // so the `isActive` check below handles the at-top case. `onEnter` remains to
    // cover loads that start scrolled below the header (e.g. restored scroll),
    // where the top later crosses going forward. The two paths are mutually
    // exclusive at load, so this no longer double-fires; the guard in
    // `_enterMenuRole` is kept as cheap insurance. The optional chain covers
    // `onEnter` firing synchronously during `create()`, which nulls
    // `this._trigger`.
    if (this._trigger?.isActive) {
      this._enterMenuRole();
    }

    this.logger.trace("armed");
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
    // abbreviated brand (RSL / UX-DX-AIX) off the same role attribute, so the text
    // swap needs no JS. (The hgroup stays visible because its CSS intro holds the
    // end frame via `both` fill — nothing here hides it.)

    // Show the nav: the attribute flip above has already rendered it
    // (CSS `display: block`), so it can be animated in.
    this._showNav();

    // One-shot: the trigger's job (detect top-reaches-top) is done, so tear it
    // down — the header stays in the menu role.
    this._trigger?.kill();
    this._trigger = null;

    this.logger.trace("entered menu role");
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
    if (!this._navItems || !this._navItems.length) return;

    // Under reduced motion the CSS attribute flip is the entire reveal — the items
    // are already visible at their resting position, so there is nothing to animate.
    const reduced = this._reducedMotionHandler?.isReducedMotion?.() ?? false;
    if (reduced) return;

    // Timing is the seam token resolved once at arm time — shared with the
    // loader-state CSS, never re-read or re-defaulted here.
    const duration = this._seam?.navRevealDuration ?? this._readSeamTokens().navRevealDuration;

    gsap.from(this._navItems, {
      autoAlpha: 0,
      y: 24,
      duration,
      ease: "power2.out",
      stagger: 0.08,
    });
  }

  kill() {
    if (this._onPreloaderOut) {
      window.removeEventListener(
        EVENTS.system.preloaderOut,
        this._onPreloaderOut,
      );
      this._onPreloaderOut = null;
    }
    this._trigger?.kill();
    this._trigger = null;

    // Reset to the hero role. The header/nav layout (and the nav's hidden state)
    // are CSS-owned off this attribute, so restoring it hands ownership back to
    // CSS — no class bookkeeping needed. (`loader` is a one-time boot phase that
    // can't be meaningfully re-entered, so `hero` is the idle resting fallback.)
    if (this._el) this._el.dataset.headerRole = "hero";

    if (this._navItems && this._navItems.length) {
      gsap.killTweensOf(this._navItems);
      // The reveal staggers the items' fade-up, so clear what it set.
      gsap.set(this._navItems, { clearProps: "opacity,visibility,transform" });
    }
    this.logger.trace("destroyed");
  }
}
