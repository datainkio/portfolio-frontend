/**
 * ---
 * aix:
 *   id: frontend.figma.views.tailwind.palettefile
 *   role: Figma tooling module: figma/views/tailwind/PaletteFile.js
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
// [ ] CHORE: Update for Tailwind v4
const __dirname = dirname(fileURLToPath(import.meta.url));
const FILEPATH = join(__dirname, "../../../styles/colors.css");
const DESCRIPTION =
  "Color palette generated from Figma data and formatted for Tailwind CSS";

export async function write(documentMeta, colors) {
  // Write the file to the file system
  try {
    // Ensure directory exists
    await mkdir(dirname(FILEPATH), { recursive: true });

    // Write file using the content string defined above
    await writeFile(FILEPATH, content(documentMeta, colors), "utf8");

    // Display success message
    console.log(chalk.cyan("\n\t✨ Palette file written successfully"));
    console.log(chalk.gray(`\t└── ${FILEPATH}`));

    // Display the palette
    // console.log(palette)
  } catch (error) {
    // Display error message
    console.error(chalk.red("\t✗ Error writing palette:"), error);
    throw error;
  }

  function content(documentMeta, colors) {
    return `/** @format */
/**
 * @fileoverview ${DESCRIPTION}
 * @source ${documentMeta.name}
 * @version ${documentMeta.version}
 * @figma
 *   File ID: ${documentMeta.fileId}
 *   Last Modified: ${new Date(documentMeta.lastModified).toLocaleString()}
 * @generated ${new Date().toLocaleString()}
 */

@theme {
    ${colors.map((color) => `--color-${color.className}: ${color.hex}`).join(";\n\t")};
    }`;
  }
}
