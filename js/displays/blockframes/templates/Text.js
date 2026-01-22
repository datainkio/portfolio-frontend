/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.templates.text
 *   role: Frontend runtime module: js/displays/blockframes/templates/Text.js
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

  chrome.setAttribute("fill", palette.secondary.light);
}
