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