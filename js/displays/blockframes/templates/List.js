/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.templates.list
 *   role: Frontend runtime module: js/displays/blockframes/templates/List.js
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
  var bullets = elem.querySelectorAll(".bullet");
  var star = elem.querySelector(".star");
  var header = elem.querySelector(".header");

  chrome.setAttribute("fill", palette.secondary.DEFAULT);
}
