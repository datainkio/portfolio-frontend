const DUR = 10;
const EASE = "power1.inOut";
var CONTAINER;
var TEXT;
var TL = gsap.timeline();
export function TextLenticular(id) {
    TEXT = document.getElementById(id);
    TEXT.classList.add("bg-horizontal-stripes");
    CONTAINER = TEXT.parentNode;
    CONTAINER.classList.add("bg-horizontal-stripes");
    TL.to(TEXT, {duration: DUR, backgroundPositionY: 40, repeat: -1, ease: "none"}, 0);
    TL.to(CONTAINER, {duration: DUR * 4, backgroundPositionY: -40, repeat: -1, ease: "none"}, 0);
    return TL;
};