/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.templates.main
 *   role: Frontend runtime module: js/displays/blockframes/templates/Main.js
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
  var chrome = elem.querySelector(".chrome");
  var text = elem.querySelector(".text");
  var modules = elem.querySelectorAll(".module");

  chrome.setAttribute("fill", palette.primary.light);
}
