/**
 * Bundle and minify choreography runtime into a single ESM file.
 * Output: assets/js/choreography/bundle.js
 */
import { build, context } from 'esbuild';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const entryPoint = resolve(projectRoot, 'js/choreography/Director.js');
const outDir = resolve(projectRoot, 'assets/js/choreography');
const outFile = resolve(outDir, 'bundle.js');

const args = new Set(process.argv.slice(2));
const watch = args.has('--watch');

const normalizeBoolean = value => {
  if (value === undefined) return undefined;
  const normalized = value.toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return undefined;
};

const envBundlePreference = normalizeBoolean(process.env.BUNDLE_JS);
const cliForcesBundle = args.has('--bundle');
const cliSkipsBundle = args.has('--no-bundle') || args.has('--skip-bundle');

let shouldBundle = envBundlePreference ?? true;
if (cliForcesBundle) shouldBundle = true;
if (cliSkipsBundle) shouldBundle = false;

if (!shouldBundle) {
  if (existsSync(outFile)) {
    rmSync(outFile);
    console.log(`[choreography] bundling disabled → removed existing bundle ${outFile}`);
  } else {
    console.log(
      '[choreography] bundling disabled → no bundle emitted (using raw ESM via Eleventy passthrough)'
    );
  }
  if (watch) {
    console.log('[choreography] --watch ignored because bundling is disabled.');
  }
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });

const buildOptions = {
  entryPoints: [entryPoint],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
  sourcemap: false,
  outfile: outFile,
  absWorkingDir: projectRoot,
  plugins: [
    {
      name: 'alias-absolute-assets',
      setup(build) {
        build.onResolve({ filter: /^\/assets\/js\/utils\/lumberjack\/index\.js$/ }, () => {
          return { path: resolve(projectRoot, 'node_modules/@datainkio/lumberjack/dist/index.js') };
        });

        build.onResolve({ filter: /^\/assets\/js\// }, args => {
          const rel = args.path.replace(/^\/assets\//, ''); // drop leading /assets/
          return { path: resolve(projectRoot, rel) };
        });
      },
    },
  ],
  logLevel: 'info',
};

if (watch) {
  const ctx = await context(buildOptions);
  await ctx.watch();
  console.log(`[choreography] bundle watching -> ${outFile}`);
} else {
  await build(buildOptions);
  console.log(`[choreography] bundle built -> ${outFile}`);
}
