/**
 * Bundle and minify choreography runtime into a single ESM file.
 * Output: assets/js/choreography/bundle.js
 */
import { build } from 'esbuild';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const entryPoint = resolve(projectRoot, 'js/choreography/Director.js');
const outDir = resolve(projectRoot, 'assets/js/choreography');
const outFile = resolve(outDir, 'bundle.js');

mkdirSync(outDir, { recursive: true });

await build({
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
});

console.log(`[choreography] bundle built -> ${outFile}`);
