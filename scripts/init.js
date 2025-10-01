import chalk from "chalk";
import displayEnvironmentInfo from "./displayEnvironmentInfo.js";
import fetchDesignSystem from "./fetchFigma.js";
import displayTailwindInfo from "./displayTailwindInfo.js";
import { initializeTailwind } from "./initTailwind.js";
import display11tyInfo from "./display11tyInfo.js";
import initialize11ty from "./init11ty.js";

export async function initialize() {
  try {
    // 1. Display environment info
    await displayEnvironmentInfo();

    // 2. Fetch design system
    // await fetchDesignSystem();

    // 3. Initialize Tailwind
    // await initializeTailwind();

    // 4. Display Tailwind info
    await displayTailwindInfo();

    // 5. Initialize 11ty
    // await initialize11ty();

    // 6. Display 11ty info
    await display11tyInfo();
  } catch (error) {
    console.error(chalk.red(`Initialization error: ${error.message}`));
    process.exit(1);
  }
}

initialize();
