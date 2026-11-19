/** @format */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Absolute path to the frontend repo root, wherever a script sits or runs from. */
export const projectRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
