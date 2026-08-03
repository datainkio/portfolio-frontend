/**
 * ---
 * aix:
 *   id: frontend.scripts.diagrams.exportstoryboards
 *   role: Build/utility script: scripts/diagrams/exportStoryboards.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - scripts
 *     - diagrams
 * ---
 */
import fs from "fs/promises";
import path from "path";
import { execSync } from "child_process";
import logger from "@datainkio/lumberjack";

const INPUT_DIR = path.resolve("njk/_pages/storyboards");
const OUTPUT_DIR = path.resolve("assets/storyboards");
const TMP_DIR = path.resolve("scripts/.tmp/storyboards");

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function extractMermaidBlocks(markdown) {
  const re = /```mermaid\s*?\n([\s\S]*?)```/gim;
  const blocks = [];
  let match;
  while ((match = re.exec(markdown)) !== null) {
    blocks.push(match[1].trim());
  }
  return blocks;
}

async function writeTempMermaid(content, base, index) {
  await ensureDir(TMP_DIR);
  const filename = `${base}-${index}.mmd`;
  const filePath = path.join(TMP_DIR, filename);
  await fs.writeFile(filePath, content, "utf8");
  return filePath;
}

function runMmdc(inputPath, outputPath) {
  const cmd = `npx -y @mermaid-js/mermaid-cli -i "${inputPath}" -o "${outputPath}" -t neutral`;
  execSync(cmd, { stdio: "inherit" });
}

export async function exportStoryboards() {
  logger.trace("Storyboards", "Exporting Mermaid blocks to SVG");
  await ensureDir(OUTPUT_DIR);

  const files = await fs.readdir(INPUT_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  let total = 0;

  for (const file of mdFiles) {
    const filePath = path.join(INPUT_DIR, file);
    const base = path.basename(file, path.extname(file));
    const markdown = await fs.readFile(filePath, "utf8");
    const blocks = extractMermaidBlocks(markdown);

    if (blocks.length === 0) {
      logger.trace("Storyboards", `No diagrams in ${file}`, "brief");
      continue;
    }

    logger.trace(
      "Storyboards",
      `Found ${blocks.length} diagram(s) in ${file}`,
      "brief",
    );

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const tempPath = await writeTempMermaid(block, base, i + 1);
      const outName = `${base}-${i + 1}.svg`;
      const outPath = path.join(OUTPUT_DIR, outName);
      try {
        runMmdc(tempPath, outPath);
        logger.trace("Storyboards", `Exported ${outName}`, "brief", "success");
        total++;
      } catch (err) {
        logger.trace(
          "Storyboards",
          `Failed ${outName}: ${err.message}`,
          "brief",
          "error",
        );
      }
    }
  }

  if (total === 0) {
    logger.trace("Storyboards", "No diagrams exported", "brief", "headsup");
  } else {
    logger.trace(
      "Storyboards",
      `Export complete: ${total} SVG(s)`,
      "brief",
      "success",
    );
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  exportStoryboards().catch(() => {
    process.exitCode = 1;
  });
}
