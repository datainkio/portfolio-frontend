import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { createSectionHeaderIntro } from "../../molecules/section-header-intro.js";
import { createScrollRevealGroup } from "../../molecules/scroll-reveal-group.js";
import { ORGANIZATIONS_ANIMATION_DEFAULTS } from "../../config/ix/motion/motion.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";

const ORGANIZATIONS_EL_ATTR = "data-organizations-el";

const selectOrganizationsEl = (view, name) =>
  view?.querySelector(`[${ORGANIZATIONS_EL_ATTR}="${name}"]`) ?? null;

export default class OrganizationsAnimations extends AbstractSectionAnimations {
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

    const elements = [
      selectOrganizationsEl(this.view, "context"),
      selectOrganizationsEl(this.view, "heading"),
      selectOrganizationsEl(this.view, "body"),
      selectOrganizationsEl(this.view, "list"),
    ];

    const organizationItems = Array.from(
      this.view?.querySelectorAll(`[${ORGANIZATIONS_EL_ATTR}="organization"]`) ?? [],
    );

    const { intro, outro } = createSectionHeaderIntro(elements, {
      duration: this.options.duration,
      stagger: this.options.stagger,
      translateY: this.options.translateY,
      ease: { in: this.options.ease.in, out: this.options.ease.out },
    });

    this._headerIntro = intro;
    this._headerOutro = outro;

    this.revealGroup = createScrollRevealGroup(organizationItems, {
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
