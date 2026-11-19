---
title: "Spec: Component colour sync"
description: "Contract for syncing a Figma component's colours into its Nunjucks template: how a template links to its component set, which layers become which utilities in which slots, what the sync writes, and what it only reports."
type: spec
tags:
  - spec
  - design-system
  - figma
  - components
aliases:
  - Component Sync Spec
links:
  - "[Design system spec](design-system.spec.md)"
  - "[Component API spec](views/component-api.views-spec.md)"
  - "[ADR 0002](../docs/design-system/adr-0002-figma-library-variables-are-the-design-tokens.md)"
  - "[ADR 0003](../docs/design-system/adr-0003-figma-owns-mapped-component-colours.md)"
  - "[Button sidecar](../views/atoms/button.md)"
---

# Spec: Component colour sync

- **Scope:** the colours a component applies, per variant and state, for every component whose sidecar links it to the Figma library. First component: Button, `views/atoms/button.njk`.
- **Status:** v1 (Button) proposed and implemented 2026-11-08 on `feat-design-system`, proven the same day: a variable rebind on Submit's fill in Figma reached the built site through `npm run sync:components`. v2 (other components) proposed 2026-11-08; the parts marked **v2** below aren't built yet. Waits on [ADR 0003](../docs/design-system/adr-0003-figma-owns-mapped-component-colours.md) (ownership, below), whose scope needs widening from Button to every mapped component when it's accepted.
- **Command:** `npm run sync:components`
- **Direction:** Figma → code. Same as tokens.

## The problem

`build:design` syncs what a colour _is_. It doesn't sync which colour a component _uses_. Rebinding Button's fill from `neutral/900` to `primary/950` in Figma changes nothing in the repo; someone edits `bg-neutral-900` by hand, and nothing notices if they don't.

v1 solved this for Button by reading three things from each variant (root fill, root stroke, the `Label` text fill) and writing them into one `variants` map. The other components in the library don't fit that shape: Section frame's axis is `Tone`, not `Style`; its colours sit on a heading and two pseudo-element layers; Pager's looks are plain strings, not a map; Card and Accession label are single components with no variants at all. v2 keeps the v1 mechanism (read bindings, replace the colour in a utility, report the rest) and makes three things declarable: which Figma property is the key, which template variables are written, and which layer feeds which utility.

## Ownership

Extends ADR 0002 from tokens to mapped component colours:

> In a template whose sidecar declares a `figma` link, Figma owns the colour utilities inside the template's **slots**. The sync writes them, and a hand edit there is reverted by the next sync. Everything else in the template stays code-owned.

In v1 the only slot is the `variants` map. v2 lets the sidecar name others.

## How a template links to Figma

No mapping file. The sidecar describes the link, in one of two forms.

**Shorthand** (v1, unchanged): the component set's node ID.

```yaml
figma: "25:43"
```

It means: the set is `25:43`, the key axis is `Style`, the only slot is `variants`, and the slot's layers are the v1 conventions (root fill → `bg-`, root stroke → `border-`, `Label` fill → `text-`).

**Block form** (**v2**): for anything the conventions don't cover.

```yaml
figma:
  set: "34:21" # a COMPONENT_SET, or a single COMPONENT (below)
  axis: Tone # the variant property that is the key; default Style
  ignore:
    axes: [Side] # properties whose variants must agree; read once
    layers: ["Arrow (::after)"] # layers whose colour inherits in code; not reported
  slots:
    sectionTones:
      - { layer: root, paint: stroke, head: border }
    headingTones:
      - { layer: "Heading (h2)/Heading", paint: fill, head: text }
      - { layer: "Heading (h2)/::before", paint: fill, head: bg }
      - { layer: "Heading (h2)/::after", paint: fill, head: bg }
```

Every field but `set` is optional. A missing `slots` means the v1 conventions on `variants`. Three conventions carry over from v1 and hold in both forms:

1. **The node ID is the link.** It survives renames on either side.
2. **The key axis's values are the slot keys**, lowercased: `Style=CTA` ↔ `variants.cta`, `Tone=accent-600` ↔ `sectionTones["accent-600"]`.
3. **Figma's `State` is the Tailwind prefix:** `Default` → none, `Hover` → `hover:`. Other states (below) aren't written.

