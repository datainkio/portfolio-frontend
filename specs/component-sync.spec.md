---
title: "Spec: Component colour sync"
description: "Contract for syncing a Figma component's colours into its Nunjucks template: how a template links to its component set, which bindings become which utilities, what the sync writes, and what it only reports."
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
  - "[Button sidecar](../views/atoms/button.md)"
---

# Spec: Component colour sync

- **Scope:** the colours a component applies, per variant and state. First component: Button, `views/atoms/button.njk`.
- **Status:** proposed, 2026-11-08. Waits on ADR 0003 (ownership, below).
- **Command:** `npm run sync:components`
- **Direction:** Figma → code. Same as tokens.

## The problem

`build:design` syncs what a colour *is*. It doesn't sync which colour a component *uses*. Rebinding Button's fill from `neutral/900` to `primary/950` in Figma changes nothing in the repo; someone edits `bg-neutral-900` by hand, and nothing notices if they don't.

## Ownership

Extends ADR 0002 from tokens to mapped component colours:

> In a template whose sidecar declares a `figma` component set, Figma owns the colour utilities inside the `variants` map. The sync writes them, and a hand edit there is reverted by the next sync. Everything else in the template stays code-owned.

## How a template links to Figma

Three conventions, and no mapping file:

1. **The sidecar names the component set.** `figma: "25:43"` in `button.md`'s frontmatter, the set's node ID. It survives renames on either side.
2. **Figma's `Style` option is the `variants` key**, lowercased: `Style=CTA` ↔ `variants.cta`, `Style=Submit` ↔ `variants.submit`.
3. **Figma's `State` is the Tailwind prefix:** `Default` → none, `Hover` → `hover:`. Focus and Disabled are not in v1 (below).

The macro keeps its looks in one literal map, which is what the Component API and the Button sidecar already ask for:

```njk
{%- set variants = {
  "cta":    "m-4 py-2 px-4 justify-self-start font-display text-neutral-100 bg-secondary-600 hover:bg-secondary-800",
  "submit": "px-4 py-1.5 font-display text-sm uppercase tracking-wider text-neutral-50 bg-secondary-600 hover:bg-secondary-700 border border-secondary-800 …",
  "dark":   "py-1 px-3 rounded text-white bg-neutral-900 hover:bg-neutral-700",
  "icon":   "border-2 border-neutral-700 rounded-xl"
} -%}
```

Layout and type classes live in the same string. The sync reads and writes only the colour utilities.

## What syncs

Read from each variant of the component set, through the REST file endpoint (Pro plan). Variable IDs resolve to names the way `build:design` resolves them.

| On the Figma variant         | Utility written     | Example                              |
| ---------------------------- | ------------------- | ------------------------------------ |
| Root layer fill              | `bg-{colour}`       | `secondary/600` → `bg-secondary-600` |
| Root layer stroke            | `border-{colour}`   | `neutral/700` → `border-neutral-700` |
| Text layer named `Label`, fill | `text-{colour}`   | `base/white` → `text-white`          |

The Hover variant writes the same utilities with `hover:`, only where its value differs from Default.

Colour names: `family/step` → `family-step`. `base/white` and `base/black` → `white` and `black`, which Tailwind ships and `colors.css` leaves out. A variable missing from the palette export is reported as *unknown variable* and never written.

## What the sync writes

- In the slot (the string value of the `variants` key), it replaces the colour of the utility with the same head: `hover:bg-secondary-800` becomes `hover:bg-secondary-700`. When the slot has no utility with that head, it appends one.
- It never removes, reorders, or edits any other class.
- It writes nothing outside the `variants` map, and never adds a variant key.
- It prints a report, one row per variant × state × property: **Figma** · **template** · **action**, where action is `written`, `unchanged`, `needs a hand`, or `unknown variable`.

Flags:

| Flag                 | Effect                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| `--check`            | Writes nothing. Exits 1 when any row isn't `unchanged`. For CI, once an offline fixture exists. |
| `--component <path>` | One template, e.g. `atoms/button.njk`. Default: every sidecar with a `figma` key.                 |

## Needs a hand

The sync reports these and leaves the template alone. You or an agent resolves them from the report:

- A colour utility in the slot with no Figma counterpart. Removing is destructive, so it's reported.
- A `Style` option with no `variants` key, or a key with no option.
- A Figma layer other than the root or `Label` that carries its own colour, such as the Submit arrow.
- A raw (unbound) colour on a mapped layer in Figma.

## Not in v1

- **Focus ring.** Figma's Focus variant carries the ring colour as an effect. Writing `focus-visible:outline-{colour}` into a variant would compete with the atom's `focusColor` param, so the atom needs a per-variant default first.
- **Disabled.** Figma changes opacity only, which the baseline already does with `disabled:opacity-60`.
- **Spacing, radius, type.** The bindings are already there (`spacing/4` → `px-4`, `radius/xl` → `rounded-xl`). Same mechanism, later.
- **Other components.** Each needs its looks in a `variants` map and a `figma` key in its sidecar.
- **Code → Figma.** A code edit to a mapped colour doesn't flow back. The report tells you it will be reverted.

## Enforcement

| Check                              | Fails on                                                                               |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| `npm run sync:components -- --check` | A mapped colour that differs from Figma                                              |
| `npm run lint:palette`             | Still runs after a write. A Figma colour outside the palette is refused, not written. |
| `npm test`                         | Fixture tests for the reader, the diff, and the writer                                 |

`npm run validate` can't include the check until the offline Figma fixture exists, for the same reason it doesn't rebuild `colors.css`.
