import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import { createVideoReveal } from "../../molecules/video-reveal/video-reveal.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { BACKGROUND_ANIMATION_DEFAULTS } from "../../config/ix/motion/motion.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";

export default class BackgroundVideoAnimations extends AbstractSectionAnimations {
  constructor(view, options = {}) {
    super(view);
    this.options = {
      duration: options.duration ?? BACKGROUND_ANIMATION_DEFAULTS.duration,
      stagger: options.stagger ?? BACKGROUND_ANIMATION_DEFAULTS.stagger,
      translateY:
        options.translateY ?? BACKGROUND_ANIMATION_DEFAULTS.translateY,
      ease: {
        in: options.ease?.in ?? BACKGROUND_ANIMATION_DEFAULTS.ease.in,
        out: options.ease?.out ?? BACKGROUND_ANIMATION_DEFAULTS.ease.out,
      },
    };

    this._buildTimeline();
  }

  _buildIntro() {
    const { intro } = createVideoReveal(this.view, {
      duration: this.options.duration,
    });
    return intro;
  }

  _buildIdle() {
    return gsap.timeline({ id: TIMELINE_IDS.idle });
  }

  _buildOutro() {
    return gsap.timeline({ id: TIMELINE_IDS.outro });
  }
}
