import chalk from "chalk";
import { write as writePaletteFile } from "../views/tailwind/PaletteFile.js";

/** Tailwind ships white and black itself, so colors.css leaves them out. */
const isBuiltIn = (variable) => variable.name.startsWith("base/");

const hex = ({ r, g, b, a = 1 }) =>
  `#${(a < 1 ? [r, g, b, a] : [r, g, b])
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;

/**
 * Reads the palette from the design-system library's colour variables:
 * `accent/500` becomes `{ name: "accent-500", hex: "#fbc30b" }`.
 *
 * @param {Object} variables `meta.variables` from VariablesService's extractVariables.
 * @returns {Array<{ name: string, hex: string }>} Sorted by name.
 */
export function extractPalette(variables) {
  return Object.values(variables)
    .filter((v) => v.resolvedType === "COLOR" && !isBuiltIn(v))
    .map((v) => ({
      name: v.name.replaceAll("/", "-"),
      hex: hex(Object.values(v.valuesByMode)[0]),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Writes styles/colors.css from the design-system library. */
export class PaletteService {
  /**
   * @param {Object} variables `meta.variables` from extractVariables.
   * @param {{ source: string }} meta Written to the file's header.
   * @returns {Promise<Array>} The palette written.
   */
  async write(variables, { source }) {
    console.log(chalk.cyan("\n\tprocessing the color palette..."));
    const palette = extractPalette(variables);
    if (!palette.length) {
      throw new Error(
        "The Figma library has no colour variables. styles/colors.css was not changed.",
      );
    }
    await writePaletteFile(palette, { source });
    return palette;
  }
}
