/** @format */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import EleventyFetch from "@11ty/eleventy-fetch";

// Where localAsset writes inside the output directory, and the URL path it
// returns. Kept outside /assets/, which is a passthrough copy of the source.
const LOCAL_ASSET_DIR = "cms";

const svgMarkupCache = new Map();

export default function (eleventyConfig) {
  eleventyConfig.addFilter("filesize", fileSizeFilter);
  eleventyConfig.addFilter("uniqueTypes", uniqueTypesFilter);
  eleventyConfig.addFilter("countByType", countByTypeFilter);
  eleventyConfig.addFilter("totalSize", totalSizeFilter);
  eleventyConfig.addFilter("lastCacheUpdate", lastCacheUpdateFilter);
  eleventyConfig.addAsyncFilter(
    "inlineSvgFromUrl",
    async function (url, className = "") {
      try {
        if (!url || typeof url !== "string") {
          return "";
        }

        let svgMarkup = svgMarkupCache.get(url);
        if (!svgMarkup) {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch SVG: ${response.status} ${response.statusText}`,
            );
          }

          svgMarkup = await response.text();
          svgMarkupCache.set(url, svgMarkup);
        }

        return injectSvgClass(svgMarkup, className);
      } catch (error) {
        console.warn(`inlineSvgFromUrl failed for ${url}: ${error.message}`);
        return "";
      }
    },
  );

  // Copies a remote file into the build and returns its site-relative URL.
  // For assets the browser fetches in CORS mode (CSS mask images): the Sanity
  // CDN only answers the project's listed CORS origins, so a mask loaded from
  // any other host (a LAN address, www) is blocked and hides the element.
  // On failure it returns the remote URL, which is the behaviour without it.
  eleventyConfig.addAsyncFilter("localAsset", async function (url) {
    if (!url || typeof url !== "string") {
      return "";
    }

    try {
      const fileName = path.basename(new URL(url).pathname);
      const buffer = await EleventyFetch(url, {
        duration: "30d",
        type: "buffer",
      });
      const outputDir = path.join(
        eleventyConfig.directories?.output || "_site",
        LOCAL_ASSET_DIR,
      );
      await mkdir(outputDir, { recursive: true });
      await writeFile(path.join(outputDir, fileName), buffer);
      return `/${LOCAL_ASSET_DIR}/${fileName}`;
    } catch (error) {
      console.warn(`localAsset failed for ${url}: ${error.message}`);
      return url;
    }
  });
}

function mergeClasses(existing = "", additional = "") {
  const tokens = `${existing} ${additional}`
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
  return [...new Set(tokens)].join(" ");
}

function injectSvgClass(svgMarkup, className) {
  if (!svgMarkup || typeof svgMarkup !== "string") {
    return "";
  }

  return svgMarkup.replace(/<svg\b([^>]*)>/i, (match, attributes) => {
    // Strip intrinsic width/height attributes so CSS sizing wins consistently
    // across browsers (Safari otherwise uses the SVG's intrinsic dimensions
    // when it's nested inside inline-flex / flex containers, which can hide
    // the rendered SVG behind ancestor `overflow-hidden`).
    let normalizedAttributes = attributes.replace(
      /\s(width|height)=(['"])[^'"]*\2/gi,
      "",
    );

    const classMatch = normalizedAttributes.match(/\sclass=(['"])(.*?)\1/i);

    if (classMatch) {
      const mergedClassName = mergeClasses(classMatch[2], className);
      normalizedAttributes = normalizedAttributes.replace(
        classMatch[0],
        ` class="${mergedClassName}"`,
      );
      return `<svg${normalizedAttributes}>`;
    }

    return `<svg${normalizedAttributes} class="${className}">`;
  });
}

export function fileSizeFilter(bytes) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

export function uniqueTypesFilter(array) {
  // Guard clause to handle undefined/null arrays
  if (!array || !Array.isArray(array)) {
    return [];
  }

  // Now safely use reduce
  return array.reduce((unique, item) => {
    if (!unique.includes(item.type)) {
      unique.push(item.type);
    }
    return unique;
  }, []);
}

export function countByTypeFilter(files, type) {
  return files.filter((file) => file.type === type).length;
}

export function totalSizeFilter(files) {
  return files.reduce((total, file) => total + (file.size || 0), 0);
}

export function lastCacheUpdateFilter(files) {
  const timestamps = files.map((file) => file.cacheDate).filter(Boolean);
  return timestamps.length
    ? new Date(Math.max(...timestamps)).toLocaleString()
    : "Not cached";
}
