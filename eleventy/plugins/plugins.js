/** @format */

import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import htmlmin from "html-minifier";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  minify(eleventyConfig);

  // It's important that UpgradeHelper is added last.
  // eleventyConfig.addPlugin(UpgradeHelper);
}

function minify(eleventyConfig) {
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });
}
