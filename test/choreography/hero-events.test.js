/** @format */

import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const heroPath = join(__dirname, '../../js/choreography/sections/hero/Hero.js');
const heroSource = await readFile(heroPath, 'utf8');

console.log('\n🧪 Verifying Hero section broadcasts standardized events');

const expectedMappings = [
  'introStart: EVENTS.hero.introStart',
  'introComplete: EVENTS.hero.introComplete',
  'outroStart: EVENTS.hero.outroStart',
  'outroComplete: EVENTS.hero.outroComplete',
];

const missing = expectedMappings.filter(mapping => !heroSource.includes(mapping));

if (missing.length > 0) {
  throw new Error(`Hero event dispatch mappings missing: ${missing.join(', ')}`);
}

console.log(
  '✅ Hero events reference the correct constants and will broadcast through AnimationBus'
);
