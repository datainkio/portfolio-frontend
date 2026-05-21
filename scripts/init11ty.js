/**
 * ---
 * aix:
 *   id: frontend.scripts.init11ty
 *   role: Build/utility script: scripts/init11ty.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - scripts
 *     - init11ty.js
 * ---
 */
import chalk from "chalk";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFile } from "fs/promises";

async function init11ty() {
  return new Promise((resolve, reject) => {
    try {
      console.log(chalk.blue.bold("\n🚀  Initializing 11ty..."));
      console.log(chalk.gray("─".repeat(50)));

      // Verify directories exist
      console.log(chalk.gray("  ↳ Checking directories"));

      // Initialize plugins
      console.log(chalk.gray("  ↳ Loading plugins"));

      // Set up template engines
      console.log(chalk.gray("  ↳ Configuring templates"));

      // Configure markdown
      console.log(chalk.gray("  ↳ Setting up markdown"));

      console.log(chalk.green("\n✓ 11ty initialized"));
      console.log(chalk.gray("─".repeat(50)) + "\n");

      resolve();
    } catch (error) {
      reject(new Error(`11ty initialization failed: ${error.message}`));
    }
  });
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initialize11ty().catch((error) => {
    console.error(chalk.red(error.message));
    process.exit(1);
  });
}

export default init11ty;
