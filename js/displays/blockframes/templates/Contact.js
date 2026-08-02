/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.templates.contact
 *   role: Frontend runtime module: js/displays/blockframes/templates/Contact.js
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
export function paint(elem, palette) {
    const header = elem.querySelector(".header");
    const dropdown = elem.querySelector(".dropdown");
    const textfields = elem.querySelectorAll(".textfield");
    const button = elem.querySelector(".button");
    const background = elem.querySelector(".background");
    const chrome = elem.querySelector(".chrome");

    chrome.setAttribute("fill", palette.accent.light);
}