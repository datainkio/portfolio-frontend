export function paint(elem, palette) {
    const sun = elem.querySelector(".sun");
    const mountains = elem.querySelector(".mountains");
    const sky = elem.querySelector(".sky");

    sun.setAttribute("fill", palette.dark);
    mountains.setAttribute("fill", palette.DEFAULT);
    sky.setAttribute("fill", palette.light);
}