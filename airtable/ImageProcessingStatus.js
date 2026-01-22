/**
 * ---
 * aix:
 *   id: frontend.airtable.imageprocessingstatus
 *   role: Airtable integration module: airtable/ImageProcessingStatus.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - airtable
 *     - ImageProcessingStatus.js
 * ---
 */
/** @format */

import cliProgress from "cli-progress";
import colors from "ansi-colors";

export class ImageProcessingStatus {
  constructor() {
    this.total = 0;
    this.processed = 0;
    this.typeCount = new Map();
    this.progressBar = new cliProgress.SingleBar({
      format:
        "🖼️   Processing Images |" +
        colors.cyan("{bar}") +
        "| {percentage}% | {value}/{total} Images | {type}",
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591"
    });
  }

  initialize(total) {
    this.total = total;
    this.progressBar.start(total, 0);
  }

  updateProgress(type) {
    this.processed++;
    this.typeCount.set(type, (this.typeCount.get(type) || 0) + 1);
    this.progressBar.update(this.processed, { type });
  }

  complete() {
    this.progressBar.stop();
    // console.log("\nImage Processing Complete:");
    for (const [type, count] of this.typeCount) {
      console.log(`${type}: ${count} files`);
    }
  }
}
