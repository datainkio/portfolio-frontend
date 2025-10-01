document.addEventListener("DOMContentLoaded", (event) => {
    try {
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
        // see https://gsap.com/docs/v3/Plugins/ScrollSmoother/
        // see https://codepen.io/GreenSock/pen/bGaWjpw
        // create the smooth scroller FIRST!
        const smoother = ScrollSmoother.create({
            wrapper: "#smooth-wrapper", // or #smooth-wrapper
            content: "#page-content", // or #smooth-content
            smooth: 2,
            // normalizeScroll: true, // prevents address bar from showing/hiding on most devices, solves various other browser inconsistencies
            // ignoreMobileResize: true, // skips ScrollTrigger.refresh() on mobile resizes from address bar showing/hiding
            effects: true,
            // preventDefault: true
        });

        // trace("parallax setup successful");
    } catch (e) {
        // trace("couldn't set up parallax");
        // trace(e);
    }
});