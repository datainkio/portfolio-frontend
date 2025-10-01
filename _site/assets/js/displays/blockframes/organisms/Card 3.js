import * as Image from "./Image.js";
export function paint(elem, palette) {
    const image = elem.querySelector(".image");
    const breadcrumb = elem.querySelector(".breadcrumb");
    const title = elem.querySelector(".title");
    const text = elem.querySelector(".text");

    if (image) {
        Image.paint(image, palette);
    }

    if (breadcrumb) {
        breadcrumb.setAttribute("fill", palette.dark);
    };

    if (title) {
        title.setAttribute("fill", palette.DEFAULT);
    };
   
    if (text) {
        text.setAttribute("fill", palette.light);
    };
    
}