import * as Card from "../organisms/Card.js";
export function paint(elem, palette) {
    const cards = elem.querySelectorAll(".Card");
    cards.forEach(card => {
        Card.paint(card, palette.accent);
    })
    const chrome = elem.querySelector(".chrome");
    chrome.setAttribute("stroke", palette.accent.light);
    chrome.setAttribute("stroke-width", 10);
    chrome.setAttribute("fill", palette.secondary.dark);
}