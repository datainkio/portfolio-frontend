/** @format */

import AbstractSectionAnimations from "../../abstract-section/AbstractSectionAnimations/AbstractSectionAnimations.js";
import { gsap } from "/assets/js/choreography/vendor/gsap/gsap.js";
import { ORGANIZATIONS_ANIMATION_DEFAULTS } from "../../../config/ix/motion/motion.js";
import { TIMELINE_IDS } from "../../../config/contracts/timelines/timelines.js";

const ORGANIZATIONS_EL_ATTR = "data-organizations-el";

const selectOrganizationsEl = (view, name) =>
  view?.querySelector(`[${ORGANIZATIONS_EL_ATTR}="${name}"]`) ?? null;

export default class OrganizationsAnimations extends AbstractSectionAnimations {
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
      duration: options.duration ?? ORGANIZATIONS_ANIMATION_DEFAULTS.duration,
      stagger: options.stagger ?? ORGANIZATIONS_ANIMATION_DEFAULTS.stagger,
      translateY:
        options.translateY ?? ORGANIZATIONS_ANIMATION_DEFAULTS.translateY,
      itemTranslateY:
        options.itemTranslateY ??
        ORGANIZATIONS_ANIMATION_DEFAULTS.itemTranslateY,
      itemRevealViewportRatio:
        options.itemRevealViewportRatio ??
        ORGANIZATIONS_ANIMATION_DEFAULTS.itemRevealViewportRatio,
      ease: {
        in: options.ease?.in ?? ORGANIZATIONS_ANIMATION_DEFAULTS.ease.in,
        out: options.ease?.out ?? ORGANIZATIONS_ANIMATION_DEFAULTS.ease.out,
      },
    };

    this.elements = {
      header: selectOrganizationsEl(this.view, "header") ?? this.view,
      context: selectOrganizationsEl(this.view, "context"),
      heading: selectOrganizationsEl(this.view, "heading") ?? this.view,
      body: selectOrganizationsEl(this.view, "body") ?? this.view,
      list: selectOrganizationsEl(this.view, "list"),
    };

    this.animTargets = [
      this.elements.context,
      this.elements.heading,
      this.elements.body,
      this.elements.list,
    ].filter(Boolean);

    this.organizationItems = Array.from(
      this.view?.querySelectorAll(
        `[${ORGANIZATIONS_EL_ATTR}="organization"]`,
      ) ?? [],
    );
    this.revealedItems = new WeakSet();

    if (this.animTargets.length) {
      gsap.set(this.animTargets, {
        autoAlpha: 0.5,
        y: this.options.translateY,
      });
    }

    if (this.organizationItems.length) {
      gsap.set(this.organizationItems, {
        autoAlpha: 0,
        y: this.options.itemTranslateY,
      });
    }

    this._buildTimeline();
  }

  showAllOrganizations() {
    this._showAllItems(this.organizationItems, this.revealedItems);
  }

  updateOrganizationsReveal() {
    this._revealItemsOnScroll({
      items: this.organizationItems,
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
