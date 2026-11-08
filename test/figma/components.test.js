/** @format */

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  colourName,
  ComponentService,
  extractComponentColours,
  variantProperties,
} from "../../figma/services/ComponentService.js";
import {
  applyColours,
  findVariantsMap,
  HEADS,
  readVariants,
} from "../../figma/views/nunjucks/VariantsMap.js";
import {
  checkStatus,
  figmaKey,
  normaliseComponent,
} from "../../scripts/build/syncComponents.js";

// The real GET /v1/files/:key/nodes?ids=25:43 response for the library's
// Button component set, taken on 2026-11-08.
const fixture = JSON.parse(
  await readFile(
    new URL("./fixtures/button-set.nodes.json", import.meta.url),
    "utf8",
  ),
);
const buttonSet = () => structuredClone(fixture.nodes["25:43"].document);
const variantOf = (set, name) =>
  set.children.find((child) => child.name === name);
const rebind = (set, name, id, layer = (node) => node) => {
  layer(variantOf(set, name)).fills[0].boundVariables.color.id = id;
  return set;
};

// The nine variables the set's Default and Hover variants bind, in
// extractVariables' shape. The Focus rings bind others, which v1 doesn't read.
const NAMES = {
  "VariableID:2:14": "neutral/50",
  "VariableID:2:15": "neutral/100",
  "VariableID:2:18": "neutral/400",
  "VariableID:2:21": "neutral/700",
  "VariableID:2:23": "neutral/900",
  "VariableID:2:42": "secondary/600",
  "VariableID:2:43": "secondary/700",
  "VariableID:2:44": "secondary/800",
  "VariableID:2:72": "base/white",
};
const library = (names = NAMES) =>
  Object.fromEntries(
    Object.entries(names).map(([id, name]) => [
      id,
      { id, name, resolvedType: "COLOR", valuesByMode: {} },
    ]),
  );
const variables = library();
const palette = new Set([
  "neutral-50",
  "neutral-100",
  "neutral-400",
  "neutral-700",
  "neutral-900",
  "secondary-600",
  "secondary-700",
  "secondary-800",
  "white",
  "black",
]);

// The spec's example map, with a baseline outside it that the sync must not touch.
const SPEC_TEMPLATE = `{%- macro render(params = {}) -%}
{%- set baseline = "bg-neutral-50 text-neutral-900 hover:bg-neutral-100" -%}
{%- set variants = {
  "cta":    "m-4 py-2 px-4 justify-self-start font-display text-neutral-100 bg-secondary-600 hover:bg-secondary-800",
  "submit": "px-4 py-1.5 font-display text-sm uppercase tracking-wider text-neutral-50 bg-secondary-600 hover:bg-secondary-700 border border-secondary-800 …",
  "dark":   "py-1 px-3 rounded text-white bg-neutral-900 hover:bg-neutral-700",
  "icon":   "border-2 border-neutral-700 rounded-xl"
} -%}
<button class="{{ [baseline, variants[params.variant]] | classes }}"></button>
{%- endmacro -%}
`;
const withSlot = (key, from, to) => {
  const next = SPEC_TEMPLATE.replace(
    new RegExp(`("${key}":\\s*"[^"]*)${from}`),
    `$1${to}`,
  );
  assert.notEqual(next, SPEC_TEMPLATE, `fixture edit missed ${key}`);
  return next;
};

const sync = (template, set = buttonSet(), vars = variables, pal = palette) => {
  const { colours, notes } = extractComponentColours(set, vars);
  return applyColours(template, colours, { notes, palette: pal });
};
const colourRows = (rows) => rows.filter((row) => row.property in HEADS);
const rowFor = (rows, variant, state, property) =>
  rows.find(
    (row) =>
      row.variant === variant &&
      row.state === state &&
      row.property === property,
  );

let passed = 0;
const test = async (name, fn) => {
  await fn();
  passed += 1;
  console.log(`  ok - ${name}`);
};

// READER

await test("the reader turns each Style's Default and Hover into bg, text and border", () => {
  const { colours } = extractComponentColours(buttonSet(), variables);
  assert.deepEqual(colours, {
    cta: {
      default: { bg: "secondary-600", text: "neutral-100" },
      hover: { bg: "secondary-800", text: "neutral-100" },
    },
    submit: {
      default: {
        bg: "secondary-600",
        border: "secondary-800",
        text: "neutral-50",
      },
      hover: {
        bg: "secondary-700",
        border: "secondary-800",
        text: "neutral-50",
      },
    },
    dark: {
      default: { bg: "neutral-900", text: "white" },
      hover: { bg: "neutral-700", text: "white" },
    },
    icon: {
      default: { border: "neutral-700" },
      hover: { border: "neutral-700" },
    },
  });
});

