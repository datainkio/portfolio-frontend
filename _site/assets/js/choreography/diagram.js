gsap.registerPlugin(ScrollTrigger);
export function arc(id) {
    // Get the SVG
    const svg = document.getElementById(id);
    const TL = gsap.timeline({
       scrollTrigger: {
            trigger: '#diagram_arc',
            start: 'bottom 75%',
            end: 'top top',
        }
    });
    TL.from(svg.getElementById("Block_01"), {opacity: 0});
    TL.from(svg.getElementById("highlight_00"), {opacity: 0});
    TL.from(svg.getElementById("arrow_01"), {opacity: 0});
    TL.from(svg.getElementById("Block_02"), {opacity: 0});
    TL.from(svg.getElementById("highlight_01"), {opacity: 0});
    TL.from(svg.getElementById("highlight_02"), {opacity: 0});
    TL.from(svg.getElementById("highlight_03"), {opacity: 0});
    TL.from(svg.getElementById("highlight_04"), {opacity: 0});
    TL.from(svg.getElementById("highlight_05"), {opacity: 0});
    TL.from(svg.getElementById("highlight_06"), {opacity: 0});
    TL.from(svg.getElementById("highlight_07"), {opacity: 0});
    TL.from(svg.getElementById("highlight_08"), {opacity: 0});
    TL.from(svg.getElementById("Select"), {opacity: 0});
    TL.from(svg.getElementById("Destination"), {opacity: 0});
    TL.from(svg.getElementById("highlight_09"), {opacity: 0});
    TL.from(svg.getElementById("highlight_10"), {opacity: 0});
    TL.from(svg.getElementById("highlight_11"), {opacity: 0});
    TL.from(svg.getElementById("Jump"), {opacity: 0});
    TL.from(svg.getElementById("Drag"), {opacity: 0});
    // Init by hiding everything
    // Display Block_01
    // Display Highlight_01
    // Display Arrow_01
    // Display Block_02
    return TL;
}