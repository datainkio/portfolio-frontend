import { gsap } from "/assets/js/gsap/gsap-core.js";
import { CustomEase } from "/assets/js/gsap/CustomEase.js";
import { CustomWiggle } from "/assets/js/gsap/CustomWiggle.js";
gsap.registerPlugin(CustomEase, CustomWiggle);

var CONTAINER, SETTINGS, SRC, DUPES;
export function SeventiesNewsShow(elem, params) {
  CONTAINER = elem;
  SETTINGS = params;
  SRC = CONTAINER.innerText;
  DUPES = [];

  buildView();

  var tl = gsap.timeline({ id: params.id });
  tl.add(moveRot());
  // stl.add(moveXY(), ">");
  // tl.add(wiggle(), ">");
  tl.id;
  return tl;
}

function buildView() {
  for (var i = 0; i < 6; i++) {
    var dupe = document.createElement("div");
    dupe.id = "wg-" + i;
    dupe.innerText = SRC;
    dupe.classList.add(
      "wandering-gel",
      "dupe",
      "origin-right",
      SETTINGS.colors[1]
    );
    CONTAINER.appendChild(dupe);
    DUPES.push(dupe);
  }
  for (var i = 0; i < 6; i++) {
    var dupe = document.createElement("div");
    dupe.id = "wg-" + i;
    dupe.innerText = SRC;
    dupe.classList.add(
      "wandering-gel",
      "dupe",
      "origin-left",
      SETTINGS.colors[0]
    );
    CONTAINER.appendChild(dupe);
    DUPES.push(dupe);
  }
}

function moveRot() {
  var color0 = DUPES.filter((item) => item.classList.contains("origin-right"));
  var color1 = DUPES.filter((item) => item.classList.contains("origin-left"));
  gsap.set(color0, { autoAlpha: 0, rotate: 90 });
  gsap.set(color1, { autoAlpha: 0, rotate: 90 });
  var interleaved = color0.map((item, index) => [item, color1[index]]).flat();
  return gsap.to(
    interleaved,
    {
      duration: SETTINGS.duration,
      autoAlpha: 0.5,
      rotate: 0,
      stagger: {
        // wrap advanced options in an object
        each: 0.1,
        ease: "power3.inOut",
      },
      ease: "sine.in",
    },
    "<25%"
  );
}

function moveXY() {
  var color = DUPES.filter((item) => item.classList.contains("origin-right"));
  return gsap.to(color, {
    duration: SETTINGS.duration,
    // autoAlpha: 1,
    x: "+=" + SETTINGS.w * SETTINGS.range,
    y: "+=" + SETTINGS.h * SETTINGS.range,
    stagger: 0.1,
  });
}

function wiggle() {
  // Create a Brownian motion wiggle configuration
  CustomWiggle.create("brownianWiggle", {
    wiggles: 100, // High number of wiggles to simulate randomness
    type: "random", // Random type to make motion unpredictable
    amplitude: 5, // Small amplitude for subtle, small movements
  });
  return gsap
    .timeline({})
    .to(DUPES, {
      repeat: -1,
      repeatRefresh: true,
      duration: 5,
      x: "*=" + "random(-2, 2)",
      ease: "textWiggle",
    })
    .to(
      DUPES,
      {
        repeat: -1,
        repeatRefresh: true,
        duration: 5,
        y: "*=" + "random(-2, 2)",
        ease: "textWiggle",
      },
      "<"
    );
}
