import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { createSectionHeaderIntro } from "../../molecules/section-header-intro/section-header-intro.js";
import { createScrollRevealGroup } from "../../molecules/scroll-reveal-group/scroll-reveal-group.js";
import { ORGANIZATIONS_ANIMATION_DEFAULTS } from "../../config/ix/presets/organizations.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";

const ORGANIZATIONS_EL_ATTR = "data-organizations-el";
// Set on a track while it scrolls; the template's Tailwind `data-marquee:`
// variants switch it from a wrapped grid to a single line.
const MARQUEE_ATTR = "data-marquee";
// Marks the duplicated items that make the loop seamless.
const CLONE_ATTR = "data-organizations-clone";

const selectOrganizationsEl = (view, name) =>
  view?.querySelector(`[${ORGANIZATIONS_EL_ATTR}="${name}"]`) ?? null;

const selectOrganizationsEls = (root, name) =>
  Array.from(
    root?.querySelectorAll(`[${ORGANIZATIONS_EL_ATTR}="${name}"]`) ?? [],
  );

export default class OrganizationsAnimations extends AbstractSectionAnimations {
  constructor(view, options = {}) {
    super(view);

    this.marqueeOptions = {
      ...ORGANIZATIONS_ANIMATION_DEFAULTS.marquee,
      ...options.marquee,
    };

    this._list = selectOrganizationsEl(this.view, "list");
    this._toggle = selectOrganizationsEl(this.view, "toggle");
    this._isMarqueeEnabled = false;
    this._isMarqueeVisible = false;
    this._isUserPaused = false;

    this._onToggleClick = this._onToggleClick.bind(this);
    this._toggle?.addEventListener("click", this._onToggleClick);

    // this.options = {
    //   duration: options.duration ?? ORGANIZATIONS_ANIMATION_DEFAULTS.duration,
    //   stagger: options.stagger ?? ORGANIZATIONS_ANIMATION_DEFAULTS.stagger,
    //   translateY:
    //     options.translateY ?? ORGANIZATIONS_ANIMATION_DEFAULTS.translateY,
    //   itemTranslateY:
    //     options.itemTranslateY ??
    //     ORGANIZATIONS_ANIMATION_DEFAULTS.itemTranslateY,
    //   itemRevealViewportRatio:
    //     options.itemRevealViewportRatio ??
    //     ORGANIZATIONS_ANIMATION_DEFAULTS.itemRevealViewportRatio,
    //   ease: {
    //     in: options.ease?.in ?? ORGANIZATIONS_ANIMATION_DEFAULTS.ease.in,
    //     out: options.ease?.out ?? ORGANIZATIONS_ANIMATION_DEFAULTS.ease.out,
    //   },
    // };

    // const elements = [
    //   selectOrganizationsEl(this.view, "context"),
    //   selectOrganizationsEl(this.view, "heading"),
    //   selectOrganizationsEl(this.view, "body"),
    //   selectOrganizationsEl(this.view, "list"),
    // ];

    // const organizationItems = Array.from(
    //   this.view?.querySelectorAll(`[${ORGANIZATIONS_EL_ATTR}="organization"]`) ?? [],
    // );

    // const { intro, outro } = createSectionHeaderIntro(elements, {
    //   duration: this.options.duration,
    //   stagger: this.options.stagger,
    //   translateY: this.options.translateY,
    //   ease: { in: this.options.ease.in, out: this.options.ease.out },
    // });

    // this._headerIntro = intro;
    // this._headerOutro = outro;

    // this.revealGroup = createScrollRevealGroup(organizationItems, {
    //   viewportRatio: this.options.itemRevealViewportRatio,
    //   duration: this.options.duration,
    //   ease: this.options.ease.in,
    //   y: this.options.itemTranslateY,
    // });

    this._buildTimeline();
  }

  _buildIntro() {
    return this._headerIntro ?? gsap.timeline({ id: TIMELINE_IDS.intro });
  }

  // The idle phase is the logo marquee. It starts empty: rows are measured and
  // filled by enableMarquee(), which the section calls only when motion is
  // allowed, so reduced motion never clones items or clips a row.
  _buildIdle() {
    return gsap.timeline({ id: TIMELINE_IDS.idle });
  }

