/** @format */

import AbstractSectionAnimations from "../../abstract-section/AbstractSectionAnimations/AbstractSectionAnimations.js";
import { gsap } from "/assets/js/choreography/vendor/gsap/gsap.js";
import { AWARDS_ANIMATION_DEFAULTS } from "../../../config/ix/motion/motion.js";
import { TIMELINE_IDS } from "../../../config/contracts/timelines/timelines.js";

const AWARDS_EL_ATTR = "data-awards-el";

const selectAwardsEl = (view, name) =>
  view?.querySelector(`[${AWARDS_EL_ATTR}="${name}"]`) ?? null;

export default class AwardsAnimations extends AbstractSectionAnimations {
  /**
   * Extends AbstractSectionAnimations, which:
   * - Stores the section root element and ID
   * - Sets up shared GSAP timeline primitives and intro/outro hooks
   * - Provides common utilities (pause/resume/reset) used by sections
   */
  /**
   * @param {HTMLElement} view
   * @param {Object} options
   */
  constructor(view, options = {}) {
    super(view);

    this.options = {
      duration: options.duration ?? AWARDS_ANIMATION_DEFAULTS.duration,
      stagger: options.stagger ?? AWARDS_ANIMATION_DEFAULTS.stagger,
      translateY: options.translateY ?? AWARDS_ANIMATION_DEFAULTS.translateY,
      itemTranslateY:
        options.itemTranslateY ?? AWARDS_ANIMATION_DEFAULTS.itemTranslateY,
      itemRevealViewportRatio:
        options.itemRevealViewportRatio ??
        AWARDS_ANIMATION_DEFAULTS.itemRevealViewportRatio,
      ease: {
        in: options.ease?.in ?? AWARDS_ANIMATION_DEFAULTS.ease.in,
        out: options.ease?.out ?? AWARDS_ANIMATION_DEFAULTS.ease.out,
      },
    };

    // Using hook-based cached refs for key elements to simplify timeline definitions
    this.elements = {
      header: selectAwardsEl(this.view, "header") ?? this.view,
      context: selectAwardsEl(this.view, "context"),
      heading: selectAwardsEl(this.view, "heading") ?? this.view,
      body: selectAwardsEl(this.view, "body") ?? this.view,
      list: selectAwardsEl(this.view, "list"),
    };

    this.animTargets = [
      this.elements.context,
      this.elements.heading,
      this.elements.body,
      this.elements.list,
    ].filter(Boolean);

    this.awardItems = Array.from(
      this.view?.querySelectorAll(`[${AWARDS_EL_ATTR}="award"]`) ?? [],
    );
    this.revealedItems = new WeakSet();

    if (this.animTargets.length) {
      gsap.set(this.animTargets, {
        autoAlpha: 0,
        y: this.options.translateY,
      });
    }

    if (this.awardItems.length) {
      gsap.set(this.awardItems, {
        autoAlpha: 0,
        y: this.options.itemTranslateY,
      });
    }

    // this.originalText = this.view?.textContent || "";
    this._buildTimeline();
  }

  showAllAwards() {
    this._showAllItems(this.awardItems, this.revealedItems);
  }

  updateAwardsReveal() {
    this._revealItemsOnScroll({
      items: this.awardItems,
      revealedItems: this.revealedItems,
      revealViewportRatio: this.options.itemRevealViewportRatio,
      buildTween: (item) => {
        gsap.to(item, {
          autoAlpha: 1,
          y: 0,
          duration: this.options.duration,
          ease: this.options.ease.in,
        });
      },
    });
  }

  _buildIntro() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.intro });
    if (!this.animTargets.length) {
      return tl;
    }

    tl.to(this.animTargets, {
      autoAlpha: 1,
      y: 0,
      duration: this.options.duration,
      stagger: this.options.stagger,
      ease: this.options.ease.in,
    }).addPause();
    return tl;
  }

  _buildIdle() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.idle });
    return tl;
  }

  _buildOutro() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.outro });
    if (!this.animTargets.length) {
      return tl;
    }

    tl.to(this.animTargets, {
      autoAlpha: 0,
      y: this.options.translateY,
      duration: this.options.duration,
      stagger: this.options.stagger,
      ease: this.options.ease.out,
    }).addPause();
    return tl;
  }
}
