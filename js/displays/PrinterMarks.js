/**
 * ---
 * aix:
 *   id: frontend.js.displays.printermarks
 *   role: Frontend runtime module: js/displays/PrinterMarks.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - displays
 *     - PrinterMarks.js
 * ---
 */
/**
 * Adds graphic elements mimicking printer proof marks, registration, etc., positioned inside a given block element.
 * Built for the 2025 portfolio.
 * Yes, it is an ungodly mix of Tailwind and vanilla CSS.
 */

const REGISTRATION_MARK_URL = "./assets/svg/registration-mark.svg";

export function add(elem) {
  const container = document.createElement("div");
  container.classList.add("printmarks", "pointer-events-none");
  elem.prepend(container);
  addRegistrationBar(container, 4);
  addTrim(container);
  addBleed(container, 8);
  // elem.classList.add("relative", "h-fit", "pt-8");
}

function createMarkElement(type, styles) {
  const mark = document.createElement("div");
  mark.classList.add(type);
  Object.assign(mark.style, styles);
  return mark;
}

export function addBleed(elem, offset = 0) {
  const bleed = createMarkElement("printmark-bleed", border(offset));
  // elem.style.position = "absolute"; // Ensure the element is positioned relatively
  elem.appendChild(bleed);
}

export function addMargins(elem, offset = 0) {
  const margins = createMarkElement("printmark-margins", border(offset));
  // elem.style.position = "relative"; // Ensure the element is positioned relatively
  elem.appendChild(margins);
}

function border(offset) {
  return {
    position: "absolute",
    // border: '1px dashed rgba(255, 0, 0, 0.8)', // Dashed border, 1px thick
    width: `calc(100% - ${2 * offset}px)`,
    height: `calc(100% - ${4 * offset}px)`,
    top: `${3 * offset}px`,
    left: `${offset}px`,
    boxSizing: "border-box",
    pointerEvents: "none",
  };
}

export function addTrim(elem) {
  const container = createMarkElement("printmark-trim", {});
  // Set the y-position based on the current value of YOFFSET
  container.style.top = `0px`;
  container.classList.add("absolute", "inset-4", "mt-8");
  elem.appendChild(container);
  // Define the positions of the corners
  const corners = [
    { side1: "top", side2: "left" },
    { side1: "top", side2: "right" },
    { side1: "bottom", side2: "left" },
    { side1: "bottom", side2: "right" },
  ];

  // Add two trim marks (horizontal and vertical) at each corner
  corners.forEach(({ side1, side2 }) => {
    // Horizontal trim mark
    const horizontalMark = createMarkElement("printmark-trim-horiz", {
      position: "absolute",
      [side1]: 0,
      [side2]: side2 === "left" ? 0 : "auto",
      right: side2 === "right" ? 0 : "auto",
    });

    // Vertical trim mark
    const verticalMark = createMarkElement("printmark-trim-vert", {
      position: "absolute",
      [side1]: side1 === "top" ? 0 : "auto",
      [side2]: 0,
      bottom: side1 === "bottom" ? 0 : "auto",
    });

    // elem.style.position = "relative"; // Ensure the element is positioned relatively
    container.appendChild(horizontalMark);
    container.appendChild(verticalMark);
  });
}

// TODO: Try to use the SVG instead of an image
export function addRegistrationBar(elem, count) {
  const container = createMarkElement("printmark-registration-bar", {});
  elem.appendChild(container);

  const markImg = new Image(); // Create a new Image object
  markImg.src = REGISTRATION_MARK_URL; // Set the image source
  markImg.alt = "Printer's mark"; // Set an alt attribute for accessibility
  markImg.classList.add("printmark-registration", "mx-auto");

  markImg.onload = () => {
    addGradientBar(container, count, "printmark-neutrals");
    container.appendChild(markImg);
    addGradientBar(container, count, "printmark-colors");
  };

  markImg.onerror = () => {
    console.error(`Failed to load image: ${url}`);
  };

  // addRegistration(container);
}
/**
 * Create a set of color swatches. Styles applied via CSS.
 * @param {*} elem
 * @param {*} count
 * @param {*} className
 */
function addGradientBar(elem, count, className) {
  const gradient = document.createElement("ul");
  gradient.classList.add(className);
  for (var i = 0; i < count; i++) {
    gradient.appendChild(document.createElement("li"));
  }
  elem.appendChild(gradient);
}

export function addStarTarget(elem, size) {
  const starTarget = createMarkElement("star-target", {
    position: "absolute",
    width: `${size * 2}rem`,
    height: `${size * 2}rem`,
    border: "0.1rem solid black",
    borderRadius: "50%",
    top: `calc(50% - ${size}rem)`,
    left: `calc(50% - ${size}rem)`,
    pointerEvents: "none",
  });

  const center = createMarkElement("center-dot", {
    position: "absolute",
    width: "0.2rem",
    height: "0.2rem",
    backgroundColor: "black",
    borderRadius: "50%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  });

  starTarget.appendChild(center);
  elem.style.position = "relative";
  elem.appendChild(starTarget);
}
