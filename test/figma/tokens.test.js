/** @format */

import assert from "node:assert/strict";
import {
  extractTokens,
  TokenService,
  TOKEN_GROUPS,
} from "../../figma/services/TokenService.js";
import { render } from "../../figma/views/tailwind/TokensFile.js";

// Variables follow extractVariables' output; the page follows a
// GET /v1/files/:key/nodes response for the library's Tokens page.
let nextId = 1;
const variable = (name, value, resolvedType = "FLOAT") => {
  const id = `VariableID:9:${nextId++}`;
  return [id, { id, name, resolvedType, valuesByMode: { "2:1": value } }];
};
const variables = (...entries) => Object.fromEntries(entries);

const shadowSample = (name, effects) => ({
  name: `EffectStyle/Shadow/${name}`,
  type: "FRAME",
  effects,
});
const drop = (y, radius, a) => ({
  type: "DROP_SHADOW",
  offset: { x: 0, y },
  radius,
  spread: 0,
  color: { r: 0, g: 0, b: 0, a },
});
const page = (...samples) => ({
  name: "Tokens",
  type: "CANVAS",
  children: [
    {
      name: "Styles",
      type: "FRAME",
      children: [
        { name: "TextStyle/Body/xs", type: "TEXT", characters: "Aa" },
        {
          name: "Effect styles",
          type: "FRAME",
          children: samples.map((s) => ({
            name: `Row · ${s.name}`,
            type: "FRAME",
            children: [s],
          })),
        },
      ],
    },
  ],
});

const library = variables(
  variable("spacing/0_5", 2),
  variable("spacing/4", 16),
  variable("container/md", 448),
  variable("radius/default", 4),
  variable("radius/lg", 8),
  variable("text/sm/size", 14),
  variable("text/sm/line-height", 20),
  variable("text/5xl/size", 48),
  variable("text/5xl/line-height", 48),
  variable("font-weight/medium", 500),
  variable("leading/snug", 1.1670000553131104),
  variable("tracking/tight", -0.02500000037252903),
  variable("screen/xs", 480),
  variable("duration/base", 460),
  variable("accent/500", { r: 1, g: 0.8, b: 0, a: 1 }, "COLOR"),
  variable("font/display", "DRAFT PAPER", "STRING"),
);
const shadows = page(
  shadowSample("md", [
    { type: "LAYER_BLUR", radius: 4 },
    {
      type: "DROP_SHADOW",
      offset: { x: 0, y: -4 },
      radius: 8,
      spread: -1,
      color: { r: 0, g: 0, b: 0, a: 0.5000000074505806 },
    },
    {
      type: "INNER_SHADOW",
      offset: { x: 0, y: 1 },
      radius: 0,
      color: { r: 1, g: 1, b: 1, a: 0.1 },
    },
    { ...drop(9, 9, 1), visible: false },
  ]),
);
const tokens = extractTokens(library, shadows);

let passed = 0;
const test = async (name, fn) => {
  await fn();
  passed += 1;
  console.log(`  ok - ${name}`);
};

await test("lengths become rem, and spacing keys use a decimal point", () => {
  assert.deepEqual(tokens.spacing, { 0.5: "0.125rem", 4: "1rem" });
  assert.deepEqual(tokens.container, { md: "28rem" });
});

await test("radius/default becomes the DEFAULT key", () => {
  assert.deepEqual(tokens.radius, { DEFAULT: "0.25rem", lg: "0.5rem" });
});

await test("type tokens match Tailwind's value forms", () => {
  assert.deepEqual(tokens.text.sm, {
    size: "0.875rem",
    lineHeight: "calc(20 / 14)",
  });
  assert.equal(tokens.text["5xl"].lineHeight, "1");
  assert.deepEqual(tokens["font-weight"], { medium: "500" });
  assert.deepEqual(tokens.leading, { snug: "1.167" });
  assert.deepEqual(tokens.tracking, { tight: "-0.025em" });
});

await test("colours, fonts, motion and screens are not tokens.css groups", () => {
  assert.deepEqual(Object.keys(tokens), TOKEN_GROUPS);
  const all = JSON.stringify(tokens);
  for (const value of ["30rem", "460", "DRAFT PAPER", "accent"]) {
    assert.ok(!all.includes(value), `${value} leaked into the tokens`);
  }
});

await test("shadows come from effect-style samples at any depth, visible layers only", () => {
  assert.deepEqual(tokens.shadow, {
    md: "0 -4px 8px -1px rgb(0 0 0 / 0.5), inset 0 1px 0 0 rgb(255 255 255 / 0.1)",
  });
});

await test("a type size without its line height throws", () => {
  assert.throws(
    () => extractTokens(variables(variable("text/lg/size", 18)), page()),
    /text\/lg needs both a size and a line-height variable/,
  );
});

await test("render sorts scales and escapes dots in keys", () => {
  const css = render(tokens, { source: "test" });
  assert.ok(
    css.indexOf("--spacing-0_5: 0.125rem") < css.indexOf("--spacing-4: 1rem"),
  );
  assert.ok(css.includes("--text-sm--line-height: calc(20 / 14);"));
  assert.equal(css, render(tokens, { source: "test" }));
});

await test("render writes the DEFAULT key without a suffix", () => {
  assert.ok(
    render(tokens, { source: "test" }).includes("  --radius: 0.25rem;"),
  );
});

await test("a missing group throws before anything is written", async () => {
  await assert.rejects(
    new TokenService().write(library, page(), { source: "test" }),
    /no tokens for: shadow\. styles\/tokens\.css was not changed/,
  );
});

console.log(`\nFigma tokens: ${passed} passed`);
