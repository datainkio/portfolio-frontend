import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

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
    this._reducedMotionHandler = reducedMotionHandler;
    this._trigger = null;
    this._inMenuRole = false;
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
    if (this._trigger || this._inMenuRole) return;

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
   * get here. This method only adds the GSAP motion on top of that instant reveal,
   * scaling it open over `--hanko-enter-duration` (ease-out). Per-link staggering
   * is layered on in a later step.
   */
  _showNav() {
    if (!this._nav) return;

    // Under reduced motion the CSS attribute flip is the entire reveal — the nav
    // is already visible at its resting scale, so there is nothing to animate.
    const reduced = this._reducedMotionHandler?.isReducedMotion?.() ?? false;
    if (reduced) return;

    const duration =
      parseFloat(
        getComputedStyle(this._el).getPropertyValue("--hanko-enter-duration"),
      ) || 0.75;

    gsap.fromTo(
      this._nav,
      { scaleY: 0 },
      { scaleY: 1, duration, ease: "power2.out" },
    );
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

    if (this._nav) {
      gsap.killTweensOf(this._nav);
      // The reveal animates `scaleY`, so clear the residual transform.
      gsap.set(this._nav, { clearProps: "transform" });
    }
    this.logger.trace("destroyed");
  }
}
