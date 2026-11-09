import chalk from "chalk";
import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { projectRoot } from "../lib/paths.js";
import { extractComponentColours } from "../../figma/services/ComponentService.js";
import { extractPalette } from "../../figma/services/PaletteService.js";
import {
  ACTIONS,
  applyColours,
} from "../../figma/views/nunjucks/VariantsMap.js";

const VIEWS = join(projectRoot, "views");

/**
 * The component set a sidecar names: `figma: "25:43"` in its frontmatter.
 *
 * @param {string} sidecar The sidecar's text.
 * @returns {?string} The node ID, or null when there's no `figma` key.
 */
export function figmaKey(sidecar) {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(sidecar);
  const key =
    frontmatter && /^figma:\s*["']?([^"'\s#]+)["']?\s*$/m.exec(frontmatter[1]);
  return key ? key[1] : null;
}

/**
 * Every template whose sidecar names a Figma component set:
 * `views/atoms/button.md` ↔ `views/atoms/button.njk`.
 *
 * @param {string} [viewsDir]
 * @returns {Promise<Array<{ template: string, sidecar: string, nodeId: string }>>}
 *   Paths relative to `viewsDir`, sorted.
 */
export async function findMappedTemplates(viewsDir = VIEWS) {
  const files = (await readdir(viewsDir, { recursive: true }))
    .filter((file) => file.endsWith(".md"))
    .sort();
  const found = [];
  for (const sidecar of files) {
    const nodeId = figmaKey(await readFile(join(viewsDir, sidecar), "utf8"));
    if (!nodeId) continue;
    const template = sidecar.replace(/\.md$/, ".njk");
    if (!existsSync(join(viewsDir, template))) {
      throw new Error(
        `views/${sidecar} names Figma node ${nodeId}, but views/${template} doesn't exist.`,
      );
    }
    found.push({ template, sidecar, nodeId });
  }
  return found;
}

/**
 * `--check`'s exit code. 1 when the sync would write (drift) or met an
 * unknown variable; 0 otherwise. `needs a hand` rows don't fail the check: the
 * spec says any row that isn't `unchanged` should, but Submit's arrow and the
 * Icon glyph are reported on every run, so that check could never pass.
 *
 * @param {Array<{ action: string }>} rows
 * @returns {0 | 1}
 */
export function checkStatus(rows) {
  return rows.some(
    ({ action }) => action === ACTIONS.written || action === ACTIONS.unknown,
  )
    ? 1
    : 0;
}

/** `views/atoms/button.njk`, `atoms/button.njk` and `atoms/button` all name one template. */
export function normaliseComponent(path) {
  const bare = path.replace(/^\.?\/?(views\/)?/, "");
  return bare.endsWith(".njk") ? bare : `${bare}.njk`;
}

const PAINT = {
  [ACTIONS.written]: chalk.green,
  [ACTIONS.unchanged]: chalk.gray,
  [ACTIONS.hand]: chalk.yellow,
  [ACTIONS.unknown]: chalk.red,
};

/** One table per component: slot · Figma · template · action, then the reason. */
function printReport(template, rows, { check }) {
  console.log(chalk.cyan.bold(`\n  views/${template}`));
  console.log(chalk.gray("─".repeat(50)));
  const cells = rows.map((row) => [
    [row.variant, row.state, row.property].filter(Boolean).join(" "),
    row.figma ?? "—",
    row.template ?? "—",
    check && row.action === ACTIONS.written ? "would write" : row.action,
  ]);
  const header = ["slot", "Figma", "template", "action"];
  const widths = header.map((title, i) =>
    Math.max(title.length, ...cells.map((cell) => cell[i].length)),
  );
  const line = (cell) =>
    cell.map((text, i) => text.padEnd(widths[i])).join("  ");
  console.log(chalk.gray(`  ${line(header).trimEnd()}`));
  rows.forEach((row, i) => {
    const note = row.note ? chalk.gray(`  ${row.note}`) : "";
    console.log(
      `  ${PAINT[row.action](row.note ? line(cells[i]) : line(cells[i]).trimEnd())}${note}`,
    );
  });

  const count = (action) => rows.filter((row) => row.action === action).length;
  const summary = [
    `${count(ACTIONS.written)} ${check ? "to write" : "written"}`,
    `${count(ACTIONS.unchanged)} unchanged`,
    `${count(ACTIONS.hand)} need a hand`,
    `${count(ACTIONS.unknown)} unknown`,
  ].join(" · ");
  console.log(chalk.gray(`\n  ${summary}`));
}

/**
 * `npm run sync:components [-- --check] [-- --component atoms/button.njk]`
 *
 * @param {string[]} [argv]
 * @returns {Promise<0 | 1>} The exit code.
 */
export default async function syncComponents(argv = process.argv.slice(2)) {
  const { values } = parseArgs({
    args: argv,
    options: {
      check: { type: "boolean", default: false },
      component: { type: "string" },
    },
  });
  const { check } = values;

  console.log(chalk.cyan.bold("\nFIGMA COMPONENTS"));
  console.log(chalk.gray("─".repeat(50)));
  if (check) console.log(chalk.gray("  --check: nothing is written"));

  let targets = await findMappedTemplates();
  if (values.component) {
    const wanted = normaliseComponent(values.component);
    targets = targets.filter(({ template }) => template === wanted);
    if (!targets.length) {
      throw new Error(
        `views/${wanted} has no sidecar with a figma key, so it isn't mapped.`,
      );
    }
  }
  if (!targets.length) {
    console.log("  No sidecar under views/ has a figma key. Nothing to sync.");
    return 0;
  }

  // Imported here so the pure exports above load without a Figma token.
  const { componentService } = await import("../../figma/index.js");
  const variables = await componentService.fetchVariables();
  const palette = new Set([
    ...extractPalette(variables).map(({ name }) => name),
    "white",
    "black",
  ]);

  let status = 0;
  for (const { template, nodeId } of targets) {
    const set = await componentService.fetchComponentSet(nodeId);
    const { colours, notes } = extractComponentColours(set, variables);
    const file = join(VIEWS, template);
    const text = await readFile(file, "utf8");
    const result = applyColours(text, colours, { notes, palette });
    printReport(template, result.rows, { check });

    if (check) {
      status = Math.max(status, checkStatus(result.rows));
    } else if (result.text !== text) {
      await writeFile(file, result.text, "utf8");
      console.log(chalk.gray(`  ↳ wrote views/${template}`));
    }
  }

  if (check) {
    console.log(
      status
        ? chalk.red(
            "\n  ✗ Out of step with Figma. Run npm run sync:components.",
          )
        : chalk.green("\n  ✓ In step with Figma."),
    );
  }
  return status;
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncComponents()
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error) => {
      console.error(chalk.red("\t✗ Component sync failed:"), error.message);
      process.exitCode = 1;
    });
}
