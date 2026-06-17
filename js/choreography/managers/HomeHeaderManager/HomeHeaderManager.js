import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

/**
 * HomeHeaderManager
 *
 * Owns the home landing header's transition into its "navigation device" role.
 *
 * The preloader runtime (pure CSS) owns the header through intro -> idle ->
 * outro and ends by dispatching `preloader:out`. That event is the seam where
 * motion/IX ownership hands off from CSS to GSAP; this manager arms only then —
 * before it, the header is `position: fixed` and CSS-owned, so touching it
 * early would fight the outro.
 *
 * Trigger (user-facing): the top of the header reaches the top of the viewport
 * (`start: "top top"`). The header is the topmost in-flow element, so this is
 * already true at scroll 0 — hence the immediate `isActive` check below in
 * addition to `onEnter`, which only fires on a forward crossing.
 *
 * Initial response (this step only): lift the header out of normal flow into
 * its resting nav state — `position: absolute; top: 0; left: 0` — so page
 * content rises underneath it (overlay approach). Continuous nav-role behavior
 * is layered on in a later step.
 */
export default class HomeHeaderManager {
  constructor({ reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped("HomeHeaderManager", {
      color: "#EC4899",
      enabled: true,
    });

    this._el = document.querySelector(SELECTORS.homeHeader);
    this._hgroup = document.querySelector(SELECTORS.homeHGroup);
    this._nav = document.querySelector(SELECTORS.homeNav);
    this._reducedMotionHandler = reducedMotionHandler;
    this._trigger = null;
    this._inNavRole = false;
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
    if (this._trigger || this._inNavRole) return;

    this._trigger = ScrollTrigger.create({
      trigger: this._el,
      start: "top top",
      onEnter: () => this._enterNavRole(),
    });

    // The header is the topmost element, so on load its top is already at the
    // viewport top: the trigger is active from scroll 0. A plain (unpinned)
    // ScrollTrigger created while already past its start does NOT fire `onEnter`,
    // so the `isActive` check below handles the at-top case. `onEnter` remains to
    // cover loads that start scrolled below the header (e.g. restored scroll),
    // where the top later crosses going forward. The two paths are mutually
    // exclusive at load, so this no longer double-fires; the guard in
    // `_enterNavRole` is kept as cheap insurance. The optional chain covers
    // `onEnter` firing synchronously during `create()`, which nulls
    // `this._trigger`.
    if (this._trigger?.isActive) {
      this._enterNavRole();
    }

    this.logger.trace("armed");
  }

  _enterNavRole() {
    // Guard first: `_arm()` can reach this via both `onEnter` and the immediate
    // `isActive` check, and at scroll 0 both fire. Returning early here keeps the
    // effect (and any logging) exactly-once.
    if (this._inNavRole) return;
    this._inNavRole = true;

    // Resting nav state (position) is CSS-owned: the template keeps the header
    // `fixed top-0 left-0 h-dvh w-full` and `hanko.css` no longer returns it to
    // flow on `data-preloader-state="exit"`, so it persists as a fixed overlay
    // with content scrolling underneath. ScrollSmoother does not run on home
    // (no `#page-main-content`), so native `fixed` holds without a pin. This
    // manager therefore does no positioning — it owns the behavioural transition.

    // Shed the hero role: play the hgroup's intro backward as it gives way to
    // the nav-role layout.
    this._hideHGroup();

    this._el.classList.remove("w-full", "grid");

    // Show the nav: play the nav's intro as it takes over the layout.
    this._showNav();

    // One-shot: the trigger's job (detect top-reaches-top) is done and the
    // header is now out of flow, so tear the trigger down.
    this._trigger?.kill();
    this._trigger = null;

    this.logger.trace("entered nav role");
  }

  /**
   * Reverse the hgroup's CSS intro (the shared `hanko-enter` keyframe) as the
   * header transitions out of its hero role.
   *
   * The intro is a CSS animation with `both` fill, so it HOLDS its end frame
   * (`opacity: 1; translateY(0)`) — and a filled CSS animation overrides inline
   * styles, while the base rule beneath it hides the hgroup
   * (`opacity: 0` under `prefers-reduced-motion: no-preference`). So we first
   * release the CSS hold (`animation: "none"`), then drive the exit with a
   * `fromTo` whose immediate-render `from` pins the visible state inline (inline
   * beats the base rule) so there is no flash to hidden.
   *
   * Mirrors the intro: `opacity 1 -> 0`, `y 0 -> 24`, ease-in (mirror of the
   * intro's ease-out), reusing `--hanko-enter-duration` for symmetry.
   */
  _hideHGroup() {
    if (!this._hgroup) return;

    const reduced = this._reducedMotionHandler?.isReducedMotion?.() ?? false;

    // Under reduced motion the CSS intro never runs (its hidden state is gated
    // behind `prefers-reduced-motion: no-preference`), so there is nothing to
    // play backward — settle to the reversed end state instantly.
    if (reduced) {
      gsap.set(this._hgroup, { autoAlpha: 0 });
      return;
    }

    // Release the CSS animation's `both`-fill hold so GSAP's inline styles win.
    this._hgroup.style.animation = "none";

    const duration =
      parseFloat(
        getComputedStyle(this._el).getPropertyValue("--hanko-enter-duration"),
      ) || 0.75;

    gsap.fromTo(
      this._hgroup,
      { autoAlpha: 1, y: 0 },
      { autoAlpha: 0, y: 24, duration, ease: "power2.in" },
    );
  }

  /**
   * Reveal the page nav as the header takes on its nav-role layout.
   *
   * The template hides the nav with Tailwind's `hidden` utility (`display: none`),
   * which GSAP cannot animate — `autoAlpha` drives `visibility`/`opacity`, not
   * `display`. So we first release the hide by dropping the `hidden` class (the
   * direct inverse of the template's hidden state), then fade the nav in.
   *
   * Mirrors `_hideHGroup`: same `--hanko-enter-duration`, opposite direction
   * (ease-out, opacity 0 -> 1), so the hgroup's exit and the nav's entrance
   * crossfade. Per-link staggering is layered on in a later step.
   */
  _showNav() {
    if (!this._nav) return;

    // Release the template's `display: none` so the element can render and fade.
    // NOTE: GSAP.autoAlpha does not touch `display`, so the nav must be visible to fade it in.
    this._nav.classList.remove("hidden");

    const reduced = this._reducedMotionHandler?.isReducedMotion?.() ?? false;
    if (reduced) {
      gsap.set(this._nav, { autoAlpha: 1 });
      return;
    }

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
    // The header's position is CSS-owned; this manager only animates the hgroup,
    // so teardown is scoped to it.
    if (this._hgroup) {
      gsap.killTweensOf(this._hgroup);
      gsap.set(this._hgroup, { clearProps: "opacity,visibility,transform" });
      // Restore CSS ownership of the intro by dropping the inline `animation: none`.
      this._hgroup.style.removeProperty("animation");
    }
    if (this._nav) {
      gsap.killTweensOf(this._nav);
      gsap.set(this._nav, { clearProps: "opacity,visibility" });
      // Restore the template's hidden state so CSS reclaims ownership.
      this._nav.classList.add("hidden");
    }
    this.logger.trace("destroyed");
  }
}
