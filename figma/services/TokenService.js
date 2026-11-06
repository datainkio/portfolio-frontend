import chalk from "chalk";
import { write as writeTokensFile } from "../views/tailwind/TokensFile.js";

/** The Figma page whose named layers carry the non-colour design tokens. */
export const TOKENS_PAGE = "Tokens";

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

function textStyle(node) {
  if (!node.style) throw new Error(`${node.name} is not a text layer`);
  return node.style;
}

/** Group → how to read a token's value from a layer of that group. */
const READERS = {
  spacing: (node) => rem(node.absoluteBoundingBox.width),
  container: (node) => rem(node.absoluteBoundingBox.width),
  radius: (node) => rem(node.cornerRadius ?? 0),
  shadow: shadowValue,
  text: (node) => {
    const { fontSize, lineHeightPx } = textStyle(node);
    return {
      size: rem(fontSize),
      lineHeight:
        fontSize === lineHeightPx
          ? "1"
          : `calc(${round(lineHeightPx)} / ${round(fontSize)})`,
    };
  },
  "font-weight": (node) => String(textStyle(node).fontWeight),
  leading: (node) => {
    const { fontSize, lineHeightPx } = textStyle(node);
    return String(round(lineHeightPx / fontSize, 3));
  },
  tracking: (node) => {
    const { fontSize, letterSpacing = 0 } = textStyle(node);
    return `${round(letterSpacing / fontSize, 3)}em`;
  },
};

/**
 * Reads tokens from the Tokens page of a Figma document. A layer named
 * `<group>/<name>` defines one token. Other layers are ignored, so the page can
 * carry labels.
 *
 * @param {Object} documentNode The `document` of a GET /v1/files/:key response.
 * @returns {Object|null} group → name → value, or null when there's no page.
 */
export function extractTokens(documentNode) {
  const page = documentNode?.children?.find((p) => p.name === TOKENS_PAGE);
  if (!page) return null;

  const tokens = Object.fromEntries(TOKEN_GROUPS.map((g) => [g, {}]));
  const visit = (node) => {
    const m = /^([a-z-]+)\/(.+)$/.exec(node.name ?? "");
    if (m && READERS[m[1]]) {
      tokens[m[1]][m[2]] = READERS[m[1]](node);
      return;
    }
    (node.children ?? []).forEach(visit);
  };
  visit(page);
  return tokens;
}

/** Writes styles/tokens.css from the Figma document. */
export class TokenService {
  constructor(client) {
    this.client = client;
  }

  async write(designFile) {
    console.log(chalk.cyan("\n\tprocessing design tokens..."));
    const tokens = extractTokens(designFile.document);
    if (!tokens) {
      console.log(
        chalk.yellow(
          `\t↳ no "${TOKENS_PAGE}" page in the Figma file; styles/tokens.css left as is`,
        ),
      );
      return false;
    }
    const empty = TOKEN_GROUPS.filter((g) => !Object.keys(tokens[g]).length);
    if (empty.length) {
      throw new Error(
        `The "${TOKENS_PAGE}" page has no layers for: ${empty.join(", ")}. styles/tokens.css was not changed.`,
      );
    }
    await writeTokensFile(tokens, {
      source: `Figma file ${designFile.name}, version ${designFile.version}`,
    });
    return true;
  }
}
