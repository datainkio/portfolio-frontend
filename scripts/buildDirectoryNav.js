#!/usr/bin/env node
/** @format */

const fs = require("fs");
const path = require("path");

const directoryToProcess = path.join(__dirname, "../src/content"); // Target directory
const outputFile = path.join(__dirname, "../dist/collection.json"); // Output JSON file

/**
 * Recursively reads the directory structure and returns it as an object.
 * @param {string} dir - Directory path to process.
 * @returns {Array} - Array of file and folder metadata.
 */
function readDirectoryStructure(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).map((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return {
        name: entry.name,
        type: "directory",
        children: readDirectoryStructure(fullPath)
      };
    } else {
      return {
        name: entry.name,
        type: "file",
        path: fullPath
      };
    }
  });
}

/**
 * Write the directory collection to a JSON file.
 * @param {Array} collection - The directory structure to write.
 * @param {string} outputPath - The path to the output file.
 */
function writeCollectionToFile(collection, outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true }); // Ensure output directory exists
  fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), "utf-8");
  console.log(`Collection written to ${outputPath}`);
}

/**
 * Main function to process the directory and output the collection.
 */
function buildCollection() {
  try {
    console.log(`Processing directory: ${directoryToProcess}`);
    const collection = readDirectoryStructure(directoryToProcess);

    console.log(`Writing collection to: ${outputFile}`);
    writeCollectionToFile(collection, outputFile);

    console.log("Directory processing complete.");
  } catch (error) {
    console.error("Error processing directory:", error);
    process.exit(1);
  }
}

// Execute the script
buildCollection();
