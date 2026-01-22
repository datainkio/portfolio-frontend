/**
 * ---
 * aix:
 *   id: frontend.figma.views.tailwind.basestylesfile
 *   role: Figma tooling module: figma/views/tailwind/BaseStylesFile.js
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
// TODO: Update for Tailwind v4
const __dirname = dirname(fileURLToPath(import.meta.url));
const FILEPATH = join(__dirname, "../../../tailwind/baseStyles.js");
const DESCRIPTION =
  "Styles for foundational HTML elements generated from Figma data and formatted for Tailwind CSS";

export async function write(textFormats, designFile) {
  // Write the file to the file system
  try {
    // Ensure directory exists
    await mkdir(dirname(FILEPATH), { recursive: true });

    // Write file using the content string defined above
    await writeFile(FILEPATH, content(textFormats, designFile), "utf8");

    // Display success message
    // console.log(chalk.cyan('\n\t✨ Font Family file written successfully'));
    // console.log(chalk.gray(`\t└── ${FILEPATH}`));

    // Display the palette
    // console.log(palette)
  } catch (error) {
    // Display error message
    console.error(chalk.red("\t✗ Error writing base styles file:"), error);
    throw error;
  }

  function content(textFormats, designFile) {
    // Generate the content for BaseStylesFile.js
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

export function baseStyles({ addBase, theme }) {
  addBase({
      'h3': {
      fontSize: theme('fontSize.2xl'),
      fontWeight: theme('fontWeight.medium'),
      lineHeight: theme('lineHeight.snug'),
      marginBottom: theme('spacing.3')
    }
  })
}

export const fontFamily = {
  ${textFormats
    .map((format) => `${format.className}: ["${format.fontFamily}"]`)
    .join(",\n  ")}
};
`;
  }
}