  _buildOutro() {
    return this._headerOutro ?? gsap.timeline({ id: TIMELINE_IDS.outro });
  }

  /**
   * Turn every overflowing row into a seamless loop and rebuild the idle
   * timeline around them. Rows that already fit stay a static wrapped grid.
   * Safe to call repeatedly: it tears down first, so it re-measures after a
   * breakpoint change.
   */
  enableMarquee() {
    this.disableMarquee();
    if (!this._list) return;

    const { pixelsPerSecond } = this.marqueeOptions;
    const idle = gsap.timeline({ id: TIMELINE_IDS.idle, paused: true });
    let marqueeCount = 0;

    selectOrganizationsEls(this._list, "viewport").forEach(
      (viewport, rowIndex) => {
        const track = selectOrganizationsEl(viewport, "track");
        if (!track) return;

        // Measure as a single line; leave the row wrapped if it fits.
        track.setAttribute(MARQUEE_ATTR, "");
        const setWidth = track.scrollWidth;
        if (setWidth <= viewport.clientWidth) {
          track.removeAttribute(MARQUEE_ATTR);
          return;
        }

        // One full copy of the set, hidden from assistive tech. Items carry
        // trailing padding rather than a flex gap, so -50% lands exactly on the
        // seam.
        Array.from(track.children).forEach((item) => {
          const clone = item.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          clone.setAttribute(CLONE_ATTR, "");
          clone.removeAttribute(ORGANIZATIONS_EL_ATTR);
          track.append(clone);
        });

        // Alternate direction by row position, so a row that fits doesn't flip
        // the direction of the rows after it.
        const reverse = rowIndex % 2 === 1;
        idle.fromTo(
          track,
          { xPercent: reverse ? -50 : 0 },
          {
            xPercent: reverse ? 0 : -50,
            duration: setWidth / pixelsPerSecond,
            ease: "none",
            repeat: -1,
          },
          0,
        );
        marqueeCount += 1;
      },
    );

    if (marqueeCount === 0) {
      idle.kill();
      return;
    }

    this._registerTimeline(TIMELINE_IDS.idle, idle);
    this._isMarqueeEnabled = true;
    if (this._toggle) this._toggle.hidden = false;
  }

  /** Remove clones, restore wrapped rows, and stop the marquee. */
  disableMarquee() {
    const idle = this.getTimeline(TIMELINE_IDS.idle);
    idle?.kill();
    this._registerTimeline(
      TIMELINE_IDS.idle,
      gsap.timeline({ id: TIMELINE_IDS.idle }),
    );

    selectOrganizationsEls(this._list, "track").forEach((track) => {
      track
        .querySelectorAll(`[${CLONE_ATTR}]`)
        .forEach((clone) => clone.remove());
      track.removeAttribute(MARQUEE_ATTR);
      gsap.set(track, { clearProps: "transform" });
    });

    this._isMarqueeEnabled = false;
    if (this._toggle) this._toggle.hidden = true;
  }

  /**
   * Visibility from OrganizationsTriggers' marquee trigger. The marquee only
   * runs on screen.
   * @param {boolean} isVisible
   */
  setMarqueeVisible(isVisible) {
    this._isMarqueeVisible = Boolean(isVisible);
    if (this._isMarqueeVisible) {
      this.resumeMarquee();
    } else {
      this.pauseMarquee();
    }
  }

  /** Run the marquee while it's on screen, unless the visitor paused it. */
  resumeMarquee() {
    if (
      !this._isMarqueeEnabled ||
      !this._isMarqueeVisible ||
      this._isUserPaused
    )
      return;
    const idle = this.getTimeline(TIMELINE_IDS.idle);
    idle?.resume();
  }

  pauseMarquee() {
    this.getTimeline(TIMELINE_IDS.idle)?.pause();
  }

  _onToggleClick() {
    this._isUserPaused = !this._isUserPaused;
    this._toggle?.setAttribute("aria-pressed", String(this._isUserPaused));
    if (this._isUserPaused) {
      this.pauseMarquee();
    } else {
      this.resumeMarquee();
    }
  }
}
