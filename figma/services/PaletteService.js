/**
 * ---
 * aix:
 *   id: frontend.figma.services.paletteservice
 *   role: Figma tooling module: figma/services/PaletteService.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - figma
 *     - services
 * ---
 */
import chalk from "chalk";
import { write as PaletteFile } from "../views/tailwind/PaletteFile.js";

/**
 * Service for handling color palette operations.
 */
export class PaletteService {
  /**
   * Creates an instance of PaletteService.
   * @param {Object} client - The client object containing configuration.
   */
  constructor(client) {
    this.client = client; // Doesn't do anything right now, but it's here for future use
  }

  /**
   * Process the color data from the Figma API.
   */
  parseColorsToPalette(colors) {
    console.log(chalk.cyan("\n\tprocessing the color palette...\n"));
    if (!colors || !Array.isArray(colors)) {
      throw new Error(
        "PaletteService.parseColors: colors must be a valid array",
      );
    }
    // Sort colors by className so the output looks all nice and pretty-like
    colors.sort((a, b) => a.className.localeCompare(b.className));
    return colors.reduce((acc, color) => {
      // color.log(); // display the color swatch and class name in the terminal
      acc[color.family] = acc[color.family] || {};
      acc[color.family][color.variant] = color.hex;
      return acc;
    }, {});
  }

  /**
   * Writes the color palette to a file.
   * @param {Array} colors - Array of color objects to be written.
   * @param {Object} [metadata={}] - Optional metadata for the palette.
   * @throws Will throw an error if colors is not a valid array.
   */
  async write(colors, metadata = {}) {
    const documentMeta = {
      name: metadata.name || "Untitled",
      lastModified: metadata.lastModified || new Date().toISOString(),
      fileId: this.client.FILE_ID || "Unknown",
      version: metadata.version || "1.0.0",
    };

    const palette = this.parseColorsToPalette(colors);

    return PaletteFile(documentMeta, colors);
  }
}
