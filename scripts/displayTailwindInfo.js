import chalk from "chalk";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
// import { logActivePlugins } from "./../tailwind/js/utils/logPlugins.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function displayTailwindInfo() {
  try {
    // Read package.json for Tailwind version
    const packageJson = JSON.parse(
      await readFile(join(__dirname, "../package.json"), "utf8")
    );
    const tailwindVersion = packageJson.dependencies.tailwindcss;

    // Read tailwind.config.js
    // const configPath = join(__dirname, "../tailwind.config.js");
    // const { default: tailwindConfig } = await import(configPath);

    console.log(chalk.blue.bold("\n🍃 TAILWIND"));
    console.log(chalk.gray("─".repeat(50)));

    // Version info
    console.log(
      chalk.blue("\tVersion".padEnd(25)),
      chalk.white(tailwindVersion)
    );

    // Plugins
    // logActivePlugins(tailwindConfig.plugins);

    // Content paths
    // console.log(chalk.blue("\n\tContent Paths:"));
    // tailwindConfig.content.forEach((path) => {
    //   console.log(chalk.gray("\t  └─"), chalk.white(path));
    // });

    // Theme customizations
    // console.log(chalk.blue("\n\tCustom Theme Settings:"));
    // Object.entries(tailwindConfig.theme || {}).forEach(([key, value]) => {
    //   console.log(
    //     chalk.gray("\t  └─"),
    //     chalk.white(`${key}: ${typeof value === "object" ? "Custom" : value}`)
    //   );
    // });

    console.log("\n\n");
  } catch (error) {
    throw new Error(`Failed to read Tailwind configuration: ${error.message}`);
  }
}

async function main() {
  try {
    await displayTailwindInfo();
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export default displayTailwindInfo;
