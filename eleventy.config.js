/** @format */
// Silence punycode warning
process.noDeprecation = true;

import logger, { LumberjackStyle } from "@datainkio/lumberjack";

// logger.enabled = false;

import collections from "./eleventy/collections/index.js";
import plugins from "./eleventy/plugins/plugins.js";
import filters from "./eleventy/filters/filters.js";
import shortcodes from "./eleventy/shortcodes/shortcodes.js";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { ENTRIES as CSS_ENTRIES } from "./scripts/build/buildCSS.js";

const execFileAsync = promisify(execFile);

/**
 * Custom Logger Styles for 11ty Operations
 */
const titleStyle = new LumberjackStyle("#EE9B00", "🚀");
const msgStyle = new LumberjackStyle("#CA6702", "•");
const successStyle = new LumberjackStyle("#EE9B00", "\n👍");

export default async function (eleventyConfig) {
  await logger.group(async () => {
    logger.trace("11ty Initialization", null, "brief", titleStyle);
    logger.trace(
      null,
      "Initialization begins by configuring passthrough copy for static assets, including JavaScript and CSS files. It then loads and registers 11ty objects: plugins, filters, shortcodes, and collections. The collections are populated by pulling data from the CMS.\n",
      "brief",
      "standard",
    );
    // Runtime flags shared with the JS build. `bundleJs` must mirror the
    // default in scripts/build/buildChoreography.js (BUNDLE_JS env, default true) so
    // the choreography-script partial loads the minified bundle.js the bundler
    // emits — rather than the raw ESM import tree — whenever bundling is on.
    const normalizeBoolean = (value) => {
      if (value === undefined) return undefined;
      const normalized = value.toLowerCase();
      if (["1", "true", "yes", "on"].includes(normalized)) return true;
      if (["0", "false", "no", "off"].includes(normalized)) return false;
      return undefined;
    };
    const bundleJs = normalizeBoolean(process.env.BUNDLE_JS) ?? true;
    // Outlines every element (see styles/utilities/debug-outlines.css) to aid
    // building layouts/templates. Off by default; set DEBUG_OUTLINES=true in
    // .env and restart the dev server to turn on.
    const debugOutlines = normalizeBoolean(process.env.DEBUG_OUTLINES) ?? false;
    eleventyConfig.addGlobalData("runtime", { bundleJs, debugOutlines });
    // Documentation (everything under ia/docs/) renders only when DOCS is on:
    // `npm run document` and `npm run start:docs` set it, and so do the deploy
    // workflows. Off by default, so `npm start` and `npm run quick` skip about
    // 240 pages.
    const docs = normalizeBoolean(process.env.DOCS) ?? false;
    if (!docs) eleventyConfig.ignores.add("ia/docs/**");
    // The Docs landing page and its four sub-pages never build here, with DOCS
    // on or off. Their content will come from Sanity and they will build
    // separately, so /docs/ and /docs/<name>/ are not written by this build.
    for (const stem of [
      "index",
      "backend",
      "content-models",
      "design-strategy",
      "frontend",
    ]) {
      eleventyConfig.ignores.add(`ia/docs/${stem}.md`);
    }

    // Passthrough copy for static assets
    logger.trace("Configuring passthrough copy", null, "brief", msgStyle);
    eleventyConfig.addPassthroughCopy({ "static/robots.txt": "robots.txt" });
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy({ js: "assets/js" });
    eleventyConfig.addPassthroughCopy({
      "node_modules/@datainkio/lumberjack/dist": "assets/js/utils/lumberjack",
    });
    eleventyConfig.addPassthroughCopy({
      "node_modules/gsap": "assets/js/vendor/gsap",
    });
    // Shared breakpoint values (single source for Tailwind's theme AND the
    // browser runtime). js/choreography/config/ix/breakpoints.js imports this
    // file via a path relative to its own location; once js/ is copied to
    // assets/js/, that import resolves to /assets/breakpoints.config.js. This
    // entry is what makes that URL actually exist — without it, any page that
    // runs the raw-ESM (unbundled) code path (e.g. work-landing-header.js on
    // the Work page, or the AnimationDirector fallback when bundle.js fails
    // to load) 404s on it. See breakpoints.config.md for the file itself.
    eleventyConfig.addPassthroughCopy({
      "breakpoints.config.js": "assets/breakpoints.config.js",
    });
    // Copy JavaScript files to _site/assets/
    // eleventyConfig.addPassthroughCopy({ js: 'assets/js' });
    // Copy video files for background video in StageManager
    // eleventyConfig.addPassthroughCopy({ 'assets/video': 'assets/video' });
    // Dev: serve passthrough files from source instead of copying ~580 files
    // on every rebuild.
    eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
    // JS is bundled by esbuild (dev:js); a JS save must not rebuild pages.
    // Choreography sidecars are the exception when docs render: they are the
    // source of the choreography reference (ia/docs/design/choreography/), so a save rebuilds it.
    eleventyConfig.watchIgnores.add("./js/**/*.js");
    eleventyConfig.watchIgnores.add("./js/**/*.canvas");
    if (docs) eleventyConfig.addWatchTarget("./js/choreography/**/*.md");
    eleventyConfig.setServerOptions({
      watch: ["_site/**/*.css", "assets/js/choreography/bundle.js"],
    });
    // Dev CSS: one Tailwind build after each Eleventy build, in place of a
    // Tailwind --watch process. main.css scans _site/**/*.html, so a watcher
    // rebuilt once per HTML file written (~50 rebuilds per save). A styles/
    // save rebuilds pages, then CSS. docs.css builds only when docs render.
    // `npm run build`/`quick` run build:css themselves, so build mode skips this.
    eleventyConfig.addWatchTarget("./styles/");
    eleventyConfig.on("eleventy.after", async ({ runMode }) => {
      if (runMode === "build") return;
      const started = Date.now();
      const entries = docs ? CSS_ENTRIES : CSS_ENTRIES.slice(0, 1);
      try {
        await Promise.all(
          entries.map(({ input, output }) =>
            execFileAsync("node_modules/.bin/tailwindcss", [
              "-i",
              input,
              "-o",
              output,
            ]),
          ),
        );
        console.log(
          `[css] ${entries.length} stylesheet(s) in ${Date.now() - started}ms`,
        );
      } catch (error) {
        console.error(
          `[css] Tailwind build failed:\n${error.stderr || error.message}`,
        );
      }
    });
    // eleventyConfig.addPassthroughCopy("video"); // slows down the build
    // eleventyConfig.addPassthroughCopy("svg");
    // eleventyConfig.addPassthroughCopy("src/js");

    // Plugins
    logger.trace("Registering 11ty plugins", null, "brief", msgStyle);
    plugins(eleventyConfig);

    // Filters
    logger.trace("Registering template filters", null, "brief", msgStyle);
    filters(eleventyConfig);

    // Shortcodes
    logger.trace("Registering template shortcodes", null, "brief", msgStyle);
    shortcodes(eleventyConfig);

    // README-as-index permalink rule is scoped to ia/docs/ via
    // ia/docs/docs.11tydata.js to avoid interfering with paginated templates.
    // Decision documented in: /docs/ia/frontmatter/

    // Collections
    logger.trace("Registering data collections", null, "brief", msgStyle);
    // Wait for all data to be fetched (either in parallel or sequential mode) before continuing with the build
    await collections(eleventyConfig);

    logger.outdent();
    logger.trace(
      "11ty configuration complete. Ready to build.",
      null,
      "brief",
      successStyle,
    );
  });

  console.log("\n");

  return {
    dir: {
      input: "ia",
      includes: "../views", // relative to input
      output: "_site",
    },
    markdownTemplateEngine: "njk",
  };
}
