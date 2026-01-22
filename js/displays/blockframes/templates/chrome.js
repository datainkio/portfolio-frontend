/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.templates.chrome
 *   role: Frontend runtime module: js/displays/blockframes/templates/chrome.js
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
import { findFarthestColor } from "../../../../utils/color.js";
export function paint(chrome, palette, method) {
    // Set Settings.size and scale
    // chrome.setAttribute("transform", `scale(${scale})`);

    // BACKGROUND
    var background = chrome.querySelector(".background");
    method(background, palette[0]);

    // TOOLBAR
    var toolbar = chrome.querySelector(".toolbar");
    
    // background
    var tbg = toolbar.querySelector(".background");
    method(tbg, palette[2]);
    tbg.setAttribute("opacity", 1);
    tbg.setAttribute("style", "mix-blend-mode: hard-light;");

    // dots
    var dots = toolbar.querySelector(".dots");
    method(dots, palette[4]);
}