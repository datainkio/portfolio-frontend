/**
 * ---
 * aix:
 *   id: frontend.js.layouts.sticky-hero
 *   role: Frontend runtime module: js/layouts/sticky-hero.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - layouts
 *     - sticky-hero.js
 * ---
 */
const HEADER = gsap.timeline({
    scrollTrigger: {
        trigger: "#main-header",
        start: "top top",
        scrub: 1
    },
});
HEADER.add(gsap.to("#main-header", { height: "4rem" }));
// HEADER.add(gsap.to("#main-header", { autoAlpha: 0 }));
HEADER.add(gsap.to("#main-title", { fontSize: "4rem" }), "<");