/**
 * ---
 * aix:
 *   id: frontend.js.gsap-test
 *   role: Frontend runtime module: js/gsap-test.js
 *   status: draft
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - gsap-test.js
 * ---
 */
console.log("gsap-test.js is here");
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
// apply parallax effect to any element with a data-speed attribute
gsap.to("[data-speed]", {
  y: (i, el) =>
    (1 - parseFloat(el.getAttribute("data-speed"))) *
    ScrollTrigger.maxScroll(window),
  ease: "none",
  scrollTrigger: {
    start: 0,
    end: "max",
    invalidateOnRefresh: true,
    scrub: 0,
  },
});
