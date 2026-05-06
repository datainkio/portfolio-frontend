/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.bio.bioanimations
 *   role: Frontend runtime module: js/choreography/sections/bio/BioAnimations.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - sections
 * ---
 */
/** @format */

import AbstractSectionAnimations from "../abstract-section/AbstractSectionAnimations.js";
import { gsap, ScrollTrigger } from "/assets/js/choreography/vendor/gsap.js";
import {
  BIO_ANIMATION_DEFAULTS,
  THROW_IN_ANIMATION,
} from "../../config/ix/motion.js";
import { BIO_SELECTORS } from "../../config/contracts/selectors.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines.js";

const BIO_EL_ATTR = BIO_SELECTORS.elementAttribute;

const selectBioEl = (view, name) =>
  view?.querySelector(`[${BIO_EL_ATTR}="${name}"]`) ?? null;

export default class BioAnimations extends AbstractSectionAnimations {
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
      duration: options.duration ?? BIO_ANIMATION_DEFAULTS.duration,
      stagger: options.stagger ?? BIO_ANIMATION_DEFAULTS.stagger,
      translateY: options.translateY ?? BIO_ANIMATION_DEFAULTS.translateY,
      itemTranslateY:
        options.itemTranslateY ?? BIO_ANIMATION_DEFAULTS.itemTranslateY,
      itemRevealViewportRatio:
        options.itemRevealViewportRatio ??
        BIO_ANIMATION_DEFAULTS.itemRevealViewportRatio,
      subSectionStartDelay:
        options.subSectionStartDelay ??
        BIO_ANIMATION_DEFAULTS.subSectionStartDelay,
      stickySubheadingFadeDuration:
        options.stickySubheadingFadeDuration ??
        BIO_ANIMATION_DEFAULTS.stickySubheadingFadeDuration,
      stickyHeaderCollapseDuration:
        options.stickyHeaderCollapseDuration ??
        BIO_ANIMATION_DEFAULTS.stickyHeaderCollapseDuration,
      stickySubheadingTopThreshold:
        options.stickySubheadingTopThreshold ??
        BIO_ANIMATION_DEFAULTS.stickySubheadingTopThreshold,
      ease: {
        in: options.ease?.in ?? BIO_ANIMATION_DEFAULTS.ease.in,
        out: options.ease?.out ?? BIO_ANIMATION_DEFAULTS.ease.out,
        inOut: options.ease?.inOut ?? BIO_ANIMATION_DEFAULTS.ease.inOut,
      },
    };

    this.elements = {
      header: selectBioEl(this.view, "header") ?? this.view,
      context: selectBioEl(this.view, "context"),
      heading: selectBioEl(this.view, "heading") ?? this.view,
      subheading: selectBioEl(this.view, "subheading"),
      body: selectBioEl(this.view, "body"),
    };

    // Using hook-based cached refs for key elements to simplify timeline definitions
    this.animTargets = [
      this.elements.context,
      this.elements.heading,
      this.elements.subheading,
      this.elements.body,
    ].filter(Boolean);

    // Sub-section items are animated individually as they enter the viewport, so we
    // only set them up here without including in the main animTargets.
    this.subSectionItems = Array.from(
      this.view?.querySelectorAll(BIO_SELECTORS.subSectionSelector) ?? [],
    );
    this.revealedItems = new WeakSet();
    this.onSubSectionRevealComplete = null;
    this._headerState = "open";
    this._headerTransition = null;
    this._headerStateTrigger = null;

    // Connecting lines

    // Set initial state for main anim targets
    if (this.animTargets.length) {
      gsap.set(this.animTargets, {
        autoAlpha: 0,
        y: this.options.translateY,
      });
    }

    // Set initial state for sub-section items; they will be revealed individually based on scroll position.
    if (this.subSectionItems.length) {
      gsap.set(this.subSectionItems, {
        autoAlpha: 0,
        y: this.options.itemTranslateY,
      });
    }

    this._buildTimeline();
    this._createHeaderStateTrigger();
  }

  showAllSubSections() {
    this._showAllItems(this.subSectionItems, this.revealedItems);
  }

  setOnSubSectionRevealComplete(handler) {
    this.onSubSectionRevealComplete =
      typeof handler === "function" ? handler : null;
  }

  kill() {
    this._headerTransition?.kill?.();
    this._headerTransition = null;
    this._headerStateTrigger?.kill?.();
    this._headerStateTrigger = null;
    super.kill();
  }

  setStickySubheadingFaded(shouldFade, { immediate = false } = {}) {
    this.setHeaderState(shouldFade ? "collapsed" : "open", { immediate });
  }

  setHeaderState(nextState, { immediate = false } = {}) {
    const header = this.elements.header;
    const subheading = this.elements.subheading;
    if (!header || !subheading) return;

    const normalizedState = nextState === "collapsed" ? "collapsed" : "open";

    this._headerTransition?.kill?.();
    this._headerTransition = null;

    if (immediate) {
      this._applyHeaderStateInstant(normalizedState);
      return;
    }

    if (normalizedState === this._headerState) {
      return;
    }

    const fadeDuration = this.options.stickySubheadingFadeDuration;
    const collapseDuration = this.options.stickyHeaderCollapseDuration;
    const ease = this.options.ease.inOut;
    const currentHeight = header.getBoundingClientRect().height;
    const targetHeight =
      normalizedState === "collapsed"
        ? this._measureHeaderHeight({ includeSubheading: false })
        : this._measureHeaderHeight({ includeSubheading: true });

    header.style.overflow = "hidden";
    gsap.set(header, { height: currentHeight });

    const tl = gsap.timeline({
      onComplete: () => {
        this._headerTransition = null;
        this._headerState = normalizedState;

        if (normalizedState === "collapsed") {
          subheading.style.display = "none";
          gsap.set(subheading, { autoAlpha: 0 });
        } else {
          subheading.style.display = "";
          gsap.set(subheading, { autoAlpha: 1 });
        }

        gsap.set(header, { height: "auto" });
        header.style.overflow = "";
      },
    });

    if (normalizedState === "collapsed") {
      tl.to(subheading, {
        autoAlpha: 0,
        duration: fadeDuration,
        ease,
        overwrite: "auto",
      })
        // .set(subheading, { display: "none" })
        .to(
          header,
          {
            height: targetHeight,
            duration: collapseDuration,
            ease,
            overwrite: "auto",
          },
          ">",
        );
    } else {
      subheading.style.display = "";
      gsap.set(subheading, { autoAlpha: 0 });

      tl.to(header, {
        height: targetHeight,
        duration: collapseDuration,
        ease,
        overwrite: "auto",
      }).to(
        subheading,
        {
          autoAlpha: 1,
          duration: fadeDuration,
          ease,
          overwrite: "auto",
        },
        ">",
      );
    }

    this._headerTransition = tl;
  }

  _applyHeaderStateInstant(state) {
    const header = this.elements.header;
    const subheading = this.elements.subheading;
    if (!header || !subheading) return;

    if (state === "collapsed") {
      subheading.style.display = "none";
      gsap.set(subheading, { autoAlpha: 0 });
    } else {
      subheading.style.display = "";
      gsap.set(subheading, { autoAlpha: 1 });
    }

    gsap.set(header, { height: "auto" });
    header.style.overflow = "";
    this._headerState = state;
    this._headerTransition = null;
  }

  _measureHeaderHeight({ includeSubheading }) {
    const header = this.elements.header;
    const subheading = this.elements.subheading;
    if (!header || !subheading) return 0;

    const priorHeaderHeight = header.style.height;
    const priorSubheadingDisplay = subheading.style.display;

    subheading.style.display = includeSubheading ? "" : "none";
    gsap.set(header, { height: "auto" });
    const measuredHeight = header.getBoundingClientRect().height;

    subheading.style.display = priorSubheadingDisplay;
    header.style.height = priorHeaderHeight;

    return measuredHeight;
  }

  updateStickySubheadingFade() {
    this._syncHeaderStateFromTrigger();
  }

  _createHeaderStateTrigger() {
    const header = this.elements.header;
    const subheading = this.elements.subheading;
    if (!this.view || !header || !subheading) return;

    this._headerStateTrigger?.kill?.();

    this._headerStateTrigger = ScrollTrigger.create({
      trigger: this.view,
      start: () => {
        const computedTop = Number.parseFloat(
          window.getComputedStyle(header).top,
        );
        const stickyTop = Number.isFinite(computedTop) ? computedTop : 0;
        const stickyThreshold =
          stickyTop + this.options.stickySubheadingTopThreshold;
        return `top top+=${stickyThreshold}`;
      },
      end: "bottom top",
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      onToggle: (trigger) => {
        this.setHeaderState(trigger.isActive ? "collapsed" : "open");
      },
      onRefresh: (trigger) => {
        this.setHeaderState(trigger.isActive ? "collapsed" : "open", {
          immediate: true,
        });
      },
    });

    this._syncHeaderStateFromTrigger({ immediate: true });
  }

  _syncHeaderStateFromTrigger({ immediate = false } = {}) {
    if (!this._headerStateTrigger) return;

    this.setHeaderState(
      this._headerStateTrigger.isActive ? "collapsed" : "open",
      { immediate },
    );
  }

  updateSubSectionReveal() {
    this._revealItemsOnScroll({
      items: this.subSectionItems,
      revealedItems: this.revealedItems,
      revealViewportRatio: this.options.itemRevealViewportRatio,
      buildTween: (item, itemIndex) => {
        gsap.to(item, {
          autoAlpha: 1,
          y: 0,
          delay: this.options.subSectionStartDelay,
          duration: this.options.duration,
          ease: this.options.ease.in,
          onComplete: () => {
            this.onSubSectionRevealComplete?.(item, itemIndex);
          },
        });
      },
    });
  }

  _buildIntro() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.intro });
    // if (!this.animTargets.length) {
    //   return tl;
    // }
    // tl.to(this.animTargets, {
    //   autoAlpha: 1,
    //   y: 0,
    //   duration: this.options.duration,
    //   stagger: this.options.stagger,
    //   ease: this.options.ease.in,
    // }).addPause();
    tl.from(this.view, THROW_IN_ANIMATION, 0);
    return tl;
  }

  _buildIdle() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.idle });
    return tl;
  }

  _buildOutro() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.outro });

    return tl;
  }
}
