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
