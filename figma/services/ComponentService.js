import { ENDPOINTS } from "../api/endpoints.js";
import { extractVariables, VariablesService } from "./VariablesService.js";

/** Figma's `State` option → the key it's read into. Focus and Disabled aren't in v1. */
const STATES = { Default: "default", Hover: "hover" };

/** The text layer whose fill becomes `text-{colour}`. */
const LABEL = "Label";

/**
 * `Style=CTA, State=Default` → `{ Style: "CTA", State: "Default" }`.
 *
 * @param {string} name A variant component's name.
 * @returns {Object<string, string>}
 */
export function variantProperties(name) {
  return Object.fromEntries(
    name
      .split(",")
      .map((pair) => pair.split("=").map((part) => part.trim()))
      .filter((pair) => pair.length === 2 && pair[0]),
  );
}

/**
 * A variable name as a Tailwind colour: `secondary/600` → `secondary-600`, and
 * `base/white` → `white`, which Tailwind ships and colors.css leaves out.
 *
 * @param {string} variableName
 * @returns {string}
 */
export function colourName(variableName) {
  const builtIn = /^base\/(white|black)$/.exec(variableName);
  return builtIn ? builtIn[1] : variableName.replaceAll("/", "-");
}

const shown = (item) => item.visible !== false;
const isColourPaint = (paint) =>
  shown(paint) &&
  (paint.type === "SOLID" || Boolean(paint.type?.startsWith("GRADIENT_")));
const colourPaints = (paints) => (paints ?? []).filter(isColourPaint);
const colourEffects = (effects) =>
  (effects ?? []).filter((effect) => shown(effect) && effect.color);

