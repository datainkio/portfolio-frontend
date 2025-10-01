/** @format */

export function paint(elem, palette) {
  console.log("Project", elem);
  const chrome = elem.querySelector(".chrome");
  const text = elem.querySelector(".text");
  const image = elem.querySelector(".image");
  const header = elem.querySelectorAll(".header");

  chrome.setAttribute("fill", palette.neutral.light);
}