### Axes

A variant's name is its properties: `Style=CTA, State=Default`. `State` is always the state axis. Of the rest, exactly one is the **key axis**: `axis` names it, or it's the only one left, or it's `Style`. More than one candidate with no `axis` fails the run.

`ignore.axes` lists properties whose values don't change colour, such as Pager cell's `Side`. The sync reads every variant and requires them to agree; a disagreement is reported as _needs a hand_ against the slot, and nothing is written for it.

A set with no key axis, or a **single `COMPONENT` node**, has one implicit variant. Its slots are strings or responsive maps, not keyed maps.

### Slots

A slot is a `{% set name = … %}` in the template. Three shapes:

| Shape          | Example                                                   | Written where                                                                                       |
| -------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Keyed map      | `variants`, `sectionTones`                                | The entry whose key is the variant's key-axis value                                                 |
| String         | Pager's `titleStyles = "text-neutral-100"`                | The string                                                                                          |
| Responsive map | Card's `figure = {"base": "bg-primary-900 …", "lg": "…"}` | The `base` entry (**v2**). Figma `Breakpoint` axes mapping onto `sm`/`md` entries are later, not v2 |

A map is one `"key": "classes"` entry per line, both double-quoted; any other line in it fails the run. Layout and type classes live in the same strings. The sync reads and writes only colour utilities, and only in the slots the sidecar names (or `variants`, in shorthand). A `set` the sidecar doesn't name is never read, written, or reported.

### Layers

Each slot lists the Figma layers that feed it, as `{ layer, paint, head }`:

- `layer` is the path from the variant's root, names joined by `/`, or `root`.
- `paint` is `fill` or `stroke`.
- `head` is `bg`, `text` or `border`.

Two layer-name conventions the library already follows are read automatically (**v2**):

