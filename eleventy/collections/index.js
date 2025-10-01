/** @format */
import chalk from "chalk";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { init as initNavigation } from "./navigation.js";
import { init as initAirtable } from "./content.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const site = JSON.parse(
  readFileSync(join(__dirname, "../../njk/_data/site.json"), "utf8")
);

export default async function (eleventyConfig) {
  try {
    // Airtable data
    await initAirtable(eleventyConfig, site);

    // Build menu from pages
    await initNavigation(eleventyConfig, site);
  } catch (error) {
    console.error(chalk.red("💥 Error loading data:"), error);
  }
}
