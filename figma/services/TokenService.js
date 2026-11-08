import chalk from "chalk";
import { write as writeTokensFile } from "../views/tailwind/TokensFile.js";

/** Groups read from named layers on the Tokens page. */
export const LAYER_GROUPS = [
  "spacing",
  "container",
  "radius",
  "shadow",
  "tracking",
];

/** Groups read from the file's existing text styles. */
export const STYLE_GROUPS = ["text", "font-weight", "leading"];

/**
 * Every group has to be present before styles/tokens.css is replaced. A missing
 * group would otherwise fall back to Tailwind's defaults with no warning.
 */
export const TOKEN_GROUPS = [...LAYER_GROUPS, ...STYLE_GROUPS];

/** The page may carry a prefix, as in "#️ Tokens". */
export const isTokensPage = (page) => /(^|\s)Tokens$/.test(page.name ?? "");

const round = (n, places = 4) => Number(n.toFixed(places));
const rem = (px) => (px === 0 ? "0" : `${round(px / 16)}rem`);
const length = (px) => (px === 0 ? "0" : `${round(px)}px`);

function shadowValue(node) {
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

/** Group → how to read a token's value from a layer of that group. */
const LAYER_READERS = {
  spacing: (node) => rem(node.absoluteBoundingBox.width),
  container: (node) => rem(node.absoluteBoundingBox.width),
  radius: (node) => rem(node.cornerRadius ?? 0),
  shadow: shadowValue,
  tracking: (node) => {
    if (!node.style) throw new Error(`${node.name} is not a text layer`);
    const { fontSize, letterSpacing = 0 } = node.style;
    return `${round(letterSpacing / fontSize, 3)}em`;
  },
};

/** An "auto" line height is a font metric, not a design decision. */
const hasExplicitLineHeight = (style) => style.lineHeightUnit !== "INTRINSIC_%";

function readTextStyles(textStyles, tokens) {
  for (const style of textStyles) {
    const [property, ...rest] = style.name.split("/");
    const name = rest.join("/");
    if (property === "fontSize") {
      const { fontSize, lineHeightPx } = style;
      tokens.text[name] = hasExplicitLineHeight(style)
        ? {
            size: rem(fontSize),
            lineHeight:
              fontSize === lineHeightPx
                ? "1"
                : `calc(${round(lineHeightPx)} / ${round(fontSize)})`,
          }
        : null;
    } else if (property === "lineHeight") {
      tokens.leading[name] = hasExplicitLineHeight(style)
        ? String(round(style.lineHeightPx / style.fontSize, 3))
        : null;
    } else if (property === "fontWeight" && name.startsWith("sans/")) {
      tokens["font-weight"][name.slice("sans/".length)] = String(
        style.fontWeight,
      );
    }
  }
}

/**
 * Reads tokens from a Figma document. On the Tokens page, a layer named
 * `<group>/<name>` defines one token, and other layers are ignored. Type tokens
 * come from the `fontSize/*`, `lineHeight/*`, and `fontWeight/sans/*` text styles.
 *
 * @param {Object} documentNode The `document` of a GET /v1/files/:key response.
 * @param {Array} textStyles TextFormat objects from StyleService.
 * @returns {Object|null} group → name → value, or null when there's no page. A
 *   text style with an auto line height reads as null.
 */
export function extractTokens(documentNode, textStyles = []) {
  const page = documentNode?.children?.find(isTokensPage);
  if (!page) return null;

  const tokens = Object.fromEntries(TOKEN_GROUPS.map((g) => [g, {}]));
  const visit = (node) => {
    const m = /^([a-z-]+)\/(.+)$/.exec(node.name ?? "");
    if (m && LAYER_READERS[m[1]]) {
      tokens[m[1]][m[2]] = LAYER_READERS[m[1]](node);
      return;
    }
    (node.children ?? []).forEach(visit);
  };
  visit(page);
  readTextStyles(textStyles, tokens);
  return tokens;
}

/** Writes styles/tokens.css from the Figma document. */
export class TokenService {
  constructor(client) {
    this.client = client;
  }

  async write(designFile, textStyles = []) {
    console.log(chalk.cyan("\n\tprocessing design tokens..."));
    const tokens = extractTokens(designFile.document, textStyles);
    const authored = LAYER_GROUPS.some(
      (g) => Object.keys(tokens?.[g] ?? {}).length,
    );
    if (!authored) {
      console.log(
        chalk.yellow(
          "\t↳ no token layers on the Figma Tokens page yet; styles/tokens.css left as is",
        ),
      );
      return false;
    }

    const empty = TOKEN_GROUPS.filter((g) => !Object.keys(tokens[g]).length);
    if (empty.length) {
      throw new Error(
        `The Figma file has no tokens for: ${empty.join(", ")}. styles/tokens.css was not changed.`,
      );
    }
    const auto = STYLE_GROUPS.flatMap((g) =>
      Object.entries(tokens[g])
        .filter(([, value]) => value === null)
        .map(([name]) => `${g}/${name}`),
    );
    if (auto.length) {
      throw new Error(
        `These text styles need an explicit line height, not auto: ${auto.join(", ")}. styles/tokens.css was not changed.`,
      );
    }

    await writeTokensFile(tokens, {
      source: `Figma file ${designFile.name}, version ${designFile.version}`,
    });
    return true;
  }
}