await test("Submit's arrow and Icon's glyph are the only notes; Focus and Disabled aren't read", () => {
  const { notes } = extractComponentColours(buttonSet(), variables);
  const layer = (variant, state, name, figma) => ({
    variant,
    state,
    kind: "layer",
    layer: name,
    figma,
  });
  assert.deepEqual(notes, [
    layer("submit", "default", "Arrow (::after)", "neutral-50"),
    layer("submit", "hover", "Arrow (::after)", "neutral-50"),
    layer("icon", "default", "Icon / Glyph", "neutral-400"),
    layer("icon", "hover", "Icon / Glyph", "neutral-400"),
  ]);
});

await test("names: Style and State from the variant, family/step and Tailwind's white and black", () => {
  assert.deepEqual(variantProperties("Style=CTA, State=Default"), {
    Style: "CTA",
    State: "Default",
  });
  assert.equal(colourName("secondary/600"), "secondary-600");
  assert.equal(colourName("base/white"), "white");
  assert.equal(colourName("base/black"), "black");
});

// THE MAP

await test("readVariants reads each key's class string", () => {
  assert.deepEqual(readVariants(SPEC_TEMPLATE), {
    cta: "m-4 py-2 px-4 justify-self-start font-display text-neutral-100 bg-secondary-600 hover:bg-secondary-800",
    submit:
      "px-4 py-1.5 font-display text-sm uppercase tracking-wider text-neutral-50 bg-secondary-600 hover:bg-secondary-700 border border-secondary-800 …",
    dark: "py-1 px-3 rounded text-white bg-neutral-900 hover:bg-neutral-700",
    icon: "border-2 border-neutral-700 rounded-xl",
  });
});

await test("a template with no variants map, or a line that isn't one entry, fails loudly", () => {
  assert.throws(
    () => findVariantsMap('{%- set looks = { "a": "b" } -%}'),
    /no `\{%- set variants = \{ … \} -%\}` map/,
  );
  assert.throws(
    () => findVariantsMap(`{%- set variants = {\n  'cta': 'bg-white'\n} -%}`),
    /Can't read this line of the variants map[\s\S]*'cta': 'bg-white'/,
  );
});

// THE DIFF AND THE WRITER

await test("unchanged: the spec's map matches Figma, and nothing is rewritten", () => {
  const { text, rows } = sync(SPEC_TEMPLATE);
  assert.equal(text, SPEC_TEMPLATE);
  assert.ok(colourRows(rows).length > 0);
  assert.ok(colourRows(rows).every((row) => row.action === "unchanged"));
  assert.equal(checkStatus(rows), 0);
});

await test("replace: a rebinding in Figma changes only that utility's colour", () => {
  const set = rebind(buttonSet(), "Style=CTA, State=Hover", "VariableID:2:43");
  const { text, rows } = sync(SPEC_TEMPLATE, set);
  assert.equal(
    text,
    SPEC_TEMPLATE.replace("hover:bg-secondary-800", "hover:bg-secondary-700"),
  );
  assert.deepEqual(rowFor(rows, "cta", "hover", "bg"), {
    variant: "cta",
    state: "hover",
    property: "bg",
    figma: "hover:bg-secondary-700",
    template: "hover:bg-secondary-800",
    action: "written",
  });
  assert.equal(rows.filter((row) => row.action === "written").length, 1);
});

await test("append: a colour the slot lacks goes on the end of the string", () => {
  const template = withSlot("icon", "border-2 border-neutral-700", "border-2");
  const { text, rows } = sync(template);
  assert.equal(
    readVariants(text).icon,
    "border-2 rounded-xl border-neutral-700",
  );
  assert.equal(
    text,
    SPEC_TEMPLATE.replace(
      '"border-2 border-neutral-700 rounded-xl"',
      '"border-2 rounded-xl border-neutral-700"',
    ),
  );
  assert.equal(rowFor(rows, "icon", "default", "border").action, "written");
});

