/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.templates.map
 *   role: Frontend runtime module: js/displays/blockframes/templates/Map.js
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
  var text = elem.querySelectorAll(".text");
  var button = elem.querySelector(".button");
  var background = elem.querySelector(".bg");
  var streets = elem.querySelector(".streets");
  var pin = elem.querySelector(".pin");
  var text = elem.querySelector(".text");

  chrome.setAttribute("fill", palette.primary.DEFAULT);
}