const hex = ({ r, g, b, a = 1 }, opacity = 1) =>
  `#${(a * opacity < 1 ? [r, g, b, a * opacity] : [r, g, b])
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;

/**
 * One bound colour, resolved. A slot the sync can't write gets a marker:
 * `{ unknown: id }` for a variable missing from `variables`, `{ raw: text }` for
 * an unbound colour, a gradient, or more than one paint.
 */
function resolve(bound, variables) {
  const id = bound?.id;
  if (!id) return undefined;
  return variables[id] ? colourName(variables[id].name) : { unknown: id };
}

function readPaints(paints, variables) {
  const colours = colourPaints(paints);
  if (!colours.length) return undefined;
  if (colours.length > 1) return { raw: `${colours.length} paints` };
  const [paint] = colours;
  if (paint.type !== "SOLID") return { raw: paint.type.toLowerCase() };
  return (
    resolve(paint.boundVariables?.color, variables) ?? {
      raw: hex(paint.color, paint.opacity),
    }
  );
}

/** A note's Figma column: the colours a layer carries, resolved where bound. */
function describe(node, variables) {
  const paints = [...colourPaints(node.fills), ...colourPaints(node.strokes)];
  const values = [
    ...paints.map((paint) =>
      paint.type === "SOLID"
        ? (resolve(paint.boundVariables?.color, variables) ??
          hex(paint.color, paint.opacity))
        : paint.type.toLowerCase(),
    ),
    ...colourEffects(node.effects).map(
      (effect) =>
        resolve(effect.boundVariables?.color, variables) ?? hex(effect.color),
    ),
  ];
  return values
    .map((value) => (typeof value === "string" ? value : value.unknown))
    .join(", ");
}

/** The first visible text layer named `Label`, at any depth. */
function findLabel(node) {
  for (const child of (node.children ?? []).filter(shown)) {
    if (child.type === "TEXT" && child.name === LABEL) return child;
    const found = findLabel(child);
    if (found) return found;
  }
  return undefined;
}

/**
 * Every visible layer under the variant, other than the mapped ones, that
 * carries its own colour. The root's effects and the Label's strokes count too,
 * because neither maps to a utility.
 */
function unmappedLayers(variant, label, variables) {
  const found = [];
  if (colourEffects(variant.effects).length) {
    found.push({
      layer: "(root) effects",
      figma: describe({ effects: variant.effects }, variables),
    });
  }
  const visit = (node, path) => {
    for (const child of (node.children ?? []).filter(shown)) {
      const here = [...path, child.name];
      const carried =
        child === label
          ? { strokes: child.strokes, effects: child.effects }
          : child;
      const figma = describe(carried, variables);
      if (figma) found.push({ layer: here.join(" / "), figma });
      visit(child, here);
    }
  };
  visit(variant, []);
  return found;
}

/**
 * Reads the colours a component set applies, per variant and state.
 *
 * Each variant's `Style` option, lowercased, is the key; only the `Default` and
 * `Hover` states are read. The root fill becomes `bg`, the root stroke `border`,
 * and the fill of the text layer named `Label` becomes `text`. A property Figma
 * doesn't set is left out.
 *
 * A slot that can't be written keeps a marker in place of the colour, so the
 * diff can report it against the right utility: `{ unknown: "VariableID:…" }`
 * when the bound variable isn't in `variables`, `{ raw: "#rrggbb" }` for an
 * unbound colour (or a gradient, or more than one paint).
 *
 * @param {Object} setNode The COMPONENT_SET `document` from GET /v1/files/:key/nodes.
 * @param {Object} variables `variables` from VariablesService's extractVariables, keyed by ID.
 * @returns {{
 *   colours: Object<string, { default?: Object, hover?: Object }>,
 *   notes: Array<{ variant: string, state: string, kind: string, layer?: string, property?: string, figma: string }>
 * }} `notes` lists everything that needs a hand, in reading order: `layer` for
 *   an unmapped coloured layer, `raw` and `unknown` for the markers above, and
 *   `name` for a variant with no `Style` option.
 */
export function extractComponentColours(setNode, variables) {
  const colours = {};
  const notes = [];

  for (const variant of (setNode.children ?? []).filter(
    (child) => child.type === "COMPONENT",
  )) {
    const { Style, State } = variantProperties(variant.name);
    if (!Style) {
      notes.push({
        variant: variant.name,
        state: "",
        kind: "name",
        figma: variant.name,
      });
      continue;
    }
    const state = STATES[State];
    if (!state) continue;

    const key = Style.toLowerCase();
    const label = findLabel(variant);
    const read = {
      bg: readPaints(variant.fills, variables),
      border: readPaints(variant.strokes, variables),
      text: label && readPaints(label.fills, variables),
    };
    const slot = {};
    for (const [property, value] of Object.entries(read)) {
      if (value === undefined) continue;
      slot[property] = value;
      if (typeof value === "object") {
        const kind = value.unknown ? "unknown" : "raw";
        notes.push({
          variant: key,
          state,
          kind,
          property,
          figma: value.unknown ?? value.raw,
        });
      }
    }
    colours[key] = { ...colours[key], [state]: slot };

    for (const { layer, figma } of unmappedLayers(variant, label, variables)) {
      notes.push({ variant: key, state, kind: "layer", layer, figma });
    }
  }

  return { colours, notes };
}

/** Throws on a Figma REST error body, which arrives as `{ status, err }`. */
const ok = (body) => {
  if (body?.err) throw new Error(`Figma API ${body.status}: ${body.err}`);
  return body;
};

/**
 * Reads component sets from the design-system library for
 * `npm run sync:components`. Works with a Pro plan's token.
 */
export class ComponentService {
  /**
   * @param {Object} client A FigmaClient, or anything with `FILE_ID` and `fetch(endpoint)`.
   * @param {VariablesService} [variablesService] Reads the Tokens page.
   */
  constructor(client, variablesService = new VariablesService(client)) {
    this.client = client;
    this.variablesService = variablesService;
  }

  /**
   * @param {string} nodeId The component set's node ID, e.g. `25:43`.
   * @returns {Promise<Object>} The COMPONENT_SET's document node.
   */
  async fetchComponentSet(nodeId) {
    const body = ok(
      await this.client.fetch(ENDPOINTS.nodes(this.client.FILE_ID, nodeId)),
    );
    const node = body.nodes?.[nodeId]?.document;
    if (!node) {
      throw new Error(
        `The Figma library has no node ${nodeId}. Check the figma key in the template's sidecar.`,
      );
    }
    if (node.type !== "COMPONENT_SET") {
      throw new Error(
        `Figma node ${nodeId} is a ${node.type}, not a component set. The sidecar's figma key names the set, not one variant.`,
      );
    }
    return node;
  }

  /**
   * The library's variables, read from a fresh Tokens page the way
   * `build:design` reads them, so bound IDs resolve to the same names.
   *
   * @returns {Promise<Object>} `variables` from extractVariables, keyed by ID.
   */
  async fetchVariables() {
    const { page } = await this.variablesService.fetchTokensPage();
    return extractVariables(page).variables;
  }
}
