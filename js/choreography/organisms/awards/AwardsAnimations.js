import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { createSectionHeaderIntro } from "../../molecules/section-header-intro/section-header-intro.js";
import { createScrollRevealGroup } from "../../molecules/scroll-reveal-group/scroll-reveal-group.js";
import { AWARDS_ANIMATION_DEFAULTS } from "../../config/ix/motion/motion.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";

const AWARDS_EL_ATTR = "data-awards-el";

const selectAwardsEl = (view, name) =>
  view?.querySelector(`[${AWARDS_EL_ATTR}="${name}"]`) ?? null;

export default class AwardsAnimations extends AbstractSectionAnimations {
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

    const elements = [
      selectAwardsEl(this.view, "context"),
      selectAwardsEl(this.view, "heading"),
      selectAwardsEl(this.view, "body"),
      selectAwardsEl(this.view, "list"),
    ];

    const awardItems = Array.from(
      this.view?.querySelectorAll(`[${AWARDS_EL_ATTR}="award"]`) ?? [],
    );

    // Build header intro/outro pair from the molecule (sets initial state once).
    const { intro, outro } = createSectionHeaderIntro(elements, {
      duration: this.options.duration,
      stagger: this.options.stagger,
      translateY: this.options.translateY,
      ease: { in: this.options.ease.in, out: this.options.ease.out },
    });

    this._headerIntro = intro;
    this._headerOutro = outro;

    this.revealGroup = createScrollRevealGroup(awardItems, {
      viewportRatio: this.options.itemRevealViewportRatio,
      duration: this.options.duration,
      ease: this.options.ease.in,
      y: this.options.itemTranslateY,
    });

    this._buildTimeline();
  }

  _buildIntro() {
    return this._headerIntro ?? gsap.timeline({ id: TIMELINE_IDS.intro });
  }

  _buildIdle() {
    return gsap.timeline({ id: TIMELINE_IDS.idle });
  }

  _buildOutro() {
    return this._headerOutro ?? gsap.timeline({ id: TIMELINE_IDS.outro });
  }
}
