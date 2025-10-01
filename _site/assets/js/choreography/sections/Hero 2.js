import { gsap } from "/assets/js/gsap/all.js";
import { ScrollSmoother } from "/assets/js/gsap/ScrollSmoother.js";
import { ScrollTrigger } from "/assets/js/gsap/ScrollTrigger.js";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// GSAP Animation Settings
const START = "top top"; // start on scroll
const END = "bottom 75%"; // end 75% from the top
const SCRUB = 1; // speed of the animation
const SCROLL = 5; // speed of the parallax effect
const TRANSFORM_ORIGIN = "bottom 25%"; // origin point for the rotation
const ROTATION = -35; // rotation value
const DESTINATION = -96; // final x position
const EASE = "sine.in"; // ease type

export default class Hero {
  constructor(elem) {
    this.CONTAINER = elem;
    return this;
  }

  outro() {
    this.TL = gsap.timeline({ id: "hero" });
    // Animate the title and gradient overlay
    this.TL.to(this.TITLE, {
      id: "heroOutro",
      scrollTrigger: this.trigger,
      transformOrigin: TRANSFORM_ORIGIN,
      rotation: ROTATION,
      x: DESTINATION,
      ease: EASE,
    });
    return this.TL;
  }

  get trigger() {
    return {
      trigger: this.CONTAINER,
      pin: this.VIDEO, // pin the trigger element while active
      pinSpacing: true,
      start: START,
      end: END,
      scrub: SCRUB,
    };
  }

  get timeline() {
    return this.TL;
  }
  get container() {
    return this.CONTAINER;
  }
  get gel() {
    return this.GEL;
  }
  get text() {
    return this.TITLE;
  }
}
