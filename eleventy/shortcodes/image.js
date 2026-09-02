/** @format */
import * as cheerio from "cheerio"; // a handy utility for manipulating HTML strings

// Add classes to <picture> and <img> elements
// Usage: {% picture "<picture><img...></picture>", "alt text", "class1 class2" %}
export function picture(pe, peClasses = "", imgClasses = "") {
  if (!pe || typeof pe !== "string") {
    // console.warn('Picture element is either missing or not a string');
    return "404";
  }

  const $ = cheerio.load(pe);

  // Add classes to <img>
  $("img").addClass(imgClasses);
  // Remove width and height attributes from <img> to limit clipping troubles w/CSS
  $("img").removeAttr("width height");

  // If the img element is wrapped in a picture...
  if ($("picture").length) {
    // Add classes to <picture>
    $("picture").addClass(peClasses);
    return $.html("picture");
  } else {
    // Assume that this is a simple <img> tag (e.e SVGs)
    return $.html("img");
  }
}
