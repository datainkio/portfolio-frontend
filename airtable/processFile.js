/** @format */

import { promises as fs } from "fs";
import path from "path";
import * as EleventyImg from "@11ty/eleventy-img";
import { AssetCache } from "@11ty/eleventy-fetch";
import { ImageProcessingStatus } from "./ImageProcessingStatus.js";
import chalk from "chalk";

const status = new ImageProcessingStatus();
let isInitialized = false;

export async function processFile(file, total, cache_dur) {
  if (!isInitialized && total) {
    status.initialize(total);
    isInitialized = true;
  }

  try {
    const assetCache = new AssetCache(`image-${file.filename}`);
    const outputBase = "_site/" + process.env.IMAGE_PATH;

    // console.log(chalk.blue(`\nProcessing: ${file.filename}`));
    // console.log(chalk.gray(`Output: ${outputBase}`));

    if (assetCache.isCacheValid(cache_dur)) {
      status.updateProgress(file.type);
      // console.log(chalk.green(`Cache hit: ${file.filename}`));
      return assetCache.getCachedValue();
    }

    // Define directories to create
    const directories = [
      outputBase,
      path.join(outputBase, "svg"),
      path.join(outputBase, "webp"),
      path.join(outputBase, "jpeg")
    ];

    // Create and verify each directory
    for (const dir of directories) {
      try {
        await fs.mkdir(dir, { recursive: true });
        const stats = await fs.stat(dir);
        if (stats.isDirectory()) {
          // console.log(chalk.green(`✓ Directory exists: ${dir}`));
        }
      } catch (error) {
        console.error(chalk.red(`Failed to create directory: ${dir}`), error);
        throw error;
      }
    }

    if (file.type === "image/svg+xml") {
      const svgPath = path.join(outputBase, "svg", file.filename);
      const response = await fetch(file.url);
      if (!response.ok)
        throw new Error(`Failed to fetch SVG: ${response.status}`);

      const svgContent = await response.text();
      await fs.writeFile(svgPath, svgContent);

      // Verify write
      await fs.access(svgPath);
      // console.log(chalk.green(`✓ Saved SVG: ${svgPath}`));

      const metadata = await EleventyImg.default(file.url, {
        formats: ["svg"],
        svgShortCircuit: true,
        outputDir: path.join(outputBase, "svg"),
        urlPath: process.env.IMAGE_PATH + "/svg"
      });

      const result = {
        ...metadata,
        originalFilename: file.filename,
        html: EleventyImg.generateHTML(metadata, {
          alt: file.filename,
          loading: "lazy",
          decoding: "async"
        })
      };

      await assetCache.save(result, "json");
      status.updateProgress(file.type);
      return result;
    }
    // console.log(file);
    // Non-SVG image processing
    const metadata = await EleventyImg.default(file.url, {
      widths: [400, 800, 1200],
      formats: ["webp", "jpeg"],
      outputDir: outputBase,
      urlPath: process.env.IMAGE_PATH
    });

    // Verify files were written
    for (const format in metadata) {
      for (const item of metadata[format]) {
        const exists = await fs
          .access(item.outputPath)
          .then(() => true)
          .catch(() => false);
        // console.log(`${item.outputPath}: ${exists ? "✓" : "✗"}`);
      }
    }

    const result = {
      ...metadata,
      originalFilename: file.filename,
      html: EleventyImg.generateHTML(metadata, {
        alt: file.filename,
        sizes: "(min-width: 1024px) 1024px, 100vw",
        loading: "lazy",
        decoding: "async"
      })
    };

    await assetCache.save(result, "json");
    status.updateProgress(file.type);
    return result;
  } catch (error) {
    console.error(chalk.red(`💥 Error processing ${file.filename}:`), error);
    throw error;
  }
}

export function completeProcessing() {
  status.complete();
}
