import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import {
  WORK_ANIMATION_DEFAULTS,
  TIMELINE_IDS,
  SELECTORS,
} from "../../config/index/index.js";

const WORK_EL_ATTR = "data-projects-el";

const selectWorkEl = (view, name) =>
  view?.querySelector(`[${WORK_EL_ATTR}="${name}"]`) ?? null;

export default class WorkAnimations extends AbstractSectionAnimations {
  constructor(view, options = {}) {
    super(view);

    this.options = {
      duration: options.duration ?? WORK_ANIMATION_DEFAULTS.duration,
      stagger: options.stagger ?? WORK_ANIMATION_DEFAULTS.stagger,
      translateY: options.translateY ?? WORK_ANIMATION_DEFAULTS.translateY,
      itemTranslateY:
        options.itemTranslateY ?? WORK_ANIMATION_DEFAULTS.itemTranslateY,
      itemRevealViewportRatio:
        options.itemRevealViewportRatio ??
        WORK_ANIMATION_DEFAULTS.itemRevealViewportRatio,
      ease: {
        in: options.ease?.in ?? WORK_ANIMATION_DEFAULTS.ease.in,
        out: options.ease?.out ?? WORK_ANIMATION_DEFAULTS.ease.out,
      },
    };

    this.elements = {
      header: selectWorkEl(this.view, "header") ?? this.view,
      context: selectWorkEl(this.view, "context"),
      heading: selectWorkEl(this.view, "heading") ?? this.view,
      body: selectWorkEl(this.view, "body") ?? this.view,
      list: selectWorkEl(this.view, "list"),
    };

    this.animTargets = [
      this.elements.context,
      this.elements.heading,
      this.elements.body,
      this.elements.list,
    ].filter(Boolean);

    this.workItems = Array.from(
      this.view?.querySelectorAll(`[${WORK_EL_ATTR}="project"]`) ?? [],
    );
    this.revealedItems = new WeakSet();

    this._buildTimeline();
  }

  showAllWorkItems() {
    this._showAllItems(this.workItems, this.revealedItems);
  }

  updateWorkReveal() {}

  _buildIntro() {
    return gsap.timeline({ id: TIMELINE_IDS.intro });
  }

  _buildIdle() {
    return gsap.timeline({ id: TIMELINE_IDS.idle });
  }

  _buildOutro() {
    return gsap.timeline({ id: TIMELINE_IDS.outro });
  }

  kill() {
    super.kill();
  }
}
