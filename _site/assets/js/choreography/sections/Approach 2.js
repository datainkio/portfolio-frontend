/** @format */
// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
import gsap from "/assets/js/gsap/gsap-core.js";
import Blockframes from "/assets/js/displays/blockframes/Blockframes.js";
import ThemeColors from "/assets/js/utils/tailwind/ThemeColors.js";

export default class Approach {
  constructor(containerId) {
    // Explicitly initialize properties in the constructor

    // Initialize class functionality
    this.init(containerId);
  }

  async init(containerId) {
    try {
      this.CONTAINER = document.getElementById("main-header");
      this.TITLE = document.getElementById("main-title");
      this.GEL = document.createElement("div");

      // this.container = document.getElementById(containerId); // DOM container element
      this.theme = new ThemeColors(); // Instance of ThemeColors
      this.bfms = new Blockframes("/assets/svg/blockframes.svg"); // Instance of Blockframes
      await this.bfms.load(); // Load the Blockframes SVG
      this.bfms.makeResponsive(); // Make the SVG responsive
      this.bfms.paintAll(this.theme.colors); // Apply theme colors

      // Add Blockframes SVG to the container
      if (this.CONTAINER) {
        this.CONTAINER.appendChild(this.bfms.svgElement);
      } else {
        console.warn(`Container with ID "${containerId}" not found.`);
      }
    } catch (error) {
      console.error("Failed to initialize Approach:", error);
    }
  }

  initView() {
    this.CONTAINER = document.getElementById("main-header");
    this.TITLE = document.getElementById("main-title");
    this.GEL = document.createElement("div");
  }

  initAnimation() {}

  get trigger() {
    return {
      trigger: this.CONTAINER,
      pin: this.VIDEO, // pin the trigger element while active
      start: "top top", // when the top of the trigger hits the top of the viewport
      // end: 'bottom top', // end after scrolling 500px beyond the start
      scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
    };
  }

  get timeline() {
    return this.TL;
  }
  get container() {
    return this.CONTAINER;
  }
}
