/**
 * ---
 * aix:
 *   id: frontend.test.choreography.hero-events-test
 *   role: Test module: test/choreography/hero-events.test.js
 *   status: draft
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - test
 *     - choreography
 * ---
 */
/** @format */

import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const heroPath = join(__dirname, "../../js/choreography/sections/hero/Hero.js");
const abstractSectionPath = join(
  __dirname,
  "../../js/choreography/sections/abstract-section/AbstractSection.js",
);
const eventsPath = join(
  __dirname,
  "../../js/choreography/config/contracts/events.js",
);

const [heroSource, abstractSectionSource, eventsSource] = await Promise.all([
  readFile(heroPath, "utf8"),
  readFile(abstractSectionPath, "utf8"),
  readFile(eventsPath, "utf8"),
]);

console.log(
  "\n🧪 Verifying Hero section uses standardized AnimationBus event contracts",
);

const requiredMarkers = [
  'sectionKey: "hero"',
  "this.events = EVENTS?.[sectionKey] ?? {};",
  "this.bus.emit(eventName, payload);",
  "hero: {",
  "introStart:",
  "introComplete:",
  "outroStart:",
  "outroComplete:",
];

const missing = requiredMarkers.filter((marker) => {
  if (heroSource.includes(marker)) return false;
  if (abstractSectionSource.includes(marker)) return false;
  if (eventsSource.includes(marker)) return false;
  return true;
});

if (missing.length > 0) {
  throw new Error(`Hero event contract markers missing: ${missing.join(", ")}`);
}

console.log(
  "✅ Hero event lifecycle is standardized and routed through AnimationBus",
);
