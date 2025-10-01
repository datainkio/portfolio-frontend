import gsap from "/assets/js/gsap/gsap-core.js";
import * as Builder from "./Builder.js";
import * as Painter from "./Painter.js";
import * as Animator from "./Animator.js";
export default class Blockframes {
  constructor(url) {
    this.url = url; // URL of the SVG file to load
    this.svgElement = null; // Will hold the loaded SVG element
    this.timeline = gsap.timeline({});
  }

  // Method to load the SVG file
  async load() {
    try {
      // Fetch the SVG file as text
      const response = await fetch(this.url);

      // Check if the response is OK (status code in the range 200-299)
      if (!response.ok) {
        throw new Error(
          `Failed to fetch SVG. Status: ${response.status} ${response.statusText}`
        );
      }

      // Get the response text (the SVG content)
      const svgText = await response.text();

      // Parse the SVG text into an SVG document
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

      // Extract the SVG element from the document
      this.svgElement = svgDoc.documentElement;

      // Check if the parsed content is a valid SVG element
      if (this.svgElement.nodeName !== "svg") {
        throw new Error("The fetched content is not a valid SVG element.");
      }

      // Return the SVG element for potential further use
      return this.svgElement;
    } catch (error) {
      // Log the error with more context
      console.error(`Error loading SVG from ${this.url}:`, error);

      // Rethrow the error to let the caller handle it
      throw error;
    }
  }

  makeGrid(rows, cols, colors) {
    // Create a container for the grid
    const grid = document.createElement("div");
    grid.classList.add("grid");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    grid.style.gap = "1px";

    // Create the grid cells
    for (let i = 0; i < rows * cols; i++) {
      const cell = document.createElement("div");
      cell.style.backgroundColor = colors[i % colors.length];
      grid.appendChild(cell);
    }

    // Add the grid to the document
    return grid;
  }

  makeResponsive() {
    // Remove any width and height attributes on the SVG
    this.svgElement.removeAttribute("width");
    this.svgElement.removeAttribute("height");

    // Set the viewBox attribute if not already set
    if (!this.svgElement.hasAttribute("viewBox")) {
      const width = this.svgElement.getAttribute("width") || "100";
      const height = this.svgElement.getAttribute("height") || "100";
      this.svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
      this.svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
    }

    // Ensure preserveAspectRatio is set
    this.svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // Add Tailwind CSS classes to the SVG element
    this.svgElement.classList.add("w-full", "h-full");
  }

  insertInto(container, svg) {
    container.appendChild(svg);
  }

  /**
   * Return an array of SVG objects. Each object contains one instance of a given block type (species).
   */
  get inventory() {
    const result = [];
    /**
     * this.svgElement.querySelector(".Blocks").children returns an HTMLCollection, which does not have
     * a forEach method. forEach is available on arrays, but not on HTMLCollection objects.
     * To get around this, convert the HTMLCollection into an array before iterating. You can use either
     * Array.from() or the spread syntax ([...]).
     */
    const blocks = [...this.svgElement.querySelector(".Blocks").children];
    blocks.forEach((block) => {
      result.push(block);
    });
    return result;
  }

  getBlock(type) {
    return this.svgElement.querySelector(type);
  }

  paintAll(palette) {
    this.svgElement.setAttribute("stroke-width", 2);
    // this.svgElement.setAttribute("stroke", palette.neutral.dark);
    this.svgElement.setAttribute("fill", palette.neutral.light);
  }

  paintBlock(block, palette) {
    Painter.block(block, palette);
  }

  placeBlock(block, container, clone = true) {
    Builder.insert(block, container, clone);
  }

  animateBlock(block) {
    return Animator.wipe(block);
  }
}
