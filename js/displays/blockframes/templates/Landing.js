/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.templates.landing
 *   role: Frontend runtime module: js/displays/blockframes/templates/Landing.js
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
/** @format */

export function paint(elem, palette) {
  console.log("Landing", elem);
  const cards = elem.querySelectorAll(".card");
  cards.forEach((card) => {
    Card.paint(card, palette.primary.light);
  });
  const chrome = elem.querySelector(".chrome");
  chrome.setAttribute("stroke", palette.accent.light);
  chrome.setAttribute("stroke-width", 10);
  chrome.setAttribute("fill", palette.secondary.dark);
}
