import gsap from "/assets/js/gsap/gsap-core.js";
import ScrollTrigger from "/assets/js/gsap/ScrollTrigger.js";
import SplitText from "/assets/js/gsap/SplitText.js";
import * as PrinterMarks from "/assets/js/displays/PrinterMarks.js";
import * as TextParty from "/assets/js/effects/TextParty.js";
gsap.registerPlugin(ScrollTrigger, SplitText);
export default class Intro {
  constructor() {
    this.initView();
    this.initAnimation();
  }
  // Initialize the view by setting up the container and adding static elements
  initView() {
    this.CONTAINER = document.getElementById("intro");
    this.addPrintMarks();
  }

  /**
   * Apply static decoration elements (e.g. print marks, etc.)
   */
  addPrintMarks() {
    // Add print registration marks to the main container
    PrinterMarks.addTrim(this.CONTAINER, 16);
    PrinterMarks.addRegistrationBar(this.CONTAINER, 4);
    PrinterMarks.addBleed(this.CONTAINER, 8);
  }

  /**
   * Set up the intro/outro animations for the section
   */
  initAnimation() {
    const TL = gsap.timeline({ paused: true });
    TL.addLabel("intro");
    TL.addLabel("outro");

    // TL.add(this.entry, "intro");
    // TL.add(this.exit, "outro");
    TL.addPause("outro");

    ScrollTrigger.create({
      trigger: this.CONTAINER,
      start: "top bottom",
      end: "top 25%",
      scrub: 1, // smoooooove
      // onEnter: () => TL.play("intro"),
      // onLeave: () => TL.play("outro"),
      // onEnterBack: () => TL.play("intro"),
      // onLeaveBack: () => TL.play("outro"),
    });

    // "20 years of award-winning work"
    ScrollTrigger.create({
      trigger: "#twenty-years",
      start: "top 65%",
      // end: "bottom center",
      animation: TextParty.gel(document.getElementById("twenty-years"), [
        "text-secondary/90",
        "text-primary/90",
      ]),
    });
    // STATEMENT
    // ScrollTrigger.create({
    //   trigger: "#statement",
    //   start: "top center",
    //   // end: "bottom center",
    //   animation: this.lines,
    // });

    // AWARDS
    ScrollTrigger.create({
      trigger: "#awards",
      start: "top 75%",
      // end: "bottom center",
      animation: this.awards,
    });
  }

  get entry() {
    console.log("entry");
    return gsap.from(this.CONTAINER, {
      id: "intro",
      transformOrigin: "top 80%",
      x: 10,
      rotation: -10,
      ease: "sine.in",
    });
  }

  get exit() {
    console.log("exit");
    return gsap.from(this.CONTAINER, {
      id: "intro",
      transformOrigin: "top 80%",
      x: 10,
      rotation: -10,
      ease: "sine.in",
    });
  }

  get lines() {
    var split = new SplitText("#statement", { type: "lines" });
    return gsap.from(split.lines, {
      duration: 1,
      y: 20,
      opacity: 0,
      stagger: 0.25,
    });
  }

  get awards() {
    return gsap.from(".award-organization", {
      duration: 1,
      y: 20,
      opacity: 0,
      stagger: 0.25,
    });
  }

  get organizations() {
    var orgs = document.getElementsByClassName("organization");
    return gsap.from(orgs, {
      duration: 1,
      y: 20,
      opacity: 0,
      stagger: 0.25,
    });
  }

  get container() {
    return this.CONTAINER;
  }

  get timeline() {
    return this.TL;
  }
}
