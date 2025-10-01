/** @format */

import StageManager from "/assets/js/choreography/StageManager.js";
import Hero from "/assets/js/choreography/sections/Hero.js";
import Work from "/assets/js/choreography/sections/Work.js";
import Biography from "/assets/js/choreography/sections/Biography.js";

window.onload = function () {
  console.log("Que?");
  const HERO = new Hero(document.getElementById("main-header")); // Hero provides the landing view
  const WORK = new Work(document.getElementById("work")); // Work provides the project views
  const BIOGRAPHY = new Biography(document.getElementById("biography")); // Background provides the slideshow of personal history
  const SM = new StageManager(); // StageManager coordinates how sections respond to scroll events
};

function onStart(id) {
  console.log(id + ".onStart");
}
function onUpdate(obj) {
  console.log(obj + ".onUpdate");
}
function onComplete(id) {
  console.log(id + ".onComplete");
  if (id == "fadeInChars") {
    // addTimeline(TextParty.gel("main-title", Config.WGParams));
  }
}
