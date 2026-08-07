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
  var background = elem.querySelector(".geo .background");
  var streets = elem.querySelector(".streets");
  var pin = elem.querySelector(".pin");

  chrome.setAttribute("fill", palette.primary.DEFAULT);
  background.setAttribute("fill", palette.neutral.light);
  streets.setAttribute("fill", palette.neutral.dark);
  pin.setAttribute("fill", palette.semantic.alert);
  button.setAttribute("fill", palette.secondary.DEFAULT);
  text.forEach((t) => t.setAttribute("fill", palette.neutral.dark));
}
