/**
 * ---
 * aix:
 *   id: frontend.test.choreography.animation-bus-flow-test
 *   role: Test module: test/choreography/animation-bus-flow.test.js
 *   status: draft
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - test
 *     - choreography
 *     - animation-bus
 * ---
 */
/** @format */

import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const read = (relPath) => readFile(join(__dirname, relPath), "utf8");

const [
  busSource,
  abstractSectionSource,
  landingSequenceSource,
  eventsSource,
  registrySource,
  directorSource,
] = await Promise.all([
  read("../../js/choreography/AnimationBus.js"),
  read("../../js/choreography/sections/abstract-section/AbstractSection.js"),
  read("../../js/choreography/sequences/landing/LandingSequence.js"),
  read("../../js/choreography/config/contracts/events.js"),
  read("../../js/choreography/sections/registry.js"),
  read("../../js/choreography/AnimationDirector.js"),
]);

console.log(
  "\n🧪 Validating AnimationBus integration across choreography listeners",
);

const requiredBusApiMarkers = [
  "on(event, callback)",
  "emit(event, data = {})",
  "off(event, callback)",
];

for (const marker of requiredBusApiMarkers) {
  if (!busSource.includes(marker)) {
    throw new Error(`AnimationBus API marker missing: ${marker}`);
  }
}

if (!abstractSectionSource.includes("this.bus.emit(eventName, payload);")) {
  throw new Error(
    "AbstractSection does not dispatch section lifecycle events via AnimationBus",
  );
}

if (
  !directorSource.includes(
    "window.dispatchEvent(new Event(EVENTS.system.directorReady));",
  )
) {
  throw new Error(
    "AnimationDirector does not dispatch director:ready system handshake event",
  );
}

if (
  !landingSequenceSource.includes(
    "window.addEventListener(\n      EVENTS.system.preloaderOut,",
  )
) {
  throw new Error(
    "LandingSequence is not listening for preloader:out system handshake",
  );
}

const registryMatch = registrySource.match(
  /export const SECTION_REGISTRY = \{([\s\S]*?)\};/,
);
if (!registryMatch) {
  throw new Error("Unable to locate SECTION_REGISTRY in registry.js");
}

const sectionIds = Array.from(
  registryMatch[1].matchAll(/\s*(\w+)\s*:\s*[A-Za-z0-9_]+\s*,/g),
).map((match) => match[1]);

if (sectionIds.length === 0) {
  throw new Error("No section IDs detected in SECTION_REGISTRY");
}

for (const sectionId of sectionIds) {
  if (!eventsSource.includes(`${sectionId}: {`)) {
    throw new Error(`EVENTS namespace missing for section: ${sectionId}`);
  }
}

const listenerMatches = Array.from(
  landingSequenceSource.matchAll(/on\(EVENTS\.(\w+)\.(\w+),/g),
);

if (listenerMatches.length === 0) {
  throw new Error("No AnimationBus listeners were detected in LandingSequence");
}

for (const [, sectionId, eventKey] of listenerMatches) {
  if (!sectionIds.includes(sectionId)) {
    throw new Error(
      `LandingSequence listens to unknown section namespace: ${sectionId}.${eventKey}`,
    );
  }

  if (
    !eventsSource.includes(`${sectionId}: {`) ||
    !eventsSource.includes(`${eventKey}:`)
  ) {
    throw new Error(
      `EVENTS contract missing listener target: ${sectionId}.${eventKey}`,
    );
  }
}

const abstractLifecycleHooks = [
  "landingStart",
  "landingComplete",
  "enter",
  "exit",
  "introStart",
  "introComplete",
  "outroStart",
  "outroComplete",
];

for (const hook of abstractLifecycleHooks) {
  const emitSignature = `this._emit(this.events.${hook}`;
  if (!abstractSectionSource.includes(emitSignature)) {
    throw new Error(
      `AbstractSection lifecycle emitter missing: ${emitSignature}`,
    );
  }
}

if (!landingSequenceSource.includes("this.sections?.hero?.playLanding?.();")) {
  throw new Error(
    "Expected video->hero sequence handoff is missing in LandingSequence",
  );
}

console.log(
  "✅ AnimationBus dispatch/receive flow validated for registered section listeners",
);
