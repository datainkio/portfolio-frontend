import { gsap } from "/assets/js/gsap/all.js";
import { ScrollSmoother } from "/assets/js/gsap/ScrollSmoother.js";
import { ScrollTrigger } from "/assets/js/gsap/ScrollTrigger.js";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const HEADER_ID = "main-header"; // <header />
const WORK_ID = "work";
const VIDEO_URL = "./video/sizzle.mov";

export default class StageManager {
  constructor() {
    this._container;
    this._view;
    this._video;
    this.initView();
    this.initAnimation();
  }

  // Initialize the view with the decorative elements
  initView() {
    // PARALLAX
    this._container = document.getElementById("smooth-content"); // For GSAP parallax
    // VIEW: Container for any decorative elements added by StageManager
    this._view = document.createElement("div");
    this._view.id = "overlay-view";
    this._view.classList.add("absolute", "inset-0", "w-full", "h-dvh", "-z-10"); // Make full-bleed
    this._container.prepend(this._view); // Add the view beneath all the other elements

    // Add the video and overlay elements
    this._video = this.addVideo(this._view, VIDEO_URL);
    this.addPixelator(this._view);
    this.addOverlay(this._view, "bg-gel-primary", "primary");
    this.addOverlay(this._view, "bg-gel-secondary", "secondary");
  }

  // Define and coordinate page animations and events
  initAnimation() {
    // Set up the foundation for parallax
    ScrollSmoother.create({
      wrapper: "#smooth-wrapper", // Wrapper ID
      content: "#smooth-content", // Content ID
      // smooth: 1.5, // Speed of smoothing (higher = slower)
      effects: true, // Allow effects like opacity or parallax
    });

    // LANDING VIEW INTRO AND OUTRO

    // Set the view in a fixed position until the bottom of biography section is reached
    ScrollTrigger.create({
      trigger: "#biography",
      pin: this._view,
      start: "top bottom",
      end: "bottom bottom",
      scrub: 1,
    });

    // Trigger for title position
    const title_trigger = {
      trigger: "#main-header h1",
      start: "center center",
      end: "bottom center",
      scrub: 1,
    };

    // Run the title outro when title_trigger is reached
    const title_outro = gsap.timeline({ paused: true });
    // title_outro.to("#main-header", {
    //   id: "heroOutro",
    //   scrollTrigger: title_trigger,
    //   opacity: 0,
    //   ease: "sine.out",
    // });

    // Run the overlay outro as if it were a piece of paper sliding off-screen
    title_outro.to(["#main-header", "#overlay-primary"], {
      id: "overlayOutro",
      scrollTrigger: title_trigger,
      transformOrigin: "bottom left", // sets the pivot point
      rotation: -25, // rotates 25 degrees counter-clockwise
      x: "100%", // slides the overlay off to the left
      y: "-150%", // vertical movement for effect
      ease: "sine.out",
    });

    // Set default opacity of all <li> items in #biography to 0
    document.querySelectorAll("#biography li").forEach((item) => {
      gsap.set(item, { opacity: 0 });
      ScrollTrigger.create({
        trigger: item,
        start: "center center",
        onEnter: () => gsap.to(item, { opacity: 1, duration: 0.5 }),
        // Optionally, you can add onLeaveBack to fade out when scrolling back
        // onLeaveBack: () => gsap.to(item, { opacity: 0, duration: 0.5 })
      });
    });
  }

  addPixelator(elem) {
    elem.classList.add("bg-pixelator", "absolute", "inset-0");
    return elem;
  }

  // Add overlays to the element
  addOverlay(elem, color, id) {
    let overlay = elem.appendChild(
      this.addGel(document.createElement("div"), color)
    );
    overlay.id = "overlay-" + id;
    return overlay;
  }

  addGel(elem, family) {
    elem.classList.add(family);
    return elem;
  }

  // Add the video element to create the hero background
  addVideo(elem, url) {
    const video = document.createElement("video");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-hidden", "true"); // Mark as decorative
    video.classList.add("bg-video");

    const sourceMP4 = document.createElement("source");
    sourceMP4.src = url;
    sourceMP4.type = "video/mp4";
    video.appendChild(sourceMP4);
    elem.appendChild(video);
    return video;
  }
}
