/**
 * Reads and writes the colour utilities in a template's `variants` map, for
 * `npm run sync:components`. Pure functions over template text: nothing here
 * touches the file system or Figma. Contract: specs/component-sync.spec.md.
 */

/** Reader property → the utility head it's written as. */
export const HEADS = { bg: "bg-", text: "text-", border: "border-" };

/** Reader state → the exact Tailwind prefix. Any other prefix is left alone. */
export const PREFIXES = { default: "", hover: "hover:" };

/** The four report actions, as the spec names them. */
export const ACTIONS = {
  written: "written",
  unchanged: "unchanged",
  hand: "needs a hand",
  unknown: "unknown variable",
};

const PROPERTIES = Object.keys(HEADS);
const STEP = /^[a-z]+-\d{2,3}$/;

const MAP = /\{%-?\s*set\s+variants\s*=\s*\{([\s\S]*?)\}\s*-?%\}/;
const ENTRY = /^\s*"([^"]+)"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,?\s*$/;

/**
 * Whether `name`, after a `bg-`, `text-` or `border-` head, is a colour:
 * `family-step`, `white`, `black`, or a palette name such as `semantic-fail`.
 * So `text-sm`, `border-2` and `border` aren't colours.
 *
 * @param {string} name
 * @param {Set<string>} [palette]
 */
export function isColourName(name, palette) {
  return (
    STEP.test(name) ||
    name === "white" ||
    name === "black" ||
    Boolean(palette?.has(name))
  );
}

/**
 * The colour in `token` when it's a colour utility with exactly this prefix and
 * head, else null. `hover:bg-neutral-700` has colour `neutral-700` for prefix
 * `hover:` and head `bg-`; `group-hover:bg-neutral-700` has none.
 */
export function colourOf(token, prefix, head, palette) {
  const lead = `${prefix}${head}`;
  if (!token.startsWith(lead)) return null;
  const name = token.slice(lead.length);
  return isColourName(name, palette) ? name : null;
}

/**
 * Finds the `{%- set variants = { … } -%}` literal: one `"key": "classes"` per
 * line, both double-quoted.
 *
 * @param {string} text Template source.
 * @returns {Array<{ key: string, value: string, start: number, end: number }>}
 *   Each entry's string, with its offsets in `text` (quotes excluded).
 * @throws When there's no map, or a line in it isn't a `"key": "string"` entry.
 */
export function findVariantsMap(text) {
  const match = MAP.exec(text);
  if (!match) {
    throw new Error(
      "The template has no `{%- set variants = { … } -%}` map for the sync to read.",
    );
  }
  const bodyStart = match.index + match[0].indexOf("{", 2) + 1;
  const entries = [];
  let offset = bodyStart;
  for (const line of match[1].split("\n")) {
    const lineStart = offset;
    offset += line.length + 1;
    if (!line.trim()) continue;
    const entry = ENTRY.exec(line);
    if (!entry) {
      throw new Error(
        `Can't read this line of the variants map; each line must be "key": "classes".\n  ${line.trim()}`,
      );
    }
    const [, key, value] = entry;
    const start = lineStart + line.indexOf(`"${value}"`, line.indexOf(":")) + 1;
    entries.push({ key, value, start, end: start + value.length });
  }
  return entries;
}

/**
 * @param {string} text Template source.
 * @returns {Object<string, string>} Each variant's class string, by key.
 */
export function readVariants(text) {
  return Object.fromEntries(
    findVariantsMap(text).map(({ key, value }) => [key, value]),
  );
}

const same = (a, b) =>
  a === b ||
  (typeof a === "object" &&
    typeof b === "object" &&
    JSON.stringify(a) === JSON.stringify(b));

/**
 * Computes one slot's rows and its new class string.
 *
 * @param {string} variant The variants key.
 * @param {string} slot Its class string.
 * @param {{ default?: Object, hover?: Object }} figma The reader's colours for this variant.
 * @param {Set<string>} [palette] Colour names the sync may write.
 * @returns {{ value: string, rows: Array }}
 */
