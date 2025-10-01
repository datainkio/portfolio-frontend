/** @format */

import { statSync, readdirSync, writeFileSync } from "fs";
import { basename, join, resolve } from "path";

/**
 * Recursively traverses a directory and builds a structure object.
 * @param {string} dir - Directory path to traverse.
 * @param {Array<string>} ignorePatterns - List of file or directory names to ignore.
 * @returns {object|null} - Directory structure or null if ignored.
 */
function getDirectoryStructure(dir, ignorePatterns = []) {
  const name = basename(dir);

  // Check if the current item matches any ignore pattern
  if (ignorePatterns.includes(name)) {
    return null;
  }

  const stats = statSync(dir);

  if (stats.isDirectory()) {
    const children = readdirSync(dir)
      .map((child) => getDirectoryStructure(join(dir, child), ignorePatterns))
      .filter(Boolean); // Remove null values (ignored items)

    return {
      name,
      type: "directory",
      children
    };
  } else if (stats.isFile()) {
    return {
      name,
      type: "file"
    };
  }

  return null;
}

/**
 * Logs the directory structure to a JSON file.
 * @param {string} startPath - Root path of the directory to log.
 * @param {string} outputFile - Path of the JSON file to write.
 * @param {Array<string>} ignorePatterns - List of file or directory names to ignore.
 */
function logDirectoryStructure(startPath, outputFile, ignorePatterns = []) {
  try {
    const structure = getDirectoryStructure(startPath, ignorePatterns);
    writeFileSync(outputFile, JSON.stringify(structure, null, 2));
    console.log(`Directory structure logged to ${outputFile}`);
  } catch (error) {
    console.error("Error logging directory structure:", error);
  }
}

// Replace 'YOUR_DIRECTORY_PATH' with the path to your 11ty site
const startPath = resolve(""); // Update this to your directory path
const outputFile = resolve("logs/structure.json"); // Update this to your desired output file name

// Specify files or directories to ignore
const ignorePatterns = ["node_modules", ".git", ".DS_Store", "structure.json"];

// Log the directory structure
logDirectoryStructure(startPath, outputFile, ignorePatterns);
