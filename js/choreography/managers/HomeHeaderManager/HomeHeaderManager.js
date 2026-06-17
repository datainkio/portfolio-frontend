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

    // Resting nav state: lifted out of normal flow and anchored to the
    // document's top-left so page content rises underneath it (overlay).
    // Positioning only — no tween — so motion vs. reduced-motion is identical;
    // a reduced branch will be introduced when motion is added in a later step.
    gsap.set(this._el, { position: "absolute", top: 0, left: 0 });

    // One-shot: the trigger's job (detect top-reaches-top) is done and the
    // header is now out of flow, so tear the trigger down.
    this._trigger?.kill();
    this._trigger = null;

    this.logger.trace("entered nav role");
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
    if (this._el) {
      gsap.killTweensOf(this._el);
      gsap.set(this._el, { clearProps: "position,top,left" });
    }
    this.logger.trace("destroyed");
  }
}
