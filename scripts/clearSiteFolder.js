/** @format */

import { rm } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

const siteFolder = join(process.cwd(), "_site");

async function clearSiteFolder() {
  if (existsSync(siteFolder)) {
    try {
      await rm(siteFolder, { recursive: true, force: true });
      console.log("_site folder cleared.");
    } catch (err) {
      console.error(`Error clearing _site folder: ${err.message}`);
    }
  } else {
    console.log("_site folder does not exist, skipping cleanup.");
  }
}

clearSiteFolder();
