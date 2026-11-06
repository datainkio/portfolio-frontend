/** @format */

import assert from "node:assert/strict";
import {
  extractTokens,
  TokenService,
} from "../../figma/services/TokenService.js";
import { render } from "../../figma/views/tailwind/TokensFile.js";

const rect = (name, props = {}) => ({
  name,
  type: "RECTANGLE",
  absoluteBoundingBox: { width: 16, height: 16 },
  ...props,
});
const text = (name, style) => ({ name, type: "TEXT", style });

const documentNode = {
  children: [
    { name: "Cover", children: [rect("spacing/999")] },
    {
      name: "Tokens",
      children: [
        rect("a label to ignore"),
        {
          name: "Spacing section",
          type: "FRAME",
          children: [
            rect("spacing/4"),
            rect("spacing/0.5", {
              absoluteBoundingBox: { width: 2, height: 2 },
            }),
          ],
        },
        rect("container/md", {
          absoluteBoundingBox: { width: 448, height: 10 },
        }),
        rect("radius/lg", { cornerRadius: 8 }),
        rect("radius/square"),
        rect("shadow/md", {
          effects: [
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
            {
              type: "DROP_SHADOW",
              visible: false,
              offset: { x: 9, y: 9 },
              radius: 9,
              color: { r: 0, g: 0, b: 0, a: 1 },
            },
          ],
        }),
        text("text/sm", { fontSize: 14, lineHeightPx: 20 }),
        text("text/5xl", { fontSize: 48, lineHeightPx: 48 }),
        text("font-weight/medium", { fontWeight: 500 }),
        text("leading/tight", { fontSize: 100, lineHeightPx: 125 }),
        text("tracking/wide", {
          fontSize: 100,
          lineHeightPx: 100,
          letterSpacing: 2.5,
        }),
      ],
    },
  ],
};

const tokens = extractTokens(documentNode);

let passed = 0;
const test = async (name, fn) => {
  await fn();
  passed += 1;
  console.log(`  ok - ${name}`);
};

await test("reads tokens only from the Tokens page, at any depth", () => {
  assert.deepEqual(tokens.spacing, { 4: "1rem", 0.5: "0.125rem" });
  assert.equal(tokens.container.md, "28rem");
});

await test("a radius layer with no corner radius reads as 0", () => {
  assert.deepEqual(tokens.radius, { lg: "0.5rem", square: "0" });
});

await test("shadows keep visible shadow effects and round float alpha", () => {
  assert.equal(
    tokens.shadow.md,
    "0 -4px 8px -1px rgb(0 0 0 / 0.5), inset 0 1px 0 0 rgb(255 255 255 / 0.1)",
  );
});

await test("type tokens match Tailwind's value forms", () => {
  assert.deepEqual(tokens.text.sm, {
    size: "0.875rem",
    lineHeight: "calc(20 / 14)",
  });
  assert.equal(tokens.text["5xl"].lineHeight, "1");
  assert.equal(tokens["font-weight"].medium, "500");
  assert.equal(tokens.leading.tight, "1.25");
  assert.equal(tokens.tracking.wide, "0.025em");
});

await test("no Tokens page returns null", () => {
  assert.equal(extractTokens({ children: [{ name: "Cover" }] }), null);
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
  const css = render(
    { ...tokens, radius: { DEFAULT: "0.25rem" } },
    { source: "test" },
  );
  assert.ok(css.includes("  --radius: 0.25rem;"));
});

await test("a missing group throws before anything is written", async () => {
  const partial = {
    children: [{ name: "Tokens", children: [rect("spacing/4")] }],
  };
  await assert.rejects(
    new TokenService({}).write({ document: partial, name: "x", version: "1" }),
    /no layers for: container, radius, shadow/,
  );
});

await test("no Tokens page writes nothing and reports false", async () => {
  const wrote = await new TokenService({}).write({
    document: { children: [{ name: "Cover" }] },
  });
  assert.equal(wrote, false);
});

console.log(`\nFigma tokens: ${passed} passed`);
