/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.templates.features
 *   role: Frontend runtime module: js/displays/blockframes/templates/Features.js
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
  const banner = elem.querySelector(".banner");
  const text = elem.querySelector(".text");
  const profiles = elem.querySelectorAll(".profiles");
  const chrome = elem.querySelector(".chrome");

  banner.setAttribute("fill", palette.primary.light);
  profiles.forEach((profile) => {
    profile.setAttribute("fill", palette.accent.light);
  });

  chrome.setAttribute("fill", palette.accent.light);
}
