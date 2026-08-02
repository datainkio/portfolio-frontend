/**
 * ---
 * aix:
 *   id: frontend.figma.views.eleventy.fontimportsfile
 *   role: Figma tooling module: figma/views/eleventy/FontImportsFile.js
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
// DEPRECATED AND REPLACE WITH IMPORTING FONTS DIRECTLY INTO CSS
import chalk from "chalk";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILEPATH = join(__dirname, "../../../njk/_includes/molecules/fonts.njk");
const DESCRIPTION =
  "Font import declarations generated from Figma data and formatted to HTML";
const VALID_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export async function write(textFormats, designFile) {
  // Write the file to the file system
  try {
    // Ensure directory exists
    await mkdir(dirname(FILEPATH), { recursive: true });

    // Write file using the content string defined above
    await writeFile(FILEPATH, content(textFormats, designFile), "utf8");

    // Display success message
    console.log(chalk.cyan("\n\t✨ Font imports file written successfully"));
    console.log(chalk.gray(`\t└── ${FILEPATH}`));

    // Display the palette
    // console.log(palette)
  } catch (error) {
    // Display error message
    console.error(chalk.red("\t✗ Error writing font family imports:"), error);
    throw error;
  }

  function content(textFormats, designFile) {
    let result = buildFileHeader(designFile);

    const fontGroups = textFormats.reduce((acc, format) => {
      if (!acc[format.fontFamily]) {
        acc[format.fontFamily] = new Set();
      }
      acc[format.fontFamily].add(format.fontWeight);
      return acc;
    }, {});

    // Create the Google Fonts import links
    Object.entries(fontGroups).forEach(([fontFamily, weights]) => {
      const weightParams = generateWeightParams(weights, fontFamily);
      result += generateFontLink(fontFamily, weightParams);
    });
    return result;
  }

  function validateFontWeight(weight, fontFamily) {
    if (!VALID_WEIGHTS.includes(weight)) {
      console.log(
        chalk.yellow(
          `\n\t⚠️  Heads-up: Font "${fontFamily}" - weight ${weight} not available`
        )
      );
      return false;
    }
    return true;
  }

  function buildFileHeader(designFile) {
    return `{# @format #}
{# 
 # @fileoverview ${DESCRIPTION}
 # @source ${designFile.name}
 # @version ${designFile.version}
 # @figma
 #   File ID: ${designFile.fileId}
 #   Last Modified: ${new Date(designFile.lastModified).toLocaleString()}
 # @generated ${new Date().toLocaleString()}
 #}

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
`;
  }

  function createUrlSafeFontFamily(fontFamily) {
    return encodeURIComponent(fontFamily).replace(/%20/g, "+");
  }

  function generateWeightParams(weights, fontFamily) {
    return Array.from(weights)
      .sort((a, b) => a - b)
      .filter((weight) => validateFontWeight(weight, fontFamily))
      .flatMap((weight) => [
        [0, weight],
        [1, weight],
      ])
      .sort((a, b) => a[0] - b[0])
      .join(";");
  }

  function generateFontLink(fontFamily, weightParams) {
    const urlFontFamily = createUrlSafeFontFamily(fontFamily);
    const weights = weightParams;
    return `<link
  href="https://fonts.googleapis.com/css2?family=${urlFontFamily}:ital,wght@${weights}&display=swap"
  rel="stylesheet"
/>\n`;
  }
}
