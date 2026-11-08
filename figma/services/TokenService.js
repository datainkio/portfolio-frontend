import chalk from "chalk";
import { write as writeTokensFile } from "../views/tailwind/TokensFile.js";

/**
 * Every group has to be present before styles/tokens.css is replaced. A missing
 * group would otherwise fall back to Tailwind's defaults with no warning.
 */
export const TOKEN_GROUPS = [
  "spacing",
  "container",
  "radius",
  "shadow",
  "text",
  "font-weight",
  "leading",
  "tracking",
];

/** The page may carry a prefix, as in "#️ Tokens". */
export const isTokensPage = (page) => /(^|\s)Tokens$/.test(page.name ?? "");

const round = (n, places = 4) => Number(n.toFixed(places));
const rem = (px) => (px === 0 ? "0" : `${round(px / 16)}rem`);
const length = (px) => (px === 0 ? "0" : `${round(px)}px`);

/** CSS for a node's visible drop and inner shadows, in Figma's order. */
export function shadowValue(node) {
  const layers = (node.effects ?? []).filter(
    (e) =>
      e.visible !== false &&
      (e.type === "DROP_SHADOW" || e.type === "INNER_SHADOW"),
  );
  if (!layers.length) throw new Error(`${node.name} has no shadow effect`);
  return layers
    .map((e) => {
      const { r, g, b, a } = e.color;
      const [x, y, z] = [r, g, b].map((c) => Math.round(c * 255));
      const inset = e.type === "INNER_SHADOW" ? "inset " : "";
      return `${inset}${length(e.offset.x)} ${length(e.offset.y)} ${length(e.radius)} ${length(e.spread ?? 0)} rgb(${x} ${y} ${z} / ${round(a, 3)})`;
    })
    .join(", ");
}

/**
 * Variable group → token name and CSS value. Figma stores lengths in px.
 * `text/*` pairs a size with a line height, so it's read separately.
 */
const VARIABLE_READERS = {
  // Variable names use `_` for the decimal point (spacing/0_5); keys use `.`.
  spacing: (name, px) => [name.replaceAll("_", "."), rem(px)],
  container: (name, px) => [name, rem(px)],
  radius: (name, px) => [name === "default" ? "DEFAULT" : name, rem(px)],
  "font-weight": (name, weight) => [name, String(weight)],
  leading: (name, ratio) => [name, String(round(ratio, 3))],
  tracking: (name, em) => [name, `${round(em, 3)}em`],
};

/**
 * Reads tokens from the design-system library. Numeric groups come from its
 * FLOAT variables; other variables (colours, fonts, motion, screens) are
 * ignored. Shadows come from the `EffectStyle/Shadow/*` samples on its Tokens
 * page, because Figma has no variable type for a shadow.
 *
 * @param {Object} variables `meta.variables` from VariablesService's extractVariables.
 * @param {Object} pageNode The Tokens page's document node.
 * @returns {Object} group → name → value
 */
export function extractTokens(variables, pageNode) {
  const tokens = Object.fromEntries(TOKEN_GROUPS.map((g) => [g, {}]));
  const sizes = {};
  for (const variable of Object.values(variables)) {
    if (variable.resolvedType !== "FLOAT") continue;
    const [group, ...rest] = variable.name.split("/");
    const value = Object.values(variable.valuesByMode)[0];
    if (group === "text") {
      const [step, property] = rest;
      sizes[step] = { ...sizes[step], [property]: value };
    } else if (VARIABLE_READERS[group]) {
      const [name, token] = VARIABLE_READERS[group](rest.join("/"), value);
      tokens[group][name] = token;
    }
  }

  for (const [step, { size, "line-height": lineHeight }] of Object.entries(
    sizes,
  )) {
    if (size === undefined || lineHeight === undefined) {
      throw new Error(
        `text/${step} needs both a size and a line-height variable. styles/tokens.css was not changed.`,
      );
    }
    tokens.text[step] = {
      size: rem(size),
      lineHeight:
        size === lineHeight
          ? "1"
          : `calc(${round(lineHeight)} / ${round(size)})`,
    };
  }

  const visit = (node) => {
    const m = /^EffectStyle\/Shadow\/(.+)$/.exec(node.name ?? "");
    if (m) {
      tokens.shadow[m[1]] = shadowValue(node);
      return;
    }
    (node.children ?? []).forEach(visit);
  };
  visit(pageNode);
  return tokens;
}

/** Writes styles/tokens.css from the design-system library. */
export class TokenService {
  /**
   * @param {Object} variables `meta.variables` from extractVariables.
   * @param {Object} pageNode The Tokens page's document node.
   * @param {{ source: string }} meta Written to the file's header.
   * @returns {Promise<Object>} The tokens written.
   */
  async write(variables, pageNode, { source }) {
    console.log(chalk.cyan("\n\tprocessing design tokens..."));
    const tokens = extractTokens(variables, pageNode);
    const empty = TOKEN_GROUPS.filter((g) => !Object.keys(tokens[g]).length);
    if (empty.length) {
      throw new Error(
        `The Figma library has no tokens for: ${empty.join(", ")}. styles/tokens.css was not changed.`,
      );
    }
    await writeTokensFile(tokens, { source });
    return tokens;
  }
}
