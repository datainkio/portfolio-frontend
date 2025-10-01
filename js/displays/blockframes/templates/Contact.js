export function paint(elem, palette) {
    const header = elem.querySelector(".header");
    const dropdown = elem.querySelector(".dropdown");
    const textfields = elem.querySelectorAll(".textfield");
    const button = elem.querySelector(".button");
    const background = elem.querySelector(".background");
    const chrome = elem.querySelector(".chrome");

    chrome.setAttribute("fill", palette.accent.light);
}