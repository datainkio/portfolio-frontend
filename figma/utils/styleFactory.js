/**
 * ---
 * aix:
 *   id: frontend.figma.utils.stylefactory
 *   role: Figma tooling module: figma/utils/styleFactory.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - figma
 *     - utils
 * ---
 */
import { Color } from "../models/fills/Color.js";
import { Pattern } from "../models/fills/Pattern.js";
import { TextFormat } from "../models/text/TextFormat.js";

/**
 * Factory function to create a style object.
 * @param {Object} styleDoc - The style document object received from the Figma API.
 * @returns {Object} - The style object.
 */

/**
 * The style document object received from the Figma API looks like this:
 *   {
    id: '83:857',
    name: 'secondary/light',
    type: 'RECTANGLE',
    scrollBehavior: 'SCROLLS',
    boundVariables: { fills: [Array] },
    blendMode: 'PASS_THROUGH',
    fills: [ [Object] ],
    strokes: [],
    strokeWeight: 1,
    strokeAlign: 'INSIDE',
    absoluteBoundingBox: { x: 0, y: 0, width: 100, height: 100 },
    absoluteRenderBounds: { x: 0, y: 0, width: 100, height: 100 },
    constraints: { vertical: 'TOP', horizontal: 'LEFT' },
    effects: [],
    interactions: []
  },
 */
export function createStyle(styleDoc) {
  switch (styleDoc.type) {
    case "TEXT":
      return new TextFormat(styleDoc);
    case "RECTANGLE":
      switch (styleDoc.fills[0].type) {
        case "SOLID":
          // Create a new color object
          return new Color(styleDoc);
        case "IMAGE":
          // Create a new pattern object
          return new Pattern(styleDoc);
      }
    case "FRAME":
      // Someday we might want to do something with frames, like define grids or something
      return;
    default:
      throw new Error(`Unknown style type: ${styleDoc.type}`);
  }
}
