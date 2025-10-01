import { gsap } from "/assets/js/gsap/gsap-core.js";
import { CustomEase } from "/assets/js/gsap/CustomEase.js";
import { CustomWiggle } from "/assets/js/gsap/CustomWiggle.js";
gsap.registerPlugin(CustomEase, CustomWiggle);

const DISTANCE = 2;
var CONTAINER, DUPES, SRC;
export function WanderingGel(elem, colors) {
  CONTAINER = elem;
  SRC = CONTAINER.getAttribute("data-text");
  DUPES = [];

  buildView(colors);
  return animate();
}

function buildView(colors) {
  CONTAINER.innerText = "";
  CONTAINER.classList.add("relative");
  // For each color value, create a duplicate of the text
  for (var i = 0; i < colors.length; i++) {
    var dir = i % 2 === 0 ? 1 : -1;
    var dupe = document.createElement("div");
    dupe.id = "wg-" + i;
    dupe.innerText = SRC;
    dupe.classList.add(colors[i], "mix-blend-multiply");
    if (dir > 0) {
      dupe.classList.add("absolute");
    }
    CONTAINER.appendChild(dupe);
    DUPES.push(dupe);
  }
}

export function animate() {
  var tl = gsap.timeline({});
  DUPES.forEach((dupe, index) => {
    var dir = index % 2 === 0 ? 1 : -1;
    tl.add(
      gsap.to(dupe, {
        duration: 1,
        x: DISTANCE * dir,
        y: DISTANCE * dir,
      }),
      "<"
    );
  });
  return tl;
}
