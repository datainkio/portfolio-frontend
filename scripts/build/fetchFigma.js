import chalk from "chalk";
import { relative } from "path";
import { fileURLToPath } from "url";
import logger from "@datainkio/lumberjack";
import {
  variablesService,
  paletteService,
  tokenService,
} from "../../figma/index.js";
import {
  extractVariables,
  writeExport,
} from "../../figma/services/VariablesService.js";
import { buildCSS } from "./buildCSS.js";

logger.enabled = true;

async function fetchDesignSystem() {
  // INIT MESSAGE
  console.log(chalk.cyan.bold("\n🎨 FIGMA"));
  console.log(chalk.gray("─".repeat(50)));
  logger.trace(
    "Starting Figma design sync:",
    "Fetching the design-system library...",
    "brief",
    "headsup",
  );

  // Show script execution outline
  const figmaWorkflow = [
    {
      name: "fetch-tokens-page",
      description: "Download the library's Tokens page from the Figma API",
      script: "figma/services/VariablesService.js",
    },
    {
      name: "export-variables",
      description: "Write the variables in the Enterprise API's shape",
      script: "figma/services/VariablesService.js",
      triggers: ["figma/exports/variables.local.json update"],
    },
    {
      name: "process-colors",
      description: "Generate CSS custom properties from colour variables",
      script: "figma/services/PaletteService.js",
      triggers: ["styles/colors.css update"],
    },
    {
      name: "process-tokens",
      description: "Generate tokens from numeric variables and shadow styles",
      script: "figma/services/TokenService.js",
      triggers: ["styles/tokens.css update"],
    },
    {
      name: "rebuild-css",
      description: "Compile CSS with updated design tokens",
      script: "scripts/build/buildCSS.js",
      triggers: ["_site/assets/styles.css regeneration"],
    },
  ];

  logger.showScriptOutline("Figma Design Token Sync", figmaWorkflow, "brief");

  await logger.group(async () => {
    try {
      // GET THE LIBRARY'S TOKENS PAGE FROM FIGMA
      const { file, page } = await variablesService.fetchTokensPage();
      logger.trace(
        "Design-system library loaded:",
        { name: file.name, version: file.version },
        "verbose",
        "standard",
      );

      // Throws, writing nothing, if the page has drifted from the variables.
      const meta = extractVariables(page);
      const exported = await writeExport(meta);
      console.log(
        chalk.gray(
          `\t↳ ${exported.variables} variables → ${relative(process.cwd(), exported.outFile)}`,
        ),
      );

      const source = `Figma file ${file.name}, version ${file.version}`;
      await logger.group(async () => {
        await paletteService.write(meta.variables, { source });
        logger.trace(
          "Palette written:",
          "Colour variables synced",
          "brief",
          "success",
        );

        // Fonts are deliberately not synced. styles/typography/ is maintained by
        // hand: it self-hosts the body and display faces for load performance.
        // See docs/design-system/adr-0001-figma-owns-design-tokens.md.
        await tokenService.write(meta.variables, page, { source });
      });

      logger.trace(
        "Design sync complete:",
        "All styles updated",
        "brief",
        "success",
      );

      // CRITICAL: Rebuild CSS with design token changes
      // Design tokens have been updated, now rebuild CSS to integrate changes
      console.log(chalk.cyan("\n🎯 REBUILDING CSS"));
      console.log(chalk.gray("─".repeat(50)));
      await buildCSS();

      // WE'RE DONE HERE. WRAP IT UP.
      return;
    } catch (error) {
      console.error(chalk.red("\t✗ Error fetching design file:"), error);
      logger.trace("Design sync failed:", error.message, "verbose", "error");
      process.exit(1);
    }
  });
}

export default fetchDesignSystem;

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fetchDesignSystem();
}
