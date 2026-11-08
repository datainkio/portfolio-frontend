import chalk from "chalk";
import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import { FigmaClient } from "../../figma/api/FigmaClient.js";
import { VariablesService } from "../../figma/services/VariablesService.js";

/**
 * Exports the design-system library's variables to
 * figma/exports/variables.local.json. Reads FIGMA_LIBRARY_FILE_ID, not
 * FIGMA_FILE_ID, so build:design keeps reading the old file.
 */
export default async function fetchFigmaVariables() {
  console.log(chalk.cyan.bold("\n🎨 FIGMA VARIABLES"));
  console.log(chalk.gray("─".repeat(50)));

  // FigmaClient's import has already loaded .env.
  const fileId = process.env.FIGMA_LIBRARY_FILE_ID;
  if (!fileId) {
    throw new Error(
      "Missing FIGMA_LIBRARY_FILE_ID: the key of the design-system library file (see .env.example).",
    );
  }
  const service = new VariablesService(new FigmaClient({ fileId }));
  const { outFile, variables, collections } = await service.write();
  console.log(
    chalk.green(
      `\t✓ ${variables} variables in ${collections} collections → ${relative(process.cwd(), outFile)}`,
    ),
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fetchFigmaVariables().catch((error) => {
    console.error(chalk.red(`\t✗ ${error.message}`));
    process.exit(1);
  });
}
