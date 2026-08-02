/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.templates.project
 *   role: Frontend runtime module: js/displays/blockframes/templates/Project.js
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
  console.log("Project", elem);
  const chrome = elem.querySelector(".chrome");
  const text = elem.querySelector(".text");
  const image = elem.querySelector(".image");
  const header = elem.querySelectorAll(".header");

  chrome.setAttribute("fill", palette.neutral.light);
}
