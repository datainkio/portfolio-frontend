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

// Produce an image with a lightbox view
export function lightbox(
  pe,
  title = "",
  caption = "",
  peClasses = "",
  imgClasses = ""
) {
  const id = "img_" + Math.floor(Math.random() * 10000);
  return `<button onclick="${id}.showModal()">${picture(
    pe,
    peClasses,
    imgClasses
  )}</button>
<dialog id="${id}" class="modal">
  <figure class="modal-box shadow-none bg-transparent max-w-none h-full flex flex-col justify-center items-center gap-4">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    ${picture(pe, "w-full", "mx-auto")}
    <figcaption>${caption}</figcaption>
  </figure>
</dialog>`;
}