await test("a write leaves the rest of the template, inside and outside the map, as it was", () => {
  const set = rebind(
    buttonSet(),
    "Style=Dark, State=Default",
    "VariableID:2:21",
  );
  const { text } = sync(SPEC_TEMPLATE, set);
  const before = readVariants(SPEC_TEMPLATE);
  const after = readVariants(text);
  assert.equal(
    after.dark,
    before.dark.replace("bg-neutral-900", "bg-neutral-700"),
  );
  assert.deepEqual({ ...after, dark: null }, { ...before, dark: null });
  assert.ok(
    text.includes('"bg-neutral-50 text-neutral-900 hover:bg-neutral-100"'),
  );
});

await test("needs a hand: a colour utility with no Figma counterpart is reported, not removed", () => {
  const template = withSlot("cta", "px-4", "px-4 border-neutral-700");
  const { text, rows } = sync(template);
  assert.equal(text, template);
  assert.deepEqual(rowFor(rows, "cta", "default", "border"), {
    variant: "cta",
    state: "default",
    property: "border",
    figma: null,
    template: "border-neutral-700",
    action: "needs a hand",
    note: "no Figma counterpart",
  });
});

await test("needs a hand: a hover utility when Figma's hover matches its default", () => {
  const set = rebind(buttonSet(), "Style=CTA, State=Hover", "VariableID:2:42");
  const { text, rows } = sync(SPEC_TEMPLATE, set);
  assert.equal(text, SPEC_TEMPLATE);
  const row = rowFor(rows, "cta", "hover", "bg");
  assert.equal(row.action, "needs a hand");
  assert.equal(row.template, "hover:bg-secondary-800");
});

await test("needs a hand: a Style with no variants key, and a key with no Style", () => {
  const template = SPEC_TEMPLATE.replace(
    '"icon":   "border-2 border-neutral-700 rounded-xl"',
    '"ghost":  "text-neutral-900"',
  );
  const { text, rows } = sync(template);
  assert.equal(text, template);
  assert.equal(rowFor(rows, "ghost", "", "").action, "needs a hand");
  assert.equal(
    rowFor(rows, "ghost", "", "").note,
    "a variants key with no Figma Style option",
  );
  assert.equal(rowFor(rows, "icon", "", "").action, "needs a hand");
  assert.equal(
    rowFor(rows, "icon", "", "").note,
    "a Figma Style option with no variants key",
  );
});

await test("needs a hand: Submit's arrow and Icon's glyph, in both states", () => {
  const { rows } = sync(SPEC_TEMPLATE);
  for (const state of ["default", "hover"]) {
    assert.equal(
      rowFor(rows, "submit", state, "Arrow (::after)").action,
      "needs a hand",
    );
    assert.equal(
      rowFor(rows, "icon", state, "Icon / Glyph").action,
      "needs a hand",
    );
  }
  assert.equal(rows.filter((row) => row.action === "needs a hand").length, 4);
});

await test("needs a hand: an unbound colour on a mapped layer", () => {
  const set = buttonSet();
  const label = variantOf(set, "Style=Dark, State=Default").children.find(
    (child) => child.name === "Label",
  );
  delete label.fills[0].boundVariables;
  const { colours, notes } = extractComponentColours(set, variables);
  assert.deepEqual(colours.dark.default.text, { raw: "#ffffff" });
  assert.ok(
    notes.some((note) => note.kind === "raw" && note.figma === "#ffffff"),
  );

  const { text, rows } = sync(SPEC_TEMPLATE, set);
  assert.equal(text, SPEC_TEMPLATE);
  assert.equal(rowFor(rows, "dark", "default", "text").action, "needs a hand");
  assert.equal(rowFor(rows, "dark", "hover", "text").action, "needs a hand");
});

await test("unknown variable: a bound ID missing from the variables is reported, never written", () => {
  const { "VariableID:2:44": dropped, ...rest } = NAMES;
  assert.ok(dropped);
  const partial = library(rest);
  const template = withSlot(
    "cta",
    "hover:bg-secondary-800",
    "hover:bg-secondary-700",
  );
  const { text, rows } = sync(template, buttonSet(), partial);
  assert.equal(text, template);
  assert.deepEqual(rowFor(rows, "cta", "hover", "bg"), {
    variant: "cta",
    state: "hover",
    property: "bg",
    figma: "VariableID:2:44",
    template: "hover:bg-secondary-700",
    action: "unknown variable",
    note: "bound to a variable that isn't in the library's export",
  });
  assert.equal(
    rowFor(rows, "submit", "default", "border").action,
    "unknown variable",
  );
  assert.equal(checkStatus(rows), 1);
});

