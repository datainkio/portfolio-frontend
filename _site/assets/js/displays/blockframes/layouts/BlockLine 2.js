/**
 * Takes a set of blockframes contained in a given SVG (blockframes.svg) and renders them
 * onscreen in multiple variations and positions.
 * 
 * Example:
 *  gsap.timeline.add(BlockLine({
*     type: "background", // "element" or "background" depending on purpose
      id: "BlockframeLibrary",
      this._container: "page-content",
      colCount: 24,  // Number of buildings * 2
      rowCount: 8,
      size: 100, // WTF is this for now other than not being 0?
      angle: 12,
      brightness: 0.25,
      opacity: 1,
      types: ["Article","Calendar","Cart","Contact","Landing","Map","Timeline"]
 * })
 */

// import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.37";
// PALETTES = await fetch("https://unpkg.com/nice-color-palettes@3.0.0/100.json").then((response) => response.json());
// import * as . from "./..js";

// Builder knows how the SVG doc is structured and is responsible for adding the right elements
// to the page.
import * as Builder from "../Builder..js";
// Painter knows how each type of block is structured and is responsible for applying colors
// to suit each type.
import * as Painter from "../Painter.js";

/**
 * 
 * @param {*} . 
 * @returns gsap.timeline instance describing how the blockline presents itself
 */
export default class BlockLine {
  constructor(container, settings) {
    this._isInited = false;
    this._container = container;
    this._type = settings.type; // "element" or "background", depending on implementation
    this._blockFrames = document.getElementById(settings.id); // the source SVG
    this._colCount = settings.colCount;
    this._rowCount = settings.rowCount;
    this._size = settings.size; // Have lost track of what this is for. :(
    this._angle = settings.angle;
    this._brightness = settings.brightness;
    this._opacity = settings.opacity;
    this._types = settings.types;
    this._timeline = gsap.timeline({id: "blockline"});

    this.blockframes.classList.add("hidden");

    // Build the view
    this._views = Builder.build(this);
    console.log(this._views);
    Painter.paint(this.color);

    // Animate things all pretty-like
    this.color.node.querySelectorAll(".building").forEach(building => {
      var stories = building.querySelectorAll(".story");
      gsap.set(stories, {autoAlpha: 0,});
      this._timeline.add(gsap.to(stories, {autoAlpha: 1, onUpdate: this.update, onUpdateParams: [this], stagger: .05}, "<+=.25" ));
    });

    // this._timeline.play();

    // this.update(this);
  
  };

  update(blockline) {
    console.log(blockline.type);
    switch (blockline.type) {
      case "element":
        blockline.container.innerHTML = blockline.color.svg();
        break;
      case "background":
        blockline.container.style.backgroundImage = `url("data:image/svg+xml;charset=UTF-8,${escape(blockline.color.svg())}")`
        break;
      default:
        console.log("unrecognized container type for BlockLine.update: " + blockline.type);
    }
  }

  get angle() {
    return this._angle;
  }
  get blockframes() {
    return this._blockFrames;
  }
  get brightness() {
    return this._brightness;
  }
  get bw() {
    return this._views[1];
  };
  get color() {
    return this._views[0];
  };
  get container() {
    return  this._container;
  }
  get cols() {
    return this._colCount;
  }
  get rows() {
    return this._rowCount;
  }
  get size() {
    return this._size;
  }
  get timeline() {
    return this._timeline;
  }
  get type() {
    return this._type;
  }
  get types() {
    return this._types;
  }
  get opacity() {
    return this._opacity;
  }
};