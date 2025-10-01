import * as Image from "../organisms/Image.js";
export function paint(elem, palette) {

    const image = elem.querySelector(".image");
    Image.paint(image, palette.secondary);

    const breadcrumb =elem.querySelector(".breadcrumb");
    const header = elem.querySelector(".header");
    const intro = elem.querySelector(".introduction");
    const chrome = elem.querySelector(".chrome");

    header.setAttribute("fill", palette.semantic.alert);
    chrome.setAttribute("stroke", palette.neutral.dark);
    chrome.setAttribute("stroke-width", 4);
    chrome.setAttribute("fill", palette.primary.DEFAULT);
}

export function intro(elem) {
    return gsap.from(elem, {
        duration: 5,
        opacity: 0
    });
}

export function outro(elem) {

}
