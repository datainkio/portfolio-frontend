/**
 * ---
 * aix:
 *   id: frontend.figma.services.typographyservice
 *   role: Figma tooling module: figma/services/TypographyService.js
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
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { write as writeFontImports } from "../views/tailwind/FontImportsFile.js";
import { write as writeFontFamilies } from "../views/tailwind/FontFamilyFile.js";
import { write as writeFontWeights } from "../views/tailwind/FontWeightFile.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @class TypographyService
 * @description Manages typography tokens in the design system by generating font family definitions and Google Fonts imports.
 *
 * Responsibilities:
 * - Processes typography styles from Figma
 * - Outputs individual css files for font family definitions, font imports, and font weights
 * - Logs typography data for troubleshooting
 *
 */
export class TypographyService {
  constructor(client) {
    this.client = client;
  }

  async updateFontImports(textFormats, designFile) {
    console.log(chalk.cyan("\n\tprocessing font imports..."));
    // this.log(textFormats, designFile);
    writeFontImports(textFormats, designFile);
  }

  async updateFontFamilies(textFormats, designFile) {
    console.log(chalk.cyan("\n\tprocessing font families..."));
    // this.log(textFormats, designFile);
    writeFontFamilies(textFormats, designFile);
  }

  async updateFontWeights(textFormats, designFile) {
    console.log(chalk.cyan("\n\tprocessing font weights..."));
    writeFontWeights(
      textFormats.filter((format) => format.property === "fontWeight"),
      designFile
    );
  }

  writeLineHeights() {}

  // Log typography data for troubleshooting
  log(textFormats, designFile) {
    console.log(textFormats);

    // LOG COUNTS
    // Group all of the different text styles returned by Figma according to font family name.
    const formatsByFamily = textFormats.reduce((acc, format) => {
      if (!acc[format.fontFamily]) {
        acc[format.fontFamily] = [];
      }
      acc[format.fontFamily].push(format);
      return acc;
    }, {});

    // Log the count of individual text formats returned by Figma
    console.log(
      chalk.gray(`\t↳ ${textFormats.length} individual text formats found`)
    );

    // Log the count of individual font families
    console.log(
      chalk.gray(`\t↳ ${Object.keys(formatsByFamily).length} font families`)
    );

    // LOG WEIGHTS
    // For each font family, log its name and any weight values for that family
    Object.entries(formatsByFamily).forEach(([family, formats]) => {
      const weights = [...new Set(formats.map((f) => f.fontWeight))].sort(
        (a, b) => a - b
      );
      console.log(
        chalk.cyan(`\t  ${family}: `) + chalk.gray(`${weights.join(",")}`)
      );
    });
  }
}
