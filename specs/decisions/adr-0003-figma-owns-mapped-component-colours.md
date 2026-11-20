---
title: "ADR 0003: Figma owns a mapped component's colours"
description: "Decision record for extending Figma ownership from design tokens to the colour utilities of a component whose sidecar links it to a Figma component set, starting with Button."
type: reference
status: draft
tags:
  - design-system
  - components
  - figma
  - decision
links:
  - "[ADR 0002](adr-0002-figma-library-variables-are-the-design-tokens.md)"
  - "[Component sync spec](../../specs/component-sync.spec.md)"
  - "[Button sidecar](../../views/atoms/button.md)"
  - "[ComponentService](../../figma/services/ComponentService.md)"
---

# ADR 0003: Figma owns a mapped component's colours

- **Status:** Proposed, 2026-11-08. Drafted by an agent from the Ownership
  section of the [component sync spec](../../specs/component-sync.spec.md). It
  takes effect when Russ accepts it, which is Step 1 of the sync task.
- **Scope:** The colour utilities (`bg-`, `text-`, `border-`, and their `hover:`
  forms) inside the `variants` map of a component template that links to a Figma
  component set. First component: Button.

## Context

[ADR 0002](adr-0002-figma-library-variables-are-the-design-tokens.md) made the
library's variables the design tokens, so what a colour _is_ flows from Figma to
code. It says nothing about which colour a component _uses_. Rebinding Button's
fill from `neutral/900` to `primary/950` in Figma changes nothing in the repo.
Someone edits `bg-neutral-900` by hand, and nothing notices if they don't.

The library holds the v1 components, with their fills, strokes, and text colours
bound to the colour variables. A bound layer comes back from the file endpoint on
the Pro plan with the variable's ID, so the binding is readable without
Enterprise. A template's classes mix colour with layout and type, so only the
colour part has a Figma counterpart.

## Decision

1. **Figma owns the mapped colours.** In a template whose sidecar declares a
   `figma` component-set node ID, Figma owns the colour utilities (`bg-`,
   `text-`, `border-`, and their `hover:` forms) inside the `variants` map.
   `npm run sync:components` writes them and reverts hand edits there on the next
   run. Everything else in the template stays code-owned.
2. **The link is the sidecar's `figma: "<nodeId>"` key,** with no mapping file.
   Figma's `Style` option is the `variants` key, lowercased. `State` is the
   Tailwind prefix: Default is none, Hover is `hover:`.
3. **Button is the first and only mapped component:** `views/atoms/button.njk`,
   component set `25:43`.

The mapping, the report, and the flags are specified in the
[component sync spec](../../specs/component-sync.spec.md).

## Alternatives

- **A mapping file** from component set to template and from option to key. Not
  chosen. It's a third thing to keep in step, and the sidecar already describes
  the template. A node ID in it survives renames on either side.
- **Code owns component colours and pushes them to Figma.** Not chosen, for the
  reason in ADR 0002: writing to Figma needs the Plugin API in a signed-in
  session, so it couldn't run in CI.
- **Sync whole class strings.** Not chosen. It would erase the layout and type
  classes that live in the same string and have no Figma counterpart.
- **A Claude skill or a Figma plugin instead of a script.** Not chosen. Neither is
  deterministic or testable with fixtures, and the diff has to be both.

## Consequences

- The four Button looks move into one `variants` map. Callers pass `variant:` and
  keep only layout classes.
- A colour change in Figma is one command: `npm run sync:components`.
- `npm run sync:components -- --check` catches drift. Rows marked `needs a hand`
  are warnings, not failures, so the Submit arrow and Icon glyph layers, which
  the sync doesn't map, don't fail the check.
- A code edit to a mapped colour is reverted, and the report says so.
- `npm run lint:palette` still refuses a colour outside the palette, so a Figma
  colour that isn't in the export is reported and never written.

## Still open

- **Focus ring.** Figma's Focus variant carries the ring colour as an effect.
  Writing it into a variant would compete with the atom's `focusColor` param, so
  the atom needs a per-variant default first.
- **Disabled.** Figma changes opacity only, which the baseline already does.
- **Spacing, radius, and type bindings.** The bindings exist already. It's the
  same mechanism, later.
- **Other components.** Each needs its looks in a `variants` map and a `figma`
  key in its sidecar.
- **Code to Figma.** A code edit to a mapped colour doesn't flow back.
