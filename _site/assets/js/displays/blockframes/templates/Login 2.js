/** @format */

export function paint(elem, palette) {
  const chrome = elem.querySelector(".chrome");
  const background = elem.querySelector(".background");
  const button = elem.querySelector(".button");
  const textfield = elem.querySelector(".textfield");
  const dropdown = elem.querySelector(".dropdown");
  const header = elem.querySelector(".header");

  console.log(elem);

  chrome.setAttribute("fill", palette.neutral.light);
}
