import gsap from "/assets/js/gsap/gsap-core.js";
import ScrollTrigger from "/assets/js/gsap/ScrollTrigger.js";
import * as PrinterMarks from "/assets/js/displays/PrinterMarks.js";
import * as TextParty from "/assets/js/effects/TextParty.js";
gsap.registerPlugin(ScrollTrigger);
export default class Work {
  constructor(elem) {
    this.setTitles();
    this.initAnimation();
    return elem;
  }

  setTitles() {
    const sections = document.querySelectorAll(".project-category");
    sections.forEach((section) => {
      // Apply the print marks to the section
      PrinterMarks.add(section);
      // Add the wandering gel text effect animation
      ScrollTrigger.create({
        trigger: section,
        animation: this.sectionIntro(section),
        start: "top 65%",
        // animation: TextParty.gel(section.querySelector(".wandering-gel"), ["text-secondary/90","text-primary/90",]),
      });
    });
  }

  sectionIntro(section) {
    return gsap.from(section, {
      transformOrigin: "top 80%",
      x: 10,
      rotation: -10,
      ease: "sine.in",
    });
  }

  initAnimation() {
    // Trigger the work section intro animation
    const work_trigger = {
      trigger: "#work",
      pin: this._view, // pin the trigger element while active
      pinSpacing: true,
      start: "top bottom",
      end: "top 25%",
      scrub: 1,
    };

    // Define the work section intro animation
    const work_intro = gsap.timeline({ paused: true });
    work_intro.from("#work", {
      id: "workIntro",
      scrollTrigger: work_trigger,
      transformOrigin: "top 80%",
      x: 10,
      rotation: -10,
      ease: "sine.in",
    });
  }
}

// Initialize the view by setting up the container and adding static elements
