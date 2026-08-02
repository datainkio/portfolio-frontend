/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.templates.blog
 *   role: Frontend runtime module: js/displays/blockframes/templates/Blog.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - displays
 *     - blockframes
 * ---
 */
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