export function applySlot(variant, slot, figma, palette) {
  // Even indices are classes, odd ones the whitespace between them, so
  // joining puts back everything the sync didn't change byte for byte.
  const parts = slot.split(/(\s+)/);
  const classes = parts
    .map((part, i) => (i % 2 === 0 && part ? i : -1))
    .filter((i) => i >= 0);
  const appended = [];
  const rows = [];
  const base = figma.default ?? {};
  // No Hover variant in Figma reads as a hover that matches the default.
  const hover = figma.hover ?? base;

  for (const [state, prefix] of Object.entries(PREFIXES)) {
    for (const property of PROPERTIES) {
      const head = HEADS[property];
      const want = state === "default" ? base[property] : hover[property];
      const target =
        typeof want === "string" ? `${prefix}${head}${want}` : undefined;
      const matches = classes.filter(
        (i) =>
          parts[i] === target ||
          colourOf(parts[i], prefix, head, palette) !== null,
      );
      const [first, ...extras] = matches;
      const template = first === undefined ? null : parts[first];
      const row = (figmaValue, action, note) =>
        rows.push({
          variant,
          state,
          property,
          figma: figmaValue,
          template,
          action,
          ...(note && { note }),
        });

      for (const i of extras) {
        rows.push({
          variant,
          state,
          property,
          figma: null,
          template: parts[i],
          action: ACTIONS.hand,
          note: `a second ${prefix}${head} colour; Figma has one at most`,
        });
      }

      if (
        state === "hover" &&
        typeof base[property] === "object" &&
        typeof want === "string"
      ) {
        row(
          target,
          ACTIONS.hand,
          "the default can't be read, so the hover can't be compared with it",
        );
        continue;
      }
      if (state === "hover" && same(want, base[property])) {
        if (template) {
          row(
            null,
            ACTIONS.hand,
            "Figma's hover matches its default, so this has no counterpart",
          );
        } else if (want !== undefined) {
          row(null, ACTIONS.unchanged, "same as default");
        }
        continue;
      }
      if (want === undefined) {
        if (state === "hover") {
          row(
            null,
            ACTIONS.hand,
            `Figma's hover drops the default's ${property} colour; no utility says that`,
          );
        } else if (template) {
          row(null, ACTIONS.hand, "no Figma counterpart");
        }
        continue;
      }
      if (typeof want === "object") {
        if (want.unknown) {
          row(
            want.unknown,
            ACTIONS.unknown,
            "bound to a variable that isn't in the library's export",
          );
        } else {
          row(
            want.raw,
            ACTIONS.hand,
            "not bound to a variable in Figma (or a gradient, or several paints)",
          );
        }
        continue;
      }
      if (palette && !palette.has(want)) {
        row(target, ACTIONS.unknown, `${want} isn't in the palette`);
        continue;
      }
      if (template === target) {
        row(target, ACTIONS.unchanged);
      } else if (template) {
        parts[first] = target;
        row(target, ACTIONS.written);
      } else {
        appended.push(target);
        row(target, ACTIONS.written);
      }
    }
  }

  let value = parts.join("");
  for (const utility of appended) {
    value =
      value && !/\s$/.test(value) ? `${value} ${utility}` : value + utility;
  }
  return { value, rows };
}

/** A reader note that isn't already a row through a marker in `colours`. */
function noteRow(note) {
  if (note.kind === "name") {
    return {
      variant: note.variant,
      state: "",
      property: "",
      figma: note.figma,
      template: null,
      action: ACTIONS.hand,
      note: "a variant with no Style option",
    };
  }
  return {
    variant: note.variant,
    state: note.state,
    property: note.layer,
    figma: note.figma,
    template: null,
    action: ACTIONS.hand,
    note: "a coloured layer other than the root or Label",
  };
}

/**
 * Writes Figma's colours into the template's `variants` map, per the spec:
 * replace the colour of the utility with the same head in place, or append one
 * at the end of the slot. Nothing else in a slot, and nothing outside the map,
 * changes. No key is added or removed.
 *
 * @param {string} text Template source.
 * @param {Object} colours `colours` from ComponentService's extractComponentColours.
 * @param {Object} [options]
 * @param {Array} [options.notes] The reader's `notes`. `layer` and `name` notes
 *   become rows; `raw` and `unknown` ones already are, through their markers.
 * @param {Set<string>} [options.palette] Colour names the sync may write. A
 *   Figma colour outside it is reported as `unknown variable`, not written.
 * @returns {{ text: string, rows: Array<{ variant: string, state: string, property: string, figma: ?string, template: ?string, action: string, note?: string }> }}
 */
export function applyColours(text, colours, { notes = [], palette } = {}) {
  const entries = findVariantsMap(text);
  const keys = entries.map(({ key }) => key);
  const rows = [];
  const edits = [];
  const notesFor = (variant) =>
    notes
      .filter(
        (note) =>
          note.variant === variant &&
          (note.kind === "layer" || note.kind === "name"),
      )
      .map(noteRow);

  for (const { key, value, start, end } of entries) {
    if (!colours[key]) {
      rows.push({
        variant: key,
        state: "",
        property: "",
        figma: null,
        template: key,
        action: ACTIONS.hand,
        note: "a variants key with no Figma Style option",
      });
      continue;
    }
    const slot = applySlot(key, value, colours[key], palette);
    rows.push(...slot.rows, ...notesFor(key));
    if (slot.value !== value) edits.push({ start, end, value: slot.value });
  }

  for (const variant of Object.keys(colours).filter((v) => !keys.includes(v))) {
    rows.push(
      {
        variant,
        state: "",
        property: "",
        figma: variant,
        template: null,
        action: ACTIONS.hand,
        note: "a Figma Style option with no variants key",
      },
      ...notesFor(variant),
    );
  }
  const seen = new Set([...keys, ...Object.keys(colours)]);
  for (const note of notes.filter((n) => !seen.has(n.variant))) {
    if (note.kind === "layer" || note.kind === "name") rows.push(noteRow(note));
  }

  let next = text;
  for (const { start, end, value } of edits.sort((a, b) => b.start - a.start)) {
    next = next.slice(0, start) + value + next.slice(end);
  }
  return { text: next, rows };
}
