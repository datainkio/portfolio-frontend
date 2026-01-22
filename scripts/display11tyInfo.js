/**
 * ---
 * aix:
 *   id: frontend.scripts.display11tyinfo
 *   role: Build/utility script: scripts/display11tyInfo.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - scripts
 *     - display11tyInfo.js
 * ---
 */
import chalk from "chalk";
import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

async function getEleventyVersion() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const packagePath = join(__dirname, "..", "package.json");
    const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
    return packageJson.devDependencies["@11ty/eleventy"].replace("^", "");
  } catch (error) {
    throw new Error(`Failed to get 11ty version: ${error.message}`);
  }
}

async function display11tyInfo() {
  const version = await getEleventyVersion();

  console.log(chalk.magenta.bold("\n🚀 11ty"));
  console.log(chalk.gray("─".repeat(50)));

  console.log(chalk.magenta("\tVersions"));
  console.log(`\t Eleventy: ${chalk.white(version)}`);
  console.log(`\t Node: ${chalk.white(process.version)}`);

  // Config info
  console.log(chalk.magenta("\n\tConfiguration"));
  console.log(`\t Input: ${chalk.white("njk")}`);
  console.log(`\t Output: ${chalk.white("_site")}`);
  console.log(`\t Includes: ${chalk.white("_includes")}`);
  console.log(`\t Data: ${chalk.white("_data")}`);

  // Template engines
  console.log(chalk.magenta("\n\tTemplate Engines"));
  console.log(`\t Markdown: ${chalk.white("njk")}`);
  console.log(`\t HTML: ${chalk.white("njk")}`);
  console.log(`\t Data: ${chalk.white("njk")}`);

  console.log("\n\n");
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  display11tyInfo().catch((error) => {
    console.error(chalk.red(error.message));
    process.exit(1);
  });
}

export default display11tyInfo;
