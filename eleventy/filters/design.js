/** @format */

/**
 * Filters for the living design-system reference (ia/docs/design/).
 *
 * A component page lists specimens in frontmatter. YAML can hold literal
 * params but not live data, so a specimen names data by path in `bind`
 * (`{ items: "cms.organizations" }`) and the layout resolves it against
 * the roots it passes in.
 */

export default function (eleventyConfig) {
  eleventyConfig.addFilter("specimenParams", specimenParams);
  eleventyConfig.addFilter("specimenCall", specimenCall);
}

/** A path segment that picks an array item by field: `slug=enquos`. */
const MATCH = /^([A-Za-z_$][\w$]*)=(.+)$/;

/**
 * Reads a dotted path from `root`. A segment is a key, an index
 * (`collections.projects.0`), or `field=value`, which picks the first array
 * item whose field equals the value (`collections.projects.slug=enquos`).
 * Bind CMS collections by slug: an index changes when the CMS order does.
 */
function getPath(root, path) {
  return String(path)
    .split(".")
    .reduce((acc, key) => {
      if (acc == null) return undefined;
      const m = MATCH.exec(key);
      if (m && Array.isArray(acc))
        return acc.find((item) => String(item?.[m[1]]) === m[2]);
      return acc[key];
    }, root);
}

/**
 * A data path as the Nunjucks a caller would write: `field=value` segments
 * become `filterByKey(…) | first`, the project filter that does the same
 * lookup (Nunjucks' own `selectattr` ignores a test argument).
 */
function pathExpr(path) {
  return String(path)
    .split(".")
    .reduce((expr, key) => {
      const m = MATCH.exec(key);
      if (!m) return expr ? `${expr}.${key}` : key;
      return `(${expr} | filterByKey(${str(m[1])}, ${str(m[2])}) | first)`;
    }, "");
}

/** Writes `value` at a dotted path, creating plain objects on the way. */
function setPath(target, path, value) {
  const keys = String(path).split(".");
  let node = target;
  keys.slice(0, -1).forEach((key) => {
    if (node[key] == null || typeof node[key] !== "object") node[key] = {};
    node = node[key];
  });
  node[keys.at(-1)] = value;
}

/**
 * Literal params plus bound data.
 *
 * @param {object} params - Literal params from frontmatter.
 * @param {object} bind - `{ paramPath: dataPath }`, e.g. `{ items: "cms.organizations" }`.
 * @param {object} roots - Data the paths may start from, e.g. `{ cms, collections }`.
 * @returns {object} A fresh params object; frontmatter is never mutated.
 *
 * EXAMPLE:
 * {{ C.render(s.params | specimenParams(s.bind, { cms: cms })) }}
 */
export function specimenParams(params = {}, bind = {}, roots = {}) {
  const out = structuredClone(params || {});
  for (const [paramPath, dataPath] of Object.entries(bind || {})) {
    setPath(out, paramPath, getPath(roots, dataPath));
  }
  return out;
}

const IDENT = /^[A-Za-z_$][\w$]*$/;

/** A string literal, single-quoted when that avoids escaping `"`. */
function str(value) {
  const s = String(value);
  if (s.includes('"') && !s.includes("'"))
    return `'${s.replace(/\\/g, "\\\\")}'`;
  return JSON.stringify(s);
}

/** Nunjucks object-literal source, with bound values printed as expressions. */
function literal(value, indent) {
  const pad = "  ".repeat(indent);
  const inner = "  ".repeat(indent + 1);
  if (value && typeof value === "object" && value.__expr) return value.__expr;
  if (typeof value === "string") return str(value);
  if (!value || typeof value !== "object") return JSON.stringify(value);

  const isArray = Array.isArray(value);
  const parts = isArray
    ? value.map((v) => literal(v, indent + 1))
    : Object.entries(value).map(
        ([k, v]) =>
          `${IDENT.test(k) ? k : JSON.stringify(k)}: ${literal(v, indent + 1)}`,
      );
  const [open, close] = isArray ? ["[", "]"] : ["{", "}"];
  if (!parts.length) return open + close;

  // Short, flat values stay on one line: { key: "Year", value: "2019" }.
  const oneLine = isArray ? `[${parts.join(", ")}]` : `{ ${parts.join(", ")} }`;
  if (oneLine.length <= 64 && !oneLine.includes("\n")) return oneLine;
  return `${open}\n${parts.map((p) => inner + p).join(",\n")}\n${pad}${close}`;
}

/**
 * The source a caller would write to render this specimen.
 *
 * @param {string} alias - Import alias, e.g. "Button".
 * @param {object} params - Literal params.
 * @param {object} bind - Bound params; printed as their data path.
 * @param {string} [content] - `{% call %}` body, when the specimen has one.
 * @returns {string} Nunjucks source, unescaped (autoescape handles output).
 */
export function specimenCall(alias, params = {}, bind = {}, content = "") {
  const shown = structuredClone(params || {});
  for (const [paramPath, dataPath] of Object.entries(bind || {})) {
    setPath(shown, paramPath, { __expr: pathExpr(dataPath) });
  }
  const args = Object.keys(shown).length ? literal(shown, 0) : "";
  const call = `${alias}.render(${args})`;
  if (!content) return `{{ ${call} }}`;
  return `{% call ${call} %}\n  ${String(content).trim()}\n{% endcall %}`;
}
