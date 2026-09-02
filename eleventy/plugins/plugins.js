/** @format */

import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import { minify } from "html-minifier-terser";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  registerHtmlMinifier(eleventyConfig);

  // It's important that UpgradeHelper is added last.
  // eleventyConfig.addPlugin(UpgradeHelper);
}

function registerHtmlMinifier(eleventyConfig) {
  eleventyConfig.addTransform("htmlmin", async function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      return await minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  });
}
