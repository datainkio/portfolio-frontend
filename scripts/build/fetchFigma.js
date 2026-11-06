import chalk from "chalk";
import { fileURLToPath } from "url";
import logger from "@datainkio/lumberjack";
import {
  fileService,
  styleService,
  paletteService,
  tokenService,
} from "../../figma/index.js";
import { buildCSS } from "./buildCSS.js";

logger.enabled = true;

async function fetchDesignSystem() {
  // INIT MESSAGE
  console.log(chalk.cyan.bold("\n🎨 FIGMA"));
  console.log(chalk.gray("─".repeat(50)));
  logger.trace(
    "Starting Figma design sync:",
    "Fetching design file...",
    "brief",
    "headsup",
  );

  // Show script execution outline
  const figmaWorkflow = [
    {
      name: "fetch-design-file",
      description: "Download design file data from Figma API",
      script: "figma/services/FileService.js",
    },
    {
      name: "extract-styles",
      description: "Extract color and typography style definitions",
      script: "figma/services/StyleService.js",
    },
    {
      name: "process-colors",
      description: "Generate CSS custom properties from color tokens",
      script: "figma/services/PaletteService.js",
      triggers: ["styles/colors.css update"],
    },
    {
      name: "process-tokens",
      description: "Generate tokens from the Figma Tokens page and text styles",
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
      // GET DESIGN FILE DATA FROM FIGMA
      const designFile = await fileService.getDocument();
      logger.trace(
        "Design file loaded:",
        { name: designFile.name, version: designFile.version },
        "verbose",
        "standard",
      );

      // LOG DESIGN FILE DATA
      designFile.log();

      // GET STYLE DATA FROM FIGMA
      const styles = await styleService.getStyles(designFile.styleIDs);
      logger.trace(
        "Styles retrieved:",
        {
          colors: styles.colors?.length,
          textFormats: styles.textFormats?.length,
        },
        "brief",
        "standard",
      );

      await logger.group(async () => {
        // UPDATE THE LOCAL BASE STYLES FILE
        // styles.colors
        // styles.textFormats
        // console.log(styles.colors);

        const palette = await paletteService.write(styles.colors, designFile);
        logger.trace(
          "Palette written:",
          "Color styles synced",
          "brief",
          "success",
        );

        // Fonts are deliberately not synced. styles/typography/ is maintained by
        // hand: it self-hosts the body and display faces for load performance.
        // See docs/design-system/adr-0001-figma-owns-design-tokens.md.
        await tokenService.write(designFile, styles.textFormats);
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
      return; //; { document: designFile, styles };
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
