import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

const WORK_EL_ATTR = "data-projects-el";
const INDUSTRY_HEADING_VALUE = "industry-heading";
const INDUSTRY_GROUP_VALUE = "industry-group";

const clamp = gsap.utils.clamp;

/**
 * Replicates `position: sticky; top: <workHeaderHeight>` on each industry `<h3>`
 * using a transform-only follow instead of a ScrollTrigger pin.
 *
 * Why not pin: the work section nests three pin layers — the work-header pin
 * (pinSpacing:false), and each card's `clip` pin (pinSpacing:false). A pinned
 * heading nested inside pinSpacing:false card pins has its pin duration collapsed
 * (the cards steal scroll length from the group), so the heading released on the
 * first card. A non-pinning translateY follow reads live layout every frame and
 * is immune to whatever the card pins do to the group's height.
 *
 * The follow target tracks the LIVE work-header height each frame, so the heading
 * stays flush under the header as WorkHeaderManager collapses it — no second
 * system writes the heading's position, which removes the entry-jump.
 */
export default class IndustryHeaderManager {
  constructor({ reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped("IndustryHeaderManager", {
      color: "#3B82F6",
      enabled: true,
    });

    const workSection = document.getElementById(SELECTORS.work);
    this._workSection = workSection ?? null;
    this._workHeader =
      workSection?.querySelector(`[${WORK_EL_ATTR}="header"]`) ?? null;
    this._reducedMotionHandler = reducedMotionHandler;
    this._driver = null;

    const groups = Array.from(
      this._workSection?.querySelectorAll(
        `[${WORK_EL_ATTR}="${INDUSTRY_GROUP_VALUE}"]`,
      ) ?? [],
    );

    this._items = groups
      .map((group) => {
        const heading = group.querySelector(
          `[${WORK_EL_ATTR}="${INDUSTRY_HEADING_VALUE}"]`,
        );
        if (!heading) return null;
        return {
          group,
          heading,
          setY: gsap.quickSetter(heading, "y", "px"),
          headingTop: 0, // natural distance from group top → heading top (constant)
          headingHeight: 0,
        };
      })
      .filter(Boolean);

    if (!this._items.length || !this._workSection) {
      this.logger.trace(
        "no industry groups found; IndustryHeaderManager disabled",
      );
      this._items = [];
      return;
    }

    this._init();
  }

  _init() {
    this._measure();
    this._apply();

    // Single non-pinning driver. onUpdate ticks while the work section is in
    // view; onRefresh re-measures natural geometry after any layout change
    // (breakpoint swap, card pin spacers, font load). No pin === no interference
    // with the card pins' pinSpacing:false.
    this._driver = ScrollTrigger.create({
      trigger: this._workSection,
      start: "top bottom",
      end: "bottom top",
      onUpdate: () => this._apply(),
      onRefresh: () => {
        this._measure();
        this._apply();
      },
      markers: false,
    });

    this.logger.trace("initialized");
  }

  /**
   * Capture each heading's natural in-flow geometry. Transforms are reset to 0
   * first so a previously-applied follow offset does not pollute the read.
   * Reads and writes are batched into separate passes to avoid layout thrash.
   */
  _measure() {
    for (const item of this._items) item.setY(0);
    for (const item of this._items) {
      const groupTop = item.group.getBoundingClientRect().top;
      const headingRect = item.heading.getBoundingClientRect();
      item.headingTop = headingRect.top - groupTop;
      item.headingHeight = headingRect.height;
    }
  }

  /**
   * For each heading: translateY so it appears fixed at `offset` (the live work
   * header height) from the viewport top, clamped so it never rises above its
   * natural position nor descends past its group's bottom edge — i.e. it rides
   * in with the group, sticks under the header, then rides out with the group.
   */
  _apply() {
    const offset = this._workHeader?.offsetHeight ?? 0;

    // Read all geometry first, then write — never interleave (avoids thrash).
    const writes = this._items.map((item) => {
      const rect = item.group.getBoundingClientRect();
      const naturalTop = rect.top + item.headingTop;
      const maxShift = Math.max(
        0,
        rect.height - item.headingHeight - item.headingTop,
      );
      return { setY: item.setY, y: clamp(0, maxShift, offset - naturalTop) };
    });

    for (const { setY, y } of writes) setY(y);
  }

  kill() {
    this._driver?.kill();
    this._driver = null;
    for (const item of this._items) {
      gsap.killTweensOf(item.heading);
      gsap.set(item.heading, { clearProps: "transform,y,rotate,top" });
    }
    this._items = [];
    this.logger.trace("destroyed");
  }
}
