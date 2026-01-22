/**
 * ---
 * aix:
 *   id: frontend.figma.views.tailwind.fontfamilyfile
 *   role: Figma tooling module: figma/views/tailwind/FontFamilyFile.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - figma
 *     - views
 * ---
 */
import chalk from "chalk";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILEPATH = join(__dirname, "../../../styles/typography/fontFamilies.css");
const DESCRIPTION =
  "Font family declarations generated from Figma data and formatted for Tailwind CSS. See figma/views/tailwind/FontFamilyFile.js";
const VALID_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export async function write(textFormats, designFile) {
  // Write the file to the file system
  try {
    // Ensure directory exists
    await mkdir(dirname(FILEPATH), { recursive: true });

    // Write file using the content string defined above
    await writeFile(FILEPATH, content(textFormats, designFile), "utf8");

    // Display success message
    console.log(chalk.cyan("\n\t✨ Font Family file written successfully"));
    console.log(chalk.gray(`\t└── ${FILEPATH}`));
  } catch (error) {
    // Display error message
    console.error(chalk.red("\t✗ Error writing font family file:"), error);
    throw error;
  }

  // Return the style declarations for the font families
  // textFormats.filter((format) => format.property === "fontFamily");
  function getStyleDeclarations(textFormats) {
    return textFormats
      .filter((format) => format.property === "fontFamily")
      .map((format) => {
        let classKey = format.className;
        if (classKey === "sans-serif") {
          classKey = "sans";
        }
        return `--font-${classKey}: ${format.fontFamily}, ${format.className};`;
      })
      .join("\n  ");
  }

  // Build the string that provides the content for the file
  function content(textFormats, designFile) {
    return `/** @format */
/**
 * @fileoverview ${DESCRIPTION}
 * @source ${designFile.name}
 * @version ${designFile.version}
 * @figma
 *   File ID: ${designFile.fileId}
 *   Last Modified: ${new Date(designFile.lastModified).toLocaleString()}
 * @generated ${new Date().toLocaleString()}
 */
@theme {
  ${getStyleDeclarations(textFormats)}
}`;
  }
}
