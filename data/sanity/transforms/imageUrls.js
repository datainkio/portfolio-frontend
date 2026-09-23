/** @format */

/**
 * Sanity image CDN URLs, built to the delivery contract in
 * content-model/documents/system/image-asset.md § Delivery rules.
 *
 *   imageUrl(url)                                   // + auto=format
 *   imageUrl(url, { w: 800, h: 450, fit: "crop" })  // fixed box, honors hot-spot rect
 *   imageUrl(url, { w: 1200, fit: "max", dpr: 2 })  // retina, never upscales
 *   imageUrl(url, { w: 1200, h: 630, fm: "jpg" })   // social preview: pinned format
 *   imageUrl(url, { dl: "Project hero.jpg" })       // named download
 *
 * Keys are camelCase (`fpX`, `minW`); they map to the CDN's names (`fp-x`, `min-w`).
 * Invalid values and param combinations the CDN would silently ignore throw at
 * build time, so a mistake fails the build instead of shipping an inert URL.
 */

const SANITY_IMAGE_URL = /^https:\/\/cdn\.sanity\.io\/images\//;

// ---------------------------------------------------------------------------
// Validators — each returns the normalized value or throws.
// ---------------------------------------------------------------------------

function fail(key, expected, value) {
  throw new TypeError(`imageUrl: \`${key}\` expects ${expected}, got ${JSON.stringify(value)}`);
}

/** Rounded — non-integer px values cause slow transforms or timeouts. */
const integer =
  (min, max = Infinity) =>
  (value, key) => {
    const n = Math.round(Number(value));
    return Number.isFinite(n) && n >= min && n <= max
      ? n
      : fail(key, `an integer ${min}–${max}`, value);
  };

const number = (min, max) => (value, key) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : fail(key, `a number ${min}–${max}`, value);
};

const oneOf =
  (...allowed) =>
  (value, key) =>
    allowed.includes(value) ? value : fail(key, allowed.map((a) => `"${a}"`).join(" | "), value);

