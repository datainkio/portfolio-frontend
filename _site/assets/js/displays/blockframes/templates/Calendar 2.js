/** @format */

export function paint(elem, palette) {
  console.log("Calendar");
  const pagination = elem.querySelector(".pagination");
  const days = elem.querySelector(".days");
  const background = elem.querySelector(".background");
  const chrome = elem.querySelector(".chrome");

  days.setAttribute("fill", palette.primary.light);
  pagination.setAttribute("fill", palette.secondary.light);
  background.setAttribute("fill", palette.primary.dark);
  chrome.setAttribute("fill", palette.semantic.success);
  // chrome.setAttribute("stroke-width", 10);
}