- A layer named `::before` or `::after`, or whose name ends in `(::before)` or `(::after)`, adds the matching Tailwind variant: `before:bg-neutral-700`, `hover:after:bg-accent-600`.
- An `INSTANCE` is owned by its own component. Its subtree is skipped by the implicit scan, and the report lists it once as `instance of <name>` rather than _needs a hand_. An explicit `layer` may still point into an instance (Pager's chevron glyph) when a template carries that colour itself.

The v1 defaults are the same mapping, spelled out: `variants` ← `{ root, fill, bg }`, `{ root, stroke, border }`, `{ Label, fill, text }`.

## What syncs

Read from each variant of the component, through the REST file endpoint (Pro plan). Variable IDs resolve to names the way `build:design` resolves them.

| On the Figma variant                      | Utility written                     | Example                              |
| ----------------------------------------- | ----------------------------------- | ------------------------------------ |
| A slot layer's bound fill or stroke       | `{prefix}{pseudo}{head}-{colour}`   | `secondary/600` → `bg-secondary-600` |
| The same, on the `Hover` variant          | `hover:` in front, where it differs | `hover:bg-secondary-700`             |
| The same, on a `::before`/`::after` layer | `before:` / `after:` in front       | `before:bg-neutral-700`              |

Colour names: `family/step` → `family-step`. `base/white` and `base/black` → `white` and `black`, which Tailwind ships and `colors.css` leaves out. A variable missing from the palette export is reported as _unknown variable_ and never written. A paint with opacity below 1 is **v2, later**: Lightbox's `backdrop:bg-black/80` needs the `/80` modifier, and nothing reads opacity yet.

## What the sync writes

- In the slot, it replaces the colour of the utility with the same prefix, pseudo and head: `hover:bg-secondary-800` becomes `hover:bg-secondary-700`. When the slot has no utility with that lead, it appends one.
- It never removes, reorders, or edits any other class.
- It writes nothing outside the named slots, and never adds a key to a map.
- It prints a report, one row per slot × key × state × head: **Figma** · **template** · **action**, where action is `written`, `unchanged`, `needs a hand`, or `unknown variable`.

Flags:

| Flag                 | Effect                                                                                                                                                                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--check`            | Writes nothing. Exits 1 when any row would be `written` or is `unknown variable`. `needs a hand` rows print as warnings and don't fail it (amended 2026-11-08: Submit's arrow and Icon's glyph are reported on every run, so failing on them would make the check useless). For CI, once an offline fixture exists. |
| `--component <path>` | One template, e.g. `atoms/button.njk`. Default: every sidecar with a `figma` key.                                                                                                                                                                                                                                   |

## Needs a hand

The sync reports these and leaves the template alone. You or an agent resolves them from the report:

- A colour utility in a slot with no Figma counterpart. Removing is destructive, so it's reported.
- A key-axis value with no map entry, or an entry with no value.
- A visible layer that carries its own colour and isn't a slot layer, an ignored layer, or inside an instance. In v1 this is Submit's arrow and Icon's glyph; v2 clears both, by `ignore.layers` and the instance rule.
- A raw (unbound) colour on a slot layer in Figma.
- Variants that an ignored axis says must agree, and don't.

## Not synced

States other than `Default` and `Hover` are read for nothing and listed once per run as `not synced`:

- **Focus.** The ring is an effect (Button, Pager) or a stroke plus an effect (Form field). Writing `focus-visible:outline-{colour}` into a slot would compete with Button's `focusColor` param, so the atom needs a per-variant default first.
- **Disabled.** Figma changes opacity only, which the baseline already does with `disabled:opacity-60`.
- **Invalid** (Form field) and **Empty** (Pager). Code shows these by swapping markup (`hidden`, `aria-hidden`), not by a state class, so there's no utility to write.

## Not in v2

- **Spacing, radius, type.** The bindings are already there (`spacing/4` → `px-4`, `radius/xl` → `rounded-xl`). Same mechanism, later.
- **Paint opacity** (`/80` modifiers) and **`Breakpoint` axes** onto responsive-map entries. Noted above.
- **Components whose colour inherits.** Link, Nav link, CTA and Icon carry no colour utilities in code; their Figma `Label` fills are stand-ins. Mapping them would _add_ colour utilities the code deliberately leaves out, so they aren't mapped. Hanko's colour is a caller default, same reason.
- **Code → Figma.** A code edit to a mapped colour doesn't flow back. The report tells you it will be reverted.

## Rollout

Order for mapping the rest of the library, each chosen for what it exercises that the one before didn't. The code side of each is in the task plan.

| Order | Component (Figma node)                 | Exercises                                                                                            |
| ----- | -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 1     | Accession label (`34:34`, a COMPONENT) | Single component; a string slot; the block form at its smallest                                      |
| 2     | Section frame (`34:21`)                | `axis: Tone`; two keyed slots; `::before`/`::after`; a Figma rename (`slate-*` → `neutral-*` values) |
| 3     | Pager (`36:55`, Pager cell)            | `ignore.axes: [Side]`; several string slots; hover on the root; an explicit layer inside an instance |
| 4     | Form field (`37:35`)                   | A `Type` axis; folding the caller's input/label looks into the component first, as Button did        |
| 5     | Card (`30:2`, a COMPONENT)             | Responsive maps written at `base`; a custom utility (`inner-border`) that needs a hand               |
| 6     | Lightbox dialog (`33:18`)              | Paint opacity (`/80`); an instance (Close) owned by Button                                           |
| —     | Award organization card (`32:53`)      | `Mode` axis against a boolean param, and an instance (Logo) carrying the colour. Decide after 1–6.   |

Button's two standing _needs a hand_ rows are cleared in step 1's spec work, by adding `ignore.layers: ["Arrow (::after)"]` to its sidecar and by the instance rule.

## Enforcement

| Check                                | Fails on                                                                                 |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `npm run sync:components -- --check` | A mapped colour that differs from Figma, or a variable missing from the palette export   |
| `npm run lint:palette`               | Still runs after a write. A Figma colour outside the palette is refused, not written.    |
| `npm test`                           | Fixture tests for the reader, the diff, and the writer, one fixture per mapped component |

`npm run validate` can't include the check until the offline Figma fixture exists, for the same reason it doesn't rebuild `colors.css`.