/** RGB, ARGB, RRGGBB or AARRGGBB; a leading `#` is stripped. */
const hex = (value, key) => {
  const color = String(value).replace(/^#/, "");
  return /^([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color)
    ? color
    : fail(key, "a hex color (RGB, ARGB, RRGGBB, AARRGGBB)", value);
};

/** `[left, top, width, height]` in source pixels. */
const rect = (value, key) => {
  const parts = Array.isArray(value) ? value : String(value).split(",");
  if (parts.length !== 4) fail(key, "[left, top, width, height]", value);
  return parts.map((part) => integer(0)(part, key)).join(",");
};

const flag = (value, key) => (value === true ? "true" : fail(key, "true", value));

/** `true` saves under the hashed asset name; a string saves under that name. */
const download = (value, key) =>
  value === true || (typeof value === "string" && value.trim())
    ? String(value)
    : fail(key, "true or a filename", value);

// ---------------------------------------------------------------------------
// Parameter map: camelCase option → CDN param + validator.
// ---------------------------------------------------------------------------

const PARAMS = {
  // Size — always constrain, always integers
  w: ["w", integer(1)],
  h: ["h", integer(1)],
  dpr: ["dpr", number(0, 5)],

  // Box fill
  fit: ["fit", oneOf("clip", "crop", "fill", "fillmax", "max", "scale", "min")],
  crop: ["crop", oneOf("top", "bottom", "left", "right", "center", "focalpoint", "entropy")],
  fpX: ["fp-x", number(0, 1)],
  fpY: ["fp-y", number(0, 1)],
  rect: ["rect", rect],
  minW: ["min-w", integer(1)],
  maxW: ["max-w", integer(1)],
  minH: ["min-h", integer(1)],
  maxH: ["max-h", integer(1)],
  pad: ["pad", integer(0, 10000)],
  bg: ["bg", hex],

  // Format and quality
  auto: ["auto", oneOf("format")],
  fm: ["fm", oneOf("jpg", "pjpg", "png", "webp")],
  q: ["q", integer(0, 100)],

  // Effects — a real server-side transform per distinct URL; avoid across lists
  blur: ["blur", integer(1, 2000)],
  sharp: ["sharp", integer(0, 100)],
  sat: ["sat", integer(-100, 100)],
  invert: ["invert", flag],

  // Download
  dl: ["dl", download],
};

/** Combinations the CDN accepts but silently ignores. */
const RULES = [
  [(o) => o.fit === "crop" && (o.w == null || o.h == null), '`fit: "crop"` needs both `w` and `h`'],
  [(o) => o.crop != null && o.fit !== "crop", '`crop` only applies with `fit: "crop"`'],
  [
    (o) => (o.fpX ?? o.fpY) != null && o.crop !== "focalpoint",
    '`fpX`/`fpY` need `fit: "crop", crop: "focalpoint"`',
  ],
  [
    (o) => (o.minW ?? o.maxW ?? o.minH ?? o.maxH) != null && o.fit !== "crop",
    '`minW`/`maxW`/`minH`/`maxH` are inert unless `fit: "crop"`',
  ],
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Build a Sanity image CDN URL from a bare asset URL plus params.
 *
 * - `auto=format` is added by default. Opt out with `auto: false`; it is also
 *   skipped when `fm` pins a format (here or already on the URL).
 * - Params already on the URL are kept unless overridden here.
 * - `vanity` appends a readable path segment (suggested filename on save,
 *   without forcing a download — use `dl` for that).
 * - `null`, `undefined` and `false` values are omitted, so conditional params
 *   can be written inline: `{ w, h, blur: isPlaceholder && 50 }`.
 *
 * Returns the input unchanged for non-strings, non-Sanity URLs, file assets
 * (`/files/`, not `/images/`) and SVGs, which the CDN serves as uploaded.
 *
 * @param {string} url - `cdn.sanity.io/images/...` asset URL
 * @param {Record<string, unknown> & { vanity?: string }} [options]
 * @returns {string}
 */
export function imageUrl(url, options = {}) {
  if (typeof url !== "string" || !SANITY_IMAGE_URL.test(url)) return url;

  const target = new URL(url);
  if (target.pathname.endsWith(".svg")) return url;

  const { vanity, ...params } = options;
  const set = Object.entries(params).filter(([, value]) => value != null && value !== false);

  for (const [key] of set) {
    if (!(key in PARAMS)) throw new TypeError(`imageUrl: unknown param \`${key}\``);
  }
  const given = Object.fromEntries(set);
  for (const [broken, message] of RULES) {
    if (broken(given)) throw new TypeError(`imageUrl: ${message}`);
  }

  const query = target.searchParams;
  for (const [key, value] of set) {
    const [param, check] = PARAMS[key];
    query.set(param, check(value, key));
  }

  const wantsAuto = params.auto !== false && !query.has("fm") && !query.has("auto");
  if (wantsAuto) query.set("auto", "format");

  if (!set.length && !wantsAuto && !vanity) return url;

  if (vanity) target.pathname += `/${encodeURIComponent(vanity)}`;

  // Hand-serialized: URLSearchParams would encode spaces as `+` and commas in `rect`.
  const search = [...query].map(
    ([key, value]) => `${key}=${encodeURIComponent(value).replace(/%2C/g, ",")}`,
  );
  target.search = search.join("&");
  return target.toString();
}

/**
 * Walk a raw Sanity query result and apply `imageUrl` (defaults only, i.e.
 * `auto=format`) to every image URL it contains, at any depth — including URLs
 * embedded in Portable Text blocks.
 *
 * Pure: returns new arrays and objects rather than mutating the input.
 */
export function normalizeImageUrls(value) {
  if (typeof value === "string") {
    return imageUrl(value);
  }

  if (Array.isArray(value)) {
    return value.map(normalizeImageUrls);
  }

  if (value && typeof value === "object" && value.constructor === Object) {
    const result = {};
    for (const [key, entry] of Object.entries(value)) {
      result[key] = normalizeImageUrls(entry);
    }
    return result;
  }

  return value;
}
