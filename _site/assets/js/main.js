import Halftone from '/assets/js/effects/image/image-halftone.js';
window.onload = function() {
    const ht = new Halftone(
        gsap.utils.toArray("#page-content")[0],
        {
        dotSize: 3,
        gridSize: 3,
        color: true
    });
    // settings(50, 0, 100);
}

export function test() {
    trace("Hello there");
}
