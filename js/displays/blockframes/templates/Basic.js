/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.templates.basic
 *   role: Frontend runtime module: js/displays/blockframes/templates/Basic.js
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
import * as Image from "../organisms/Image.js";
export function paint(elem, palette) {
    elem.setAttribute("fill", "#FFFFFF");
    const image = elem.querySelector(".banner");
    if (image) {
        Image.paint(image, palette.secondary);
    }
    const title = elem.querySelector(".title");
    const subtitle =elem.querySelector(".subtitle");
    const text = elem.querySelector(".text");
    const chrome = elem.querySelector(".chrome");
}
