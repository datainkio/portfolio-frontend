import { findFarthestColor } from "../../../../utils/color.js";
import { paintElement } from "../../Painter.js";

export function paint(timeline, palette) {
    var chop = timeline.querySelector(".chop");
    var bullets = timeline.querySelector(".bullets");
    var history = timeline.querySelector(".history");
    chop.setAttribute("opacity", 1);
    chop
        .querySelector(".background")
        .setAttribute("fill", findFarthestColor(palette[1], palette));
    chop
        .querySelector(".star")
    paintElement(bullets, palette[3], 1);
    paintElement(history, palette[2], 1);
}