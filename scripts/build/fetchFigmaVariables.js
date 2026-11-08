import chalk from "chalk";
import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import { FigmaClient } from "../../figma/api/FigmaClient.js";
import { VariablesService } from "../../figma/services/VariablesService.js";

/**
 * Exports the design-system library's variables to
 * figma/exports/variables.local.json without touching styles/.
 * `npm run build:design` writes the same export as part of a full sync.
 */
export default async function fetchFigmaVariables() {
  console.log(chalk.cyan.bold("\n🎨 FIGMA VARIABLES"));
  console.log(chalk.gray("─".repeat(50)));

  const service = new VariablesService(new FigmaClient());
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