await test("a colour outside the palette is refused as an unknown variable", () => {
  const set = rebind(buttonSet(), "Style=CTA, State=Hover", "VariableID:2:43");
  const narrow = new Set(
    [...palette].filter((name) => name !== "secondary-700"),
  );
  const { text, rows } = sync(SPEC_TEMPLATE, set, variables, narrow);
  assert.equal(text, SPEC_TEMPLATE);
  assert.equal(rowFor(rows, "cta", "hover", "bg").action, "unknown variable");
  assert.equal(
    rowFor(rows, "cta", "hover", "bg").note,
    "secondary-700 isn't in the palette",
  );
});

await test("only no prefix and the exact hover: prefix count; other prefixes are left alone", () => {
  const template = withSlot(
    "cta",
    "font-display",
    "font-display focus:bg-neutral-50 group-hover:text-white md:bg-neutral-900 after:content-['→'] text-sm",
  );
  const { text, rows } = sync(template);
  assert.equal(text, template);
  assert.ok(
    rows
      .filter((row) => row.variant === "cta")
      .every((row) => row.action === "unchanged"),
  );
});

await test("a palette name like semantic-fail is written once, then reads as unchanged", () => {
  const vars = library({ ...NAMES, "VariableID:2:99": "semantic/fail" });
  const set = rebind(
    buttonSet(),
    "Style=CTA, State=Default",
    "VariableID:2:99",
  );
  // null: no palette, so the written utility must still be recognised next run.
  for (const pal of [new Set([...palette, "semantic-fail"]), null]) {
    const first = sync(SPEC_TEMPLATE, set, vars, pal);
    assert.equal(
      readVariants(first.text).cta,
      readVariants(SPEC_TEMPLATE).cta.replace(
        "bg-secondary-600",
        "bg-semantic-fail",
      ),
    );
    const second = sync(first.text, set, vars, pal);
    assert.equal(second.text, first.text);
    assert.equal(
      rowFor(second.rows, "cta", "default", "bg").action,
      "unchanged",
    );
  }
});

// THE CLI

await test("--check exits 1 on drift or an unknown variable; needs a hand alone exits 0", () => {
  const rows = (...actions) => actions.map((action) => ({ action }));
  assert.equal(checkStatus(rows("unchanged", "needs a hand")), 0);
  assert.equal(checkStatus(rows("unchanged", "written")), 1);
  assert.equal(checkStatus(rows("needs a hand", "unknown variable")), 1);
  assert.equal(checkStatus([]), 0);
});

await test("a template is mapped by a figma key in its sidecar's frontmatter", () => {
  assert.equal(
    figmaKey(
      '---\ndescription: "Button"\nfigma: "25:43"\ntags:\n  - atom\n---\n# Button\n',
    ),
    "25:43",
  );
  assert.equal(figmaKey("---\ndescription: x\n---\nfigma: 25:43\n"), null);
  assert.equal(figmaKey("# No frontmatter\n"), null);
  assert.equal(normaliseComponent("atoms/button.njk"), "atoms/button.njk");
  assert.equal(normaliseComponent("views/atoms/button"), "atoms/button.njk");
});

// THE SERVICE

const fakeClient = (respond) => {
  const calls = [];
  return {
    calls,
    FILE_ID: "libraryKey",
    fetch: async (endpoint) => {
      calls.push(endpoint);
      return respond(endpoint);
    },
  };
};

await test("fetchComponentSet reads the set through the nodes endpoint", async () => {
  const client = fakeClient(() => fixture);
  const set = await new ComponentService(client).fetchComponentSet("25:43");
  assert.deepEqual(client.calls, ["/files/libraryKey/nodes?ids=25:43"]);
  assert.equal(set.type, "COMPONENT_SET");
  assert.equal(set.children.length, 16);
});

await test("a node that isn't a component set, or isn't there, fails with a hint", async () => {
  const variant = fixture.nodes["25:43"].document.children[0];
  const service = (body) => new ComponentService(fakeClient(() => body));
  await assert.rejects(
    service({ nodes: { "25:44": { document: variant } } }).fetchComponentSet(
      "25:44",
    ),
    /25:44 is a COMPONENT, not a component set/,
  );
  await assert.rejects(
    service({ nodes: { "9:9": null } }).fetchComponentSet("9:9"),
    /no node 9:9\. Check the figma key/,
  );
  await assert.rejects(
    service({ status: 403, err: "Invalid token" }).fetchComponentSet("25:43"),
    /Figma API 403: Invalid token/,
  );
});

console.log(`\nFigma components: ${passed} passed`);
